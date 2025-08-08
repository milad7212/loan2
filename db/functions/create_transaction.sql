-- This function creates a new transaction, links it to one or more buyers,
-- and updates the credit amounts for both the seller and the buyers.
-- It now returns the newly created transaction record as JSON.

CREATE OR REPLACE FUNCTION create_transaction(
    p_seller_id uuid,
    p_buyer_ids uuid[],
    p_amounts int[],
    p_tracking_code text,
    p_message text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_transaction_amount int;
    seller_remaining_credit int;
    new_transaction_id uuid;
    buyer_id uuid;
    amount_to_transfer int;
    i int;
BEGIN
    -- 1. Validate inputs
    IF array_length(p_buyer_ids, 1) IS NULL OR array_length(p_amounts, 1) IS NULL THEN
        RAISE EXCEPTION 'Bad Request: Buyer and amount arrays cannot be empty.';
    END IF;
    IF array_length(p_buyer_ids, 1) <> array_length(p_amounts, 1) THEN
        RAISE EXCEPTION 'Bad Request: Buyer and amount arrays must have the same number of elements.';
    END IF;

    -- 2. Calculate total amount and check seller's credit
    total_transaction_amount := 0;
    FOREACH amount_to_transfer IN ARRAY p_amounts
    LOOP
        IF amount_to_transfer <= 0 THEN
            RAISE EXCEPTION 'Bad Request: Transaction amounts must be positive.';
        END IF;
        total_transaction_amount := total_transaction_amount + amount_to_transfer;
    END LOOP;

    SELECT remaining_amount INTO seller_remaining_credit FROM sellers WHERE id = p_seller_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bad Request: Seller not found.';
    END IF;
    IF seller_remaining_credit < total_transaction_amount THEN
        RAISE EXCEPTION 'Bad Request: Seller does not have enough credit for this transaction.';
    END IF;

    -- 3. Create the main transaction record
    INSERT INTO transactions (seller_id, amount, status, date, tracking_code, message, history)
    VALUES (
        p_seller_id,
        total_transaction_amount,
        'pending_transfer',
        NOW(),
        p_tracking_code,
        p_message,
        jsonb_build_array(jsonb_build_object(
            'status', 'pending_transfer',
            'description', 'Transaction created',
            'date', to_char(NOW(), 'YYYY/MM/DD'),
            'time', to_char(NOW(), 'HH24:MI')
        ))
    ) RETURNING id INTO new_transaction_id;

    -- 4. Loop through buyers, update their balances, and create linking records
    FOR i IN 1..array_length(p_buyer_ids, 1)
    LOOP
        buyer_id := p_buyer_ids[i];
        amount_to_transfer := p_amounts[i];

        UPDATE buyers
        SET remaining_amount = remaining_amount - amount_to_transfer,
            status = CASE
                        WHEN (remaining_amount - amount_to_transfer) <= 0 THEN 'completed'
                        ELSE 'partial'
                     END
        WHERE id = buyer_id;

        INSERT INTO transaction_buyers (transaction_id, buyer_id, amount)
        VALUES (new_transaction_id, buyer_id, amount_to_transfer);
    END LOOP;

    -- 5. Update seller's remaining credit
    UPDATE sellers
    SET remaining_amount = remaining_amount - total_transaction_amount
    WHERE id = p_seller_id;

    -- 6. Return the newly created transaction with nested seller and buyer data
    RETURN (
        SELECT row_to_json(t)
        FROM (
            SELECT
                *,
                (
                    SELECT row_to_json(s)
                    FROM (
                        SELECT full_name, phone, national_id FROM sellers WHERE id = new_t.seller_id
                    ) s
                ) as seller,
                (
                    SELECT json_agg(json_build_object('buyer', row_to_json(b)))
                    FROM (
                        SELECT bu.name, bu.phone, bu.national_id, bu.referrer_id
                        FROM buyers bu
                        JOIN transaction_buyers tb ON tb.buyer_id = bu.id
                        WHERE tb.transaction_id = new_t.id
                    ) b
                ) as buyers
            FROM transactions new_t
            WHERE id = new_transaction_id
        ) t
    );

END;
$$;

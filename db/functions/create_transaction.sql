-- This function creates a new transaction, links it to one or more buyers,
-- and updates the credit amounts for both the seller and the buyers.
-- It includes validation to prevent common errors.

-- Before creating the function, you may need to enable the pgcrypto extension
-- if you haven't already. You can run this once in the Supabase SQL Editor:
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- This line is commented out by default. If you need to replace an
-- existing function, you can uncomment it.
-- DROP FUNCTION IF EXISTS create_transaction;

CREATE OR REPLACE FUNCTION create_transaction(
    p_seller_id uuid,
    p_buyer_ids uuid[],
    p_amounts int[],
    p_tracking_code text,
    p_message text
)
RETURNS void
LANGUAGE plpgsql
-- SECURITY DEFINER is important for allowing the function to have elevated
-- privileges, but be very careful with it. It should be used if your
-- RLS policies would otherwise prevent the updates in this function.
-- If your policies allow these updates, you can use SECURITY INVOKER.
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
    -- 1. Validate inputs to prevent errors
    IF array_length(p_buyer_ids, 1) IS NULL OR array_length(p_amounts, 1) IS NULL THEN
        RAISE EXCEPTION 'Bad Request: Buyer and amount arrays cannot be empty.';
    END IF;

    IF array_length(p_buyer_ids, 1) <> array_length(p_amounts, 1) THEN
        RAISE EXCEPTION 'Bad Request: Buyer and amount arrays must have the same number of elements.';
    END IF;

    -- 2. Calculate total amount and check seller's available credit
    total_transaction_amount := 0;
    FOREACH amount_to_transfer IN ARRAY p_amounts
    LOOP
        IF amount_to_transfer <= 0 THEN
            RAISE EXCEPTION 'Bad Request: Transaction amounts must be positive.';
        END IF;
        total_transaction_amount := total_transaction_amount + amount_to_transfer;
    END LOOP;

    -- Lock the seller row to prevent race conditions and get their current credit
    SELECT remainingAmount INTO seller_remaining_credit
    FROM sellers
    WHERE id = p_seller_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bad Request: Seller not found.';
    END IF;

    IF seller_remaining_credit < total_transaction_amount THEN
        RAISE EXCEPTION 'Bad Request: Seller does not have enough credit for this transaction.';
    END IF;

    -- 3. Create the main transaction record
    -- Note: Assumes `date` column can be set with NOW() and history is jsonb.
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

        -- Update buyer's remaining amount and status
        UPDATE buyers
        SET remainingAmount = remainingAmount - amount_to_transfer,
            status = CASE
                        WHEN (remainingAmount - amount_to_transfer) <= 0 THEN 'completed'
                        ELSE 'partial'
                     END
        WHERE id = buyer_id;

        -- This part assumes you have a linking table `transaction_buyers`.
        -- If you don't, this function won't know which buyers were part of this transaction.
        -- If this table doesn't exist, you should create it.
        --
        -- CREATE TABLE transaction_buyers (
        --   id uuid primary key default gen_random_uuid(),
        --   transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
        --   buyer_id uuid REFERENCES buyers(id),
        --   amount int
        -- );
        --
        -- INSERT INTO transaction_buyers (transaction_id, buyer_id, amount)
        -- VALUES (new_transaction_id, buyer_id, amount_to_transfer);

    END LOOP;

    -- 5. Update seller's remaining credit
    UPDATE sellers
    SET remainingAmount = remainingAmount - total_transaction_amount
    WHERE id = p_seller_id;

END;
$$;

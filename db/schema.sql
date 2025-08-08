-- This file contains the inferred SQL schema for the database tables.
-- You can run these commands in your Supabase SQL Editor to set up your database.
-- Note: It's recommended to run these one by one to ensure they succeed.

-- Enable the pgcrypto extension for gen_random_uuid() if not already enabled.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table for Referrers
CREATE TABLE referrers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Sellers
-- Stores information about individuals selling their loan credits.
CREATE TABLE sellers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fullName TEXT NOT NULL,
    phone TEXT,
    accountNumber TEXT,
    cardNumber TEXT,
    creditAmount INT NOT NULL,
    remainingAmount INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Buyers
-- Stores information about individuals looking to buy loan credits.
CREATE TABLE buyers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    nationalId TEXT,
    referrer_id uuid REFERENCES referrers(id),
    requestedAmount INT NOT NULL,
    remainingAmount INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'partial', 'completed')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Transactions
-- A master record for each transaction event.
CREATE TABLE transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id uuid NOT NULL REFERENCES sellers(id),
    amount INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending_transfer', 'transferred', 'pending_payment', 'completed', 'cancelled', 'paid')),
    date TEXT, -- Using TEXT as the app seems to format it as YYYY/MM/DD
    tracking_code TEXT UNIQUE,
    message TEXT,
    history JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Linking Table for Transactions and Buyers
-- This table creates a many-to-many relationship between transactions and buyers.
-- This is a more robust design than using an array of buyer IDs in the transactions table.
CREATE TABLE transaction_buyers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    buyer_id uuid NOT NULL REFERENCES buyers(id),
    amount INT NOT NULL, -- The specific amount transferred to this buyer in this transaction
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(transaction_id, buyer_id) -- Ensures a buyer is only listed once per transaction
);

-- Optional: Add indexes for faster lookups on foreign keys
CREATE INDEX ON buyers (referrer_id);
CREATE INDEX ON transactions (seller_id);
CREATE INDEX ON transaction_buyers (transaction_id);
CREATE INDEX ON transaction_buyers (buyer_id);

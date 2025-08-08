-- This file contains the corrected SQL schema for the database tables.
-- Please re-run these commands in your Supabase SQL Editor to fix the
-- "400 Bad Request" errors on insert.
-- The column names have been changed from camelCase to snake_case to match
-- the convention expected by the Supabase client library.

-- Enable the pgcrypto extension for gen_random_uuid() if not already enabled.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- NOTE: If you have existing tables, you will need to either DROP them first
-- or use ALTER TABLE to rename/add columns.
-- Example: ALTER TABLE buyers RENAME COLUMN "nationalId" TO national_id;
-- Example: ALTER TABLE referrers ADD COLUMN phone TEXT;

-- Table for Referrers
CREATE TABLE referrers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    national_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Sellers
CREATE TABLE sellers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT,
    account_number TEXT,
    card_number TEXT,
    credit_amount INT NOT NULL,
    remaining_amount INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Buyers
CREATE TABLE buyers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    national_id TEXT,
    referrer_id uuid REFERENCES referrers(id),
    requested_amount INT NOT NULL,
    remaining_amount INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'partial', 'completed')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Transactions
CREATE TABLE transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id uuid NOT NULL REFERENCES sellers(id),
    amount INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending_transfer', 'transferred', 'pending_payment', 'completed', 'cancelled', 'paid')),
    date TEXT,
    tracking_code TEXT UNIQUE,
    message TEXT,
    history JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Linking Table for Transactions and Buyers
CREATE TABLE transaction_buyers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    buyer_id uuid NOT NULL REFERENCES buyers(id),
    amount INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(transaction_id, buyer_id)
);

-- Optional: Add indexes for faster lookups on foreign keys
CREATE INDEX ON buyers (referrer_id);
CREATE INDEX ON transactions (seller_id);
CREATE INDEX ON transaction_buyers (transaction_id);
CREATE INDEX ON transaction_buyers (buyer_id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'JPY',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly', 'weekly')),
  start_date TIMESTAMPTZ NOT NULL,
  next_billing_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'canceled')),
  memo TEXT,
  payment_method TEXT,
  category_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_next_billing_date_idx ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS subscriptions_created_at_idx ON subscriptions(created_at DESC);

-- Add foreign key to categories if needed (optional)
-- ALTER TABLE subscriptions ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Add comment
COMMENT ON TABLE subscriptions IS 'Stores recurring subscription information for users';

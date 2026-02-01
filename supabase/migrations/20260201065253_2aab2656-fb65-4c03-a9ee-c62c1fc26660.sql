-- Mortgage comparisons (user searches)
CREATE TABLE mortgage_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  property_id UUID,
  
  -- Search params
  loan_amount INTEGER NOT NULL,
  property_value INTEGER NOT NULL,
  ltv DECIMAL(5,2),
  
  mortgage_type TEXT DEFAULT 'btl', -- btl, residential, remortgage
  term_years INTEGER DEFAULT 25,
  
  -- Results cached
  results JSONB,
  best_rate DECIMAL(5,3),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mortgage products (cached rates)
CREATE TABLE mortgage_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  lender TEXT NOT NULL,
  product_name TEXT,
  
  rate DECIMAL(5,3) NOT NULL,
  initial_rate_period INTEGER, -- months
  
  mortgage_type TEXT, -- btl, residential
  rate_type TEXT, -- fixed, variable, tracker
  
  max_ltv DECIMAL(5,2),
  min_loan INTEGER,
  max_loan INTEGER,
  
  product_fee INTEGER DEFAULT 0,
  cashback INTEGER DEFAULT 0,
  
  early_repayment_charges JSONB,
  eligibility_criteria JSONB,
  
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Mortgage referrals (affiliate tracking)
CREATE TABLE mortgage_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  comparison_id UUID REFERENCES mortgage_comparisons(id),
  product_id UUID REFERENCES mortgage_products(id),
  
  -- Partner
  partner TEXT NOT NULL, -- 'mojo', 'l_and_c', 'trussle', 'habito'
  
  -- Application details
  loan_amount INTEGER,
  lender_name TEXT,
  rate DECIMAL(5,3),
  
  -- Tracking
  referral_url TEXT,
  referral_code TEXT,
  click_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'clicked', -- clicked, applied, approved, completed, rejected
  
  -- Commission
  commission_amount INTEGER, -- in pence
  commission_paid BOOLEAN DEFAULT false,
  commission_paid_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mortgage_comparisons_user ON mortgage_comparisons(user_id);
CREATE INDEX idx_mortgage_products_active ON mortgage_products(is_active);
CREATE INDEX idx_mortgage_products_type_ltv ON mortgage_products(mortgage_type, max_ltv);
CREATE INDEX idx_mortgage_referrals_user ON mortgage_referrals(user_id);
CREATE INDEX idx_mortgage_referrals_status ON mortgage_referrals(status);

-- RLS
ALTER TABLE mortgage_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own comparisons" ON mortgage_comparisons FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own referrals" ON mortgage_referrals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read active products" ON mortgage_products FOR SELECT USING (is_active = true);

-- Sample mortgage products (realistic UK BTL rates as of 2025)
INSERT INTO mortgage_products (lender, product_name, rate, initial_rate_period, mortgage_type, rate_type, max_ltv, min_loan, max_loan, product_fee) VALUES
('NatWest', 'BTL 5 Year Fixed', 5.19, 60, 'btl', 'fixed', 75.00, 25000, 2000000, 99900),
('Barclays', 'BTL Fixed Rate', 5.24, 60, 'btl', 'fixed', 75.00, 50000, 1500000, 0),
('Santander', 'BTL 5 Year Fixed', 5.29, 60, 'btl', 'fixed', 75.00, 25000, 1000000, 99900),
('HSBC', 'BTL Fixed', 5.34, 60, 'btl', 'fixed', 75.00, 50000, 2500000, 149900),
('Nationwide', 'BTL 5 Year', 5.39, 60, 'btl', 'fixed', 75.00, 25000, 1000000, 99900),
('TSB', 'BTL Fixed Rate', 5.44, 60, 'btl', 'fixed', 75.00, 40000, 750000, 0),
('Virgin Money', 'BTL 5 Year Fixed', 5.49, 60, 'btl', 'fixed', 75.00, 25000, 1000000, 99500),
('The Mortgage Works', 'BTL Fixed', 5.14, 60, 'btl', 'fixed', 75.00, 25001, 2000000, 149900),
('BM Solutions', 'BTL 5 Year', 5.24, 60, 'btl', 'fixed', 75.00, 25001, 1000000, 99900),
('Paragon', 'BTL Fixed Rate', 5.29, 60, 'btl', 'fixed', 80.00, 50000, 2000000, 0),
('NatWest', 'BTL 2 Year Fixed', 5.49, 24, 'btl', 'fixed', 75.00, 25000, 2000000, 99900),
('Barclays', 'BTL 2 Year Fixed', 5.54, 24, 'btl', 'fixed', 75.00, 50000, 1500000, 0),
('Santander', 'BTL 2 Year Fixed', 5.59, 24, 'btl', 'fixed', 75.00, 25000, 1000000, 0),
('HSBC', 'BTL Tracker', 5.09, 24, 'btl', 'tracker', 75.00, 50000, 2500000, 99900),
('Nationwide', 'BTL Variable', 5.69, 0, 'btl', 'variable', 75.00, 25000, 1000000, 0),
('NatWest', 'BTL 75% LTV', 5.09, 60, 'btl', 'fixed', 75.00, 25000, 2000000, 199900),
('Paragon', 'BTL 80% LTV', 5.69, 60, 'btl', 'fixed', 80.00, 50000, 1000000, 99900),
('The Mortgage Works', 'BTL 80% LTV', 5.74, 60, 'btl', 'fixed', 80.00, 25001, 1000000, 149900);
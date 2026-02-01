-- Portfolio properties
CREATE TABLE portfolio_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Property details
  address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  property_type TEXT,
  bedrooms INTEGER,
  
  -- Purchase info
  purchase_date DATE NOT NULL,
  purchase_price INTEGER NOT NULL,
  current_value INTEGER,
  
  -- Finance
  mortgage_lender TEXT,
  mortgage_amount INTEGER,
  mortgage_rate DECIMAL(5,2),
  monthly_payment INTEGER,
  
  -- Tenure
  tenure TEXT,
  lease_years INTEGER,
  
  -- Strategy
  investment_strategy TEXT,
  property_status TEXT DEFAULT 'let',
  
  -- Performance cache
  total_income_ytd INTEGER DEFAULT 0,
  total_expenses_ytd INTEGER DEFAULT 0,
  current_yield DECIMAL(5,2),
  
  -- Images
  images TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenancies
CREATE TABLE tenancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES portfolio_properties(id) ON DELETE CASCADE,
  
  tenant_name TEXT NOT NULL,
  tenant_email TEXT,
  tenant_phone TEXT,
  
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rent INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  deposit_scheme TEXT,
  
  status TEXT DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rent payments
CREATE TABLE rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id UUID REFERENCES tenancies(id) ON DELETE CASCADE,
  
  expected_date DATE NOT NULL,
  expected_amount INTEGER NOT NULL,
  actual_date DATE,
  actual_amount INTEGER,
  
  status TEXT DEFAULT 'pending',
  days_late INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property expenses
CREATE TABLE property_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  expense_date DATE NOT NULL,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  
  is_tax_deductible BOOLEAN DEFAULT true,
  receipt_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance items
CREATE TABLE compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES portfolio_properties(id) ON DELETE CASCADE,
  
  compliance_type TEXT NOT NULL,
  certificate_number TEXT,
  issued_date DATE,
  expiry_date DATE NOT NULL,
  certificate_url TEXT,
  
  status TEXT DEFAULT 'valid',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance jobs
CREATE TABLE maintenance_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES portfolio_properties(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  
  reported_date DATE NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  
  estimated_cost INTEGER,
  actual_cost INTEGER,
  contractor_name TEXT,
  contractor_phone TEXT,
  
  status TEXT DEFAULT 'reported',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio summary (cached per user)
CREATE TABLE portfolio_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  total_properties INTEGER DEFAULT 0,
  total_value INTEGER DEFAULT 0,
  total_equity INTEGER DEFAULT 0,
  monthly_income INTEGER DEFAULT 0,
  monthly_expenses INTEGER DEFAULT 0,
  monthly_cash_flow INTEGER DEFAULT 0,
  portfolio_yield DECIMAL(5,2),
  occupancy_rate DECIMAL(5,2),
  
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_portfolio_properties_user ON portfolio_properties(user_id);
CREATE INDEX idx_tenancies_property ON tenancies(portfolio_property_id);
CREATE INDEX idx_tenancies_status ON tenancies(status);
CREATE INDEX idx_rent_payments_status ON rent_payments(status);
CREATE INDEX idx_rent_payments_expected_date ON rent_payments(expected_date);
CREATE INDEX idx_expenses_property ON property_expenses(portfolio_property_id);
CREATE INDEX idx_expenses_user ON property_expenses(user_id);
CREATE INDEX idx_compliance_expiry ON compliance_items(expiry_date);
CREATE INDEX idx_compliance_status ON compliance_items(status);
CREATE INDEX idx_maintenance_status ON maintenance_jobs(status);
CREATE INDEX idx_maintenance_priority ON maintenance_jobs(priority);

-- Enable RLS
ALTER TABLE portfolio_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage own portfolio properties"
  ON portfolio_properties FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage tenancies for own properties"
  ON tenancies FOR ALL
  USING (portfolio_property_id IN (SELECT id FROM portfolio_properties WHERE user_id = auth.uid()));

CREATE POLICY "Users manage payments for own tenancies"
  ON rent_payments FOR ALL
  USING (tenancy_id IN (
    SELECT t.id FROM tenancies t 
    JOIN portfolio_properties p ON t.portfolio_property_id = p.id 
    WHERE p.user_id = auth.uid()
  ));

CREATE POLICY "Users manage own expenses"
  ON property_expenses FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage compliance for own properties"
  ON compliance_items FOR ALL
  USING (portfolio_property_id IN (SELECT id FROM portfolio_properties WHERE user_id = auth.uid()));

CREATE POLICY "Users manage maintenance for own properties"
  ON maintenance_jobs FOR ALL
  USING (portfolio_property_id IN (SELECT id FROM portfolio_properties WHERE user_id = auth.uid()));

CREATE POLICY "Users view own portfolio summary"
  ON portfolio_summary FOR ALL
  USING (auth.uid() = user_id);

-- Update triggers
CREATE TRIGGER update_portfolio_properties_updated_at
  BEFORE UPDATE ON portfolio_properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenancies_updated_at
  BEFORE UPDATE ON tenancies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_items_updated_at
  BEFORE UPDATE ON compliance_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_jobs_updated_at
  BEFORE UPDATE ON maintenance_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
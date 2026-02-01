-- Phase 12: MTD, EPC Planner, Deposits, E-Signatures, Claims Tracker

-- 12A: Making Tax Digital
CREATE TABLE IF NOT EXISTS mtd_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tax_year TEXT NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'accepted', 'rejected')),
  submitted_at TIMESTAMPTZ,
  hmrc_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mtd_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obligation_id UUID REFERENCES mtd_obligations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_income DECIMAL(12,2),
  total_expenses DECIMAL(12,2),
  net_profit DECIMAL(12,2),
  income_breakdown JSONB DEFAULT '{}',
  expense_breakdown JSONB DEFAULT '{}',
  submission_id TEXT,
  hmrc_response JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mtd_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  hmrc_connected BOOLEAN DEFAULT false,
  nino_encrypted TEXT,
  utr_encrypted TEXT,
  business_name TEXT,
  accounting_type TEXT DEFAULT 'cash' CHECK (accounting_type IN ('cash', 'accruals')),
  auto_categorise BOOLEAN DEFAULT true,
  reminder_days_before INTEGER DEFAULT 14,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12B: EPC Improvement Planner
CREATE TABLE IF NOT EXISTS epc_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_rating TEXT,
  current_score INTEGER,
  certificate_date DATE,
  certificate_expiry DATE,
  target_rating TEXT DEFAULT 'C',
  target_deadline DATE DEFAULT '2028-12-31',
  recommendations JSONB DEFAULT '[]',
  planned_improvements JSONB DEFAULT '[]',
  total_estimated_cost DECIMAL(10,2),
  projected_rating TEXT,
  projected_score INTEGER,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'planning', 'in_progress', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS epc_improvements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES epc_assessments(id) ON DELETE CASCADE,
  measure_type TEXT NOT NULL,
  description TEXT,
  cost_low DECIMAL(10,2),
  cost_high DECIMAL(10,2),
  score_improvement INTEGER,
  annual_savings DECIMAL(10,2),
  status TEXT DEFAULT 'recommended' CHECK (status IN ('recommended', 'planned', 'completed', 'skipped')),
  completed_date DATE,
  actual_cost DECIMAL(10,2),
  grant_eligible BOOLEAN DEFAULT false,
  grant_name TEXT,
  grant_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12C: Deposit Protection Manager (without tenant FK since tenants table doesn't exist)
CREATE TABLE IF NOT EXISTS deposit_protections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_name TEXT NOT NULL,
  tenant_email TEXT,
  portfolio_property_id UUID REFERENCES portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  deposit_type TEXT DEFAULT 'security' CHECK (deposit_type IN ('security', 'holding')),
  scheme TEXT NOT NULL CHECK (scheme IN ('dps', 'tds', 'mydeposits')),
  scheme_reference TEXT,
  received_date DATE NOT NULL,
  protected_date DATE,
  protection_deadline DATE,
  certificate_issued_date DATE,
  certificate_url TEXT,
  prescribed_info_served BOOLEAN DEFAULT false,
  prescribed_info_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'protected', 'returned', 'disputed', 'court')),
  return_date DATE,
  amount_returned DECIMAL(10,2),
  deductions JSONB DEFAULT '[]',
  dispute_raised BOOLEAN DEFAULT false,
  dispute_date DATE,
  dispute_outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12D: E-Signatures
CREATE TABLE IF NOT EXISTS signature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  document_name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  portfolio_property_id UUID REFERENCES portfolio_properties(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'completed', 'declined', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signature_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES signature_requests(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('landlord', 'tenant', 'guarantor', 'witness')),
  sign_order INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'viewed', 'signed', 'declined')),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signature_data TEXT,
  ip_address INET,
  user_agent TEXT,
  decline_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signature_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES signature_requests(id) ON DELETE CASCADE,
  signer_id UUID REFERENCES signature_signers(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12E: Insurance Claims Tracker
CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES portfolio_properties(id) ON DELETE SET NULL,
  insurance_policy_id UUID REFERENCES insurance_policies(id) ON DELETE SET NULL,
  claim_reference TEXT,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('property_damage', 'theft', 'liability', 'rent_guarantee', 'legal_expenses', 'accidental_damage', 'flood', 'fire', 'subsidence')),
  incident_date DATE NOT NULL,
  incident_description TEXT,
  estimated_loss DECIMAL(12,2),
  claim_amount DECIMAL(12,2),
  excess_amount DECIMAL(10,2),
  settlement_amount DECIMAL(12,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'acknowledged', 'assessing', 'approved', 'partially_approved', 'rejected', 'settled', 'closed')),
  submitted_date DATE,
  acknowledged_date DATE,
  decision_date DATE,
  settlement_date DATE,
  handler_name TEXT,
  handler_phone TEXT,
  handler_email TEXT,
  notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claim_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES insurance_claims(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT CHECK (document_type IN ('photos', 'receipts', 'quotes', 'police_report', 'inventory')),
  document_url TEXT NOT NULL,
  document_name TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claim_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES insurance_claims(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_description TEXT,
  event_date TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'user'
);

-- RLS Policies
ALTER TABLE mtd_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtd_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtd_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE epc_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE epc_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_protections ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_timeline ENABLE ROW LEVEL SECURITY;

-- MTD RLS
CREATE POLICY "Users manage own MTD obligations" ON mtd_obligations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own MTD submissions" ON mtd_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own MTD settings" ON mtd_settings FOR ALL USING (auth.uid() = user_id);

-- EPC RLS
CREATE POLICY "Users manage own EPC assessments" ON epc_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage EPC improvements via assessments" ON epc_improvements FOR ALL USING (
  EXISTS (SELECT 1 FROM epc_assessments WHERE id = assessment_id AND user_id = auth.uid())
);

-- Deposit RLS
CREATE POLICY "Users manage own deposit protections" ON deposit_protections FOR ALL USING (auth.uid() = user_id);

-- Signature RLS
CREATE POLICY "Users manage own signature requests" ON signature_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view signers for own requests" ON signature_signers FOR ALL USING (
  EXISTS (SELECT 1 FROM signature_requests WHERE id = request_id AND user_id = auth.uid())
);
CREATE POLICY "Users view audit log for own requests" ON signature_audit_log FOR ALL USING (
  EXISTS (SELECT 1 FROM signature_requests WHERE id = request_id AND user_id = auth.uid())
);

-- Claims RLS
CREATE POLICY "Users manage own insurance claims" ON insurance_claims FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage claim documents for own claims" ON claim_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM insurance_claims WHERE id = claim_id AND user_id = auth.uid())
);
CREATE POLICY "Users view claim timeline for own claims" ON claim_timeline FOR ALL USING (
  EXISTS (SELECT 1 FROM insurance_claims WHERE id = claim_id AND user_id = auth.uid())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mtd_obligations_user ON mtd_obligations(user_id);
CREATE INDEX IF NOT EXISTS idx_mtd_obligations_tax_year ON mtd_obligations(tax_year, quarter);
CREATE INDEX IF NOT EXISTS idx_epc_assessments_property ON epc_assessments(portfolio_property_id);
CREATE INDEX IF NOT EXISTS idx_deposit_protections_status ON deposit_protections(status);
CREATE INDEX IF NOT EXISTS idx_signature_requests_status ON signature_requests(status);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_status ON insurance_claims(status);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_property ON insurance_claims(portfolio_property_id);
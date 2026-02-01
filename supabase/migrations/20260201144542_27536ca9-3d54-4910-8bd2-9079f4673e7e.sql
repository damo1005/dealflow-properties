-- Phase 13: Rent Guarantee, Utilities, Development Appraisal, Bridging, Virtual Tours

-- =====================================================
-- 13A: Rent Guarantee Insurance
-- =====================================================

CREATE TABLE IF NOT EXISTS public.rent_guarantee_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  policy_number TEXT,
  monthly_rent_covered DECIMAL(10,2),
  max_claim_months INTEGER DEFAULT 12,
  max_claim_amount DECIMAL(12,2),
  legal_expenses_cover DECIMAL(10,2),
  annual_premium DECIMAL(10,2),
  premium_rate DECIMAL(5,2),
  start_date DATE,
  end_date DATE,
  tenant_referenced BOOLEAN DEFAULT false,
  reference_provider TEXT,
  reference_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'claimed')),
  policy_document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rent_guarantee_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES public.rent_guarantee_policies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  claim_reference TEXT,
  arrears_start_date DATE,
  total_arrears DECIMAL(10,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'paying', 'exhausted', 'closed')),
  payments_received DECIMAL(10,2) DEFAULT 0,
  months_claimed INTEGER DEFAULT 0,
  eviction_started BOOLEAN DEFAULT false,
  eviction_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 13B: Utility Switching Service
-- =====================================================

CREATE TABLE IF NOT EXISTS public.property_utilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  utility_type TEXT NOT NULL CHECK (utility_type IN ('gas', 'electricity', 'water', 'broadband', 'council_tax')),
  supplier TEXT,
  account_number TEXT,
  tariff_name TEXT,
  monthly_cost DECIMAL(10,2),
  annual_cost DECIMAL(10,2),
  unit_rate DECIMAL(8,4),
  standing_charge DECIMAL(8,2),
  contract_end_date DATE,
  exit_fee DECIMAL(10,2),
  meter_type TEXT,
  mpan TEXT,
  mprn TEXT,
  paid_by TEXT DEFAULT 'tenant' CHECK (paid_by IN ('tenant', 'landlord', 'included')),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.utility_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utility_id UUID REFERENCES public.property_utilities(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  reading_value DECIMAL(12,2) NOT NULL,
  reading_type TEXT DEFAULT 'actual' CHECK (reading_type IN ('actual', 'estimated')),
  photo_url TEXT,
  submitted_to_supplier BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 13C: Development Appraisal
-- =====================================================

CREATE TABLE IF NOT EXISTS public.development_appraisals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  address TEXT,
  postcode TEXT,
  project_type TEXT CHECK (project_type IN ('conversion', 'new_build', 'refurb_flip', 'hmo_conversion', 'extension')),
  existing_units INTEGER DEFAULT 1,
  proposed_units INTEGER,
  unit_breakdown JSONB DEFAULT '[]',
  purchase_price DECIMAL(12,2),
  purchase_costs DECIMAL(10,2),
  construction_cost DECIMAL(12,2),
  contingency_percent DECIMAL(5,2) DEFAULT 10,
  professional_fees DECIMAL(10,2),
  finance_type TEXT,
  loan_amount DECIMAL(12,2),
  interest_rate DECIMAL(5,2),
  loan_term_months INTEGER,
  arrangement_fee DECIMAL(10,2),
  gdv DECIMAL(12,2),
  sales_costs DECIMAL(10,2),
  exit_strategy TEXT CHECK (exit_strategy IN ('sell', 'retain', 'mix')),
  estimated_rent_pcm DECIMAL(10,2),
  estimated_yield DECIMAL(5,2),
  total_costs DECIMAL(12,2),
  gross_profit DECIMAL(12,2),
  net_profit DECIMAL(12,2),
  profit_on_cost DECIMAL(5,2),
  roi DECIMAL(5,2),
  build_months INTEGER,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 13D: Bridging Finance Calculator
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bridging_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  loan_purpose TEXT,
  property_value DECIMAL(12,2),
  purchase_price DECIMAL(12,2),
  loan_amount DECIMAL(12,2),
  ltv DECIMAL(5,2),
  term_months INTEGER,
  interest_rate_monthly DECIMAL(5,3),
  arrangement_fee_percent DECIMAL(5,2),
  exit_fee_percent DECIMAL(5,2),
  gross_interest DECIMAL(10,2),
  arrangement_fee DECIMAL(10,2),
  exit_fee DECIMAL(10,2),
  valuation_fee DECIMAL(10,2),
  legal_fee DECIMAL(10,2),
  total_cost DECIMAL(12,2),
  total_repayable DECIMAL(12,2),
  exit_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 13E: Virtual Tours & Viewings
-- =====================================================

CREATE TABLE IF NOT EXISTS public.property_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  tour_type TEXT CHECK (tour_type IN ('360_photo', 'video_walkthrough', 'matterport', 'floorplan_3d')),
  tour_url TEXT,
  embed_code TEXT,
  thumbnail_url TEXT,
  provider TEXT,
  external_id TEXT,
  is_public BOOLEAN DEFAULT false,
  password_protected BOOLEAN DEFAULT false,
  password_hash TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.viewing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  viewing_type TEXT DEFAULT 'in_person' CHECK (viewing_type IN ('in_person', 'virtual', 'video_call')),
  preferred_dates JSONB DEFAULT '[]',
  confirmed_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  feedback TEXT,
  interest_level TEXT CHECK (interest_level IN ('very_interested', 'interested', 'not_interested')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.viewing_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME,
  end_time TIME,
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- Enable RLS
-- =====================================================

ALTER TABLE public.rent_guarantee_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_guarantee_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_utilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_appraisals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridging_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewing_availability ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies
-- =====================================================

CREATE POLICY "Users can manage own rent guarantee policies" ON public.rent_guarantee_policies
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own rent guarantee claims" ON public.rent_guarantee_claims
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own property utilities" ON public.property_utilities
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage utility readings" ON public.utility_readings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.property_utilities u WHERE u.id = utility_id AND u.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own development appraisals" ON public.development_appraisals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bridging calculations" ON public.bridging_calculations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own property tours" ON public.property_tours
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own viewing requests" ON public.viewing_requests
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own viewing availability" ON public.viewing_availability
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_rent_guarantee_policies_user ON public.rent_guarantee_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_property_utilities_property ON public.property_utilities(portfolio_property_id);
CREATE INDEX IF NOT EXISTS idx_development_appraisals_user ON public.development_appraisals(user_id);
CREATE INDEX IF NOT EXISTS idx_viewing_requests_property ON public.viewing_requests(portfolio_property_id);
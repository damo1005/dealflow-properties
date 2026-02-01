-- Phase 9: Advanced AI & Agent Features

-- Feature 9A: AI Property Valuation
CREATE TABLE IF NOT EXISTS public.property_valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  address TEXT,
  postcode TEXT,
  property_type TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_footage INTEGER,
  condition TEXT,
  features TEXT[],
  estimated_value DECIMAL(12,2),
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  value_range_low DECIMAL(12,2),
  value_range_high DECIMAL(12,2),
  estimated_rent_pcm DECIMAL(10,2),
  rent_range_low DECIMAL(10,2),
  rent_range_high DECIMAL(10,2),
  estimated_yield DECIMAL(5,2),
  comparables JSONB,
  valuation_factors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.valuation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE NOT NULL,
  valuation_date DATE NOT NULL,
  estimated_value DECIMAL(12,2),
  source TEXT DEFAULT 'ai',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature 9B: Tenant Screening
CREATE TABLE IF NOT EXISTS public.tenant_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  current_address TEXT,
  desired_move_date DATE,
  proposed_rent DECIMAL(10,2),
  tenancy_length_months INTEGER,
  num_occupants INTEGER,
  has_pets BOOLEAN DEFAULT false,
  pet_details TEXT,
  employment_status TEXT,
  employer_name TEXT,
  job_title TEXT,
  annual_income DECIMAL(12,2),
  status TEXT DEFAULT 'received',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenant_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.tenant_applications(id) ON DELETE CASCADE NOT NULL,
  reference_type TEXT NOT NULL,
  referee_name TEXT,
  referee_email TEXT,
  referee_phone TEXT,
  referee_relationship TEXT,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  response JSONB,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.tenant_applications(id) ON DELETE CASCADE NOT NULL,
  provider TEXT,
  external_reference TEXT,
  credit_score INTEGER,
  score_band TEXT,
  ccjs INTEGER DEFAULT 0,
  bankruptcies INTEGER DEFAULT 0,
  rent_to_income_ratio DECIMAL(5,2),
  affordability_pass BOOLEAN,
  recommendation TEXT,
  report_url TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature 9C: Rent Collection Automation
CREATE TABLE IF NOT EXISTS public.rent_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id UUID REFERENCES public.tenancies(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  frequency TEXT DEFAULT 'monthly',
  due_day INTEGER,
  start_date DATE NOT NULL,
  end_date DATE,
  payment_method TEXT,
  bank_reference TEXT,
  auto_detect_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rent_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rent_schedule_id UUID REFERENCES public.rent_schedules(id) ON DELETE SET NULL,
  tenancy_id UUID REFERENCES public.tenancies(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  due_date DATE NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  paid_date DATE,
  payment_method TEXT,
  payment_reference TEXT,
  days_late INTEGER DEFAULT 0,
  late_fee DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rent_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reminder_type TEXT,
  days_offset INTEGER,
  send_email BOOLEAN DEFAULT true,
  send_sms BOOLEAN DEFAULT false,
  send_notification BOOLEAN DEFAULT true,
  email_template TEXT,
  sms_template TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature 9D: Portfolio Benchmarking
CREATE TABLE IF NOT EXISTS public.benchmark_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT,
  property_type TEXT,
  avg_gross_yield DECIMAL(5,2),
  avg_net_yield DECIMAL(5,2),
  avg_void_rate DECIMAL(5,2),
  avg_expense_ratio DECIMAL(5,2),
  avg_rent_growth_1y DECIMAL(5,2),
  avg_capital_growth_1y DECIMAL(5,2),
  avg_roi DECIMAL(5,2),
  data_period TEXT,
  data_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  snapshot_date DATE NOT NULL,
  total_properties INTEGER,
  total_value DECIMAL(14,2),
  total_debt DECIMAL(14,2),
  total_equity DECIMAL(14,2),
  gross_yield DECIMAL(5,2),
  net_yield DECIMAL(5,2),
  cash_on_cash DECIMAL(5,2),
  roi DECIMAL(5,2),
  void_rate DECIMAL(5,2),
  expense_ratio DECIMAL(5,2),
  rent_collection_rate DECIMAL(5,2),
  capital_growth DECIMAL(5,2),
  rent_growth DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, snapshot_date)
);

-- Feature 9E: White-Label for Agents
CREATE TABLE IF NOT EXISTS public.white_label_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  company_website TEXT,
  primary_color TEXT DEFAULT '#1e40af',
  secondary_color TEXT DEFAULT '#3b82f6',
  accent_color TEXT DEFAULT '#10b981',
  custom_domain TEXT,
  domain_verified BOOLEAN DEFAULT false,
  features_enabled JSONB DEFAULT '{}',
  max_clients INTEGER DEFAULT 50,
  max_properties_per_client INTEGER DEFAULT 20,
  subscription_tier TEXT DEFAULT 'agent_pro',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  user_id UUID REFERENCES auth.users(id),
  access_level TEXT DEFAULT 'view_only',
  property_count INTEGER DEFAULT 0,
  management_fee_percent DECIMAL(5,2),
  fee_type TEXT DEFAULT 'percentage',
  status TEXT DEFAULT 'active',
  contract_start_date DATE,
  contract_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_property_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_client_id UUID REFERENCES public.agent_clients(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE NOT NULL,
  management_type TEXT,
  fee_percent DECIMAL(5,2),
  fee_fixed DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_client_id, portfolio_property_id)
);

-- Enable RLS
ALTER TABLE public.property_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.white_label_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_property_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own valuations" ON public.property_valuations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own valuation history" ON public.valuation_history FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.portfolio_properties WHERE id = portfolio_property_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own tenant applications" ON public.tenant_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tenant references" ON public.tenant_references FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.tenant_applications WHERE id = application_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own credit checks" ON public.credit_checks FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.tenant_applications WHERE id = application_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own rent schedules" ON public.rent_schedules FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.portfolio_properties WHERE id = portfolio_property_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own rent ledger" ON public.rent_ledger FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.portfolio_properties WHERE id = portfolio_property_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own rent reminders" ON public.rent_reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view benchmark data" ON public.benchmark_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own portfolio snapshots" ON public.portfolio_snapshots FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own white label config" ON public.white_label_configs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Agents can manage own clients" ON public.agent_clients FOR ALL USING (auth.uid() = agent_id);
CREATE POLICY "Agents can manage property assignments" ON public.agent_property_assignments FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.agent_clients WHERE id = agent_client_id AND agent_id = auth.uid()));

-- Indexes
CREATE INDEX idx_valuations_user ON public.property_valuations(user_id);
CREATE INDEX idx_valuations_property ON public.property_valuations(portfolio_property_id);
CREATE INDEX idx_valuation_history_property ON public.valuation_history(portfolio_property_id);
CREATE INDEX idx_tenant_applications_user ON public.tenant_applications(user_id);
CREATE INDEX idx_tenant_applications_status ON public.tenant_applications(status);
CREATE INDEX idx_tenant_references_application ON public.tenant_references(application_id);
CREATE INDEX idx_credit_checks_application ON public.credit_checks(application_id);
CREATE INDEX idx_rent_schedules_tenancy ON public.rent_schedules(tenancy_id);
CREATE INDEX idx_rent_ledger_property ON public.rent_ledger(portfolio_property_id);
CREATE INDEX idx_rent_ledger_status ON public.rent_ledger(status);
CREATE INDEX idx_portfolio_snapshots_user ON public.portfolio_snapshots(user_id);
CREATE INDEX idx_agent_clients_agent ON public.agent_clients(agent_id);
CREATE INDEX idx_property_assignments_client ON public.agent_property_assignments(agent_client_id);

-- Triggers
CREATE TRIGGER update_tenant_applications_updated_at BEFORE UPDATE ON public.tenant_applications 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_white_label_configs_updated_at BEFORE UPDATE ON public.white_label_configs 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agent_clients_updated_at BEFORE UPDATE ON public.agent_clients 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Phase 14: Accreditations, Company Accounts, Rental Bidding, Smart Home, Carbon

-- 14A: Landlord Accreditations
CREATE TABLE IF NOT EXISTS public.landlord_accreditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheme_name TEXT NOT NULL,
  provider TEXT,
  membership_number TEXT,
  accreditation_level TEXT,
  start_date DATE,
  expiry_date DATE,
  cpd_hours_required INTEGER,
  cpd_hours_completed INTEGER DEFAULT 0,
  annual_fee DECIMAL(10,2),
  certificate_url TEXT,
  status TEXT DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.property_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  license_type TEXT NOT NULL,
  local_authority TEXT NOT NULL,
  license_number TEXT,
  application_date DATE,
  granted_date DATE,
  expiry_date DATE,
  application_fee DECIMAL(10,2),
  max_occupants INTEGER,
  conditions JSONB,
  status TEXT DEFAULT 'active',
  license_document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cpd_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accreditation_id UUID REFERENCES public.landlord_accreditations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_name TEXT NOT NULL,
  provider TEXT,
  activity_date DATE,
  hours DECIMAL(4,2),
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14B: Property Companies
CREATE TABLE IF NOT EXISTS public.property_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  company_number TEXT,
  incorporation_date DATE,
  company_type TEXT DEFAULT 'spv',
  registered_address TEXT,
  directors JSONB,
  shareholders JSONB,
  year_end_month INTEGER,
  accounting_reference_date DATE,
  vat_registered BOOLEAN DEFAULT false,
  vat_number TEXT,
  bank_name TEXT,
  account_number_masked TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.company_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.property_companies(id) ON DELETE CASCADE,
  filing_type TEXT NOT NULL,
  period_start DATE,
  period_end DATE,
  due_date DATE NOT NULL,
  filed_date DATE,
  status TEXT DEFAULT 'pending',
  filing_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.director_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.property_companies(id) ON DELETE CASCADE,
  direction TEXT,
  director_name TEXT,
  amount DECIMAL(12,2),
  loan_date DATE,
  interest_rate DECIMAL(5,2) DEFAULT 0,
  amount_repaid DECIMAL(12,2) DEFAULT 0,
  balance DECIMAL(12,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14C: Rental Bidding
CREATE TABLE IF NOT EXISTS public.rental_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  asking_rent DECIMAL(10,2) NOT NULL,
  min_acceptable_rent DECIMAL(10,2),
  min_tenancy_months INTEGER DEFAULT 12,
  available_from DATE,
  accept_pets BOOLEAN DEFAULT false,
  accept_smokers BOOLEAN DEFAULT false,
  accept_dss BOOLEAN DEFAULT false,
  bidding_enabled BOOLEAN DEFAULT false,
  bidding_end_date DATE,
  show_highest_bid BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  view_count INTEGER DEFAULT 0,
  enquiry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rental_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.rental_listings(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  offered_rent DECIMAL(10,2) NOT NULL,
  tenancy_length_months INTEGER,
  move_in_date DATE,
  num_occupants INTEGER,
  has_pets BOOLEAN DEFAULT false,
  pet_details TEXT,
  employment_status TEXT,
  annual_income DECIMAL(12,2),
  cover_message TEXT,
  status TEXT DEFAULT 'pending',
  landlord_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14D: Smart Home
CREATE TABLE IF NOT EXISTS public.smart_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_type TEXT NOT NULL,
  device_name TEXT,
  manufacturer TEXT,
  model TEXT,
  platform TEXT,
  external_id TEXT,
  room TEXT,
  is_online BOOLEAN DEFAULT true,
  battery_level INTEGER,
  last_seen_at TIMESTAMPTZ,
  alerts_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.device_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.smart_devices(id) ON DELETE CASCADE,
  reading_type TEXT,
  reading_value DECIMAL(10,2),
  reading_unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.device_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.smart_devices(id) ON DELETE CASCADE,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id),
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'warning',
  message TEXT,
  status TEXT DEFAULT 'active',
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14E: Carbon Footprint
CREATE TABLE IF NOT EXISTS public.carbon_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_year INTEGER,
  electricity_kwh DECIMAL(10,2),
  gas_kwh DECIMAL(10,2),
  oil_litres DECIMAL(10,2),
  electricity_carbon DECIMAL(10,2),
  gas_carbon DECIMAL(10,2),
  oil_carbon DECIMAL(10,2),
  total_carbon DECIMAL(10,2),
  carbon_per_sqm DECIMAL(10,2),
  carbon_rating TEXT,
  uk_average_carbon DECIMAL(10,2),
  vs_average_percent DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.carbon_offsets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT,
  project_name TEXT,
  tonnes_offset DECIMAL(10,2),
  cost DECIMAL(10,2),
  purchase_date DATE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.landlord_accreditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpd_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.director_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_offsets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their accreditations" ON public.landlord_accreditations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their property licenses" ON public.property_licenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their CPD activities" ON public.cpd_activities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their companies" ON public.property_companies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage company filings" ON public.company_filings FOR ALL USING (EXISTS (SELECT 1 FROM public.property_companies WHERE id = company_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage director loans" ON public.director_loans FOR ALL USING (EXISTS (SELECT 1 FROM public.property_companies WHERE id = company_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage their rental listings" ON public.rental_listings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view offers on their listings" ON public.rental_offers FOR ALL USING (EXISTS (SELECT 1 FROM public.rental_listings WHERE id = listing_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage their smart devices" ON public.smart_devices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view device readings" ON public.device_readings FOR ALL USING (EXISTS (SELECT 1 FROM public.smart_devices WHERE id = device_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage device alerts" ON public.device_alerts FOR ALL USING (EXISTS (SELECT 1 FROM public.smart_devices WHERE id = device_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage their carbon assessments" ON public.carbon_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their carbon offsets" ON public.carbon_offsets FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_accreditations_user ON public.landlord_accreditations(user_id);
CREATE INDEX idx_accreditations_expiry ON public.landlord_accreditations(expiry_date);
CREATE INDEX idx_property_licenses_property ON public.property_licenses(portfolio_property_id);
CREATE INDEX idx_cpd_activities_accreditation ON public.cpd_activities(accreditation_id);
CREATE INDEX idx_company_filings_company ON public.company_filings(company_id);
CREATE INDEX idx_rental_listings_property ON public.rental_listings(portfolio_property_id);
CREATE INDEX idx_rental_offers_listing ON public.rental_offers(listing_id);
CREATE INDEX idx_smart_devices_property ON public.smart_devices(portfolio_property_id);
CREATE INDEX idx_device_readings_device ON public.device_readings(device_id);
CREATE INDEX idx_carbon_assessments_property ON public.carbon_assessments(portfolio_property_id);
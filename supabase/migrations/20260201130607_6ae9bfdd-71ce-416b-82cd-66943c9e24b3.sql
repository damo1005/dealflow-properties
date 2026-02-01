-- Conveyancing Firms table
CREATE TABLE IF NOT EXISTS public.conveyancing_firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  handles_purchases BOOLEAN DEFAULT true,
  handles_sales BOOLEAN DEFAULT true,
  handles_remortgage BOOLEAN DEFAULT true,
  handles_transfer_equity BOOLEAN DEFAULT true,
  handles_btl BOOLEAN DEFAULT true,
  handles_ltd_company BOOLEAN DEFAULT true,
  handles_leasehold BOOLEAN DEFAULT true,
  handles_new_build BOOLEAN DEFAULT true,
  purchase_fee_from DECIMAL(10,2),
  sale_fee_from DECIMAL(10,2),
  remortgage_fee_from DECIMAL(10,2),
  referral_partner TEXT,
  referral_link TEXT,
  commission_type TEXT CHECK (commission_type IN ('per_completion', 'percentage')) DEFAULT 'per_completion',
  commission_amount DECIMAL(10,2),
  sra_number TEXT,
  cqs_accredited BOOLEAN DEFAULT false,
  avg_completion_days INTEGER,
  trustpilot_rating DECIMAL(3,2),
  reviews_count INTEGER,
  offers_no_sale_no_fee BOOLEAN DEFAULT false,
  offers_fixed_fee BOOLEAN DEFAULT true,
  offers_online_tracking BOOLEAN DEFAULT true,
  dedicated_conveyancer BOOLEAN DEFAULT true,
  coverage_areas TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conveyancing Quotes table
CREATE TABLE IF NOT EXISTS public.conveyancing_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'sale', 'purchase_and_sale', 'remortgage', 'transfer_equity')) NOT NULL,
  purchase_price DECIMAL(12,2),
  purchase_property_type TEXT,
  purchase_postcode TEXT,
  is_btl BOOLEAN DEFAULT false,
  is_ltd_company BOOLEAN DEFAULT false,
  needs_mortgage BOOLEAN DEFAULT true,
  is_first_time_buyer BOOLEAN DEFAULT false,
  is_help_to_buy BOOLEAN DEFAULT false,
  is_shared_ownership BOOLEAN DEFAULT false,
  sale_price DECIMAL(12,2),
  sale_property_type TEXT,
  sale_postcode TEXT,
  has_outstanding_mortgage BOOLEAN DEFAULT false,
  remortgage_value DECIMAL(12,2),
  remortgage_postcode TEXT,
  is_cash_buyer BOOLEAN DEFAULT false,
  has_survey BOOLEAN DEFAULT true,
  chain_position TEXT,
  quotes JSONB,
  status TEXT CHECK (status IN ('draft', 'quoted', 'instructed', 'completed', 'expired')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Conveyancing Instructions table
CREATE TABLE IF NOT EXISTS public.conveyancing_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quote_id UUID REFERENCES public.conveyancing_quotes(id),
  firm_id UUID REFERENCES public.conveyancing_firms(id),
  firm_name TEXT,
  transaction_type TEXT,
  property_address TEXT,
  transaction_value DECIMAL(12,2),
  legal_fee DECIMAL(10,2),
  disbursements DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  instructed_date DATE DEFAULT CURRENT_DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  status TEXT CHECK (status IN ('instructed', 'searches_ordered', 'contract_received', 'enquiries_raised', 'mortgage_approved', 'exchange', 'completion', 'cancelled')) DEFAULT 'instructed',
  referral_click_id TEXT,
  commission_status TEXT CHECK (commission_status IN ('pending', 'approved', 'paid', 'declined')) DEFAULT 'pending',
  commission_amount DECIMAL(10,2),
  commission_date DATE,
  contract_pdf_url TEXT,
  completion_statement_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractor Categories table
CREATE TABLE IF NOT EXISTS public.contractor_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  typical_hourly_rate_min DECIMAL(6,2),
  typical_hourly_rate_max DECIMAL(6,2),
  typical_callout_fee DECIMAL(6,2),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractors table
CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  trading_as TEXT,
  logo_url TEXT,
  bio TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website_url TEXT,
  coverage_areas TEXT[],
  coverage_radius_miles INTEGER,
  home_postcode TEXT,
  is_gas_safe_registered BOOLEAN DEFAULT false,
  gas_safe_number TEXT,
  is_niceic_registered BOOLEAN DEFAULT false,
  niceic_number TEXT,
  other_certifications TEXT[],
  has_public_liability BOOLEAN DEFAULT false,
  public_liability_amount DECIMAL(12,2),
  insurance_expiry_date DATE,
  is_vetted BOOLEAN DEFAULT false,
  vetted_at TIMESTAMPTZ,
  dbs_checked BOOLEAN DEFAULT false,
  references_checked BOOLEAN DEFAULT false,
  hourly_rate DECIMAL(6,2),
  half_day_rate DECIMAL(8,2),
  day_rate DECIMAL(8,2),
  callout_fee DECIMAL(6,2),
  free_quotes BOOLEAN DEFAULT true,
  emergency_callout BOOLEAN DEFAULT false,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Requests table
CREATE TABLE IF NOT EXISTS public.job_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category_id UUID REFERENCES public.contractor_categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  property_address TEXT,
  property_postcode TEXT,
  urgency TEXT CHECK (urgency IN ('emergency', 'urgent', 'normal', 'flexible')) DEFAULT 'normal',
  preferred_date DATE,
  preferred_time TEXT,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  photo_urls TEXT[],
  status TEXT CHECK (status IN ('draft', 'posted', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled')) DEFAULT 'draft',
  selected_contractor_id UUID REFERENCES public.contractors(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Job Quotes table
CREATE TABLE IF NOT EXISTS public.job_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_request_id UUID REFERENCES public.job_requests(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES public.contractors(id) ON DELETE CASCADE,
  quote_amount DECIMAL(10,2) NOT NULL,
  quote_description TEXT,
  estimated_duration TEXT,
  earliest_start_date DATE,
  labour_cost DECIMAL(10,2),
  materials_cost DECIMAL(10,2),
  other_costs DECIMAL(10,2),
  valid_until DATE,
  status TEXT CHECK (status IN ('sent', 'viewed', 'accepted', 'declined', 'expired')) DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractor Reviews table
CREATE TABLE IF NOT EXISTS public.contractor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contractor_id UUID REFERENCES public.contractors(id) ON DELETE CASCADE,
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5) NOT NULL,
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  review_text TEXT,
  contractor_response TEXT,
  is_verified BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conveyancing_quotes_user ON public.conveyancing_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_conveyancing_instructions_user ON public.conveyancing_instructions(user_id);
CREATE INDEX IF NOT EXISTS idx_contractors_active ON public.contractors(is_active, is_vetted);
CREATE INDEX IF NOT EXISTS idx_job_requests_user ON public.job_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_contractor_reviews_contractor ON public.contractor_reviews(contractor_id);

-- Enable RLS
ALTER TABLE public.conveyancing_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conveyancing_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conveyancing_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone reads conveyancing firms" ON public.conveyancing_firms FOR SELECT USING (true);
CREATE POLICY "Users manage own conveyancing quotes" ON public.conveyancing_quotes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own conveyancing instructions" ON public.conveyancing_instructions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone reads contractor categories" ON public.contractor_categories FOR SELECT USING (true);
CREATE POLICY "Anyone reads active contractors" ON public.contractors FOR SELECT USING (is_active = true AND is_vetted = true);
CREATE POLICY "Users manage own job requests" ON public.job_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users read relevant job quotes" ON public.job_quotes FOR SELECT USING (
  job_request_id IN (SELECT id FROM public.job_requests WHERE user_id = auth.uid())
);
CREATE POLICY "Anyone reads approved reviews" ON public.contractor_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users manage own reviews" ON public.contractor_reviews FOR ALL USING (auth.uid() = user_id);

-- Insert sample conveyancing firms
INSERT INTO public.conveyancing_firms (firm_name, purchase_fee_from, sale_fee_from, referral_partner, commission_amount, sra_number, cqs_accredited, avg_completion_days, trustpilot_rating, reviews_count, offers_no_sale_no_fee, coverage_areas, display_order) VALUES
('SAM Conveyancing', 599.00, 599.00, 'direct', 150.00, 'SRA123456', true, 56, 4.8, 8234, true, ARRAY['nationwide'], 1),
('Homeward Legal', 649.00, 649.00, 'direct', 125.00, 'SRA234567', true, 62, 4.6, 6891, true, ARRAY['nationwide'], 2),
('My Home Move Conveyancing', 699.00, 699.00, 'direct', 100.00, 'SRA345678', true, 58, 4.5, 4521, true, ARRAY['nationwide'], 3),
('Premier Property Lawyers', 749.00, 749.00, 'direct', 175.00, 'SRA456789', true, 54, 4.7, 5129, false, ARRAY['nationwide'], 4)
ON CONFLICT DO NOTHING;

-- Insert contractor categories
INSERT INTO public.contractor_categories (category_name, slug, icon, description, typical_hourly_rate_min, typical_hourly_rate_max, typical_callout_fee, display_order) VALUES
('Plumber', 'plumber', '🔧', 'Plumbing repairs, installations, and maintenance', 40, 80, 60, 1),
('Electrician', 'electrician', '⚡', 'Electrical repairs, installations, and rewiring', 45, 90, 70, 2),
('Gas Engineer', 'gas-engineer', '🔥', 'Gas Safe registered engineers for boilers and heating', 50, 100, 80, 3),
('Builder', 'builder', '🏗️', 'Building work, extensions, and renovations', 35, 75, 0, 4),
('Painter & Decorator', 'painter-decorator', '🎨', 'Interior and exterior painting and decorating', 25, 50, 0, 5),
('Locksmith', 'locksmith', '🔐', 'Lock repairs, replacements, and emergency lockouts', 50, 100, 90, 6),
('Cleaner', 'cleaner', '🧹', 'End of tenancy cleaning and deep cleans', 15, 25, 0, 7),
('Handyman', 'handyman', '🔨', 'General property maintenance and repairs', 30, 60, 50, 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample contractors
INSERT INTO public.contractors (business_name, email, phone, bio, coverage_areas, is_gas_safe_registered, gas_safe_number, has_public_liability, dbs_checked, is_vetted, hourly_rate, callout_fee, emergency_callout, avg_rating, total_reviews, total_jobs_completed) VALUES
('ABC Plumbing Services', 'info@abcplumbing.co.uk', '020 1234 5678', 'Professional plumbing service for landlords. 20+ years experience. Gas Safe certified.', ARRAY['EN', 'N', 'E'], true, '123456', true, true, true, 55.00, 60.00, true, 4.9, 47, 523),
('Elite Electrical Ltd', 'hello@eliteelectrical.co.uk', '020 2345 6789', 'NICEIC approved electricians. Rewiring, EICRs, consumer units.', ARRAY['London'], true, null, true, true, true, 65.00, 70.00, false, 4.7, 89, 412),
('QuickFix Plumbing', 'jobs@quickfix.co.uk', '020 3456 7890', 'Fast, reliable plumbing repairs. Same day service available.', ARRAY['N', 'NW', 'EN'], true, '234567', true, false, true, 50.00, 55.00, true, 4.3, 23, 178),
('Pro Painters London', 'info@propainters.co.uk', '020 4567 8901', 'Professional decorating for rental properties. Quick turnaround.', ARRAY['London'], false, null, true, true, true, 35.00, 0, false, 4.6, 56, 234)
ON CONFLICT DO NOTHING;
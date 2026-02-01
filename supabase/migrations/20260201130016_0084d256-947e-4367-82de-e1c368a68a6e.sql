-- Insurance Providers table
CREATE TABLE IF NOT EXISTS public.insurance_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  offers_buildings BOOLEAN DEFAULT true,
  offers_contents BOOLEAN DEFAULT true,
  offers_liability BOOLEAN DEFAULT true,
  offers_rent_guarantee BOOLEAN DEFAULT false,
  offers_legal_expenses BOOLEAN DEFAULT false,
  offers_emergency_assistance BOOLEAN DEFAULT false,
  affiliate_network TEXT,
  affiliate_link TEXT,
  commission_type TEXT CHECK (commission_type IN ('per_policy', 'percentage', 'cpa')),
  commission_amount DECIMAL(10,2),
  cookie_duration_days INTEGER DEFAULT 30,
  trustpilot_rating DECIMAL(3,2),
  defaqto_rating INTEGER,
  avg_buildings_premium DECIMAL(10,2),
  avg_contents_premium DECIMAL(10,2),
  avg_combined_premium DECIMAL(10,2),
  key_features TEXT[],
  excess_options TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insurance Quotes table
CREATE TABLE IF NOT EXISTS public.insurance_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_property_id UUID,
  property_address TEXT,
  postcode TEXT,
  property_type TEXT,
  property_value DECIMAL(12,2),
  rebuild_cost DECIMAL(12,2),
  year_built INTEGER,
  coverage_type TEXT CHECK (coverage_type IN ('buildings', 'contents', 'combined', 'liability')),
  buildings_cover_amount DECIMAL(12,2),
  contents_cover_amount DECIMAL(12,2),
  bedrooms INTEGER,
  is_listed_building BOOLEAN DEFAULT false,
  has_flat_roof BOOLEAN DEFAULT false,
  is_hmo BOOLEAN DEFAULT false,
  is_furnished BOOLEAN DEFAULT false,
  has_tenants BOOLEAN DEFAULT true,
  needs_rent_guarantee BOOLEAN DEFAULT false,
  needs_legal_expenses BOOLEAN DEFAULT false,
  needs_emergency_cover BOOLEAN DEFAULT false,
  quotes JSONB,
  status TEXT CHECK (status IN ('draft', 'quoted', 'purchased', 'expired')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Insurance Purchases table
CREATE TABLE IF NOT EXISTS public.insurance_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quote_id UUID REFERENCES public.insurance_quotes(id),
  provider_id UUID REFERENCES public.insurance_providers(id),
  provider_name TEXT,
  policy_number TEXT,
  coverage_type TEXT,
  annual_premium DECIMAL(10,2),
  excess DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  affiliate_click_id TEXT,
  commission_status TEXT CHECK (commission_status IN ('pending', 'approved', 'paid', 'declined')) DEFAULT 'pending',
  commission_amount DECIMAL(10,2),
  commission_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insurance Renewals table
CREATE TABLE IF NOT EXISTS public.insurance_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.insurance_purchases(id) ON DELETE CASCADE,
  renewal_date DATE NOT NULL,
  reminder_sent_60_days BOOLEAN DEFAULT false,
  reminder_sent_30_days BOOLEAN DEFAULT false,
  reminder_sent_7_days BOOLEAN DEFAULT false,
  renewed BOOLEAN DEFAULT false,
  renewed_with_provider_id UUID REFERENCES public.insurance_providers(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_insurance_quotes_user ON public.insurance_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_quotes_status ON public.insurance_quotes(status);
CREATE INDEX IF NOT EXISTS idx_insurance_purchases_user ON public.insurance_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_renewals_date ON public.insurance_renewals(renewal_date);

-- Enable RLS
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_renewals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read insurance providers" ON public.insurance_providers FOR SELECT USING (true);

CREATE POLICY "Users can manage their own quotes" ON public.insurance_quotes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own purchases" ON public.insurance_purchases FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own renewals" ON public.insurance_renewals FOR ALL USING (
  purchase_id IN (SELECT id FROM public.insurance_purchases WHERE user_id = auth.uid())
);

-- Insert sample insurance providers
INSERT INTO public.insurance_providers (
  provider_name, 
  logo_url,
  offers_buildings,
  offers_contents,
  offers_rent_guarantee,
  offers_legal_expenses,
  offers_emergency_assistance,
  affiliate_network,
  commission_type,
  commission_amount,
  trustpilot_rating,
  defaqto_rating,
  avg_buildings_premium,
  avg_combined_premium,
  key_features,
  display_order
) VALUES
(
  'HomeLet Landlord Insurance',
  '/logos/homelet.png',
  true, true, true, true, true,
  'direct',
  'per_policy',
  50.00,
  4.5,
  5,
  280.00,
  350.00,
  ARRAY['UK''s #1 landlord insurance', 'Rent guarantee available', '24/7 emergency helpline', 'Legal expenses included', 'Defaqto 5 Star rated'],
  1
),
(
  'Simply Business',
  '/logos/simply-business.png',
  true, true, false, true, true,
  'awin',
  'per_policy',
  35.00,
  4.3,
  4,
  250.00,
  310.00,
  ARRAY['Compare 15+ insurers', 'Fast online quotes', 'Specialist landlord cover', 'HMO insurance available', 'Award-winning service'],
  2
),
(
  'Aviva Landlord Insurance',
  '/logos/aviva.png',
  true, true, true, true, true,
  'direct',
  'per_policy',
  45.00,
  4.2,
  5,
  290.00,
  360.00,
  ARRAY['Major UK insurer', 'Flexible excess options', 'Rent guarantee included', 'Alternative accommodation cover', 'Multi-property discounts'],
  3
),
(
  'Direct Line for Business',
  '/logos/direct-line.png',
  true, true, false, true, false,
  'direct',
  'per_policy',
  40.00,
  4.1,
  4,
  260.00,
  320.00,
  ARRAY['Established brand', 'Online policy management', 'No admin fees', '10% online discount', 'Claims helpline 24/7'],
  4
),
(
  'Alan Boswell Group',
  '/logos/alan-boswell.png',
  true, true, true, true, true,
  'direct',
  'per_policy',
  55.00,
  4.4,
  5,
  300.00,
  380.00,
  ARRAY['Specialist landlord broker', 'Tailored cover', 'Personal service', 'Portfolio discounts', 'Claims advocacy'],
  5
)
ON CONFLICT DO NOTHING;
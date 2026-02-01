-- Land Registry data table
CREATE TABLE IF NOT EXISTS public.land_registry_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  uprn TEXT,
  title_number TEXT UNIQUE,
  tenure TEXT CHECK (tenure IN ('freehold', 'leasehold')),
  proprietor_name TEXT,
  proprietor_address TEXT,
  proprietorship_category TEXT,
  company_registration_number TEXT,
  date_proprietor_added DATE,
  lease_term_years INTEGER,
  lease_start_date DATE,
  lease_expiry_date DATE,
  ground_rent DECIMAL(10,2),
  has_charges BOOLEAN DEFAULT false,
  charge_count INTEGER DEFAULT 0,
  charges JSONB,
  has_restrictions BOOLEAN DEFAULT false,
  restrictions JSONB,
  last_sale_date DATE,
  last_sale_price DECIMAL(12,2),
  last_sale_type TEXT,
  boundary_polygon JSONB,
  title_plan_url TEXT,
  data_quality TEXT DEFAULT 'basic',
  last_refreshed_at TIMESTAMPTZ DEFAULT NOW(),
  api_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price paid history table
CREATE TABLE IF NOT EXISTS public.price_paid_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  sale_price DECIMAL(12,2) NOT NULL,
  sale_date DATE NOT NULL,
  property_type TEXT CHECK (property_type IN ('D', 'S', 'T', 'F', 'O')),
  old_new TEXT CHECK (old_new IN ('Y', 'N')),
  duration TEXT CHECK (duration IN ('F', 'L')),
  transaction_category TEXT,
  record_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_land_registry_postcode ON public.land_registry_data(postcode);
CREATE INDEX IF NOT EXISTS idx_land_registry_title ON public.land_registry_data(title_number);
CREATE INDEX IF NOT EXISTS idx_price_paid_postcode ON public.price_paid_history(postcode);
CREATE INDEX IF NOT EXISTS idx_price_paid_date ON public.price_paid_history(sale_date DESC);

-- RLS
ALTER TABLE public.land_registry_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_paid_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads land registry" ON public.land_registry_data FOR SELECT USING (true);
CREATE POLICY "Anyone reads price paid" ON public.price_paid_history FOR SELECT USING (true);
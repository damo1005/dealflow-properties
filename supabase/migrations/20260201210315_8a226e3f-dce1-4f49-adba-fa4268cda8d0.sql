-- Cached property listings from searches
CREATE TABLE IF NOT EXISTS public.property_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- External IDs
  external_id TEXT NOT NULL,
  source TEXT NOT NULL,
  listing_url TEXT NOT NULL,
  
  -- Basic info
  address TEXT NOT NULL,
  postcode TEXT,
  outcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  
  -- Property details
  bedrooms INTEGER,
  bathrooms INTEGER,
  receptions INTEGER,
  property_type TEXT,
  tenure TEXT,
  
  -- Pricing
  price INTEGER,
  price_qualifier TEXT,
  original_price INTEGER,
  price_change_date DATE,
  is_reduced BOOLEAN DEFAULT false,
  reduction_percent DECIMAL,
  
  -- Dates
  first_listed DATE,
  last_updated DATE,
  
  -- Agent
  agent_name TEXT,
  agent_phone TEXT,
  agent_logo_url TEXT,
  
  -- Media
  images TEXT[],
  thumbnail_url TEXT,
  floorplan_url TEXT,
  
  -- Description
  summary TEXT,
  description TEXT,
  features TEXT[],
  
  -- Calculated/enriched fields
  estimated_rent INTEGER,
  gross_yield DECIMAL,
  price_per_sqft DECIMAL,
  
  -- Status
  status TEXT DEFAULT 'active',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(external_id, source)
);

-- Search history cache
CREATE TABLE IF NOT EXISTS public.property_search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_key TEXT UNIQUE NOT NULL,
  search_params JSONB,
  result_count INTEGER,
  last_searched TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour'
);

-- User saved searches
CREATE TABLE IF NOT EXISTS public.user_saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT,
  search_params JSONB,
  alert_enabled BOOLEAN DEFAULT false,
  last_alerted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User saved properties (favorites)
CREATE TABLE IF NOT EXISTS public.user_saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  listing_id UUID REFERENCES public.property_listings(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_postcode ON public.property_listings(postcode);
CREATE INDEX IF NOT EXISTS idx_listings_outcode ON public.property_listings(outcode);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.property_listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_beds ON public.property_listings(bedrooms);
CREATE INDEX IF NOT EXISTS idx_listings_type ON public.property_listings(property_type);
CREATE INDEX IF NOT EXISTS idx_listings_source ON public.property_listings(source, external_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.property_listings(status);
CREATE INDEX IF NOT EXISTS idx_search_cache_key ON public.property_search_cache(search_key);
CREATE INDEX IF NOT EXISTS idx_search_cache_expires ON public.property_search_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON public.user_saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON public.user_saved_properties(user_id);

-- Enable RLS
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_properties ENABLE ROW LEVEL SECURITY;

-- Policies - Public read for listings and cache
CREATE POLICY "Public read listings" ON public.property_listings FOR SELECT USING (true);
CREATE POLICY "Service role insert listings" ON public.property_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role update listings" ON public.property_listings FOR UPDATE USING (true);

CREATE POLICY "Public read cache" ON public.property_search_cache FOR SELECT USING (true);
CREATE POLICY "Service role manage cache" ON public.property_search_cache FOR ALL USING (true);

-- User-specific policies
CREATE POLICY "Users manage own searches" ON public.user_saved_searches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own saved properties" ON public.user_saved_properties FOR ALL USING (auth.uid() = user_id);
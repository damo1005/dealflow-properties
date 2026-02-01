-- Add scan_frequency column to deal_scouts table
ALTER TABLE public.deal_scouts 
ADD COLUMN IF NOT EXISTS scan_frequency TEXT DEFAULT 'daily';

-- Add listing_url column to cached_properties if not exists
ALTER TABLE public.cached_properties
ADD COLUMN IF NOT EXISTS listing_url TEXT;

-- Add floor_area_sqft column to cached_properties if not exists
ALTER TABLE public.cached_properties
ADD COLUMN IF NOT EXISTS floor_area_sqft INTEGER;

-- Add tenure column to cached_properties if not exists
ALTER TABLE public.cached_properties
ADD COLUMN IF NOT EXISTS tenure TEXT;

-- Add epc_rating column to cached_properties if not exists
ALTER TABLE public.cached_properties
ADD COLUMN IF NOT EXISTS epc_rating TEXT;

-- Create index for faster property lookups by postcode
CREATE INDEX IF NOT EXISTS idx_cached_properties_postcode ON public.cached_properties(postcode);

-- Create index for faster property lookups by price range
CREATE INDEX IF NOT EXISTS idx_cached_properties_price ON public.cached_properties(price);

-- Add comment for clarity
COMMENT ON COLUMN public.deal_scouts.scan_frequency IS 'Scan frequency: every_6_hours, every_12_hours, daily, manual';
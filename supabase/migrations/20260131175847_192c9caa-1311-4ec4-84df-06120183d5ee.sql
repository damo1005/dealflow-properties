-- Create API usage tracking table
CREATE TABLE IF NOT EXISTS public.api_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  cost_credits integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  response_time_ms integer,
  success boolean DEFAULT true,
  error_message text
);

-- Create index for usage queries
CREATE INDEX IF NOT EXISTS idx_api_usage_user_date ON public.api_usage(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON public.api_usage(endpoint, created_at);

-- Enable RLS
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- RLS policy - users can view their own usage
CREATE POLICY "Users can view their own API usage"
ON public.api_usage FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert (from edge functions)
CREATE POLICY "Service can insert API usage"
ON public.api_usage FOR INSERT
WITH CHECK (true);

-- Create area statistics cache table
CREATE TABLE IF NOT EXISTS public.area_statistics_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  postcode text NOT NULL,
  area_type text DEFAULT 'postcode',
  data jsonb NOT NULL,
  cached_at timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone DEFAULT (now() + interval '30 days') NOT NULL,
  UNIQUE(postcode, area_type)
);

CREATE INDEX IF NOT EXISTS idx_area_stats_postcode ON public.area_statistics_cache(postcode);
CREATE INDEX IF NOT EXISTS idx_area_stats_expires ON public.area_statistics_cache(expires_at);

ALTER TABLE public.area_statistics_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view area statistics cache"
ON public.area_statistics_cache FOR SELECT
USING (true);

-- Create comparables cache table
CREATE TABLE IF NOT EXISTS public.comparables_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  postcode text NOT NULL,
  radius_miles numeric DEFAULT 0.5,
  property_type text,
  data jsonb NOT NULL,
  cached_at timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone DEFAULT (now() + interval '7 days') NOT NULL,
  UNIQUE(postcode, radius_miles, property_type)
);

CREATE INDEX IF NOT EXISTS idx_comparables_postcode ON public.comparables_cache(postcode);
CREATE INDEX IF NOT EXISTS idx_comparables_expires ON public.comparables_cache(expires_at);

ALTER TABLE public.comparables_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comparables cache"
ON public.comparables_cache FOR SELECT
USING (true);

-- Create rental estimates cache table
CREATE TABLE IF NOT EXISTS public.rental_estimates_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  postcode text NOT NULL,
  bedrooms integer,
  property_type text,
  data jsonb NOT NULL,
  cached_at timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone DEFAULT (now() + interval '7 days') NOT NULL,
  UNIQUE(postcode, bedrooms, property_type)
);

CREATE INDEX IF NOT EXISTS idx_rental_postcode ON public.rental_estimates_cache(postcode);
CREATE INDEX IF NOT EXISTS idx_rental_expires ON public.rental_estimates_cache(expires_at);

ALTER TABLE public.rental_estimates_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rental estimates cache"
ON public.rental_estimates_cache FOR SELECT
USING (true);

-- Create function to clean expired caches
CREATE OR REPLACE FUNCTION public.clean_all_expired_caches()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.cached_properties WHERE expires_at < now();
  DELETE FROM public.area_statistics_cache WHERE expires_at < now();
  DELETE FROM public.comparables_cache WHERE expires_at < now();
  DELETE FROM public.rental_estimates_cache WHERE expires_at < now();
END;
$$;
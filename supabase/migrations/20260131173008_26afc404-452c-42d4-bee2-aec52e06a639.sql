-- Create cached_properties table for API results cache
CREATE TABLE public.cached_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  postcode TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  price_reduced BOOLEAN DEFAULT false,
  bedrooms INTEGER,
  bathrooms INTEGER,
  property_type TEXT,
  images TEXT[] DEFAULT '{}',
  days_on_market INTEGER DEFAULT 0,
  estimated_yield NUMERIC,
  roi_potential NUMERIC,
  features TEXT[] DEFAULT '{}',
  description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  region TEXT,
  county TEXT,
  raw_data JSONB,
  cached_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for cache lookup
CREATE INDEX idx_cached_properties_external_id ON public.cached_properties(external_id);
CREATE INDEX idx_cached_properties_expires_at ON public.cached_properties(expires_at);
CREATE INDEX idx_cached_properties_postcode ON public.cached_properties(postcode);
CREATE INDEX idx_cached_properties_price ON public.cached_properties(price);

-- Enable RLS (public read for cached data)
ALTER TABLE public.cached_properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cached properties
CREATE POLICY "Anyone can view cached properties"
ON public.cached_properties
FOR SELECT
USING (true);

-- Create saved_properties table for user favorites
CREATE TABLE public.saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID REFERENCES public.cached_properties(id) ON DELETE CASCADE,
  external_property_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id),
  UNIQUE(user_id, external_property_id)
);

-- Enable RLS
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_properties
CREATE POLICY "Users can view their own saved properties"
ON public.saved_properties
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save properties"
ON public.saved_properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved properties"
ON public.saved_properties
FOR DELETE
USING (auth.uid() = user_id);

-- Create pipeline_properties table for deal tracking
CREATE TABLE public.pipeline_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID REFERENCES public.cached_properties(id) ON DELETE SET NULL,
  external_property_id TEXT,
  stage TEXT NOT NULL DEFAULT 'Lead' CHECK (stage IN ('Lead', 'Analyzing', 'Negotiating', 'Due Diligence', 'Closed')),
  address TEXT NOT NULL,
  price NUMERIC,
  notes TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pipeline_properties ENABLE ROW LEVEL SECURITY;

-- RLS policies for pipeline_properties
CREATE POLICY "Users can view their own pipeline properties"
ON public.pipeline_properties
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their pipeline"
ON public.pipeline_properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pipeline properties"
ON public.pipeline_properties
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their pipeline"
ON public.pipeline_properties
FOR DELETE
USING (auth.uid() = user_id);

-- Create saved_searches table
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  alerts_enabled BOOLEAN DEFAULT false,
  last_alert_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_searches
CREATE POLICY "Users can view their own saved searches"
ON public.saved_searches
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved searches"
ON public.saved_searches
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their saved searches"
ON public.saved_searches
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved searches"
ON public.saved_searches
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_pipeline_properties_updated_at
BEFORE UPDATE ON public.pipeline_properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at
BEFORE UPDATE ON public.saved_searches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION public.clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.cached_properties WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
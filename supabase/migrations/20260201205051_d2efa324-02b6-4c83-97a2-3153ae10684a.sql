-- Create analyzed_properties table for storing Deal Analyser results
CREATE TABLE public.analyzed_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Source
  source_url TEXT,
  source_type TEXT, -- 'rightmove', 'zoopla', 'onthemarket', 'auction', 'manual'
  
  -- Property details
  address TEXT NOT NULL,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  
  -- Specs
  bedrooms INTEGER,
  bathrooms INTEGER,
  receptions INTEGER,
  property_type TEXT,
  tenure TEXT,
  floor_area_sqft INTEGER,
  epc_rating TEXT,
  year_built INTEGER,
  
  -- Pricing
  asking_price DECIMAL,
  offer_price DECIMAL,
  price_per_sqft DECIMAL,
  
  -- Analysis inputs
  purchase_price DECIMAL,
  refurb_cost DECIMAL,
  legal_fees DECIMAL,
  stamp_duty DECIMAL,
  other_costs DECIMAL,
  
  -- Financing
  deposit_percent DECIMAL,
  mortgage_rate DECIMAL,
  mortgage_term INTEGER,
  interest_only BOOLEAN DEFAULT true,
  
  -- Rental estimates
  monthly_rent DECIMAL,
  annual_rent DECIMAL,
  
  -- Calculated metrics
  total_investment DECIMAL,
  gross_yield DECIMAL,
  net_yield DECIMAL,
  roi DECIMAL,
  cash_on_cash DECIMAL,
  monthly_cashflow DECIMAL,
  annual_cashflow DECIMAL,
  deal_score INTEGER,
  
  -- GDV for flips/developments
  gdv DECIMAL,
  profit DECIMAL,
  profit_on_cost DECIMAL,
  
  -- Strategy
  strategy TEXT, -- 'btl', 'hmo', 'flip', 'brrrr', 'sa', 'development'
  
  -- Images
  images TEXT[],
  thumbnail_url TEXT,
  
  -- Features
  features TEXT[],
  description TEXT,
  
  -- Agent
  agent_name TEXT,
  agent_phone TEXT,
  
  -- Status
  status TEXT DEFAULT 'analyzed', -- 'analyzed', 'watching', 'offered', 'purchased', 'rejected'
  notes TEXT,
  
  -- Timestamps
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_comparisons table for saving comparison sessions
CREATE TABLE public.property_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  property_ids UUID[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_analyzed_properties_user ON public.analyzed_properties(user_id);
CREATE INDEX idx_analyzed_properties_postcode ON public.analyzed_properties(postcode);
CREATE INDEX idx_analyzed_properties_status ON public.analyzed_properties(status);
CREATE INDEX idx_analyzed_properties_strategy ON public.analyzed_properties(strategy);
CREATE INDEX idx_property_comparisons_user ON public.property_comparisons(user_id);

-- Enable RLS
ALTER TABLE public.analyzed_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS policies for analyzed_properties
CREATE POLICY "Users can view own analyzed properties" 
  ON public.analyzed_properties FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyzed properties" 
  ON public.analyzed_properties FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyzed properties" 
  ON public.analyzed_properties FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyzed properties" 
  ON public.analyzed_properties FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for property_comparisons
CREATE POLICY "Users can view own property comparisons" 
  ON public.property_comparisons FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own property comparisons" 
  ON public.property_comparisons FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own property comparisons" 
  ON public.property_comparisons FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own property comparisons" 
  ON public.property_comparisons FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_analyzed_properties_updated_at
  BEFORE UPDATE ON public.analyzed_properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_comparisons_updated_at
  BEFORE UPDATE ON public.property_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
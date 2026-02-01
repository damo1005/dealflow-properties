-- Drop and recreate market_data with unique constraint renamed
DROP TABLE IF EXISTS public.market_data CASCADE;

-- Market Data table
CREATE TABLE public.market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode_area TEXT NOT NULL,
  postcode_district TEXT,
  region TEXT,
  data_date DATE NOT NULL,
  period_type TEXT CHECK (period_type IN ('month', 'quarter', 'year')) DEFAULT 'month',
  median_price DECIMAL(12,2),
  average_price DECIMAL(12,2),
  lower_quartile_price DECIMAL(12,2),
  upper_quartile_price DECIMAL(12,2),
  price_per_sqft DECIMAL(8,2),
  median_rent DECIMAL(10,2),
  average_rent DECIMAL(10,2),
  average_gross_yield DECIMAL(5,2),
  sales_volume INTEGER,
  new_listings INTEGER,
  average_days_to_sell INTEGER,
  price_change_mom DECIMAL(5,2),
  price_change_yoy DECIMAL(5,2),
  stock_for_sale INTEGER,
  stock_to_rent INTEGER,
  demand_score INTEGER CHECK (demand_score BETWEEN 0 AND 100),
  property_types JSONB,
  data_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint
ALTER TABLE public.market_data ADD CONSTRAINT market_data_unique_postcode_date UNIQUE(postcode_area, data_date, period_type);

-- Indexes for market_data
CREATE INDEX idx_market_data_postcode ON public.market_data(postcode_area, data_date DESC);
CREATE INDEX idx_market_data_region ON public.market_data(region, data_date DESC);

-- RLS for market_data
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads market data" ON public.market_data FOR SELECT USING (true);
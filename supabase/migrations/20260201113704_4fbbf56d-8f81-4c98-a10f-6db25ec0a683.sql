-- Area market data cache
CREATE TABLE IF NOT EXISTS market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode TEXT NOT NULL,
  area_type TEXT,
  avg_sold_price INTEGER,
  avg_sold_price_3m INTEGER,
  avg_sold_price_12m INTEGER,
  price_growth_pct DECIMAL(5,2),
  price_per_sqft INTEGER,
  avg_rent_pcm INTEGER,
  avg_rent_1bed INTEGER,
  avg_rent_2bed INTEGER,
  avg_rent_3bed INTEGER,
  gross_yield DECIMAL(5,2),
  properties_for_sale INTEGER,
  properties_sold_3m INTEGER,
  avg_time_on_market_days INTEGER,
  sale_vs_asking_pct DECIMAL(5,2),
  population INTEGER,
  median_age INTEGER,
  avg_income INTEGER,
  employment_rate DECIMAL(5,2),
  btl_score INTEGER,
  hmo_score INTEGER,
  growth_score INTEGER,
  overall_investment_score INTEGER,
  demand_score INTEGER,
  supply_score INTEGER,
  raw_data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(postcode)
);

-- Comparative Market Analysis reports
CREATE TABLE IF NOT EXISTS cma_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID,
  subject_address TEXT NOT NULL,
  subject_postcode TEXT NOT NULL,
  subject_price INTEGER,
  sold_comparables JSONB,
  active_comparables JSONB,
  rental_comparables JSONB,
  market_value_estimate INTEGER,
  confidence_level DECIMAL(5,2),
  price_vs_market_pct DECIMAL(5,2),
  estimated_rent INTEGER,
  estimated_yield DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distressed properties tracker
CREATE TABLE IF NOT EXISTS distressed_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID,
  address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  distress_type TEXT[],
  distress_score INTEGER,
  current_price INTEGER,
  estimated_value INTEGER,
  potential_discount_pct DECIMAL(5,2),
  days_on_market INTEGER,
  price_reductions INTEGER,
  last_reduction_pct DECIMAL(5,2),
  epc_rating TEXT,
  is_active BOOLEAN DEFAULT true,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User distressed property watches
CREATE TABLE IF NOT EXISTS distressed_watches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  postcodes TEXT[],
  max_price INTEGER,
  property_types TEXT[],
  min_discount_pct DECIMAL(5,2),
  email_alerts BOOLEAN DEFAULT true,
  alert_frequency TEXT DEFAULT 'weekly',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Investment hotspots
CREATE TABLE IF NOT EXISTS investment_hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name TEXT NOT NULL,
  postcode_district TEXT NOT NULL,
  hotspot_type TEXT,
  avg_price INTEGER,
  avg_yield DECIMAL(5,2),
  price_growth_12m DECIMAL(5,2),
  forecast_growth_12m DECIMAL(5,2),
  reasons TEXT[],
  opportunity_score INTEGER,
  suitable_strategies TEXT[],
  entry_price_range TEXT,
  risk_level TEXT,
  infrastructure_projects TEXT[],
  demographic_trends JSONB,
  is_active BOOLEAN DEFAULT true,
  rank INTEGER,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User saved hotspots
CREATE TABLE IF NOT EXISTS saved_hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  hotspot_id UUID REFERENCES investment_hotspots(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hotspot_id)
);

-- Planning applications
CREATE TABLE IF NOT EXISTS planning_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  description TEXT,
  application_type TEXT,
  status TEXT,
  decision_date DATE,
  applicant TEXT,
  case_officer TEXT,
  consultation_end_date DATE,
  property_impact JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User planning alerts
CREATE TABLE IF NOT EXISTS planning_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  postcodes TEXT[],
  radius_miles INTEGER DEFAULT 1,
  alert_types TEXT[],
  email_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_market_data_postcode ON market_data(postcode);
CREATE INDEX IF NOT EXISTS idx_market_data_expires ON market_data(expires_at);
CREATE INDEX IF NOT EXISTS idx_cma_reports_user ON cma_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_cma_reports_postcode ON cma_reports(subject_postcode);
CREATE INDEX IF NOT EXISTS idx_distressed_properties_postcode ON distressed_properties(postcode);
CREATE INDEX IF NOT EXISTS idx_distressed_properties_score ON distressed_properties(distress_score DESC);
CREATE INDEX IF NOT EXISTS idx_distressed_properties_active ON distressed_properties(is_active);
CREATE INDEX IF NOT EXISTS idx_hotspots_type ON investment_hotspots(hotspot_type);
CREATE INDEX IF NOT EXISTS idx_hotspots_rank ON investment_hotspots(rank);
CREATE INDEX IF NOT EXISTS idx_planning_postcode ON planning_applications(postcode);
CREATE INDEX IF NOT EXISTS idx_planning_status ON planning_applications(status);

-- RLS
ALTER TABLE cma_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE distressed_watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE distressed_properties ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users own CMA reports" ON cma_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own distressed watches" ON distressed_watches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own saved hotspots" ON saved_hotspots FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own planning alerts" ON planning_alerts FOR ALL USING (auth.uid() = user_id);

-- Public read policies
CREATE POLICY "Market data public read" ON market_data FOR SELECT USING (true);
CREATE POLICY "Hotspots public read" ON investment_hotspots FOR SELECT USING (true);
CREATE POLICY "Planning public read" ON planning_applications FOR SELECT USING (true);
CREATE POLICY "Distressed public read" ON distressed_properties FOR SELECT USING (true);
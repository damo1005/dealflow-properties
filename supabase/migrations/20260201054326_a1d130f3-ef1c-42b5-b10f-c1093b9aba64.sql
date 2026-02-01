-- Deal scout configurations (saved searches on steroids)
CREATE TABLE deal_scouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Scout settings
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Search criteria
  location_areas TEXT[],
  location_radius_miles INTEGER,
  location_center_lat DECIMAL(10,8),
  location_center_lng DECIMAL(11,8),
  
  price_min INTEGER,
  price_max INTEGER,
  
  property_types TEXT[],
  bedrooms_min INTEGER,
  bedrooms_max INTEGER,
  
  -- Strategy targeting
  investment_strategy TEXT,
  
  -- Scoring preferences (weights 0-100)
  prioritize_yield BOOLEAN DEFAULT true,
  prioritize_cash_flow BOOLEAN DEFAULT true,
  prioritize_capital_growth BOOLEAN DEFAULT false,
  prioritize_below_market BOOLEAN DEFAULT true,
  
  yield_min DECIMAL(5,2),
  cash_flow_min INTEGER,
  bmv_min DECIMAL(5,2),
  
  -- Filters
  exclude_leasehold BOOLEAN DEFAULT false,
  exclude_shared_ownership BOOLEAN DEFAULT false,
  exclude_auction BOOLEAN DEFAULT false,
  exclude_new_build BOOLEAN DEFAULT false,
  require_parking BOOLEAN DEFAULT false,
  require_garden BOOLEAN DEFAULT false,
  max_chain_length INTEGER,
  
  -- Alert settings
  alert_frequency TEXT DEFAULT 'instant',
  alert_score_threshold INTEGER DEFAULT 70,
  alert_methods JSONB DEFAULT '["email", "push"]'::jsonb,
  
  -- ML preferences (learned over time)
  ml_preferences JSONB,
  
  -- Performance tracking
  properties_found INTEGER DEFAULT 0,
  properties_viewed INTEGER DEFAULT 0,
  properties_saved INTEGER DEFAULT 0,
  avg_score DECIMAL(5,2),
  
  -- State
  last_scan_at TIMESTAMPTZ,
  next_scan_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discovered properties (what the scout found)
CREATE TABLE scout_discoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID REFERENCES deal_scouts(id) ON DELETE CASCADE,
  property_id UUID REFERENCES cached_properties(id) ON DELETE CASCADE,
  
  -- Discovery context
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT,
  listing_url TEXT,
  
  -- Scoring
  overall_score INTEGER NOT NULL,
  score_breakdown JSONB NOT NULL,
  score_reasoning TEXT,
  
  -- Deal intelligence
  days_on_market INTEGER,
  price_changes JSONB,
  is_price_reduced BOOLEAN DEFAULT false,
  total_price_reduction INTEGER,
  reduction_percentage DECIMAL(5,2),
  
  estimated_market_value INTEGER,
  below_market_value INTEGER,
  bmv_percentage DECIMAL(5,2),
  
  estimated_yield DECIMAL(5,2),
  estimated_cash_flow INTEGER,
  estimated_roi DECIMAL(5,2),
  
  -- Opportunity indicators
  opportunity_flags JSONB,
  risk_flags JSONB,
  
  -- User interaction
  was_alerted BOOLEAN DEFAULT false,
  alert_sent_at TIMESTAMPTZ,
  was_viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMPTZ,
  was_saved BOOLEAN DEFAULT false,
  saved_at TIMESTAMPTZ,
  user_feedback TEXT,
  
  -- Status
  status TEXT DEFAULT 'active',
  status_updated_at TIMESTAMPTZ
);

-- Scout alerts sent to users
CREATE TABLE scout_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID REFERENCES deal_scouts(id) ON DELETE CASCADE,
  discovery_id UUID REFERENCES scout_discoveries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Alert details
  alert_type TEXT DEFAULT 'new_match',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_method TEXT,
  
  -- Engagement
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMPTZ,
  action_taken TEXT
);

-- ML training data (learn from user behavior)
CREATE TABLE scout_ml_training (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID REFERENCES cached_properties(id),
  
  -- Property features at time of interaction
  property_features JSONB NOT NULL,
  
  -- User action (label for training)
  action TEXT NOT NULL,
  action_timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Context
  scout_score INTEGER,
  user_implicit_score INTEGER,
  
  -- For model improvement
  was_shown_in_alert BOOLEAN,
  days_since_shown INTEGER
);

-- Off-market deals database
CREATE TABLE off_market_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source
  source_type TEXT,
  source_name TEXT,
  source_contact JSONB,
  
  -- Property details
  address TEXT,
  postcode TEXT,
  property_type TEXT,
  bedrooms INTEGER,
  price INTEGER,
  description TEXT,
  
  -- Availability
  available_from DATE,
  reason_off_market TEXT,
  
  -- Images & docs
  images JSONB,
  documents JSONB,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market intelligence cache
CREATE TABLE market_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  area TEXT NOT NULL,
  
  -- Pricing intel
  avg_price INTEGER,
  median_price INTEGER,
  price_per_sqft INTEGER,
  price_trend_3mo DECIMAL(5,2),
  price_trend_12mo DECIMAL(5,2),
  
  -- Rental intel
  avg_rent INTEGER,
  median_rent INTEGER,
  avg_yield DECIMAL(5,2),
  rental_demand TEXT,
  avg_void_period_days INTEGER,
  
  -- Market activity
  properties_for_sale INTEGER,
  new_listings_30d INTEGER,
  properties_sold_30d INTEGER,
  avg_days_to_sell INTEGER,
  avg_sale_vs_asking DECIMAL(5,2),
  
  -- Investment metrics
  investment_score INTEGER,
  growth_potential TEXT,
  cash_flow_potential TEXT,
  
  -- Last updated
  data_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_deal_scouts_user ON deal_scouts(user_id);
CREATE INDEX idx_deal_scouts_active ON deal_scouts(is_active) WHERE is_active = true;
CREATE INDEX idx_scout_discoveries_scout ON scout_discoveries(scout_id);
CREATE INDEX idx_scout_discoveries_property ON scout_discoveries(property_id);
CREATE INDEX idx_scout_discoveries_score ON scout_discoveries(overall_score DESC);
CREATE INDEX idx_scout_discoveries_discovered ON scout_discoveries(discovered_at DESC);
CREATE INDEX idx_scout_alerts_user ON scout_alerts(user_id);
CREATE INDEX idx_scout_alerts_discovery ON scout_alerts(discovery_id);
CREATE INDEX idx_scout_ml_training_user ON scout_ml_training(user_id);
CREATE INDEX idx_off_market_active ON off_market_properties(is_active) WHERE is_active = true;
CREATE INDEX idx_market_intelligence_area ON market_intelligence(area);

-- Enable RLS
ALTER TABLE deal_scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_ml_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE off_market_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own scouts"
  ON deal_scouts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own discoveries"
  ON scout_discoveries FOR SELECT
  USING (
    scout_id IN (
      SELECT id FROM deal_scouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own discoveries"
  ON scout_discoveries FOR UPDATE
  USING (
    scout_id IN (
      SELECT id FROM deal_scouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own alerts"
  ON scout_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ML training data"
  ON scout_ml_training FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create ML training data"
  ON scout_ml_training FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active off-market properties"
  ON off_market_properties FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view market intelligence"
  ON market_intelligence FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_deal_scouts_updated_at
  BEFORE UPDATE ON deal_scouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
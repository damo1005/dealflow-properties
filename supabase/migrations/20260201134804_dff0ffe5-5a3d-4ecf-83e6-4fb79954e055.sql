-- Deal Analyses table
CREATE TABLE IF NOT EXISTS deal_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Property Info
  property_address TEXT,
  postcode TEXT,
  property_type TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_footage INTEGER,
  
  -- Source
  source_url TEXT,
  source_platform TEXT,
  
  -- Purchase Details
  asking_price DECIMAL(12,2),
  offer_price DECIMAL(12,2),
  purchase_type TEXT CHECK (purchase_type IN ('standard', 'auction', 'bmv', 'off_market')),
  
  -- Refurbishment
  refurb_light DECIMAL(10,2) DEFAULT 0,
  refurb_medium DECIMAL(10,2) DEFAULT 0,
  refurb_heavy DECIMAL(10,2) DEFAULT 0,
  arv DECIMAL(12,2),
  
  -- Financing
  finance_type TEXT CHECK (finance_type IN ('cash', 'btl_mortgage', 'bridging', 'commercial')),
  ltv DECIMAL(5,2),
  interest_rate DECIMAL(5,2),
  mortgage_term INTEGER,
  interest_only BOOLEAN DEFAULT true,
  
  -- Strategy
  strategy TEXT CHECK (strategy IN ('btl', 'flip', 'hmo', 'sa', 'student', 'development')),
  strategy_inputs JSONB,
  
  -- Calculated Results
  deal_score INTEGER,
  score_breakdown JSONB,
  
  -- Key Metrics
  gross_yield DECIMAL(5,2),
  net_yield DECIMAL(5,2),
  cash_on_cash DECIMAL(5,2),
  roi_year_1 DECIMAL(5,2),
  monthly_cash_flow DECIMAL(10,2),
  annual_cash_flow DECIMAL(10,2),
  
  -- Costs
  total_cash_required DECIMAL(12,2),
  costs_breakdown JSONB,
  
  -- Projections
  five_year_projection JSONB,
  
  -- Risk
  risk_assessment JSONB,
  stress_test JSONB,
  
  -- Comparables
  sold_comparables JSONB,
  rental_comparables JSONB,
  
  -- Area Data
  area_data JSONB,
  
  -- Tax
  tax_implications JSONB,
  
  -- Status
  status TEXT DEFAULT 'analysed' CHECK (status IN ('analysed', 'saved', 'in_pipeline', 'archived')),
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_deal_analyses_user ON deal_analyses(user_id);
CREATE INDEX idx_deal_analyses_postcode ON deal_analyses(postcode);
CREATE INDEX idx_deal_analyses_score ON deal_analyses(deal_score);
CREATE INDEX idx_deal_analyses_strategy ON deal_analyses(strategy);
CREATE INDEX idx_deal_analyses_created ON deal_analyses(user_id, created_at DESC);

-- RLS
ALTER TABLE deal_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses" ON deal_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own analyses" ON deal_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own analyses" ON deal_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own analyses" ON deal_analyses FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_deal_analyses_updated_at
  BEFORE UPDATE ON deal_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
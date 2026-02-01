-- User risk profiles table
CREATE TABLE IF NOT EXISTS public.user_risk_profiles (
  user_id UUID PRIMARY KEY NOT NULL,
  max_negative_cashflow INTEGER DEFAULT 0,
  min_yield_percentage DECIMAL(5,2) DEFAULT 5.00,
  max_ltv_percentage DECIMAL(5,2) DEFAULT 75.00,
  preferred_strategies TEXT[] DEFAULT ARRAY['btl']::TEXT[],
  risk_tolerance TEXT DEFAULT 'moderate',
  investment_goals JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market conditions table
CREATE TABLE IF NOT EXISTS public.market_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date TIMESTAMPTZ DEFAULT NOW(),
  boe_base_rate DECIMAL(4,2),
  avg_mortgage_rate DECIMAL(4,2),
  avg_yields_by_area JSONB,
  inflation_rate DECIMAL(4,2),
  data_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_market_conditions_date ON public.market_conditions(snapshot_date DESC);

-- Enable RLS
ALTER TABLE public.user_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_conditions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_risk_profiles
CREATE POLICY "Users can view own risk profile"
  ON public.user_risk_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk profile"
  ON public.user_risk_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own risk profile"
  ON public.user_risk_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for market_conditions (read-only for all authenticated users)
CREATE POLICY "Anyone can view market conditions"
  ON public.market_conditions FOR SELECT
  USING (true);

-- Add trigger for updated_at on user_risk_profiles
CREATE TRIGGER update_user_risk_profiles_updated_at
  BEFORE UPDATE ON public.user_risk_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
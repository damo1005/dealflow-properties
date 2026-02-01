-- Scenario shares (for collaboration)
CREATE TABLE IF NOT EXISTS public.scenario_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  permissions TEXT DEFAULT 'view',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal seek history
CREATE TABLE IF NOT EXISTS public.goal_seek_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id TEXT,
  target_metric TEXT NOT NULL,
  target_value DECIMAL(10,2) NOT NULL,
  adjust_variable TEXT NOT NULL,
  calculated_value DECIMAL(10,2),
  is_achievable BOOLEAN,
  alternative_solutions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scenario_shares_token ON public.scenario_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_scenario_shares_scenario ON public.scenario_shares(scenario_id);
CREATE INDEX IF NOT EXISTS idx_goal_seek_user ON public.goal_seek_results(user_id);

-- Enable RLS
ALTER TABLE public.scenario_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_seek_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scenario_shares
CREATE POLICY "Users can manage own shares"
  ON public.scenario_shares FOR ALL
  USING (auth.uid() = shared_by);

CREATE POLICY "Anyone can view shared scenarios by token"
  ON public.scenario_shares FOR SELECT
  USING (share_token IS NOT NULL);

-- RLS Policies for goal_seek_results
CREATE POLICY "Users can view own goal seeks"
  ON public.goal_seek_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create goal seeks"
  ON public.goal_seek_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);
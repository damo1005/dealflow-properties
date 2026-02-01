-- Investment Targets table
CREATE TABLE IF NOT EXISTS public.investment_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  target_gross_yield DECIMAL(5,2),
  target_net_yield DECIMAL(5,2),
  target_roi_percentage DECIMAL(6,2),
  target_roi_years INTEGER,
  target_monthly_cash_flow DECIMAL(10,2),
  target_annual_cash_flow DECIMAL(10,2),
  target_occupancy_rate DECIMAL(5,2) DEFAULT 95,
  target_avg_void_days INTEGER DEFAULT 14,
  target_maintenance_percentage DECIMAL(5,2) DEFAULT 10,
  target_management_percentage DECIMAL(5,2) DEFAULT 10,
  target_annual_appreciation DECIMAL(5,2) DEFAULT 3,
  target_exit_value DECIMAL(12,2),
  target_exit_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id)
);

-- Performance Snapshots table
CREATE TABLE IF NOT EXISTS public.performance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  actual_gross_yield DECIMAL(5,2),
  actual_net_yield DECIMAL(5,2),
  actual_roi DECIMAL(6,2),
  actual_monthly_cash_flow DECIMAL(10,2),
  actual_occupancy_rate DECIMAL(5,2),
  current_property_value DECIMAL(12,2),
  current_mortgage_balance DECIMAL(12,2),
  current_equity DECIMAL(12,2),
  ytd_rental_income DECIMAL(10,2),
  ytd_expenses DECIMAL(10,2),
  ytd_net_profit DECIMAL(10,2),
  yield_variance DECIMAL(5,2),
  roi_variance DECIMAL(6,2),
  cash_flow_variance DECIMAL(10,2),
  occupancy_variance DECIMAL(5,2),
  performance_rating TEXT CHECK (performance_rating IN ('Excellent', 'Good', 'On Target', 'Below Target', 'Poor')),
  performance_score INTEGER CHECK (performance_score BETWEEN 0 AND 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, snapshot_date)
);

-- Investment Milestones table
CREATE TABLE IF NOT EXISTS public.investment_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  user_id UUID NOT NULL,
  milestone_type TEXT CHECK (milestone_type IN (
    'purchase_completed', 'first_tenant', 'break_even', 'target_roi_achieved',
    'refinance_completed', 'major_renovation', 'sale_completed'
  )) NOT NULL,
  milestone_date DATE NOT NULL,
  milestone_value DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Alerts table
CREATE TABLE IF NOT EXISTS public.performance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  alert_type TEXT CHECK (alert_type IN (
    'yield_below_target', 'cash_flow_negative', 'occupancy_low',
    'expenses_high', 'roi_below_target', 'value_drop'
  )) NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  alert_message TEXT NOT NULL,
  metric_name TEXT,
  target_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),
  variance DECIMAL(10,2),
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_investment_targets_property ON public.investment_targets(property_id);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_property ON public.performance_snapshots(property_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_investment_milestones_property ON public.investment_milestones(property_id);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_user ON public.performance_alerts(user_id, is_resolved);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_property ON public.performance_alerts(property_id, is_resolved);

-- RLS
ALTER TABLE public.investment_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own targets" ON public.investment_targets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own snapshots" ON public.performance_snapshots FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own milestones" ON public.investment_milestones FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own alerts" ON public.performance_alerts FOR ALL USING (auth.uid() = user_id);
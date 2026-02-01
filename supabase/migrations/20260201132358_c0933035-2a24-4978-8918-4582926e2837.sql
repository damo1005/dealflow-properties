-- Portfolio Metrics table for aggregated KPIs
CREATE TABLE IF NOT EXISTS public.portfolio_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT CHECK (period_type IN ('month', 'quarter', 'year', 'all_time')),
  total_portfolio_value DECIMAL(15,2),
  total_equity DECIMAL(15,2),
  total_debt DECIMAL(15,2),
  total_rental_income DECIMAL(12,2),
  total_other_income DECIMAL(12,2),
  gross_income DECIMAL(12,2),
  total_mortgage_payments DECIMAL(12,2),
  total_maintenance DECIMAL(12,2),
  total_management_fees DECIMAL(12,2),
  total_insurance DECIMAL(12,2),
  total_utilities DECIMAL(12,2),
  total_other_expenses DECIMAL(12,2),
  total_expenses DECIMAL(12,2),
  net_profit DECIMAL(12,2),
  net_profit_margin DECIMAL(5,2),
  total_invested DECIMAL(15,2),
  total_return DECIMAL(15,2),
  roi_percentage DECIMAL(6,2),
  annualized_roi DECIMAL(6,2),
  average_gross_yield DECIMAL(5,2),
  average_net_yield DECIMAL(5,2),
  total_units INTEGER,
  occupied_units INTEGER,
  vacant_units INTEGER,
  occupancy_rate DECIMAL(5,2),
  average_void_days DECIMAL(6,2),
  total_arrears DECIMAL(12,2),
  arrears_percentage DECIMAL(5,2),
  monthly_cash_flow DECIMAL(12,2),
  annual_cash_flow DECIMAL(12,2),
  purchase_price_total DECIMAL(15,2),
  current_value_total DECIMAL(15,2),
  capital_growth DECIMAL(15,2),
  capital_growth_percentage DECIMAL(6,2),
  properties_houses INTEGER DEFAULT 0,
  properties_flats INTEGER DEFAULT 0,
  properties_hmo INTEGER DEFAULT 0,
  properties_commercial INTEGER DEFAULT 0,
  properties_by_region JSONB,
  compliant_properties INTEGER,
  non_compliant_properties INTEGER,
  compliance_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Performance table for individual property metrics
CREATE TABLE IF NOT EXISTS public.property_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  rental_income DECIMAL(10,2),
  other_income DECIMAL(10,2),
  mortgage_payment DECIMAL(10,2),
  maintenance DECIMAL(10,2),
  management_fees DECIMAL(10,2),
  insurance DECIMAL(10,2),
  utilities DECIMAL(10,2),
  other_expenses DECIMAL(10,2),
  net_profit DECIMAL(10,2),
  occupancy_days INTEGER,
  void_days INTEGER,
  occupancy_rate DECIMAL(5,2),
  invested_capital DECIMAL(12,2),
  current_equity DECIMAL(12,2),
  roi DECIMAL(6,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, period_start, period_end)
);

-- Dashboard Widgets for customization
CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  widget_type TEXT NOT NULL,
  widget_config JSONB,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_metrics_user ON public.portfolio_metrics(user_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_property_performance_property ON public.property_performance(property_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_user ON public.dashboard_widgets(user_id);

-- RLS
ALTER TABLE public.portfolio_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own metrics" ON public.portfolio_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own performance" ON public.property_performance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own widgets" ON public.dashboard_widgets FOR ALL USING (auth.uid() = user_id);
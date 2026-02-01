-- Phase 8: Advanced Features

-- Feature 8A: Mortgage Tracker
CREATE TABLE IF NOT EXISTS public.mortgages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE SET NULL,
  lender_name TEXT NOT NULL,
  account_number TEXT,
  mortgage_type TEXT DEFAULT 'btl',
  repayment_type TEXT DEFAULT 'interest_only',
  original_amount DECIMAL(12,2) NOT NULL,
  current_balance DECIMAL(12,2) NOT NULL,
  rate_type TEXT DEFAULT 'fixed',
  current_rate DECIMAL(5,2) NOT NULL,
  svr_rate DECIMAL(5,2),
  deal_start_date DATE,
  deal_end_date DATE,
  term_years INTEGER,
  monthly_payment DECIMAL(10,2),
  erc_percent DECIMAL(5,2),
  erc_end_date DATE,
  is_portable BOOLEAN DEFAULT false,
  overpayment_allowance DECIMAL(5,2) DEFAULT 10,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mortgage_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mortgage_id UUID REFERENCES public.mortgages(id) ON DELETE CASCADE NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  principal DECIMAL(10,2) DEFAULT 0,
  interest DECIMAL(10,2),
  is_overpayment BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature 8B: Property Condition Tracker
CREATE TABLE IF NOT EXISTS public.property_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  inspection_type TEXT NOT NULL,
  inspection_date DATE NOT NULL,
  inspector_name TEXT,
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  overall_notes TEXT,
  status TEXT DEFAULT 'scheduled',
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.room_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES public.property_inspections(id) ON DELETE CASCADE NOT NULL,
  room_name TEXT NOT NULL,
  walls_rating INTEGER CHECK (walls_rating BETWEEN 1 AND 5),
  flooring_rating INTEGER CHECK (flooring_rating BETWEEN 1 AND 5),
  ceiling_rating INTEGER CHECK (ceiling_rating BETWEEN 1 AND 5),
  fixtures_rating INTEGER CHECK (fixtures_rating BETWEEN 1 AND 5),
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  notes TEXT,
  photo_urls TEXT[]
);

CREATE TABLE IF NOT EXISTS public.property_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_property_id UUID REFERENCES public.portfolio_properties(id) ON DELETE CASCADE NOT NULL,
  inspection_id UUID REFERENCES public.property_inspections(id) ON DELETE SET NULL,
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  room_name TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'reported',
  resolved_at TIMESTAMPTZ,
  resolution_cost DECIMAL(10,2),
  photo_urls TEXT[],
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature 8C: Rental Yield Heatmap
CREATE TABLE IF NOT EXISTS public.area_yield_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode_district TEXT NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  avg_gross_yield DECIMAL(5,2),
  avg_property_price DECIMAL(12,2),
  avg_rent_pcm DECIMAL(8,2),
  yield_change_1y DECIMAL(5,2),
  price_change_1y DECIMAL(5,2),
  sample_size INTEGER,
  data_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(postcode_district, data_date)
);

-- Feature 8E: API & Webhooks
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read'],
  rate_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  total_deliveries INTEGER DEFAULT 0,
  failed_deliveries INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES public.webhooks(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.mortgages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mortgage_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.area_yield_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mortgages
CREATE POLICY "Users can view own mortgages" ON public.mortgages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own mortgages" ON public.mortgages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mortgages" ON public.mortgages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mortgages" ON public.mortgages FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for mortgage_payments
CREATE POLICY "Users can view own mortgage payments" ON public.mortgage_payments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.mortgages WHERE id = mortgage_id AND user_id = auth.uid()));
CREATE POLICY "Users can create own mortgage payments" ON public.mortgage_payments FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.mortgages WHERE id = mortgage_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own mortgage payments" ON public.mortgage_payments FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.mortgages WHERE id = mortgage_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own mortgage payments" ON public.mortgage_payments FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.mortgages WHERE id = mortgage_id AND user_id = auth.uid()));

-- RLS Policies for property_inspections
CREATE POLICY "Users can view own inspections" ON public.property_inspections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own inspections" ON public.property_inspections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inspections" ON public.property_inspections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inspections" ON public.property_inspections FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for room_conditions
CREATE POLICY "Users can view own room conditions" ON public.room_conditions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.property_inspections WHERE id = inspection_id AND user_id = auth.uid()));
CREATE POLICY "Users can create own room conditions" ON public.room_conditions FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.property_inspections WHERE id = inspection_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own room conditions" ON public.room_conditions FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.property_inspections WHERE id = inspection_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own room conditions" ON public.room_conditions FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.property_inspections WHERE id = inspection_id AND user_id = auth.uid()));

-- RLS Policies for property_issues
CREATE POLICY "Users can view own property issues" ON public.property_issues FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.portfolio_properties WHERE id = portfolio_property_id AND user_id = auth.uid()));
CREATE POLICY "Users can create own property issues" ON public.property_issues FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolio_properties WHERE id = portfolio_property_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own property issues" ON public.property_issues FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.portfolio_properties WHERE id = portfolio_property_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own property issues" ON public.property_issues FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.portfolio_properties WHERE id = portfolio_property_id AND user_id = auth.uid()));

-- RLS Policies for area_yield_data (public read)
CREATE POLICY "Anyone can view yield data" ON public.area_yield_data FOR SELECT TO authenticated USING (true);

-- RLS Policies for api_keys
CREATE POLICY "Users can view own api keys" ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own api keys" ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api keys" ON public.api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api keys" ON public.api_keys FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for webhooks
CREATE POLICY "Users can view own webhooks" ON public.webhooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own webhooks" ON public.webhooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own webhooks" ON public.webhooks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own webhooks" ON public.webhooks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for webhook_deliveries
CREATE POLICY "Users can view own webhook deliveries" ON public.webhook_deliveries FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.webhooks WHERE id = webhook_id AND user_id = auth.uid()));

-- Indexes
CREATE INDEX idx_mortgages_user ON public.mortgages(user_id);
CREATE INDEX idx_mortgages_property ON public.mortgages(portfolio_property_id);
CREATE INDEX idx_mortgages_deal_end ON public.mortgages(deal_end_date);
CREATE INDEX idx_mortgage_payments_mortgage ON public.mortgage_payments(mortgage_id);
CREATE INDEX idx_inspections_property ON public.property_inspections(portfolio_property_id);
CREATE INDEX idx_inspections_user ON public.property_inspections(user_id);
CREATE INDEX idx_room_conditions_inspection ON public.room_conditions(inspection_id);
CREATE INDEX idx_property_issues_property ON public.property_issues(portfolio_property_id);
CREATE INDEX idx_property_issues_status ON public.property_issues(status);
CREATE INDEX idx_area_yield_postcode ON public.area_yield_data(postcode_district);
CREATE INDEX idx_api_keys_user ON public.api_keys(user_id);
CREATE INDEX idx_webhooks_user ON public.webhooks(user_id);
CREATE INDEX idx_webhook_deliveries_webhook ON public.webhook_deliveries(webhook_id);

-- Triggers for updated_at
CREATE TRIGGER update_mortgages_updated_at BEFORE UPDATE ON public.mortgages 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON public.property_inspections 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.property_issues 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Report Templates
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  template_name TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN (
    'monthly_performance',
    'quarterly_review',
    'annual_summary',
    'tax_year_end',
    'investor_report',
    'lender_report',
    'compliance_report',
    'property_analysis',
    'portfolio_valuation',
    'custom'
  )) NOT NULL,
  
  sections JSONB NOT NULL DEFAULT '[]',
  
  include_logo BOOLEAN DEFAULT false,
  logo_url TEXT,
  company_name TEXT,
  primary_color TEXT DEFAULT '#1a56db',
  
  page_size TEXT DEFAULT 'A4',
  orientation TEXT CHECK (orientation IN ('portrait', 'landscape')) DEFAULT 'portrait',
  
  default_date_range TEXT,
  default_properties TEXT[],
  
  is_system_template BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  report_name TEXT NOT NULL,
  template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
  
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'one_time')) NOT NULL,
  schedule_day INTEGER,
  schedule_time TIME DEFAULT '09:00',
  
  recipients JSONB NOT NULL DEFAULT '[]',
  
  delivery_method TEXT CHECK (delivery_method IN ('email', 'download', 'both')) DEFAULT 'email',
  email_subject TEXT,
  email_message TEXT,
  
  include_properties TEXT[],
  date_range_type TEXT CHECK (date_range_type IN ('last_month', 'last_quarter', 'last_year', 'ytd', 'custom')),
  custom_date_start DATE,
  custom_date_end DATE,
  
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Reports
CREATE TABLE IF NOT EXISTS generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  report_name TEXT NOT NULL,
  template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
  scheduled_report_id UUID REFERENCES scheduled_reports(id) ON DELETE SET NULL,
  
  report_type TEXT,
  period_start DATE,
  period_end DATE,
  
  file_url TEXT,
  file_size INTEGER,
  
  properties_count INTEGER,
  total_income DECIMAL(12,2),
  total_expenses DECIMAL(12,2),
  net_profit DECIMAL(12,2),
  
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generation_time_ms INTEGER,
  
  was_sent BOOLEAN DEFAULT false,
  sent_to JSONB,
  sent_at TIMESTAMPTZ,
  
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Sections
CREATE TABLE IF NOT EXISTS report_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  section_key TEXT UNIQUE NOT NULL,
  section_name TEXT NOT NULL,
  section_description TEXT,
  
  section_type TEXT CHECK (section_type IN (
    'summary_cards',
    'financial_table',
    'chart',
    'property_list',
    'compliance_status',
    'transaction_log',
    'occupancy_calendar',
    'cash_flow_forecast',
    'roi_analysis',
    'market_comparison',
    'text_block'
  )) NOT NULL,
  
  config_schema JSONB,
  available_in_templates TEXT[],
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scheduled_reports_user ON scheduled_reports(user_id, is_active);
CREATE INDEX idx_scheduled_reports_next_send ON scheduled_reports(next_send_at) WHERE is_active = true;
CREATE INDEX idx_generated_reports_user ON generated_reports(user_id, generated_at DESC);
CREATE INDEX idx_generated_reports_scheduled ON generated_reports(scheduled_report_id);
CREATE INDEX idx_report_templates_user ON report_templates(user_id);
CREATE INDEX idx_report_templates_system ON report_templates(is_system_template) WHERE is_system_template = true;

-- RLS
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read system templates" ON report_templates FOR SELECT USING (is_system_template = true OR auth.uid() = user_id);
CREATE POLICY "Users manage own templates" ON report_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage scheduled reports" ON scheduled_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage generated reports" ON generated_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone reads sections" ON report_sections FOR SELECT USING (true);

-- Insert system report templates
INSERT INTO report_templates (template_name, template_type, sections, is_system_template) VALUES
(
  'Monthly Performance Report',
  'monthly_performance',
  '[
    {"key": "executive_summary", "enabled": true},
    {"key": "portfolio_overview", "enabled": true},
    {"key": "income_breakdown", "enabled": true},
    {"key": "expense_breakdown", "enabled": true},
    {"key": "cash_flow_analysis", "enabled": true},
    {"key": "property_performance", "enabled": true},
    {"key": "occupancy_status", "enabled": true},
    {"key": "compliance_status", "enabled": true}
  ]'::jsonb,
  true
),
(
  'Tax Year-End Report',
  'tax_year_end',
  '[
    {"key": "tax_summary", "enabled": true},
    {"key": "income_statement", "enabled": true},
    {"key": "deductible_expenses", "enabled": true},
    {"key": "capital_allowances", "enabled": true},
    {"key": "mortgage_interest", "enabled": true},
    {"key": "property_disposals", "enabled": true},
    {"key": "supporting_documents", "enabled": true}
  ]'::jsonb,
  true
),
(
  'Investor Report',
  'investor_report',
  '[
    {"key": "investment_summary", "enabled": true},
    {"key": "portfolio_valuation", "enabled": true},
    {"key": "roi_analysis", "enabled": true},
    {"key": "income_vs_forecast", "enabled": true},
    {"key": "capital_growth", "enabled": true},
    {"key": "market_performance", "enabled": true},
    {"key": "future_outlook", "enabled": true}
  ]'::jsonb,
  true
),
(
  'Lender Report',
  'lender_report',
  '[
    {"key": "portfolio_overview", "enabled": true},
    {"key": "rental_income_proof", "enabled": true},
    {"key": "compliance_certificates", "enabled": true},
    {"key": "property_valuations", "enabled": true}
  ]'::jsonb,
  true
),
(
  'Compliance Report',
  'compliance_report',
  '[
    {"key": "compliance_overview", "enabled": true},
    {"key": "gas_safety_certificates", "enabled": true},
    {"key": "epc_ratings", "enabled": true},
    {"key": "eicr_certificates", "enabled": true},
    {"key": "insurance_policies", "enabled": true}
  ]'::jsonb,
  true
);

-- Insert report sections
INSERT INTO report_sections (section_key, section_name, section_type, section_description, available_in_templates) VALUES
('executive_summary', 'Executive Summary', 'summary_cards', 'High-level KPIs and summary', ARRAY['monthly_performance', 'quarterly_review', 'annual_summary']),
('portfolio_overview', 'Portfolio Overview', 'property_list', 'List of all properties with key metrics', ARRAY['monthly_performance', 'investor_report', 'lender_report']),
('income_breakdown', 'Income Breakdown', 'financial_table', 'Detailed income by source', ARRAY['monthly_performance', 'tax_year_end', 'investor_report']),
('expense_breakdown', 'Expense Breakdown', 'financial_table', 'Detailed expenses by category', ARRAY['monthly_performance', 'tax_year_end']),
('cash_flow_analysis', 'Cash Flow Analysis', 'chart', 'Monthly cash flow trends', ARRAY['monthly_performance', 'quarterly_review', 'investor_report']),
('property_performance', 'Property Performance', 'property_list', 'Individual property metrics', ARRAY['monthly_performance', 'annual_summary', 'investor_report']),
('occupancy_status', 'Occupancy Status', 'occupancy_calendar', 'Occupancy and void periods', ARRAY['monthly_performance', 'investor_report']),
('compliance_status', 'Compliance Status', 'compliance_status', 'Certificates and legal compliance', ARRAY['monthly_performance', 'compliance_report', 'lender_report']),
('roi_analysis', 'ROI Analysis', 'roi_analysis', 'Return on investment metrics', ARRAY['investor_report', 'annual_summary']),
('tax_summary', 'Tax Summary', 'financial_table', 'Tax calculations and obligations', ARRAY['tax_year_end'])
ON CONFLICT (section_key) DO NOTHING;
export type ReportTemplateType =
  | 'monthly_performance'
  | 'quarterly_review'
  | 'annual_summary'
  | 'tax_year_end'
  | 'investor_report'
  | 'lender_report'
  | 'compliance_report'
  | 'property_analysis'
  | 'portfolio_valuation'
  | 'custom';

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';

export type DeliveryMethod = 'email' | 'download' | 'both';

export type DateRangeType = 'last_month' | 'last_quarter' | 'last_year' | 'ytd' | 'custom';

export type SectionType =
  | 'summary_cards'
  | 'financial_table'
  | 'chart'
  | 'property_list'
  | 'compliance_status'
  | 'transaction_log'
  | 'occupancy_calendar'
  | 'cash_flow_forecast'
  | 'roi_analysis'
  | 'market_comparison'
  | 'text_block';

export interface ReportSection {
  key: string;
  enabled: boolean;
}

export interface ReportTemplate {
  id: string;
  user_id?: string;
  template_name: string;
  template_type: ReportTemplateType;
  sections: ReportSection[];
  include_logo: boolean;
  logo_url?: string;
  company_name?: string;
  primary_color: string;
  page_size: string;
  orientation: 'portrait' | 'landscape';
  default_date_range?: string;
  default_properties?: string[];
  is_system_template: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportRecipient {
  email: string;
  name?: string;
  role?: string;
}

export interface ScheduledReport {
  id: string;
  user_id: string;
  report_name: string;
  template_id?: string;
  frequency: ReportFrequency;
  schedule_day?: number;
  schedule_time: string;
  recipients: ReportRecipient[];
  delivery_method: DeliveryMethod;
  email_subject?: string;
  email_message?: string;
  include_properties?: string[];
  date_range_type?: DateRangeType;
  custom_date_start?: string;
  custom_date_end?: string;
  is_active: boolean;
  last_sent_at?: string;
  next_send_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedReport {
  id: string;
  user_id: string;
  report_name: string;
  template_id?: string;
  scheduled_report_id?: string;
  report_type?: string;
  period_start?: string;
  period_end?: string;
  file_url?: string;
  file_size?: number;
  properties_count?: number;
  total_income?: number;
  total_expenses?: number;
  net_profit?: number;
  generated_at: string;
  generation_time_ms?: number;
  was_sent: boolean;
  sent_to?: ReportRecipient[];
  sent_at?: string;
  download_count: number;
  last_downloaded_at?: string;
  created_at: string;
}

export interface ReportSectionConfig {
  id: string;
  section_key: string;
  section_name: string;
  section_description?: string;
  section_type: SectionType;
  config_schema?: Record<string, unknown>;
  available_in_templates: string[];
  is_active: boolean;
  created_at: string;
}

export interface QuickReport {
  id: string;
  title: string;
  description: string;
  icon: string;
  template_type: ReportTemplateType;
  includes: string[];
  badge?: string;
}

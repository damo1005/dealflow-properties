export interface PortfolioMetrics {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  period_type: 'month' | 'quarter' | 'year' | 'all_time';
  total_portfolio_value: number;
  total_equity: number;
  total_debt: number;
  total_rental_income: number;
  total_other_income: number;
  gross_income: number;
  total_mortgage_payments: number;
  total_maintenance: number;
  total_management_fees: number;
  total_insurance: number;
  total_utilities: number;
  total_other_expenses: number;
  total_expenses: number;
  net_profit: number;
  net_profit_margin: number;
  total_invested: number;
  total_return: number;
  roi_percentage: number;
  annualized_roi: number;
  average_gross_yield: number;
  average_net_yield: number;
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  occupancy_rate: number;
  average_void_days: number;
  total_arrears: number;
  arrears_percentage: number;
  monthly_cash_flow: number;
  annual_cash_flow: number;
  purchase_price_total: number;
  current_value_total: number;
  capital_growth: number;
  capital_growth_percentage: number;
  properties_houses: number;
  properties_flats: number;
  properties_hmo: number;
  properties_commercial: number;
  compliant_properties: number;
  non_compliant_properties: number;
  compliance_percentage: number;
}

export interface PropertyPerformance {
  id: string;
  property_id: string;
  property_address: string;
  period_start: string;
  period_end: string;
  rental_income: number;
  other_income: number;
  mortgage_payment: number;
  maintenance: number;
  management_fees: number;
  insurance: number;
  utilities: number;
  other_expenses: number;
  net_profit: number;
  occupancy_days: number;
  void_days: number;
  occupancy_rate: number;
  invested_capital: number;
  current_equity: number;
  roi: number;
}

export interface DashboardWidget {
  id: string;
  widget_type: string;
  widget_config: Record<string, unknown>;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  is_visible: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'income' | 'expense' | 'maintenance' | 'viewing' | 'compliance' | 'document';
  title: string;
  description: string;
  property?: string;
  amount?: number;
  timestamp: Date;
  icon: string;
}

export interface PerformanceRanking {
  property_id: string;
  address: string;
  net_yield: number;
  cash_flow: number;
  roi: number;
  roi_years: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

export const PERIOD_OPTIONS = [
  { value: 'month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all_time', label: 'All Time' },
];

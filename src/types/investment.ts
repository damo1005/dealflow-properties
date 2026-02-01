export interface InvestmentTargets {
  id: string;
  user_id: string;
  property_id: string;
  target_gross_yield: number;
  target_net_yield: number;
  target_roi_percentage: number;
  target_roi_years: number;
  target_monthly_cash_flow: number;
  target_annual_cash_flow: number;
  target_occupancy_rate: number;
  target_avg_void_days: number;
  target_maintenance_percentage: number;
  target_management_percentage: number;
  target_annual_appreciation: number;
  target_exit_value: number;
  target_exit_year: number;
  created_at: string;
  updated_at: string;
}

export interface PerformanceSnapshot {
  id: string;
  user_id: string;
  property_id: string;
  snapshot_date: string;
  actual_gross_yield: number;
  actual_net_yield: number;
  actual_roi: number;
  actual_monthly_cash_flow: number;
  actual_occupancy_rate: number;
  current_property_value: number;
  current_mortgage_balance: number;
  current_equity: number;
  ytd_rental_income: number;
  ytd_expenses: number;
  ytd_net_profit: number;
  yield_variance: number;
  roi_variance: number;
  cash_flow_variance: number;
  occupancy_variance: number;
  performance_rating: 'Excellent' | 'Good' | 'On Target' | 'Below Target' | 'Poor';
  performance_score: number;
  notes?: string;
  created_at: string;
}

export interface InvestmentMilestone {
  id: string;
  property_id: string;
  milestone_type: 
    | 'purchase_completed' 
    | 'first_tenant' 
    | 'break_even' 
    | 'target_roi_achieved'
    | 'refinance_completed' 
    | 'major_renovation' 
    | 'sale_completed';
  milestone_date: string;
  milestone_value?: number;
  notes?: string;
  created_at: string;
}

export interface PerformanceAlert {
  id: string;
  user_id: string;
  property_id: string;
  alert_type: 
    | 'yield_below_target' 
    | 'cash_flow_negative' 
    | 'occupancy_low'
    | 'expenses_high' 
    | 'roi_below_target' 
    | 'value_drop';
  severity: 'low' | 'medium' | 'high' | 'critical';
  alert_message: string;
  metric_name?: string;
  target_value?: number;
  actual_value?: number;
  variance?: number;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

export interface PerformanceMetric {
  name: string;
  target: number;
  actual: number;
  unit: string;
  status: 'above' | 'on_target' | 'below';
  variance: number;
  varianceLabel: string;
}

export interface YearlyPerformance {
  year: number;
  income: number;
  expenses: number;
  profit: number;
  cumulativeROI: number;
  note?: string;
}

export interface PropertyForecast {
  year: number;
  value: number;
  equity: number;
  mortgage: number;
  monthlyRent: number;
  annualIncome: number;
  cumulativeIncome: number;
}

export const MILESTONE_LABELS: Record<InvestmentMilestone['milestone_type'], { label: string; icon: string }> = {
  purchase_completed: { label: 'Purchase Completed', icon: '🏠' },
  first_tenant: { label: 'First Tenant', icon: '👤' },
  break_even: { label: 'Break Even', icon: '⚖️' },
  target_roi_achieved: { label: 'Target ROI Achieved', icon: '🎯' },
  refinance_completed: { label: 'Refinance Completed', icon: '💰' },
  major_renovation: { label: 'Major Renovation', icon: '🔧' },
  sale_completed: { label: 'Sale Completed', icon: '🏷️' },
};

export const ALERT_CONFIG: Record<PerformanceAlert['alert_type'], { label: string; icon: string }> = {
  yield_below_target: { label: 'Yield Below Target', icon: '📉' },
  cash_flow_negative: { label: 'Negative Cash Flow', icon: '🔴' },
  occupancy_low: { label: 'Low Occupancy', icon: '🏚️' },
  expenses_high: { label: 'High Expenses', icon: '💸' },
  roi_below_target: { label: 'ROI Below Target', icon: '📊' },
  value_drop: { label: 'Value Drop', icon: '⬇️' },
};

export const SEVERITY_STYLES: Record<PerformanceAlert['severity'], string> = {
  low: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
};

export const RATING_STYLES: Record<PerformanceSnapshot['performance_rating'], string> = {
  'Excellent': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Good': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'On Target': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  'Below Target': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Poor': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

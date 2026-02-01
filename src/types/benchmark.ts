export interface BenchmarkData {
  id: string;
  region?: string;
  property_type?: string;
  avg_gross_yield?: number;
  avg_net_yield?: number;
  avg_void_rate?: number;
  avg_expense_ratio?: number;
  avg_rent_growth_1y?: number;
  avg_capital_growth_1y?: number;
  avg_roi?: number;
  data_period?: string;
  data_date?: string;
  created_at: string;
}

export interface PortfolioSnapshot {
  id: string;
  user_id: string;
  snapshot_date: string;
  total_properties?: number;
  total_value?: number;
  total_debt?: number;
  total_equity?: number;
  gross_yield?: number;
  net_yield?: number;
  cash_on_cash?: number;
  roi?: number;
  void_rate?: number;
  expense_ratio?: number;
  rent_collection_rate?: number;
  capital_growth?: number;
  rent_growth?: number;
  created_at: string;
}

export interface BenchmarkMetric {
  name: string;
  yourValue: number;
  marketValue: number;
  difference: number;
  percentile: number;
  status: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
}

export interface BenchmarkScorecard {
  overall_score: number;
  rating: string;
  metrics: BenchmarkMetric[];
}

export const REGIONS = [
  { value: 'uk_average', label: 'UK Average' },
  { value: 'north_west', label: 'North West' },
  { value: 'north_east', label: 'North East' },
  { value: 'yorkshire', label: 'Yorkshire' },
  { value: 'midlands', label: 'Midlands' },
  { value: 'london', label: 'London' },
  { value: 'south_east', label: 'South East' },
  { value: 'south_west', label: 'South West' },
  { value: 'wales', label: 'Wales' },
  { value: 'scotland', label: 'Scotland' },
];

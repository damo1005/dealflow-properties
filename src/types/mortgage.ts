export interface Mortgage {
  id: string;
  user_id: string;
  portfolio_property_id?: string;
  lender_name: string;
  account_number?: string;
  mortgage_type: 'btl' | 'residential' | 'commercial';
  repayment_type: 'interest_only' | 'repayment';
  original_amount: number;
  current_balance: number;
  rate_type: 'fixed' | 'variable' | 'tracker';
  current_rate: number;
  svr_rate?: number;
  deal_start_date?: string;
  deal_end_date?: string;
  term_years?: number;
  monthly_payment?: number;
  erc_percent?: number;
  erc_end_date?: string;
  is_portable: boolean;
  overpayment_allowance: number;
  status: 'active' | 'completed' | 'refinanced';
  created_at: string;
  updated_at: string;
  // Joined data
  property_address?: string;
}

export interface MortgagePayment {
  id: string;
  mortgage_id: string;
  payment_date: string;
  amount: number;
  principal: number;
  interest?: number;
  is_overpayment: boolean;
  created_at: string;
}

export interface MortgageAlert {
  mortgage: Mortgage;
  days_remaining: number;
  severity: 'critical' | 'warning' | 'info';
  svr_impact?: number;
}

export interface MortgageSummary {
  total_debt: number;
  monthly_cost: number;
  avg_rate: number;
  portfolio_ltv: number;
  annual_interest: number;
  mortgages_expiring_soon: number;
}

export type DealType = 'equity_split' | 'profit_share' | 'loan';
export type DealStatus = 'active' | 'exited' | 'dissolved';
export type TransactionType = 'capital_call' | 'distribution' | 'expense' | 'income';
export type SplitType = 'by_equity' | 'by_profit' | 'custom';

export interface JVDeal {
  id: string;
  user_id: string;
  portfolio_property_id?: string;
  deal_name?: string;
  deal_type: DealType;
  deal_start_date?: string;
  projected_exit_date?: string;
  total_investment?: number;
  status: DealStatus;
  exit_date?: string;
  exit_price?: number;
  net_proceeds?: number;
  notes?: string;
  created_at: string;
  property?: {
    address: string;
    postcode: string;
    current_value?: number;
  };
  partners?: JVPartner[];
}

export interface JVPartner {
  id: string;
  jv_deal_id: string;
  partner_name: string;
  partner_email?: string;
  team_member_id?: string;
  is_self: boolean;
  initial_investment: number;
  additional_investments: number;
  equity_percentage: number;
  profit_percentage?: number;
  distributions_received: number;
  exit_proceeds?: number;
  created_at: string;
}

export interface JVTransaction {
  id: string;
  jv_deal_id: string;
  transaction_type: TransactionType;
  total_amount: number;
  transaction_date: string;
  description?: string;
  split_type: SplitType;
  custom_splits?: Record<string, number>;
  created_at: string;
}

export interface JVSummary {
  totalDeals: number;
  activeDeals: number;
  totalInvested: number;
  totalEquity: number;
  totalDistributions: number;
}

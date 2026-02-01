export interface MTDObligation {
  id: string;
  user_id: string;
  tax_year: string;
  quarter: number;
  period_start: string;
  period_end: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'accepted' | 'rejected';
  submitted_at: string | null;
  hmrc_reference: string | null;
  created_at: string;
}

export interface MTDSubmission {
  id: string;
  obligation_id: string;
  user_id: string;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  income_breakdown: IncomeBreakdown;
  expense_breakdown: ExpenseBreakdown;
  submission_id: string | null;
  hmrc_response: any | null;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  created_at: string;
}

export interface MTDSettings {
  id: string;
  user_id: string;
  hmrc_connected: boolean;
  nino_encrypted: string | null;
  utr_encrypted: string | null;
  business_name: string | null;
  accounting_type: 'cash' | 'accruals';
  auto_categorise: boolean;
  reminder_days_before: number;
  created_at: string;
}

export interface IncomeBreakdown {
  rental_income?: number;
  other_income?: number;
}

export interface ExpenseBreakdown {
  mortgage_interest?: number;
  insurance?: number;
  repairs?: number;
  agent_fees?: number;
  utilities?: number;
  other?: number;
}

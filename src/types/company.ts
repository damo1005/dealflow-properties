export interface PropertyCompany {
  id: string;
  user_id: string;
  company_name: string;
  company_number: string | null;
  incorporation_date: string | null;
  company_type: 'spv' | 'trading' | 'holding';
  registered_address: string | null;
  directors: Director[] | null;
  shareholders: Shareholder[] | null;
  year_end_month: number | null;
  accounting_reference_date: string | null;
  vat_registered: boolean;
  vat_number: string | null;
  bank_name: string | null;
  account_number_masked: string | null;
  created_at: string;
}

export interface Director {
  name: string;
  appointed_date: string;
}

export interface Shareholder {
  name: string;
  shares: number;
  percentage: number;
}

export interface CompanyFiling {
  id: string;
  company_id: string;
  filing_type: 'confirmation_statement' | 'annual_accounts' | 'corporation_tax' | 'vat_return' | 'director_change';
  period_start: string | null;
  period_end: string | null;
  due_date: string;
  filed_date: string | null;
  status: 'pending' | 'filed' | 'overdue';
  filing_reference: string | null;
  created_at: string;
}

export interface DirectorLoan {
  id: string;
  company_id: string;
  direction: 'to_company' | 'from_company';
  director_name: string | null;
  amount: number | null;
  loan_date: string | null;
  interest_rate: number;
  amount_repaid: number;
  balance: number | null;
  status: 'active' | 'repaid';
  created_at: string;
}

export const FILING_TYPES = [
  { value: 'confirmation_statement', label: 'Confirmation Statement' },
  { value: 'annual_accounts', label: 'Annual Accounts' },
  { value: 'corporation_tax', label: 'Corporation Tax Return' },
  { value: 'vat_return', label: 'VAT Return' },
  { value: 'director_change', label: 'Director Change' },
] as const;

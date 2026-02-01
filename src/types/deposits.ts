export interface DepositProtection {
  id: string;
  tenant_name: string;
  tenant_email: string | null;
  portfolio_property_id: string | null;
  user_id: string;
  amount: number;
  deposit_type: 'security' | 'holding';
  scheme: 'dps' | 'tds' | 'mydeposits';
  scheme_reference: string | null;
  received_date: string;
  protected_date: string | null;
  protection_deadline: string | null;
  certificate_issued_date: string | null;
  certificate_url: string | null;
  prescribed_info_served: boolean;
  prescribed_info_date: string | null;
  status: 'pending' | 'protected' | 'returned' | 'disputed' | 'court';
  return_date: string | null;
  amount_returned: number | null;
  deductions: DepositDeduction[];
  dispute_raised: boolean;
  dispute_date: string | null;
  dispute_outcome: string | null;
  created_at: string;
  // Virtual fields
  property_address?: string;
  days_until_deadline?: number;
}

export interface DepositDeduction {
  reason: string;
  amount: number;
  description?: string;
}

export type DepositScheme = {
  id: 'dps' | 'tds' | 'mydeposits';
  name: string;
  type: 'custodial' | 'insured' | 'both';
  website: string;
};

export const DEPOSIT_SCHEMES: DepositScheme[] = [
  { id: 'dps', name: 'Deposit Protection Service (DPS)', type: 'both', website: 'https://www.depositprotection.com' },
  { id: 'tds', name: 'Tenancy Deposit Scheme (TDS)', type: 'both', website: 'https://www.tenancydepositscheme.com' },
  { id: 'mydeposits', name: 'mydeposits', type: 'both', website: 'https://www.mydeposits.co.uk' },
];

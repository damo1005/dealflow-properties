export type RGIPolicyStatus = 'active' | 'expired' | 'cancelled' | 'claimed';
export type RGIClaimStatus = 'draft' | 'submitted' | 'approved' | 'paying' | 'exhausted' | 'closed';

export interface RentGuaranteePolicy {
  id: string;
  user_id: string;
  portfolio_property_id: string | null;
  tenant_id: string | null;
  provider: string;
  policy_number: string | null;
  monthly_rent_covered: number | null;
  max_claim_months: number;
  max_claim_amount: number | null;
  legal_expenses_cover: number | null;
  annual_premium: number | null;
  premium_rate: number | null;
  start_date: string | null;
  end_date: string | null;
  tenant_referenced: boolean;
  reference_provider: string | null;
  reference_date: string | null;
  status: RGIPolicyStatus;
  policy_document_url: string | null;
  created_at: string;
}

export interface RentGuaranteeClaim {
  id: string;
  policy_id: string;
  user_id: string;
  claim_reference: string | null;
  arrears_start_date: string | null;
  total_arrears: number | null;
  status: RGIClaimStatus;
  payments_received: number;
  months_claimed: number;
  eviction_started: boolean;
  eviction_date: string | null;
  created_at: string;
}

export const RGI_PROVIDERS = [
  { id: 'homelet', name: 'HomeLet', rate: 3.6, maxMonths: 12, legalCover: 50000 },
  { id: 'let_alliance', name: 'Let Alliance', rate: 3.3, maxMonths: 9, legalCover: 25000 },
  { id: 'rent_guarantee', name: 'Rent Guarantee', rate: 3.0, maxMonths: 12, legalCover: 35000 },
  { id: 'alan_boswell', name: 'Alan Boswell', rate: 3.5, maxMonths: 15, legalCover: 75000 },
];

export interface InsuranceClaim {
  id: string;
  user_id: string;
  portfolio_property_id: string | null;
  insurance_policy_id: string | null;
  claim_reference: string | null;
  claim_type: ClaimType;
  incident_date: string;
  incident_description: string | null;
  estimated_loss: number | null;
  claim_amount: number | null;
  excess_amount: number | null;
  settlement_amount: number | null;
  status: ClaimStatus;
  submitted_date: string | null;
  acknowledged_date: string | null;
  decision_date: string | null;
  settlement_date: string | null;
  handler_name: string | null;
  handler_phone: string | null;
  handler_email: string | null;
  notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  // Virtual fields
  property_address?: string;
  documents?: ClaimDocument[];
  timeline?: ClaimTimelineEvent[];
}

export type ClaimType = 
  | 'property_damage'
  | 'theft'
  | 'liability'
  | 'rent_guarantee'
  | 'legal_expenses'
  | 'accidental_damage'
  | 'flood'
  | 'fire'
  | 'subsidence';

export type ClaimStatus = 
  | 'draft'
  | 'submitted'
  | 'acknowledged'
  | 'assessing'
  | 'approved'
  | 'partially_approved'
  | 'rejected'
  | 'settled'
  | 'closed';

export interface ClaimDocument {
  id: string;
  claim_id: string;
  document_type: 'photos' | 'receipts' | 'quotes' | 'police_report' | 'inventory' | null;
  document_url: string;
  document_name: string | null;
  uploaded_at: string;
}

export interface ClaimTimelineEvent {
  id: string;
  claim_id: string;
  event_type: string;
  event_description: string | null;
  event_date: string;
  created_by: 'system' | 'user' | 'insurer';
}

export const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  property_damage: 'Property Damage',
  theft: 'Theft',
  liability: 'Liability',
  rent_guarantee: 'Rent Guarantee',
  legal_expenses: 'Legal Expenses',
  accidental_damage: 'Accidental Damage',
  flood: 'Flood',
  fire: 'Fire',
  subsidence: 'Subsidence',
};

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  assessing: 'Under Assessment',
  approved: 'Approved',
  partially_approved: 'Partially Approved',
  rejected: 'Rejected',
  settled: 'Settled',
  closed: 'Closed',
};

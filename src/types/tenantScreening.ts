export interface TenantApplication {
  id: string;
  user_id: string;
  portfolio_property_id?: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  current_address?: string;
  desired_move_date?: string;
  proposed_rent?: number;
  tenancy_length_months?: number;
  num_occupants?: number;
  has_pets: boolean;
  pet_details?: string;
  employment_status?: 'employed' | 'self_employed' | 'student' | 'retired' | 'other';
  employer_name?: string;
  job_title?: string;
  annual_income?: number;
  status: 'received' | 'screening' | 'approved' | 'rejected' | 'withdrawn';
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  property_address?: string;
  references?: TenantReference[];
  credit_check?: CreditCheck;
}

export interface TenantReference {
  id: string;
  application_id: string;
  reference_type: 'employer' | 'landlord' | 'character' | 'credit';
  referee_name?: string;
  referee_email?: string;
  referee_phone?: string;
  referee_relationship?: string;
  status: 'pending' | 'requested' | 'received' | 'verified';
  requested_at?: string;
  received_at?: string;
  response?: Record<string, unknown>;
  rating?: number;
  comments?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
}

export interface CreditCheck {
  id: string;
  application_id: string;
  provider?: string;
  external_reference?: string;
  credit_score?: number;
  score_band?: 'excellent' | 'good' | 'fair' | 'poor';
  ccjs: number;
  bankruptcies: number;
  rent_to_income_ratio?: number;
  affordability_pass?: boolean;
  recommendation?: 'pass' | 'refer' | 'fail';
  report_url?: string;
  checked_at: string;
}

export interface ApplicationSummary {
  active_applications: number;
  awaiting_references: number;
  ready_for_decision: number;
}

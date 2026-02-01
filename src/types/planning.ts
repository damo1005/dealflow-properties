export interface PlanningApplication {
  id: string;
  property_address: string;
  postcode: string | null;
  application_reference: string;
  local_authority_name: string;
  received_date: string | null;
  validated_date: string | null;
  decision_date: string | null;
  appeal_date: string | null;
  proposal_description: string;
  development_type: string | null;
  application_type: string | null;
  status: 'pending' | 'approved' | 'refused' | 'withdrawn' | 'appealed' | 'invalid' | 'determined';
  decision: string | null;
  decision_reason: string | null;
  conditions: PlanningCondition[] | null;
  applicant_name: string | null;
  applicant_type: string | null;
  agent_name: string | null;
  agent_company: string | null;
  existing_use: string | null;
  proposed_use: string | null;
  number_of_units_existing: number | null;
  number_of_units_proposed: number | null;
  gross_internal_area: number | null;
  site_area: number | null;
  number_of_storeys: number | null;
  documents: PlanningDocument[] | null;
  easting: number | null;
  northing: number | null;
  latitude: number | null;
  longitude: number | null;
  consultation_end_date: string | null;
  neighbour_notification_date: string | null;
  site_notice_date: string | null;
  portal_url: string | null;
  case_officer: string | null;
  ward: string | null;
  last_checked_at: string;
  created_at: string;
  updated_at: string;
}

export interface PlanningCondition {
  number: number;
  title: string;
  description: string;
}

export interface PlanningDocument {
  name: string;
  url: string;
  type: string;
  date: string;
}

export interface PlanningComment {
  id: string;
  application_id: string;
  comment_type: 'objection' | 'support' | 'neutral';
  comment_text: string | null;
  commenter_name: string | null;
  commenter_address: string | null;
  comment_date: string | null;
  created_at: string;
}

export interface PlanningAlert {
  id: string;
  user_id: string;
  postcode_area: string | null;
  radius_miles: number;
  development_types: string[] | null;
  include_approved: boolean;
  include_pending: boolean;
  include_refused: boolean;
  email_frequency: 'immediate' | 'daily' | 'weekly';
  last_notified_at: string | null;
  is_active: boolean;
  created_at: string;
}

export const PLANNING_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  approved: { bg: 'bg-green-100', text: 'text-green-800' },
  refused: { bg: 'bg-red-100', text: 'text-red-800' },
  withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800' },
  appealed: { bg: 'bg-purple-100', text: 'text-purple-800' },
  invalid: { bg: 'bg-orange-100', text: 'text-orange-800' },
  determined: { bg: 'bg-blue-100', text: 'text-blue-800' },
};

export const PLANNING_STATUS_ICONS: Record<string, string> = {
  pending: '🟡',
  approved: '✅',
  refused: '❌',
  withdrawn: '⚪',
  appealed: '🟣',
  invalid: '⚠️',
  determined: '🔵',
};

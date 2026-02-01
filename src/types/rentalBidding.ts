export interface RentalListing {
  id: string;
  portfolio_property_id: string | null;
  user_id: string;
  asking_rent: number;
  min_acceptable_rent: number | null;
  min_tenancy_months: number;
  available_from: string | null;
  accept_pets: boolean;
  accept_smokers: boolean;
  accept_dss: boolean;
  bidding_enabled: boolean;
  bidding_end_date: string | null;
  show_highest_bid: boolean;
  status: 'draft' | 'active' | 'under_offer' | 'let';
  view_count: number;
  enquiry_count: number;
  created_at: string;
}

export interface RentalOffer {
  id: string;
  listing_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  offered_rent: number;
  tenancy_length_months: number | null;
  move_in_date: string | null;
  num_occupants: number | null;
  has_pets: boolean;
  pet_details: string | null;
  employment_status: string | null;
  annual_income: number | null;
  cover_message: string | null;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  landlord_notes: string | null;
  created_at: string;
}

export const EMPLOYMENT_STATUSES = [
  { value: 'employed', label: 'Employed' },
  { value: 'self_employed', label: 'Self-Employed' },
  { value: 'retired', label: 'Retired' },
  { value: 'student', label: 'Student' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'benefits', label: 'On Benefits' },
] as const;

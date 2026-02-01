export interface AccommodationRequest {
  id: string;
  user_id: string;
  request_type: 'seeking' | 'offering';
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  
  // Basic details
  location: string;
  postcode_area: string | null;
  property_type: string[];
  
  // Guest/tenant details
  number_of_guests: number;
  has_children: boolean;
  has_pets: boolean;
  
  // Budget & dates
  budget_max: number;
  budget_min: number | null;
  move_in_date: string | null;
  move_out_date: string | null;
  duration_months: number | null;
  
  // Requirements
  self_contained: boolean;
  no_sharing: boolean;
  parking_required: boolean;
  furnished: boolean | null;
  
  // Description
  title: string;
  description: string | null;
  special_requirements: string | null;
  
  // Contact
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  preferred_contact_method: 'platform' | 'email' | 'phone' | 'whatsapp';
  whatsapp_number: string | null;
  
  // Visibility
  is_public: boolean;
  show_contact_details: boolean;
  
  // Engagement
  view_count: number;
  enquiry_count: number;
  
  // Metadata
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestEnquiry {
  id: string;
  request_id: string;
  enquirer_user_id: string;
  message: string;
  property_id: string | null;
  offered_price: number | null;
  available_from: string | null;
  contact_details_shared: boolean;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
}

export interface SavedRequest {
  id: string;
  user_id: string;
  request_id: string;
  notes: string | null;
  created_at: string;
}

export interface AccommodationFilters {
  requestType: 'all' | 'seeking' | 'offering';
  location: string;
  budgetMin: number;
  budgetMax: number;
  propertyTypes: string[];
  moveInDate: string | null;
  duration: 'any' | 'short' | 'long';
  selfContained: boolean;
  noSharing: boolean;
  parking: boolean;
  petFriendly: boolean;
  familyFriendly: boolean;
}

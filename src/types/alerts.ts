export interface RequestAlert {
  id: string;
  user_id: string;
  name: string;
  
  // Alert type
  alert_for: 'seeking' | 'offering' | 'both';
  
  // Location criteria
  location_areas: string[] | null;
  location_radius_miles: number | null;
  location_center_lat: number | null;
  location_center_lng: number | null;
  
  // Budget criteria
  budget_min: number | null;
  budget_max: number | null;
  
  // Property criteria
  property_types: string[] | null;
  
  // Date criteria
  move_in_date_from: string | null;
  move_in_date_to: string | null;
  duration_min_months: number | null;
  duration_max_months: number | null;
  
  // Requirements filters
  must_be_self_contained: boolean;
  must_allow_pets: boolean;
  must_allow_children: boolean;
  must_have_parking: boolean;
  furnished_preference: 'furnished' | 'unfurnished' | 'either';
  
  // Alert delivery
  delivery_methods: string[];
  email_address: string | null;
  phone_number: string | null;
  whatsapp_number: string | null;
  slack_webhook_url: string | null;
  webhook_url: string | null;
  
  // Frequency
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  digest_time: string | null;
  digest_day: number | null;
  
  // Smart features
  ai_match_threshold: number;
  exclude_keywords: string[] | null;
  include_keywords: string[] | null;
  
  // State
  is_active: boolean;
  last_triggered_at: string | null;
  total_matches_sent: number;
  
  // Rate limiting
  max_alerts_per_day: number;
  alerts_sent_today: number;
  last_reset_date: string;
  
  created_at: string;
  updated_at: string;
}

export interface AlertMatch {
  id: string;
  alert_id: string;
  request_id: string;
  match_score: number;
  sent_at: string;
  delivery_method: string;
  was_clicked: boolean;
  clicked_at: string | null;
  was_enquired: boolean;
  enquired_at: string | null;
}

export interface AlertEngagement {
  id: string;
  alert_id: string;
  metric: 'sent' | 'opened' | 'clicked' | 'enquired';
  timestamp: string;
  metadata: Record<string, unknown> | null;
}

export interface CreateAlertFormData {
  name: string;
  alert_for: 'seeking' | 'offering' | 'both';
  location_areas: string[];
  location_radius_miles: number | null;
  budget_min: number | null;
  budget_max: number | null;
  property_types: string[];
  move_in_date_from: string | null;
  move_in_date_to: string | null;
  duration_min_months: number | null;
  duration_max_months: number | null;
  must_be_self_contained: boolean;
  must_allow_pets: boolean;
  must_allow_children: boolean;
  must_have_parking: boolean;
  furnished_preference: 'furnished' | 'unfurnished' | 'either';
  delivery_methods: string[];
  email_address: string;
  phone_number: string;
  whatsapp_number: string;
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  digest_time: string;
  ai_match_threshold: number;
  include_keywords: string[];
  exclude_keywords: string[];
}

export const defaultAlertFormData: CreateAlertFormData = {
  name: '',
  alert_for: 'seeking',
  location_areas: [],
  location_radius_miles: null,
  budget_min: null,
  budget_max: null,
  property_types: [],
  move_in_date_from: null,
  move_in_date_to: null,
  duration_min_months: null,
  duration_max_months: null,
  must_be_self_contained: false,
  must_allow_pets: false,
  must_allow_children: false,
  must_have_parking: false,
  furnished_preference: 'either',
  delivery_methods: ['email', 'push'],
  email_address: '',
  phone_number: '',
  whatsapp_number: '',
  frequency: 'instant',
  digest_time: '09:00',
  ai_match_threshold: 70,
  include_keywords: [],
  exclude_keywords: [],
};

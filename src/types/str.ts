export type PropertyType = 'apartment' | 'house' | 'room' | 'studio' | 'villa' | 'cottage';

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'completed';

export type ExpenseCategory = 
  | 'mortgage' | 'utilities' | 'internet' | 'cleaning' 
  | 'maintenance' | 'supplies' | 'toiletries' | 'linens'
  | 'platform_fees' | 'insurance' | 'property_tax' 
  | 'hoa_fees' | 'marketing' | 'other';

export type TemplateType = 
  | 'booking_confirmation' | 'pre_arrival' | 'checkin_day'
  | 'during_stay' | 'checkout_reminder' | 'post_stay_review'
  | 'cancellation' | 'modification' | 'damage_report';

export type BlockReason = 'maintenance' | 'personal_use' | 'blocked' | 'other';

export interface STRProperty {
  id: string;
  user_id: string;
  property_name: string;
  address?: string;
  postcode?: string;
  property_type?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  sleeps?: number;
  square_feet?: number;
  title?: string;
  description?: string;
  house_rules?: string;
  checkin_instructions?: string;
  checkout_instructions?: string;
  amenities?: string[];
  unique_features?: string;
  target_guests?: string[];
  listing_score?: number;
  title_score?: number;
  description_score?: number;
  photos_score?: number;
  amenities_score?: number;
  last_optimized_at?: string;
  base_price_per_night?: number;
  weekend_premium_pct?: number;
  cleaning_fee?: number;
  extra_guest_fee?: number;
  security_deposit?: number;
  summer_rate?: number;
  winter_rate?: number;
  peak_season_rate?: number;
  weekly_discount_pct?: number;
  monthly_discount_pct?: number;
  last_minute_discount_pct?: number;
  airbnb_url?: string;
  airbnb_ical_url?: string;
  vrbo_url?: string;
  vrbo_ical_url?: string;
  booking_com_url?: string;
  booking_com_ical_url?: string;
  photo_urls?: string[];
  photo_count?: number;
  photo_checklist_completed?: boolean;
  distance_to_beach_km?: number;
  distance_to_city_center_km?: number;
  nearby_attractions?: string[];
  is_active?: boolean;
  is_listed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface STRBooking {
  id: string;
  str_property_id: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_count?: number;
  checkin_date: string;
  checkout_date: string;
  nights?: number;
  nightly_rate?: number;
  total_nights_cost?: number;
  cleaning_fee?: number;
  extra_fees?: number;
  platform_fee?: number;
  total_payout?: number;
  status?: BookingStatus;
  platform?: string;
  booking_notes?: string;
  special_requests?: string;
  external_booking_id?: string;
  synced_from_ical?: boolean;
  ical_uid?: string;
  last_synced_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface STRExpense {
  id: string;
  str_property_id: string;
  user_id: string;
  expense_date: string;
  category?: ExpenseCategory;
  description?: string;
  amount: number;
  is_recurring?: boolean;
  recurrence_frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  receipt_url?: string;
  vendor?: string;
  is_tax_deductible?: boolean;
  created_at?: string;
}

export interface ListingGeneration {
  id: string;
  str_property_id: string;
  user_id: string;
  titles: { text: string; score: number }[];
  descriptions: { text: string; score: number }[];
  house_rules?: string;
  checkin_instructions?: string;
  input_data?: Record<string, any>;
  selected_title_index?: number;
  selected_description_index?: number;
  applied_to_listing?: boolean;
  created_at?: string;
}

export interface MessageTemplate {
  id: string;
  user_id: string;
  template_type?: TemplateType;
  template_name: string;
  subject?: string;
  body: string;
  variables?: string[];
  send_timing?: string;
  is_default?: boolean;
  language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PhotoChecklist {
  id: string;
  str_property_id: string;
  room_name: string;
  photo_requirements: { item: string; completed: boolean }[];
  total_required?: number;
  completed_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CalendarBlock {
  id: string;
  str_property_id: string;
  start_date: string;
  end_date: string;
  reason?: BlockReason;
  notes?: string;
  created_at?: string;
}

export interface STRStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  occupancyRate: number;
  avgNightlyRate: number;
  totalNights: number;
  bookedNights: number;
}

export const AMENITIES_LIST = [
  // Essentials
  { category: 'Essentials', items: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air Conditioning', 'Heating', 'TV', 'Free Parking'] },
  // Special Features
  { category: 'Special Features', items: ['Pool', 'Hot Tub', 'Gym', 'BBQ/Grill', 'Fireplace', 'Balcony/Patio', 'Garden'] },
  // Work Friendly
  { category: 'Work Friendly', items: ['Dedicated Workspace', 'Office Desk', 'Ergonomic Chair', 'Fast WiFi (100+ Mbps)'] },
  // Family Friendly
  { category: 'Family Friendly', items: ['Crib', 'High Chair', 'Games/Toys', 'Child Safety Features'] },
  // Pet Friendly
  { category: 'Pet Friendly', items: ['Pets Allowed', 'Fenced Yard', 'Pet Bowls'] },
  // Accessibility
  { category: 'Accessibility', items: ['Step-Free Access', 'Wide Doorways', 'Accessible Bathroom'] }
];

export const PHOTO_CHECKLIST_DEFAULTS = [
  { room_name: 'Exterior', items: ['Front of property (daytime)', 'Property at night (if well-lit)', 'Parking area', 'Garden/outdoor space', 'Building entrance'] },
  { room_name: 'Living Room', items: ['Wide angle full room', 'Seating area close-up', 'Entertainment setup (TV)', 'Windows/natural light', 'Decor details', 'Artwork/features', 'Different angle 1', 'Different angle 2'] },
  { room_name: 'Kitchen', items: ['Full kitchen view', 'Countertops', 'Appliances close-up', 'Dining area', 'Coffee station', 'Storage/pantry'] },
  { room_name: 'Master Bedroom', items: ['Bed (styled, made)', 'Wider room view', 'Closet/wardrobe', 'Windows/lighting', 'Bedside details'] },
  { room_name: 'Bathroom', items: ['Full bathroom view', 'Shower/tub', 'Vanity/sink', 'Amenities/toiletries'] },
  { room_name: 'Special Features', items: ['Pool', 'Hot tub', 'Gym/fitness', 'Workspace/desk', 'Balcony/patio', 'Unique features', 'View from property', 'Outdoor dining', 'BBQ area', 'Extras'] }
];

export const TARGET_GUESTS_OPTIONS = [
  'Families with Children',
  'Business Travelers',
  'Couples',
  'Groups of Friends',
  'Digital Nomads',
  'Solo Travelers',
  'Pet Owners'
];

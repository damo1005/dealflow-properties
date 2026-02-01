export type EventType = 'meetup' | 'webinar' | 'conference' | 'workshop' | 'networking';
export type EventStatus = 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled';
export type RegistrationStatus = 'registered' | 'attended' | 'cancelled' | 'no_show';

export interface NetworkingEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: EventType | null;
  is_virtual: boolean;
  venue_name: string | null;
  venue_address: string | null;
  city: string | null;
  postcode: string | null;
  virtual_link: string | null;
  start_datetime: string;
  end_datetime: string | null;
  timezone: string;
  max_attendees: number | null;
  current_attendees: number;
  is_free: boolean;
  ticket_price: number | null;
  member_price: number | null;
  organiser_id: string | null;
  organiser_name: string | null;
  status: EventStatus;
  image_url: string | null;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type: string;
  amount_paid: number | null;
  status: RegistrationStatus;
  checked_in_at: string | null;
  created_at: string;
}

export interface EventConnection {
  id: string;
  event_id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
}

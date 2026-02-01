export type TourType = '360_photo' | 'video_walkthrough' | 'matterport' | 'floorplan_3d';
export type ViewingType = 'in_person' | 'virtual' | 'video_call';
export type ViewingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type InterestLevel = 'very_interested' | 'interested' | 'not_interested';

export interface PropertyTour {
  id: string;
  portfolio_property_id: string;
  user_id: string;
  tour_type: TourType | null;
  tour_url: string | null;
  embed_code: string | null;
  thumbnail_url: string | null;
  provider: string | null;
  external_id: string | null;
  is_public: boolean;
  password_protected: boolean;
  view_count: number;
  created_at: string;
}

export interface ViewingRequest {
  id: string;
  portfolio_property_id: string;
  user_id: string;
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  viewing_type: ViewingType;
  preferred_dates: { date: string; time_slot: string }[];
  confirmed_date: string | null;
  status: ViewingStatus;
  feedback: string | null;
  interest_level: InterestLevel | null;
  notes: string | null;
  created_at: string;
}

export interface ViewingAvailability {
  id: string;
  portfolio_property_id: string;
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export const TOUR_TYPE_LABELS: Record<TourType, string> = {
  '360_photo': '360° Photo Tour',
  'video_walkthrough': 'Video Walkthrough',
  'matterport': 'Matterport 3D',
  'floorplan_3d': 'Interactive Floorplan',
};

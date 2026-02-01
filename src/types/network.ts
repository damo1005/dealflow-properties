export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  cover_photo_url: string | null;
  investor_type: 'beginner' | 'intermediate' | 'experienced' | 'professional';
  years_investing: number;
  specialties: string[];
  properties_count: number;
  portfolio_value: number | null;
  portfolio_yield: number | null;
  location_city: string | null;
  location_country: string;
  linkedin_url: string | null;
  twitter_handle: string | null;
  website: string | null;
  looking_for: string[];
  open_to_jv: boolean;
  open_to_mentor: boolean;
  profile_visibility: 'public' | 'network_only' | 'private';
  created_at: string;
  updated_at: string;
}

export interface UserConnection {
  id: string;
  follower_id: string;
  following_id: string;
  connection_type: 'follow' | 'mutual';
  created_at: string;
  follower?: UserProfile;
  following?: UserProfile;
}

export interface NetworkPost {
  id: string;
  user_id: string;
  post_type: 'deal_share' | 'question' | 'insight' | 'success_story' | 'jv_opportunity';
  title: string | null;
  content: string;
  images: string[];
  deal_type: string | null;
  asking_price: number | null;
  location_area: string | null;
  jv_structure: string | null;
  jv_equity_split: string | null;
  jv_investment_required: number | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  visibility: 'public' | 'connections_only' | 'private';
  created_at: string;
  updated_at: string;
  author?: UserProfile;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'insightful' | 'celebrate';
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  author?: UserProfile;
  replies?: PostComment[];
}

export interface UserMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
  sender?: UserProfile;
  recipient?: UserProfile;
}

export interface NetworkGroup {
  id: string;
  created_by: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  group_type: 'location_based' | 'strategy_based' | 'general' | null;
  location_area: string | null;
  member_count: number;
  visibility: 'public' | 'private';
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  user?: UserProfile;
}

export interface JVPreferences {
  id: string;
  user_id: string;
  capital_available: number | null;
  skills: string[];
  looking_for_skills: string[];
  looking_for_capital: boolean;
  preferred_strategies: string[];
  preferred_locations: string[];
  min_deal_size: number | null;
  max_deal_size: number | null;
  created_at: string;
}

export const INVESTOR_TYPES = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'experienced', label: 'Experienced (3-10 years)' },
  { value: 'professional', label: 'Professional (10+ years)' },
];

export const SPECIALTIES = [
  'BTL',
  'BRR',
  'HMO',
  'Commercial',
  'Development',
  'Flipping',
  'SA (Serviced Accommodation)',
  'Rent-to-Rent',
];

export const LOOKING_FOR = [
  'JV Partners',
  'Mentors',
  'Deals',
  'Networking',
  'Investors',
  'Knowledge',
];

export const POST_TYPES = [
  { value: 'deal_share', label: 'Share a Deal', icon: '📊' },
  { value: 'question', label: 'Ask a Question', icon: '❓' },
  { value: 'insight', label: 'Share an Insight', icon: '💡' },
  { value: 'jv_opportunity', label: 'JV Opportunity', icon: '🤝' },
  { value: 'success_story', label: 'Success Story', icon: '🎉' },
];

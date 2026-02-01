export type AdminRole = 'super_admin' | 'admin' | 'support' | 'content_moderator';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketCategory = 'technical' | 'billing' | 'feature_request' | 'bug';

export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'declined';
export type RevenueType = 'subscription' | 'affiliate' | 'one_time';
export type AnnouncementType = 'info' | 'warning' | 'feature' | 'maintenance';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'removed';

export interface AdminUser {
  id: string;
  user_id: string;
  admin_email: string;
  admin_role: AdminRole;
  can_manage_users: boolean;
  can_manage_content: boolean;
  can_view_financials: boolean;
  can_manage_settings: boolean;
  can_manage_affiliates: boolean;
  last_login_at?: string;
  login_count: number;
  is_active: boolean;
  created_at: string;
}

export interface PlatformSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type?: string;
  category?: string;
  description?: string;
  is_sensitive?: boolean;
  updated_by?: string;
  updated_at: string;
}

export interface UserActivityLog {
  id: string;
  user_id?: string;
  activity_type?: string;
  activity_details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface FeatureUsage {
  id: string;
  feature_name: string;
  usage_count: number;
  unique_users: number;
  date: string;
}

export interface AffiliateCommission {
  id: string;
  user_id?: string;
  affiliate_network?: string;
  advertiser?: string;
  click_date?: string;
  conversion_date?: string;
  commission_amount?: number;
  commission_status?: CommissionStatus;
  tracking_id?: string;
  transaction_id?: string;
  mortgage_amount?: number;
  property_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueLog {
  id: string;
  user_id?: string;
  revenue_type?: RevenueType;
  amount: number;
  currency?: string;
  plan_name?: string;
  billing_period?: string;
  transaction_id?: string;
  payment_method?: string;
  status?: 'pending' | 'completed' | 'refunded' | 'failed';
  transaction_date: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id?: string;
  subject: string;
  description: string;
  category?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to?: string;
  opened_at: string;
  resolved_at?: string;
  closed_at?: string;
  // Joined fields
  user_email?: string;
  user_name?: string;
}

export interface SupportMessage {
  id: string;
  ticket_id?: string;
  sender_id?: string;
  sender_type?: 'user' | 'admin';
  message: string;
  attachments?: string[];
  created_at: string;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  announcement_type?: AnnouncementType;
  target_users?: string;
  is_active: boolean;
  show_banner: boolean;
  show_modal: boolean;
  starts_at?: string;
  ends_at?: string;
  created_by?: string;
  created_at: string;
}

export interface ModerationItem {
  id: string;
  content_type?: string;
  content_id: string;
  reported_by?: string;
  report_reason?: string;
  status: ModerationStatus;
  moderated_by?: string;
  moderation_notes?: string;
  created_at: string;
  moderated_at?: string;
}

export interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  proSubscriptions: number;
  premiumSubscriptions: number;
  mrr: number;
  pendingCommissions: number;
  pendingCommissionCount: number;
  openTickets: number;
  urgentTickets: number;
  avgResponseTime: number;
}

export interface UserWithProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_sign_in_at?: string;
  plan?: string;
  is_active?: boolean;
  total_revenue?: number;
}

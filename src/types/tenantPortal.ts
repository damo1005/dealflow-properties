export type MaintenanceCategory = 'plumbing' | 'electrical' | 'heating' | 'appliance' | 'structural' | 'other';
export type MaintenanceUrgency = 'low' | 'normal' | 'high' | 'emergency';
export type MaintenanceStatus = 'submitted' | 'acknowledged' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface TenantPortalUser {
  id: string;
  tenant_id: string;
  email: string;
  is_active: boolean;
  invite_sent_at: string | null;
  invite_accepted_at: string | null;
  last_login_at: string | null;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  portfolio_property_id: string;
  title: string;
  description: string | null;
  category: MaintenanceCategory | null;
  location: string | null;
  urgency: MaintenanceUrgency;
  photo_urls: string[];
  status: MaintenanceStatus;
  landlord_notes: string | null;
  scheduled_date: string | null;
  contractor_name: string | null;
  contractor_phone: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  tenant_rating: number | null;
  tenant_feedback: string | null;
  created_at: string;
}

export interface TenantMessage {
  id: string;
  tenant_id: string;
  portfolio_property_id: string;
  sender_type: 'tenant' | 'landlord';
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

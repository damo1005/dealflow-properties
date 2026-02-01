export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'accountant' | 'partner';
export type MemberStatus = 'pending' | 'active' | 'suspended';
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface Team {
  id: string;
  name: string;
  slug?: string;
  owner_id: string;
  settings: Record<string, unknown>;
  subscription_tier: string;
  max_members: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  custom_permissions: Record<string, boolean>;
  status: MemberStatus;
  invited_at: string;
  invited_by?: string;
  accepted_at?: string;
  profile?: {
    full_name: string;
    avatar_url?: string;
    email?: string;
  };
}

export interface PropertyAccess {
  id: string;
  team_member_id: string;
  portfolio_property_id: string;
  access_level: string;
  can_view_financials: boolean;
  can_view_tenants: boolean;
  can_edit: boolean;
  ownership_percentage?: number;
  investment_amount?: number;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: TeamRole;
  property_ids: string[];
  invitation_token: string;
  status: InvitationStatus;
  expires_at: string;
  invited_by?: string;
  created_at: string;
}

export interface TeamActivityLog {
  id: string;
  team_id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export const ROLE_PERMISSIONS: Record<TeamRole, { label: string; description: string; color: string }> = {
  owner: { label: 'Owner', description: 'Full access including billing', color: 'bg-purple-500' },
  admin: { label: 'Admin', description: 'Full access except billing', color: 'bg-blue-500' },
  editor: { label: 'Editor', description: 'Can add/edit properties, transactions', color: 'bg-green-500' },
  viewer: { label: 'Viewer', description: 'Read-only access', color: 'bg-gray-500' },
  accountant: { label: 'Accountant', description: 'Read-only + financial exports', color: 'bg-yellow-500' },
  partner: { label: 'Partner (JV)', description: 'Access to specific properties only', color: 'bg-orange-500' },
};

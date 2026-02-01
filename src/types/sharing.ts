export interface PortfolioShare {
  id: string;
  user_id: string;
  name: string;
  share_token: string;
  include_properties: boolean;
  include_financials: boolean;
  include_tenants: boolean;
  include_compliance: boolean;
  property_ids?: string[];
  custom_message?: string;
  hide_addresses: boolean;
  password_hash?: string;
  expires_at?: string;
  max_views?: number;
  view_count: number;
  is_active: boolean;
  created_at: string;
}

export interface ShareView {
  id: string;
  portfolio_share_id: string;
  ip_address?: string;
  user_agent?: string;
  viewed_at: string;
}

export interface CreateShareInput {
  name: string;
  include_properties: boolean;
  include_financials: boolean;
  include_tenants: boolean;
  include_compliance: boolean;
  property_ids?: string[];
  hide_addresses: boolean;
  password?: string;
  expires_in_days?: number;
}

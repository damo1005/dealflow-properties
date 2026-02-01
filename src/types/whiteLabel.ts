export interface WhiteLabelConfig {
  id: string;
  user_id: string;
  company_name: string;
  company_logo_url?: string;
  company_website?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  custom_domain?: string;
  domain_verified: boolean;
  features_enabled: Record<string, boolean>;
  max_clients: number;
  max_properties_per_client: number;
  subscription_tier: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentClient {
  id: string;
  agent_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  user_id?: string;
  access_level: 'view_only' | 'limited' | 'full';
  property_count: number;
  management_fee_percent?: number;
  fee_type: 'percentage' | 'fixed';
  status: 'active' | 'paused' | 'terminated';
  contract_start_date?: string;
  contract_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AgentPropertyAssignment {
  id: string;
  agent_client_id: string;
  portfolio_property_id: string;
  management_type?: 'full' | 'tenant_find' | 'rent_collection';
  fee_percent?: number;
  fee_fixed?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  // Joined data
  property_address?: string;
}

export interface AgentSummary {
  active_clients: number;
  properties_managed: number;
  monthly_fees: number;
}

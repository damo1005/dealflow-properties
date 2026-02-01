export type IntegrationCategory = 'accounting' | 'crm' | 'marketing' | 'analytics' | 'utilities' | 'storage' | 'communication';
export type IntegrationStatus = 'draft' | 'pending' | 'active' | 'deprecated';

export interface APIIntegration {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  developer_name: string | null;
  developer_url: string | null;
  category: IntegrationCategory | null;
  icon_url: string | null;
  screenshots: string[];
  is_free: boolean;
  monthly_price: number | null;
  install_count: number;
  avg_rating: number | null;
  review_count: number;
  status: IntegrationStatus;
  auth_url: string | null;
  webhook_url: string | null;
  docs_url: string | null;
  created_at: string;
}

export interface UserIntegration {
  id: string;
  user_id: string;
  integration_id: string;
  is_connected: boolean;
  settings: Record<string, unknown>;
  last_sync_at: string | null;
  sync_status: string | null;
  created_at: string;
}

export interface IntegrationReview {
  id: string;
  integration_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

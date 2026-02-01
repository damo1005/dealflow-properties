export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_prefix: string;
  permissions: string[];
  rate_limit: number;
  is_active: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface Webhook {
  id: string;
  user_id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  total_deliveries: number;
  failed_deliveries: number;
  last_triggered_at?: string;
  created_at: string;
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status_code?: number;
  status: 'pending' | 'success' | 'failed';
  attempts: number;
  created_at: string;
}

export type WebhookEventType = 
  | 'property.created'
  | 'property.updated'
  | 'property.deleted'
  | 'transaction.created'
  | 'rent.received'
  | 'rent.overdue'
  | 'compliance.expiring'
  | 'compliance.expired'
  | 'deal.analysed'
  | 'deal.high_score';

export const WEBHOOK_EVENTS: { category: string; events: { value: WebhookEventType; label: string }[] }[] = [
  {
    category: 'Properties',
    events: [
      { value: 'property.created', label: 'Property Created' },
      { value: 'property.updated', label: 'Property Updated' },
      { value: 'property.deleted', label: 'Property Deleted' },
    ],
  },
  {
    category: 'Transactions',
    events: [
      { value: 'transaction.created', label: 'Transaction Created' },
    ],
  },
  {
    category: 'Rent',
    events: [
      { value: 'rent.received', label: 'Rent Received' },
      { value: 'rent.overdue', label: 'Rent Overdue' },
    ],
  },
  {
    category: 'Compliance',
    events: [
      { value: 'compliance.expiring', label: 'Compliance Expiring' },
      { value: 'compliance.expired', label: 'Compliance Expired' },
    ],
  },
  {
    category: 'Deals',
    events: [
      { value: 'deal.analysed', label: 'Deal Analysed' },
      { value: 'deal.high_score', label: 'High Score Deal Found' },
    ],
  },
];

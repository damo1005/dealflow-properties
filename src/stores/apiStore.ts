import { create } from 'zustand';
import { ApiKey, Webhook, WebhookDelivery } from '@/types/api';

interface ApiState {
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  deliveries: WebhookDelivery[];
  isLoading: boolean;
  
  // API Keys actions
  setApiKeys: (keys: ApiKey[]) => void;
  addApiKey: (key: ApiKey) => void;
  updateApiKey: (id: string, updates: Partial<ApiKey>) => void;
  deleteApiKey: (id: string) => void;
  
  // Webhooks actions
  setWebhooks: (webhooks: Webhook[]) => void;
  addWebhook: (webhook: Webhook) => void;
  updateWebhook: (id: string, updates: Partial<Webhook>) => void;
  deleteWebhook: (id: string) => void;
  
  // Deliveries
  setDeliveries: (deliveries: WebhookDelivery[]) => void;
  getWebhookDeliveries: (webhookId: string) => WebhookDelivery[];
  
  setIsLoading: (loading: boolean) => void;
}

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Production API Key',
    key_hash: 'hashed_key_1',
    key_prefix: 'pk_live_abc',
    permissions: ['read', 'write'],
    rate_limit: 1000,
    is_active: true,
    last_used_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Development Key',
    key_hash: 'hashed_key_2',
    key_prefix: 'pk_test_xyz',
    permissions: ['read'],
    rate_limit: 100,
    is_active: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockWebhooks: Webhook[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Rent Notifications',
    url: 'https://api.mycrm.com/webhooks/rent',
    events: ['rent.received', 'rent.overdue'],
    secret: 'whsec_abc123',
    is_active: true,
    total_deliveries: 48,
    failed_deliveries: 2,
    last_triggered_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Compliance Alerts',
    url: 'https://hooks.slack.com/services/xxx',
    events: ['compliance.expiring', 'compliance.expired'],
    secret: 'whsec_def456',
    is_active: true,
    total_deliveries: 12,
    failed_deliveries: 0,
    last_triggered_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: '1',
    webhook_id: '1',
    event_type: 'rent.received',
    payload: { property_id: 'prop-1', amount: 850, tenant: 'John Smith' },
    status_code: 200,
    status: 'success',
    attempts: 1,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    webhook_id: '1',
    event_type: 'rent.overdue',
    payload: { property_id: 'prop-2', amount: 950, days_overdue: 3 },
    status_code: 500,
    status: 'failed',
    attempts: 3,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useApiStore = create<ApiState>((set, get) => ({
  apiKeys: mockApiKeys,
  webhooks: mockWebhooks,
  deliveries: mockDeliveries,
  isLoading: false,

  setApiKeys: (keys) => set({ apiKeys: keys }),
  
  addApiKey: (key) => set((state) => ({
    apiKeys: [...state.apiKeys, key],
  })),
  
  updateApiKey: (id, updates) => set((state) => ({
    apiKeys: state.apiKeys.map((k) =>
      k.id === id ? { ...k, ...updates } : k
    ),
  })),
  
  deleteApiKey: (id) => set((state) => ({
    apiKeys: state.apiKeys.filter((k) => k.id !== id),
  })),

  setWebhooks: (webhooks) => set({ webhooks }),
  
  addWebhook: (webhook) => set((state) => ({
    webhooks: [...state.webhooks, webhook],
  })),
  
  updateWebhook: (id, updates) => set((state) => ({
    webhooks: state.webhooks.map((w) =>
      w.id === id ? { ...w, ...updates } : w
    ),
  })),
  
  deleteWebhook: (id) => set((state) => ({
    webhooks: state.webhooks.filter((w) => w.id !== id),
  })),

  setDeliveries: (deliveries) => set({ deliveries }),
  
  getWebhookDeliveries: (webhookId) => {
    return get().deliveries.filter((d) => d.webhook_id === webhookId);
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));

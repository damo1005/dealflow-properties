import { create } from 'zustand';
import type { SignatureRequest, SignatureSigner, SignatureAuditLog } from '@/types/signatures';

// Mock data
const mockSigners: SignatureSigner[] = [
  {
    id: 's1',
    request_id: '1',
    name: 'John Smith',
    email: 'john@email.com',
    role: 'landlord',
    sign_order: 1,
    status: 'signed',
    sent_at: '2026-01-28T10:00:00Z',
    viewed_at: '2026-01-28T10:15:00Z',
    signed_at: '2026-01-28T10:20:00Z',
    signature_data: null,
    ip_address: null,
    user_agent: null,
    decline_reason: null,
    created_at: '2026-01-28T09:00:00Z',
  },
  {
    id: 's2',
    request_id: '1',
    name: 'James Wilson',
    email: 'james@email.com',
    role: 'tenant',
    sign_order: 2,
    status: 'viewed',
    sent_at: '2026-01-28T10:00:00Z',
    viewed_at: '2026-01-29T09:00:00Z',
    signed_at: null,
    signature_data: null,
    ip_address: null,
    user_agent: null,
    decline_reason: null,
    created_at: '2026-01-28T09:00:00Z',
  },
  {
    id: 's3',
    request_id: '1',
    name: 'Mary Wilson',
    email: 'mary@email.com',
    role: 'tenant',
    sign_order: 2,
    status: 'sent',
    sent_at: '2026-01-28T10:00:00Z',
    viewed_at: null,
    signed_at: null,
    signature_data: null,
    ip_address: null,
    user_agent: null,
    decline_reason: null,
    created_at: '2026-01-28T09:00:00Z',
  },
];

const mockRequests: SignatureRequest[] = [
  {
    id: '1',
    user_id: 'user-1',
    document_id: 'doc-1',
    document_name: 'Tenancy Agreement - 14 Oak Street',
    document_url: '/documents/tenancy-agreement.pdf',
    portfolio_property_id: 'prop-1',
    status: 'sent',
    expires_at: '2026-02-04T23:59:59Z',
    created_at: '2026-01-28T09:00:00Z',
    signers: mockSigners,
    property_address: '14 Oak Street, M14 2AB',
  },
  {
    id: '2',
    user_id: 'user-1',
    document_id: 'doc-2',
    document_name: 'Section 13 Notice - 28 Victoria Road',
    document_url: '/documents/section-13.pdf',
    portfolio_property_id: 'prop-2',
    status: 'completed',
    expires_at: null,
    created_at: '2026-01-15T10:00:00Z',
    signers: [
      {
        id: 's4',
        request_id: '2',
        name: 'John Smith',
        email: 'john@email.com',
        role: 'landlord',
        sign_order: 1,
        status: 'signed',
        sent_at: '2026-01-15T10:00:00Z',
        viewed_at: '2026-01-15T10:05:00Z',
        signed_at: '2026-01-15T10:10:00Z',
        signature_data: null,
        ip_address: null,
        user_agent: null,
        decline_reason: null,
        created_at: '2026-01-15T10:00:00Z',
      },
      {
        id: 's5',
        request_id: '2',
        name: 'Sarah Brown',
        email: 'sarah@email.com',
        role: 'tenant',
        sign_order: 2,
        status: 'signed',
        sent_at: '2026-01-15T10:00:00Z',
        viewed_at: '2026-01-15T14:00:00Z',
        signed_at: '2026-01-15T14:05:00Z',
        signature_data: null,
        ip_address: null,
        user_agent: null,
        decline_reason: null,
        created_at: '2026-01-15T10:00:00Z',
      },
    ],
    property_address: '28 Victoria Road, M20 4BW',
  },
];

interface SignaturesState {
  requests: SignatureRequest[];
  isLoading: boolean;
  selectedRequest: SignatureRequest | null;

  // Actions
  setRequests: (requests: SignatureRequest[]) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedRequest: (request: SignatureRequest | null) => void;
  addRequest: (request: SignatureRequest) => void;

  // Helpers
  getPendingRequests: () => SignatureRequest[];
  getCompletedRequests: () => SignatureRequest[];
  getCompletedThisMonth: () => number;
}

export const useSignaturesStore = create<SignaturesState>((set, get) => ({
  requests: mockRequests,
  isLoading: false,
  selectedRequest: null,

  setRequests: (requests) => set({ requests }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedRequest: (selectedRequest) => set({ selectedRequest }),
  addRequest: (request) => set((state) => ({ requests: [...state.requests, request] })),

  getPendingRequests: () => {
    return get().requests.filter(r => 
      r.status === 'draft' || r.status === 'sent' || r.status === 'viewed'
    );
  },

  getCompletedRequests: () => {
    return get().requests.filter(r => r.status === 'completed' || r.status === 'signed');
  },

  getCompletedThisMonth: () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return get().requests.filter(r => {
      if (r.status !== 'completed' && r.status !== 'signed') return false;
      return new Date(r.created_at) >= startOfMonth;
    }).length;
  },
}));

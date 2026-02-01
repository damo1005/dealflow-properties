import { create } from 'zustand';
import type { InsuranceClaim, ClaimDocument, ClaimTimelineEvent } from '@/types/claims';

// Mock data
const mockClaims: InsuranceClaim[] = [
  {
    id: '1',
    user_id: 'user-1',
    portfolio_property_id: 'prop-1',
    insurance_policy_id: 'policy-1',
    claim_reference: 'CLM-2026-001',
    claim_type: 'property_damage',
    incident_date: '2026-01-10',
    incident_description: 'Burst pipe in bathroom caused water damage to ceiling in bedroom below. Tenant reported on 10 Jan, emergency plumber attended same day to fix pipe.',
    estimated_loss: 4500,
    claim_amount: 4500,
    excess_amount: 250,
    settlement_amount: null,
    status: 'assessing',
    submitted_date: '2026-01-15',
    acknowledged_date: '2026-01-20',
    decision_date: null,
    settlement_date: null,
    handler_name: 'Sarah Jones',
    handler_phone: '0800 123 4567',
    handler_email: 'sarah.jones@insurer.com',
    notes: 'Assessor scheduled for 5 Feb 2026',
    rejection_reason: null,
    created_at: '2026-01-15T10:00:00Z',
    property_address: '14 Oak Street, M14 2AB',
    timeline: [
      { id: 't1', claim_id: '1', event_type: 'scheduled', event_description: 'Assessor visit scheduled for 5 Feb', event_date: '2026-02-05T10:00:00Z', created_by: 'system' },
      { id: 't2', claim_id: '1', event_type: 'acknowledged', event_description: 'Insurer acknowledged claim', event_date: '2026-01-20T10:00:00Z', created_by: 'system' },
      { id: 't3', claim_id: '1', event_type: 'submitted', event_description: 'Claim submitted', event_date: '2026-01-15T10:00:00Z', created_by: 'user' },
      { id: 't4', claim_id: '1', event_type: 'documents', event_description: 'Documents uploaded (3 files)', event_date: '2026-01-15T10:00:00Z', created_by: 'user' },
      { id: 't5', claim_id: '1', event_type: 'incident', event_description: 'Incident occurred', event_date: '2026-01-10T00:00:00Z', created_by: 'user' },
    ],
  },
  {
    id: '2',
    user_id: 'user-1',
    portfolio_property_id: 'prop-2',
    insurance_policy_id: 'policy-2',
    claim_reference: 'CLM-2025-012',
    claim_type: 'theft',
    incident_date: '2025-11-05',
    incident_description: 'Break-in at property while vacant between tenancies. Items stolen include boiler parts and copper piping.',
    estimated_loss: 1200,
    claim_amount: 1200,
    excess_amount: 250,
    settlement_amount: 950,
    status: 'settled',
    submitted_date: '2025-11-08',
    acknowledged_date: '2025-11-10',
    decision_date: '2025-11-20',
    settlement_date: '2025-11-25',
    handler_name: 'Mike Johnson',
    handler_phone: '0800 123 4568',
    handler_email: 'mike.johnson@insurer.com',
    notes: null,
    rejection_reason: null,
    created_at: '2025-11-08T10:00:00Z',
    property_address: '28 Victoria Road, M20 4BW',
    timeline: [],
  },
];

interface ClaimsState {
  claims: InsuranceClaim[];
  isLoading: boolean;
  selectedClaim: InsuranceClaim | null;

  // Actions
  setClaims: (claims: InsuranceClaim[]) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedClaim: (claim: InsuranceClaim | null) => void;
  addClaim: (claim: InsuranceClaim) => void;
  updateClaim: (id: string, data: Partial<InsuranceClaim>) => void;

  // Helpers
  getActiveClaims: () => InsuranceClaim[];
  getSettledClaims: () => InsuranceClaim[];
  getTotalClaimed: () => number;
  getTotalSettledYTD: () => number;
}

export const useClaimsStore = create<ClaimsState>((set, get) => ({
  claims: mockClaims,
  isLoading: false,
  selectedClaim: null,

  setClaims: (claims) => set({ claims }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedClaim: (selectedClaim) => set({ selectedClaim }),
  
  addClaim: (claim) => set((state) => ({ 
    claims: [...state.claims, claim] 
  })),
  
  updateClaim: (id, data) => set((state) => ({
    claims: state.claims.map(c => c.id === id ? { ...c, ...data } : c),
  })),

  getActiveClaims: () => {
    const activeStatuses = ['draft', 'submitted', 'acknowledged', 'assessing'];
    return get().claims.filter(c => activeStatuses.includes(c.status));
  },

  getSettledClaims: () => {
    return get().claims.filter(c => c.status === 'settled' || c.status === 'closed');
  },

  getTotalClaimed: () => {
    return get().getActiveClaims().reduce((sum, c) => sum + (c.claim_amount || 0), 0);
  },

  getTotalSettledYTD: () => {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    return get().claims
      .filter(c => c.status === 'settled' && c.settlement_date && new Date(c.settlement_date) >= yearStart)
      .reduce((sum, c) => sum + (c.settlement_amount || 0), 0);
  },
}));

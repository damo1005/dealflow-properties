import { create } from 'zustand';
import { TenantApplication, TenantReference, CreditCheck, ApplicationSummary } from '@/types/tenantScreening';

interface TenantScreeningState {
  applications: TenantApplication[];
  isLoading: boolean;
  
  setApplications: (applications: TenantApplication[]) => void;
  addApplication: (application: TenantApplication) => void;
  updateApplication: (id: string, updates: Partial<TenantApplication>) => void;
  deleteApplication: (id: string) => void;
  
  addReference: (applicationId: string, reference: TenantReference) => void;
  updateReference: (applicationId: string, referenceId: string, updates: Partial<TenantReference>) => void;
  
  setCreditCheck: (applicationId: string, creditCheck: CreditCheck) => void;
  
  getSummary: () => ApplicationSummary;
  setIsLoading: (loading: boolean) => void;
}

const mockApplications: TenantApplication[] = [
  {
    id: '1',
    user_id: 'user-1',
    portfolio_property_id: 'prop-1',
    applicant_name: 'Sarah Johnson',
    applicant_email: 'sarah.johnson@email.com',
    applicant_phone: '07700 900123',
    current_address: '45 Current Street, Manchester, M1 1AB',
    desired_move_date: '2026-03-01',
    proposed_rent: 850,
    tenancy_length_months: 12,
    num_occupants: 2,
    has_pets: false,
    employment_status: 'employed',
    employer_name: 'Tech Company Ltd',
    job_title: 'Software Developer',
    annual_income: 42000,
    status: 'screening',
    property_address: '14 Oak Street, Manchester, M14 5TH',
    references: [
      { id: 'ref-1', application_id: '1', reference_type: 'employer', referee_name: 'John Manager', referee_email: 'john@techcompany.com', status: 'received', rating: 5, comments: 'Excellent employee', created_at: new Date().toISOString() },
      { id: 'ref-2', application_id: '1', reference_type: 'landlord', referee_name: 'Previous Landlord', referee_email: 'landlord@email.com', status: 'received', rating: 4, created_at: new Date().toISOString() },
      { id: 'ref-3', application_id: '1', reference_type: 'character', status: 'pending', created_at: new Date().toISOString() },
    ],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    portfolio_property_id: 'prop-2',
    applicant_name: 'Michael Brown',
    applicant_email: 'michael.brown@email.com',
    applicant_phone: '07700 900456',
    desired_move_date: '2026-02-15',
    proposed_rent: 950,
    tenancy_length_months: 12,
    num_occupants: 1,
    has_pets: true,
    pet_details: '1 cat',
    employment_status: 'employed',
    employer_name: 'Finance Corp',
    job_title: 'Accountant',
    annual_income: 48000,
    status: 'received',
    property_address: '28 Victoria Road, Didsbury, M20 2QT',
    references: [],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useTenantScreeningStore = create<TenantScreeningState>((set, get) => ({
  applications: mockApplications,
  isLoading: false,

  setApplications: (applications) => set({ applications }),
  
  addApplication: (application) => set((state) => ({
    applications: [application, ...state.applications],
  })),
  
  updateApplication: (id, updates) => set((state) => ({
    applications: state.applications.map((app) =>
      app.id === id ? { ...app, ...updates, updated_at: new Date().toISOString() } : app
    ),
  })),
  
  deleteApplication: (id) => set((state) => ({
    applications: state.applications.filter((app) => app.id !== id),
  })),

  addReference: (applicationId, reference) => set((state) => ({
    applications: state.applications.map((app) =>
      app.id === applicationId
        ? { ...app, references: [...(app.references || []), reference] }
        : app
    ),
  })),

  updateReference: (applicationId, referenceId, updates) => set((state) => ({
    applications: state.applications.map((app) =>
      app.id === applicationId
        ? {
            ...app,
            references: app.references?.map((ref) =>
              ref.id === referenceId ? { ...ref, ...updates } : ref
            ),
          }
        : app
    ),
  })),

  setCreditCheck: (applicationId, creditCheck) => set((state) => ({
    applications: state.applications.map((app) =>
      app.id === applicationId ? { ...app, credit_check: creditCheck } : app
    ),
  })),

  getSummary: () => {
    const { applications } = get();
    const active = applications.filter((a) => !['approved', 'rejected', 'withdrawn'].includes(a.status));
    const awaitingRefs = applications.filter((a) => {
      const refs = a.references || [];
      return a.status === 'screening' && refs.some((r) => r.status === 'pending' || r.status === 'requested');
    });
    const ready = applications.filter((a) => {
      const refs = a.references || [];
      return a.status === 'screening' && refs.every((r) => r.status === 'received' || r.status === 'verified');
    });

    return {
      active_applications: active.length,
      awaiting_references: awaitingRefs.length,
      ready_for_decision: ready.length,
    };
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));

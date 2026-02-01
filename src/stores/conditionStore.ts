import { create } from 'zustand';
import { PropertyInspection, PropertyIssue, ConditionSummary } from '@/types/condition';

interface ConditionState {
  inspections: PropertyInspection[];
  issues: PropertyIssue[];
  isLoading: boolean;
  
  // Actions
  setInspections: (inspections: PropertyInspection[]) => void;
  addInspection: (inspection: PropertyInspection) => void;
  updateInspection: (id: string, updates: Partial<PropertyInspection>) => void;
  
  setIssues: (issues: PropertyIssue[]) => void;
  addIssue: (issue: PropertyIssue) => void;
  updateIssue: (id: string, updates: Partial<PropertyIssue>) => void;
  resolveIssue: (id: string, cost?: number) => void;
  
  getPropertySummary: (propertyId: string) => ConditionSummary;
  getPropertyIssues: (propertyId: string) => PropertyIssue[];
  getPropertyInspections: (propertyId: string) => PropertyInspection[];
  
  setIsLoading: (loading: boolean) => void;
}

// Mock data
const mockIssues: PropertyIssue[] = [
  {
    id: '1',
    portfolio_property_id: 'prop-1',
    title: 'Leaking tap in kitchen',
    description: 'Cold water tap dripping constantly',
    room_name: 'Kitchen',
    category: 'plumbing',
    priority: 'medium',
    status: 'reported',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    portfolio_property_id: 'prop-1',
    title: 'Damp patch in bathroom ceiling',
    description: 'Visible damp stain appearing after showers',
    room_name: 'Bathroom',
    category: 'structural',
    priority: 'high',
    status: 'in_progress',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    portfolio_property_id: 'prop-2',
    title: 'Broken light switch',
    description: 'Main bedroom light switch not working',
    room_name: 'Bedroom 1',
    category: 'electrical',
    priority: 'urgent',
    status: 'reported',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockInspections: PropertyInspection[] = [
  {
    id: '1',
    portfolio_property_id: 'prop-1',
    user_id: 'user-1',
    inspection_type: 'routine',
    inspection_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    inspector_name: 'John Smith',
    overall_rating: 4,
    overall_notes: 'Property in good condition overall. Minor maintenance items noted.',
    status: 'completed',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    issues_found: 2,
  },
  {
    id: '2',
    portfolio_property_id: 'prop-1',
    user_id: 'user-1',
    inspection_type: 'move_in',
    inspection_date: '2024-06-15',
    inspector_name: 'Inventory Pro Ltd',
    overall_rating: 5,
    overall_notes: 'Full inventory completed. Property in excellent condition at move-in.',
    status: 'completed',
    report_url: '/reports/inventory-prop1.pdf',
    created_at: '2024-06-15T10:00:00Z',
    updated_at: '2024-06-15T10:00:00Z',
    issues_found: 0,
  },
];

export const useConditionStore = create<ConditionState>((set, get) => ({
  inspections: mockInspections,
  issues: mockIssues,
  isLoading: false,

  setInspections: (inspections) => set({ inspections }),
  
  addInspection: (inspection) => set((state) => ({
    inspections: [...state.inspections, inspection],
  })),
  
  updateInspection: (id, updates) => set((state) => ({
    inspections: state.inspections.map((i) =>
      i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i
    ),
  })),

  setIssues: (issues) => set({ issues }),
  
  addIssue: (issue) => set((state) => ({
    issues: [...state.issues, issue],
  })),
  
  updateIssue: (id, updates) => set((state) => ({
    issues: state.issues.map((i) =>
      i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i
    ),
  })),
  
  resolveIssue: (id, cost) => set((state) => ({
    issues: state.issues.map((i) =>
      i.id === id
        ? {
            ...i,
            status: 'resolved' as const,
            resolved_at: new Date().toISOString(),
            resolution_cost: cost,
            updated_at: new Date().toISOString(),
          }
        : i
    ),
  })),

  getPropertySummary: (propertyId) => {
    const { inspections, issues } = get();
    const propertyInspections = inspections.filter((i) => i.portfolio_property_id === propertyId);
    const propertyIssues = issues.filter((i) => i.portfolio_property_id === propertyId);
    
    const completedInspections = propertyInspections.filter((i) => i.status === 'completed');
    const latestInspection = completedInspections.sort(
      (a, b) => new Date(b.inspection_date).getTime() - new Date(a.inspection_date).getTime()
    )[0];

    const openIssues = propertyIssues.filter((i) => i.status !== 'resolved');
    
    // Calculate next inspection (6 months from last)
    let next_inspection_due: string | undefined;
    if (latestInspection) {
      const lastDate = new Date(latestInspection.inspection_date);
      lastDate.setMonth(lastDate.getMonth() + 6);
      next_inspection_due = lastDate.toISOString().split('T')[0];
    }

    return {
      overall_rating: latestInspection?.overall_rating || 0,
      last_inspection_date: latestInspection?.inspection_date,
      open_issues: openIssues.length,
      next_inspection_due,
    };
  },

  getPropertyIssues: (propertyId) => {
    return get().issues.filter((i) => i.portfolio_property_id === propertyId);
  },

  getPropertyInspections: (propertyId) => {
    return get().inspections.filter((i) => i.portfolio_property_id === propertyId);
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));

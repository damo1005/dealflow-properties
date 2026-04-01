import { create } from 'zustand';

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface PipelineProperty {
  id: string;
  user_id: string;
  property_id?: string;
  external_property_id?: string;
  address: string;
  price?: number;
  stage: string;
  position: number;
  notes?: string;
  labels: string[];
  priority: 'low' | 'medium' | 'high' | null;
  assigned_to?: string;
  image_url?: string;
  bedrooms?: number;
  estimated_yield?: number;
  roi_potential?: number;
  viewing_date?: string;
  viewing_time?: string;
  agent_contact?: string;
  offer_amount?: number;
  offer_date?: string;
  solicitor_details?: string;
  exchange_target_date?: string;
  purchase_date?: string;
  actual_price?: number;
  landlord_name?: string;
  monthly_offer?: number;
  created_at: string;
  updated_at: string;
  activities: PipelineActivity[];
  comments: PipelineComment[];
  documents: PipelineDocument[];
  reminders: PipelineReminder[];
}

export interface PipelineActivity {
  id: string;
  type: 'created' | 'moved' | 'commented' | 'viewed' | 'updated' | 'labeled' | 'document_added';
  description: string;
  timestamp: string;
  user_name?: string;
  from_stage?: string;
  to_stage?: string;
}

export interface PipelineComment {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
}

export interface PipelineDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

export interface PipelineReminder {
  id: string;
  title: string;
  due_date: string;
  completed: boolean;
}

export interface PipelineFilters {
  labels: string[];
  assignedTo: string | null;
  dateRange: { from: Date | null; to: Date | null };
  search: string;
  sortBy: 'activity' | 'price' | 'days';
}

interface PipelineState {
  stages: PipelineStage[];
  properties: PipelineProperty[];
  filters: PipelineFilters;
  selectedPropertyId: string | null;
  showActivitySidebar: boolean;
  availableLabels: { id: string; name: string; color: string }[];
  
  // Actions
  setStages: (stages: PipelineStage[]) => void;
  addStage: (stage: PipelineStage) => void;
  updateStage: (id: string, updates: Partial<PipelineStage>) => void;
  deleteStage: (id: string) => void;
  reorderStages: (stages: PipelineStage[]) => void;
  
  setProperties: (properties: PipelineProperty[]) => void;
  addProperty: (property: PipelineProperty) => void;
  updateProperty: (id: string, updates: Partial<PipelineProperty>) => void;
  deleteProperty: (id: string) => void;
  moveProperty: (propertyId: string, toStage: string, toPosition: number) => void;
  
  setFilters: (filters: Partial<PipelineFilters>) => void;
  clearFilters: () => void;
  
  setSelectedPropertyId: (id: string | null) => void;
  toggleActivitySidebar: () => void;
  
  addComment: (propertyId: string, comment: PipelineComment) => void;
  addActivity: (propertyId: string, activity: PipelineActivity) => void;
  addReminder: (propertyId: string, reminder: PipelineReminder) => void;
  toggleReminder: (propertyId: string, reminderId: string) => void;
}

const defaultStages: PipelineStage[] = [
  { id: 'identified', name: 'Identified', color: 'hsl(var(--chart-1))', order: 0 },
  { id: 'contacted', name: 'Contacted', color: 'hsl(var(--chart-2))', order: 1 },
  { id: 'pitched', name: 'Pitched', color: 'hsl(var(--chart-3))', order: 2 },
  { id: 'negotiating', name: 'Negotiating', color: 'hsl(var(--chart-4))', order: 3 },
  { id: 'signed', name: 'Signed', color: 'hsl(var(--chart-5))', order: 4 },
  { id: 'live', name: 'Live', color: 'hsl(var(--primary))', order: 5 },
];

const defaultLabels = [
  { id: 'hot', name: 'Hot Lead', color: 'hsl(0 84% 60%)' },
  { id: 'responsive', name: 'Responsive', color: 'hsl(142 76% 36%)' },
  { id: 'agent-intro', name: 'Agent Intro', color: 'hsl(45 93% 47%)' },
  { id: 'direct', name: 'Direct to Landlord', color: 'hsl(221 83% 53%)' },
  { id: 'returning', name: 'Returning Landlord', color: 'hsl(280 67% 50%)' },
];

const defaultFilters: PipelineFilters = {
  labels: [],
  assignedTo: null,
  dateRange: { from: null, to: null },
  search: '',
  sortBy: 'activity',
};

export const usePipelineStore = create<PipelineState>((set) => ({
  stages: defaultStages,
  properties: [],
  filters: defaultFilters,
  selectedPropertyId: null,
  showActivitySidebar: false,
  availableLabels: defaultLabels,
  
  setStages: (stages) => set({ stages }),
  addStage: (stage) => set((state) => ({ stages: [...state.stages, stage] })),
  updateStage: (id, updates) => set((state) => ({
    stages: state.stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
  })),
  deleteStage: (id) => set((state) => ({
    stages: state.stages.filter((s) => s.id !== id),
  })),
  reorderStages: (stages) => set({ stages }),
  
  setProperties: (properties) => set({ properties }),
  addProperty: (property) => set((state) => ({ properties: [...state.properties, property] })),
  updateProperty: (id, updates) => set((state) => ({
    properties: state.properties.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p)),
  })),
  deleteProperty: (id) => set((state) => ({
    properties: state.properties.filter((p) => p.id !== id),
  })),
  moveProperty: (propertyId, toStage, toPosition) => set((state) => {
    const property = state.properties.find((p) => p.id === propertyId);
    if (!property) return state;
    
    const fromStage = property.stage;
    const activity: PipelineActivity = {
      id: `act-${Date.now()}`,
      type: 'moved',
      description: `Moved from ${fromStage} to ${toStage}`,
      timestamp: new Date().toISOString(),
      from_stage: fromStage,
      to_stage: toStage,
    };
    
    return {
      properties: state.properties.map((p) =>
        p.id === propertyId
          ? { ...p, stage: toStage, position: toPosition, updated_at: new Date().toISOString(), activities: [activity, ...p.activities] }
          : p
      ),
    };
  }),
  
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: defaultFilters }),
  
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
  toggleActivitySidebar: () => set((state) => ({ showActivitySidebar: !state.showActivitySidebar })),
  
  addComment: (propertyId, comment) => set((state) => ({
    properties: state.properties.map((p) =>
      p.id === propertyId
        ? {
            ...p,
            comments: [...p.comments, comment],
            activities: [
              { id: `act-${Date.now()}`, type: 'commented', description: 'Added a comment', timestamp: new Date().toISOString() },
              ...p.activities,
            ],
          }
        : p
    ),
  })),
  addActivity: (propertyId, activity) => set((state) => ({
    properties: state.properties.map((p) =>
      p.id === propertyId ? { ...p, activities: [activity, ...p.activities] } : p
    ),
  })),
  addReminder: (propertyId, reminder) => set((state) => ({
    properties: state.properties.map((p) =>
      p.id === propertyId ? { ...p, reminders: [...p.reminders, reminder] } : p
    ),
  })),
  toggleReminder: (propertyId, reminderId) => set((state) => ({
    properties: state.properties.map((p) =>
      p.id === propertyId
        ? { ...p, reminders: p.reminders.map((r) => (r.id === reminderId ? { ...r, completed: !r.completed } : r)) }
        : p
    ),
  })),
}));

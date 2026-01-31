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
  { id: 'sourced', name: 'Sourced', color: 'hsl(var(--chart-1))', order: 0 },
  { id: 'researching', name: 'Researching', color: 'hsl(var(--chart-2))', order: 1 },
  { id: 'viewing-booked', name: 'Viewing Booked', color: 'hsl(var(--chart-3))', order: 2 },
  { id: 'offer-made', name: 'Offer Made', color: 'hsl(var(--chart-4))', order: 3 },
  { id: 'under-offer', name: 'Under Offer', color: 'hsl(var(--chart-5))', order: 4 },
  { id: 'solicitors', name: 'Solicitors Instructed', color: 'hsl(var(--primary))', order: 5 },
  { id: 'completed', name: 'Completed', color: 'hsl(var(--success))', order: 6 },
  { id: 'passed', name: 'Passed', color: 'hsl(var(--muted-foreground))', order: 7 },
];

const defaultLabels = [
  { id: 'hot', name: 'Hot Deal', color: 'hsl(0 84% 60%)' },
  { id: 'bmv', name: 'BMV', color: 'hsl(142 76% 36%)' },
  { id: 'auction', name: 'Auction', color: 'hsl(45 93% 47%)' },
  { id: 'chain-free', name: 'Chain Free', color: 'hsl(221 83% 53%)' },
  { id: 'motivated', name: 'Motivated Seller', color: 'hsl(280 67% 50%)' },
];

const defaultFilters: PipelineFilters = {
  labels: [],
  assignedTo: null,
  dateRange: { from: null, to: null },
  search: '',
  sortBy: 'activity',
};

// Mock data for demo
const mockProperties: PipelineProperty[] = [
  {
    id: '1',
    user_id: 'user-1',
    address: '123 Oak Street, Manchester, M1 4WA',
    price: 245000,
    stage: 'sourced',
    position: 0,
    notes: 'Great potential for HMO conversion',
    labels: ['hot', 'bmv'],
    priority: 'high',
    image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    bedrooms: 3,
    estimated_yield: 6.2,
    roi_potential: 12.5,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    activities: [
      { id: 'a1', type: 'created', description: 'Added to pipeline', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    comments: [],
    documents: [],
    reminders: [],
  },
  {
    id: '2',
    user_id: 'user-1',
    address: '45 Victoria Road, Birmingham, B15 2TH',
    price: 189000,
    stage: 'researching',
    position: 0,
    labels: ['chain-free'],
    priority: 'medium',
    image_url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400',
    bedrooms: 2,
    estimated_yield: 7.1,
    roi_potential: 15.2,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    activities: [
      { id: 'a2', type: 'created', description: 'Added to pipeline', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a3', type: 'moved', description: 'Moved to Researching', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), from_stage: 'Sourced', to_stage: 'Researching' },
    ],
    comments: [
      { id: 'c1', content: 'Spoke with agent - motivated seller', user_name: 'You', created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    ],
    documents: [],
    reminders: [],
  },
  {
    id: '3',
    user_id: 'user-1',
    address: '78 Park Lane, Leeds, LS1 5QT',
    price: 425000,
    stage: 'viewing-booked',
    position: 0,
    labels: ['auction'],
    priority: 'high',
    image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
    bedrooms: 4,
    estimated_yield: 5.4,
    viewing_date: '2026-02-05',
    viewing_time: '14:00',
    agent_contact: 'John Smith - 07700 900123',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    activities: [],
    comments: [],
    documents: [],
    reminders: [
      { id: 'r1', title: 'Prepare viewing questions', due_date: '2026-02-04', completed: false },
    ],
  },
  {
    id: '4',
    user_id: 'user-1',
    address: '12 Queen Street, Liverpool, L1 4DQ',
    price: 135000,
    stage: 'offer-made',
    position: 0,
    labels: ['motivated'],
    priority: 'high',
    offer_amount: 125000,
    offer_date: '2026-01-28',
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    bedrooms: 2,
    estimated_yield: 8.5,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    activities: [],
    comments: [],
    documents: [],
    reminders: [],
  },
];

export const usePipelineStore = create<PipelineState>((set) => ({
  stages: defaultStages,
  properties: mockProperties,
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

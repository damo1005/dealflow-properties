import { create } from 'zustand';
import type { STRProperty, STRBooking, STRExpense, MessageTemplate, STRStats } from '@/types/str';

interface STRState {
  // Properties
  properties: STRProperty[];
  selectedProperty: STRProperty | null;
  isLoadingProperties: boolean;
  
  // Bookings
  bookings: STRBooking[];
  isLoadingBookings: boolean;
  
  // Expenses
  expenses: STRExpense[];
  isLoadingExpenses: boolean;
  
  // Templates
  templates: MessageTemplate[];
  isLoadingTemplates: boolean;
  
  // Stats
  stats: STRStats | null;
  
  // UI State
  activeTab: 'overview' | 'calendar' | 'financials' | 'optimize' | 'templates';
  wizardStep: number;
  wizardData: Partial<STRProperty>;
  
  // Actions
  setProperties: (properties: STRProperty[]) => void;
  setSelectedProperty: (property: STRProperty | null) => void;
  setIsLoadingProperties: (loading: boolean) => void;
  
  setBookings: (bookings: STRBooking[]) => void;
  setIsLoadingBookings: (loading: boolean) => void;
  
  setExpenses: (expenses: STRExpense[]) => void;
  setIsLoadingExpenses: (loading: boolean) => void;
  
  setTemplates: (templates: MessageTemplate[]) => void;
  setIsLoadingTemplates: (loading: boolean) => void;
  
  setStats: (stats: STRStats) => void;
  
  setActiveTab: (tab: 'overview' | 'calendar' | 'financials' | 'optimize' | 'templates') => void;
  setWizardStep: (step: number) => void;
  updateWizardData: (data: Partial<STRProperty>) => void;
  resetWizard: () => void;
  
  addProperty: (property: STRProperty) => void;
  updateProperty: (id: string, data: Partial<STRProperty>) => void;
  removeProperty: (id: string) => void;
  
  addBooking: (booking: STRBooking) => void;
  updateBooking: (id: string, data: Partial<STRBooking>) => void;
  removeBooking: (id: string) => void;
  
  addExpense: (expense: STRExpense) => void;
  updateExpense: (id: string, data: Partial<STRExpense>) => void;
  removeExpense: (id: string) => void;
}

export const useSTRStore = create<STRState>((set) => ({
  // Initial state
  properties: [],
  selectedProperty: null,
  isLoadingProperties: false,
  
  bookings: [],
  isLoadingBookings: false,
  
  expenses: [],
  isLoadingExpenses: false,
  
  templates: [],
  isLoadingTemplates: false,
  
  stats: null,
  
  activeTab: 'overview',
  wizardStep: 1,
  wizardData: {},
  
  // Actions
  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setIsLoadingProperties: (loading) => set({ isLoadingProperties: loading }),
  
  setBookings: (bookings) => set({ bookings }),
  setIsLoadingBookings: (loading) => set({ isLoadingBookings: loading }),
  
  setExpenses: (expenses) => set({ expenses }),
  setIsLoadingExpenses: (loading) => set({ isLoadingExpenses: loading }),
  
  setTemplates: (templates) => set({ templates }),
  setIsLoadingTemplates: (loading) => set({ isLoadingTemplates: loading }),
  
  setStats: (stats) => set({ stats }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setWizardStep: (step) => set({ wizardStep: step }),
  updateWizardData: (data) => set((state) => ({ 
    wizardData: { ...state.wizardData, ...data } 
  })),
  resetWizard: () => set({ wizardStep: 1, wizardData: {} }),
  
  addProperty: (property) => set((state) => ({ 
    properties: [...state.properties, property] 
  })),
  updateProperty: (id, data) => set((state) => ({
    properties: state.properties.map((p) => 
      p.id === id ? { ...p, ...data } : p
    ),
    selectedProperty: state.selectedProperty?.id === id 
      ? { ...state.selectedProperty, ...data } 
      : state.selectedProperty
  })),
  removeProperty: (id) => set((state) => ({
    properties: state.properties.filter((p) => p.id !== id),
    selectedProperty: state.selectedProperty?.id === id ? null : state.selectedProperty
  })),
  
  addBooking: (booking) => set((state) => ({ 
    bookings: [...state.bookings, booking] 
  })),
  updateBooking: (id, data) => set((state) => ({
    bookings: state.bookings.map((b) => 
      b.id === id ? { ...b, ...data } : b
    )
  })),
  removeBooking: (id) => set((state) => ({
    bookings: state.bookings.filter((b) => b.id !== id)
  })),
  
  addExpense: (expense) => set((state) => ({ 
    expenses: [...state.expenses, expense] 
  })),
  updateExpense: (id, data) => set((state) => ({
    expenses: state.expenses.map((e) => 
      e.id === id ? { ...e, ...data } : e
    )
  })),
  removeExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== id)
  }))
}));

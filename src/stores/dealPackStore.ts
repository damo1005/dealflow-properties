import { create } from 'zustand';

export type TemplateType = 'investor' | 'jv-partner' | 'lender' | 'internal' | 'custom';

export interface DealPackSection {
  id: string;
  type: 'cover' | 'executive-summary' | 'property-details' | 'financial-analysis' | 'market-analysis' | 'supporting-docs' | 'custom';
  title: string;
  enabled: boolean;
  order: number;
  content?: Record<string, unknown>;
}

export interface BrandingSettings {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  customFooter: string;
}

export interface DealPackData {
  id: string;
  name: string;
  template: TemplateType;
  propertyId?: string;
  sections: DealPackSection[];
  branding: BrandingSettings;
  createdAt: string;
  updatedAt: string;
  
  // Property data
  property?: {
    address: string;
    price: number;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
    description: string;
    features: string[];
    estimatedYield?: number;
    roiPotential?: number;
  };
  
  // Financial data
  financials?: {
    purchasePrice: number;
    deposit: number;
    mortgageAmount: number;
    interestRate: number;
    monthlyRent: number;
    monthlyMortgage: number;
    monthlyCashflow: number;
    annualYield: number;
    roi: number;
    assumptions: Record<string, string | number>;
  };
  
  // Custom content
  headline?: string;
  investmentHighlights?: string[];
  recommendation?: string;
}

interface DealPackState {
  currentPack: DealPackData | null;
  savedPacks: DealPackData[];
  isEditing: boolean;
  activeSection: string | null;
  previewMode: boolean;
  
  // Actions
  createNewPack: (template: TemplateType, propertyId?: string) => void;
  updatePack: (updates: Partial<DealPackData>) => void;
  updateSection: (sectionId: string, updates: Partial<DealPackSection>) => void;
  reorderSections: (sections: DealPackSection[]) => void;
  toggleSection: (sectionId: string) => void;
  addCustomSection: (title: string) => void;
  removeSection: (sectionId: string) => void;
  updateBranding: (branding: Partial<BrandingSettings>) => void;
  setActiveSection: (sectionId: string | null) => void;
  setPreviewMode: (preview: boolean) => void;
  savePack: () => void;
  loadPack: (packId: string) => void;
  deletePack: (packId: string) => void;
  resetPack: () => void;
}

const defaultBranding: BrandingSettings = {
  primaryColor: '#3b82f6',
  secondaryColor: '#1f2937',
  companyName: 'DealFlow',
  contactEmail: 'info@dealflow.com',
  contactPhone: '+44 123 456 7890',
  website: 'www.dealflow.com',
  customFooter: 'Confidential - For intended recipient only',
};

const getDefaultSections = (template: TemplateType): DealPackSection[] => {
  const baseSections: DealPackSection[] = [
    { id: 'cover', type: 'cover', title: 'Cover Page', enabled: true, order: 0 },
    { id: 'executive', type: 'executive-summary', title: 'Executive Summary', enabled: true, order: 1 },
    { id: 'property', type: 'property-details', title: 'Property Details', enabled: true, order: 2 },
    { id: 'financial', type: 'financial-analysis', title: 'Financial Analysis', enabled: true, order: 3 },
    { id: 'market', type: 'market-analysis', title: 'Market Analysis', enabled: true, order: 4 },
    { id: 'docs', type: 'supporting-docs', title: 'Supporting Documents', enabled: false, order: 5 },
  ];

  // Customize based on template
  switch (template) {
    case 'lender':
      return baseSections.map(s => 
        s.id === 'docs' ? { ...s, enabled: true } : s
      );
    case 'internal':
      return baseSections.map(s => 
        s.id === 'cover' ? { ...s, enabled: false } : s
      );
    default:
      return baseSections;
  }
};

// Mock property data for demo
const mockProperty = {
  address: '123 Victoria Road, Manchester, M1 4JD',
  price: 245000,
  images: [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  ],
  bedrooms: 3,
  bathrooms: 2,
  propertyType: 'Semi-detached',
  description: 'A stunning three-bedroom semi-detached property located in a sought-after area of Manchester. This property offers excellent investment potential with strong rental demand and capital growth prospects.',
  features: ['Gas Central Heating', 'Double Glazing', 'Garden', 'Driveway', 'Close to Transport Links', 'Recently Refurbished'],
  estimatedYield: 7.8,
  roiPotential: 15.2,
};

const mockFinancials = {
  purchasePrice: 245000,
  deposit: 61250,
  mortgageAmount: 183750,
  interestRate: 5.5,
  monthlyRent: 1450,
  monthlyMortgage: 842,
  monthlyCashflow: 608,
  annualYield: 7.1,
  roi: 11.9,
  assumptions: {
    'LTV': '75%',
    'Interest Rate': '5.5%',
    'Void Rate': '5%',
    'Maintenance': '10%',
    'Management': '10%',
  },
};

export const useDealPackStore = create<DealPackState>((set, get) => ({
  currentPack: null,
  savedPacks: [],
  isEditing: false,
  activeSection: null,
  previewMode: false,

  createNewPack: (template, propertyId) => {
    const newPack: DealPackData = {
      id: `pack-${Date.now()}`,
      name: 'Untitled Deal Pack',
      template,
      propertyId,
      sections: getDefaultSections(template),
      branding: { ...defaultBranding },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      property: mockProperty,
      financials: mockFinancials,
      headline: '7.8% NET Yield Investment Opportunity',
      investmentHighlights: [
        'Strong rental demand in Manchester city centre',
        'Recently refurbished to high standard',
        '7.8% estimated yield with potential for growth',
        'Excellent transport links - 5 mins to Piccadilly station',
        'Below market value purchase opportunity',
      ],
      recommendation: 'This property represents an excellent investment opportunity for investors seeking strong cash flow and capital appreciation. The combination of below market value pricing, high rental demand, and recent refurbishment make it ideal for a buy-to-let portfolio.',
    };
    set({ currentPack: newPack, isEditing: true, activeSection: 'cover' });
  },

  updatePack: (updates) => {
    const { currentPack } = get();
    if (!currentPack) return;
    set({
      currentPack: {
        ...currentPack,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateSection: (sectionId, updates) => {
    const { currentPack } = get();
    if (!currentPack) return;
    set({
      currentPack: {
        ...currentPack,
        sections: currentPack.sections.map(s =>
          s.id === sectionId ? { ...s, ...updates } : s
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  reorderSections: (sections) => {
    const { currentPack } = get();
    if (!currentPack) return;
    set({
      currentPack: {
        ...currentPack,
        sections: sections.map((s, i) => ({ ...s, order: i })),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  toggleSection: (sectionId) => {
    const { currentPack } = get();
    if (!currentPack) return;
    set({
      currentPack: {
        ...currentPack,
        sections: currentPack.sections.map(s =>
          s.id === sectionId ? { ...s, enabled: !s.enabled } : s
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  addCustomSection: (title) => {
    const { currentPack } = get();
    if (!currentPack) return;
    const newSection: DealPackSection = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      title,
      enabled: true,
      order: currentPack.sections.length,
    };
    set({
      currentPack: {
        ...currentPack,
        sections: [...currentPack.sections, newSection],
        updatedAt: new Date().toISOString(),
      },
    });
  },

  removeSection: (sectionId) => {
    const { currentPack } = get();
    if (!currentPack) return;
    set({
      currentPack: {
        ...currentPack,
        sections: currentPack.sections
          .filter(s => s.id !== sectionId)
          .map((s, i) => ({ ...s, order: i })),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateBranding: (branding) => {
    const { currentPack } = get();
    if (!currentPack) return;
    set({
      currentPack: {
        ...currentPack,
        branding: { ...currentPack.branding, ...branding },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  setActiveSection: (sectionId) => set({ activeSection: sectionId }),
  setPreviewMode: (preview) => set({ previewMode: preview }),

  savePack: () => {
    const { currentPack, savedPacks } = get();
    if (!currentPack) return;
    const existingIndex = savedPacks.findIndex(p => p.id === currentPack.id);
    if (existingIndex >= 0) {
      set({
        savedPacks: savedPacks.map((p, i) =>
          i === existingIndex ? currentPack : p
        ),
      });
    } else {
      set({ savedPacks: [...savedPacks, currentPack] });
    }
  },

  loadPack: (packId) => {
    const { savedPacks } = get();
    const pack = savedPacks.find(p => p.id === packId);
    if (pack) {
      set({ currentPack: pack, isEditing: true });
    }
  },

  deletePack: (packId) => {
    const { savedPacks, currentPack } = get();
    set({
      savedPacks: savedPacks.filter(p => p.id !== packId),
      currentPack: currentPack?.id === packId ? null : currentPack,
    });
  },

  resetPack: () => {
    set({ currentPack: null, isEditing: false, activeSection: null, previewMode: false });
  },
}));

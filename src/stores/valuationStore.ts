import { create } from 'zustand';
import { PropertyValuation, ValuationHistory, ValuationInput } from '@/types/valuation';

interface ValuationState {
  valuations: PropertyValuation[];
  history: ValuationHistory[];
  currentValuation: PropertyValuation | null;
  isLoading: boolean;
  
  setValuations: (valuations: PropertyValuation[]) => void;
  addValuation: (valuation: PropertyValuation) => void;
  setCurrentValuation: (valuation: PropertyValuation | null) => void;
  setHistory: (history: ValuationHistory[]) => void;
  setIsLoading: (loading: boolean) => void;
  
  // AI valuation simulation
  generateValuation: (input: ValuationInput) => PropertyValuation;
}

// Mock comparables data
const generateMockComparables = (postcode: string, bedrooms: number) => [
  {
    address: `12 ${postcode.split(' ')[0]} Street`,
    price: 168000 + Math.random() * 20000,
    date: '2025-11-15',
    bedrooms,
    property_type: 'Terraced',
    distance: '0.1 mi',
  },
  {
    address: `8 Near Road, ${postcode.split(' ')[0]}`,
    price: 175000 + Math.random() * 15000,
    date: '2025-10-22',
    bedrooms,
    property_type: 'Terraced',
    distance: '0.2 mi',
  },
  {
    address: `24 Area Lane, ${postcode.split(' ')[0]}`,
    price: 171000 + Math.random() * 18000,
    date: '2025-12-01',
    bedrooms,
    property_type: 'Terraced',
    distance: '0.3 mi',
  },
];

export const useValuationStore = create<ValuationState>((set, get) => ({
  valuations: [],
  history: [],
  currentValuation: null,
  isLoading: false,

  setValuations: (valuations) => set({ valuations }),
  addValuation: (valuation) => set((state) => ({ 
    valuations: [valuation, ...state.valuations] 
  })),
  setCurrentValuation: (valuation) => set({ currentValuation: valuation }),
  setHistory: (history) => set({ history }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  generateValuation: (input) => {
    // Simulated AI valuation logic
    const baseValue = 150000;
    const bedroomMultiplier = input.bedrooms * 25000;
    const bathroomMultiplier = input.bathrooms * 8000;
    const sqftMultiplier = input.square_footage ? input.square_footage * 150 : 0;
    
    const conditionMultipliers = {
      excellent: 1.15,
      good: 1.05,
      fair: 0.95,
      poor: 0.85,
    };
    
    const featureValue = input.features.length * 3000;
    
    let estimatedValue = (baseValue + bedroomMultiplier + bathroomMultiplier + sqftMultiplier + featureValue) 
      * conditionMultipliers[input.condition];
    
    // Add some randomness
    estimatedValue = Math.round(estimatedValue * (0.95 + Math.random() * 0.1));
    
    const variance = estimatedValue * 0.05;
    const confidence = 75 + Math.floor(Math.random() * 20);
    
    const monthlyRent = Math.round(estimatedValue * 0.005);
    const rentVariance = monthlyRent * 0.06;
    
    const valuation: PropertyValuation = {
      id: crypto.randomUUID(),
      user_id: 'current-user',
      portfolio_property_id: input.portfolio_property_id,
      address: input.address,
      postcode: input.postcode,
      property_type: input.property_type,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      square_footage: input.square_footage,
      condition: input.condition,
      features: input.features,
      estimated_value: estimatedValue,
      confidence_score: confidence,
      value_range_low: Math.round(estimatedValue - variance),
      value_range_high: Math.round(estimatedValue + variance),
      estimated_rent_pcm: monthlyRent,
      rent_range_low: Math.round(monthlyRent - rentVariance),
      rent_range_high: Math.round(monthlyRent + rentVariance),
      estimated_yield: Number(((monthlyRent * 12 / estimatedValue) * 100).toFixed(1)),
      comparables: generateMockComparables(input.postcode, input.bedrooms),
      valuation_factors: [
        { name: 'Location Score', impact: 0, description: '7.5/10 - Good area' },
        { name: 'Size Adjustment', impact: 3000, description: 'Based on sq ft' },
        { name: 'Condition', impact: input.condition === 'excellent' ? 5000 : -2500, description: `Property in ${input.condition} condition` },
        { name: 'Market Trend', impact: estimatedValue * 0.023, description: '+2.3% (6 months)' },
        { name: 'Comparable Quality', impact: 0, description: 'High confidence' },
      ],
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      currentValuation: valuation,
      valuations: [valuation, ...state.valuations],
    }));

    return valuation;
  },
}));

export interface CarbonAssessment {
  id: string;
  portfolio_property_id: string | null;
  user_id: string;
  assessment_year: number | null;
  electricity_kwh: number | null;
  gas_kwh: number | null;
  oil_litres: number | null;
  electricity_carbon: number | null;
  gas_carbon: number | null;
  oil_carbon: number | null;
  total_carbon: number | null;
  carbon_per_sqm: number | null;
  carbon_rating: string | null;
  uk_average_carbon: number | null;
  vs_average_percent: number | null;
  created_at: string;
}

export interface CarbonOffset {
  id: string;
  user_id: string;
  provider: string | null;
  project_name: string | null;
  tonnes_offset: number | null;
  cost: number | null;
  purchase_date: string | null;
  certificate_url: string | null;
  created_at: string;
}

// UK Grid carbon intensity factors (kg CO2e per kWh)
export const CARBON_FACTORS = {
  electricity: 0.233, // 2024 UK Grid average
  gas: 0.184,
  oil: 2.54, // per litre
  lpg: 0.214,
} as const;

// Carbon rating thresholds (kg CO2e per sqm per year)
export const CARBON_RATINGS = [
  { rating: 'A', maxCarbon: 15, color: '#00A651' },
  { rating: 'B', maxCarbon: 25, color: '#4CAF50' },
  { rating: 'C', maxCarbon: 40, color: '#8BC34A' },
  { rating: 'D', maxCarbon: 55, color: '#FFEB3B' },
  { rating: 'E', maxCarbon: 75, color: '#FF9800' },
  { rating: 'F', maxCarbon: 100, color: '#FF5722' },
  { rating: 'G', maxCarbon: Infinity, color: '#F44336' },
] as const;

export const UK_AVERAGE_CARBON_PER_SQM = 48; // kg CO2e per sqm per year

export const OFFSET_PROJECTS = [
  {
    id: 'uk-woodland',
    name: 'UK Woodland Creation',
    description: 'Plant native trees in Scotland',
    pricePerTonne: 15,
    standard: 'Verified Carbon Standard',
  },
  {
    id: 'wind-india',
    name: 'Wind Farm - India',
    description: 'Support renewable energy development',
    pricePerTonne: 8,
    standard: 'Gold Standard',
  },
  {
    id: 'cookstoves-africa',
    name: 'Clean Cookstoves - Africa',
    description: 'Replace inefficient cooking methods',
    pricePerTonne: 10,
    standard: 'Gold Standard',
  },
] as const;

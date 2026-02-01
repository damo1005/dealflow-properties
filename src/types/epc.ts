export interface EPCCertificate {
  id: string;
  property_address: string;
  postcode: string;
  building_reference_number: string | null;
  certificate_hash: string;
  lodgement_date: string;
  lodgement_datetime: string | null;
  current_energy_rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  current_energy_efficiency: number;
  potential_energy_rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  potential_energy_efficiency: number;
  current_co2_emissions: number | null;
  current_co2_emissions_rating: string | null;
  potential_co2_emissions: number | null;
  potential_co2_emissions_rating: string | null;
  current_energy_cost: number | null;
  potential_energy_cost: number | null;
  property_type: string | null;
  built_form: string | null;
  total_floor_area: number | null;
  number_habitable_rooms: number | null;
  number_heated_rooms: number | null;
  walls_description: string | null;
  walls_energy_efficiency: string | null;
  roof_description: string | null;
  roof_energy_efficiency: string | null;
  floor_description: string | null;
  floor_energy_efficiency: string | null;
  windows_description: string | null;
  windows_energy_efficiency: string | null;
  main_heating_description: string | null;
  main_heating_energy_efficiency: string | null;
  main_fuel: string | null;
  heating_cost_current: number | null;
  heating_cost_potential: number | null;
  hot_water_description: string | null;
  hot_water_energy_efficiency: string | null;
  hot_water_cost_current: number | null;
  hot_water_cost_potential: number | null;
  lighting_description: string | null;
  lighting_energy_efficiency: string | null;
  lighting_cost_current: number | null;
  lighting_cost_potential: number | null;
  improvements: EPCImprovement[] | null;
  assessor_name: string | null;
  assessor_company: string | null;
  inspection_date: string | null;
  epc_local_authority: string | null;
  constituency: string | null;
  county: string | null;
  transaction_type: string | null;
  tenure: string | null;
  created_at: string;
  updated_at: string;
}

export interface EPCImprovement {
  item: string;
  description: string;
  summary: string;
  indicativeCost: string;
  typicalSaving: string;
  energyPerformanceRating: string;
  environmentalImpactRating: string;
}

export const EPC_RATING_COLORS: Record<string, string> = {
  A: '#008054',
  B: '#19b459',
  C: '#8dce46',
  D: '#ffd500',
  E: '#fcaa3c',
  F: '#ef8023',
  G: '#e9153b',
};

export const EPC_RATING_RANGES: Record<string, string> = {
  A: '92-100',
  B: '81-91',
  C: '69-80',
  D: '55-68',
  E: '39-54',
  F: '21-38',
  G: '1-20',
};

export const EFFICIENCY_LABELS: Record<string, string> = {
  'Very Good': 'text-green-600',
  Good: 'text-green-500',
  Average: 'text-yellow-600',
  Poor: 'text-orange-500',
  'Very Poor': 'text-red-500',
};

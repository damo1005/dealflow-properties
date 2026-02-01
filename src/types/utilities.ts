export type UtilityType = 'gas' | 'electricity' | 'water' | 'broadband' | 'council_tax';
export type PaidBy = 'tenant' | 'landlord' | 'included';
export type ReadingType = 'actual' | 'estimated';

export interface PropertyUtility {
  id: string;
  portfolio_property_id: string;
  user_id: string;
  utility_type: UtilityType;
  supplier: string | null;
  account_number: string | null;
  tariff_name: string | null;
  monthly_cost: number | null;
  annual_cost: number | null;
  unit_rate: number | null;
  standing_charge: number | null;
  contract_end_date: string | null;
  exit_fee: number | null;
  meter_type: string | null;
  mpan: string | null;
  mprn: string | null;
  paid_by: PaidBy;
  status: string;
  created_at: string;
}

export interface UtilityReading {
  id: string;
  utility_id: string;
  reading_date: string;
  reading_value: number;
  reading_type: ReadingType;
  photo_url: string | null;
  submitted_to_supplier: boolean;
  created_at: string;
}

export const UTILITY_ICONS: Record<UtilityType, string> = {
  electricity: '⚡',
  gas: '🔥',
  water: '💧',
  broadband: '🌐',
  council_tax: '🏛️',
};

export const UTILITY_SUPPLIERS: Record<UtilityType, string[]> = {
  electricity: ['British Gas', 'EDF', 'Octopus Energy', 'E.ON', 'SSE', 'Scottish Power', 'OVO'],
  gas: ['British Gas', 'EDF', 'Octopus Energy', 'E.ON', 'SSE', 'Scottish Power', 'OVO'],
  water: ['United Utilities', 'Thames Water', 'Severn Trent', 'Yorkshire Water', 'Anglian Water'],
  broadband: ['BT', 'Virgin Media', 'Sky', 'TalkTalk', 'Vodafone', 'Hyperoptic'],
  council_tax: [],
};

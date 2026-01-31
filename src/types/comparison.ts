export interface ComparisonProperty {
  id: string;
  address: string;
  price: number;
  originalPrice?: number;
  priceReduced?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  tenure?: string;
  sqft?: number;
  epcRating?: string;
  councilTaxBand?: string;
  postcode?: string;
  daysOnMarket?: number;
  estimatedRent?: number;
  estimatedValue?: number;
  images?: string[];
  latitude?: number;
  longitude?: number;
  // Calculated fields
  calculatedYield?: number;
  calculatedCashFlow?: number;
  calculatedROI?: number;
  totalCashRequired?: number;
}

export interface CalculatorInputs {
  depositPercent: number;
  mortgageRate: number;
  mortgageTerm: number;
  managementFee: number;
  maintenancePercent: number;
  voidPercent: number;
  insuranceMonthly: number;
}

export interface ComparisonRow {
  key: string;
  label: string;
  category: "financial" | "property" | "location" | "investment";
  getValue: (property: ComparisonProperty) => string | number | null;
  format?: (value: unknown) => string;
  higherIsBetter?: boolean;
  unit?: string;
}

export interface SavedComparison {
  id: string;
  user_id: string;
  name: string;
  property_ids: string[];
  property_data: ComparisonProperty[];
  calculator_inputs: CalculatorInputs;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type HighlightType = "best" | "worst" | "neutral" | "second-best";

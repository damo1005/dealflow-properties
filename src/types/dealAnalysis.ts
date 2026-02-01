export type PropertyType = 'terraced' | 'semi-detached' | 'detached' | 'flat' | 'bungalow' | 'hmo' | 'commercial';
export type PurchaseType = 'standard' | 'auction' | 'bmv' | 'off_market';
export type FinanceType = 'cash' | 'btl_mortgage' | 'bridging' | 'commercial';
export type Strategy = 'btl' | 'flip' | 'hmo' | 'sa' | 'student' | 'development';
export type AnalysisStatus = 'analysed' | 'saved' | 'in_pipeline' | 'archived';

export interface PropertyInput {
  inputMethod: 'url' | 'address' | 'manual';
  sourceUrl?: string;
  sourcePlatform?: string;
  address?: string;
  postcode: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
}

export interface FinancialsInput {
  askingPrice: number;
  offerPrice: number;
  purchaseType: PurchaseType;
  refurbLight: number;
  refurbMedium: number;
  refurbHeavy: number;
  arv?: number;
  financeType: FinanceType;
  ltv: number;
  interestRate: number;
  mortgageTerm: number;
  interestOnly: boolean;
}

export interface BTLStrategyInputs {
  monthlyRent: number;
  managementPercent: number;
  voidWeeksPerYear: number;
  maintenancePercent: number;
}

export interface FlipStrategyInputs {
  targetSalePrice: number;
  refinanceLtv: number;
  holdPeriodMonths: number;
}

export interface HMOStrategyInputs {
  numberOfRooms: number;
  rentPerRoom: number;
  billsIncluded: boolean;
  estimatedBills: number;
}

export interface SAStrategyInputs {
  nightlyRate: number;
  occupancyPercent: number;
  cleaningPerStay: number;
  platformFeesPercent: number;
}

export type StrategyInputs = BTLStrategyInputs | FlipStrategyInputs | HMOStrategyInputs | SAStrategyInputs;

export interface StrategyInput {
  strategy: Strategy;
  inputs: StrategyInputs;
}

export interface ScoreBreakdown {
  cashFlow: number;
  roi: number;
  risk: number;
  growth: number;
  exitOptions: number;
}

export interface CostsBreakdown {
  deposit: number;
  sdlt: number;
  legalFees: number;
  survey: number;
  brokerFee: number;
  refurb: number;
  otherCosts: number;
}

export interface YearProjection {
  year: number;
  cumulativeCashFlow: number;
  propertyValue: number;
  equity: number;
  totalReturn: number;
}

export interface RiskItem {
  level: 'low' | 'medium' | 'high';
  description: string;
}

export interface StressTestResult {
  rate: number;
  monthlyPayment: number;
  cashFlow: number;
  status: 'positive' | 'warning' | 'negative';
}

export interface ComparableProperty {
  address: string;
  price: number;
  date?: string;
  type?: string;
  beds?: number;
  status?: string;
}

export interface AreaData {
  epcRating?: string;
  floodRisk?: string;
  crimeScore?: number;
  schoolsRating?: string;
  planningApplications?: number;
}

export interface TaxImplications {
  sdlt: number;
  incomeTaxOnRent: number;
  section24Restriction: number;
  effectiveTaxRate: number;
  afterTaxCashFlow: number;
  recommendation?: string;
}

export interface DealAnalysis {
  id: string;
  userId: string;
  
  // Property
  propertyAddress?: string;
  postcode?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  sourceUrl?: string;
  sourcePlatform?: string;
  
  // Purchase
  askingPrice: number;
  offerPrice: number;
  purchaseType: PurchaseType;
  
  // Refurb
  refurbLight: number;
  refurbMedium: number;
  refurbHeavy: number;
  arv?: number;
  
  // Finance
  financeType: FinanceType;
  ltv: number;
  interestRate: number;
  mortgageTerm: number;
  interestOnly: boolean;
  
  // Strategy
  strategy: Strategy;
  strategyInputs: StrategyInputs;
  
  // Results
  dealScore: number;
  scoreBreakdown: ScoreBreakdown;
  grossYield: number;
  netYield: number;
  cashOnCash: number;
  roiYear1: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  totalCashRequired: number;
  costsBreakdown: CostsBreakdown;
  fiveYearProjection: YearProjection[];
  riskAssessment: RiskItem[];
  stressTest: StressTestResult[];
  soldComparables: ComparableProperty[];
  rentalComparables: ComparableProperty[];
  areaData: AreaData;
  taxImplications: TaxImplications;
  
  // Meta
  status: AnalysisStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WizardState {
  step: number;
  property: PropertyInput;
  financials: FinancialsInput;
  strategy: StrategyInput;
}

import { create } from 'zustand';

export interface BTLInputs {
  // Purchase
  purchasePrice: number;
  depositPercent: number;
  mortgageRate: number;
  mortgageTerm: number;
  legalFees: number;
  surveyFees: number;
  brokerFees: number;
  refurbCosts: number;
  
  // Rental
  monthlyRent: number;
  voidPercent: number;
  lettingAgentFee: number;
  managementFee: number;
  
  // Ongoing
  insurance: number;
  maintenancePercent: number;
  serviceCharge: number;
  groundRent: number;
}

export interface BRRInputs {
  // Stage 1
  purchasePrice: number;
  refurbBudget: number;
  refurbTimeline: number;
  bridgingRate: number;
  bridgingFee: number;
  
  // Stage 2
  estimatedARV: number;
  newMortgageLTV: number;
  newMortgageRate: number;
  newMortgageTerm: number;
  
  // Rental (after refinance)
  monthlyRent: number;
  voidPercent: number;
  managementFee: number;
  insurance: number;
  maintenancePercent: number;
}

export interface HMOInputs {
  // Property
  purchasePrice: number;
  refurbCosts: number;
  conversionCosts: number;
  licensingFees: number;
  depositPercent: number;
  mortgageRate: number;
  mortgageTerm: number;
  
  // Rooms
  numberOfRooms: number;
  roomRents: number[];
  billsIncluded: boolean;
  utilityCosts: number;
  
  // Costs
  managementFee: number;
  insurance: number;
  safetyCertificates: number;
  maintenanceReserve: number;
}

export interface FlipInputs {
  purchasePrice: number;
  refurbBudget: number;
  refurbTimeline: number;
  bridgingRate: number;
  bridgingFee: number;
  legalFees: number;
  estateAgentFee: number;
  targetSalePrice: number;
}

export interface CalculatorScenario {
  id: string;
  name: string;
  type: 'btl' | 'brr' | 'hmo' | 'flip' | 'commercial';
  inputs: BTLInputs | BRRInputs | HMOInputs | FlipInputs;
  createdAt: string;
  propertyId?: string;
}

interface CalculatorState {
  activeTab: 'btl' | 'brr' | 'hmo' | 'flip' | 'commercial';
  btlInputs: BTLInputs;
  brrInputs: BRRInputs;
  hmoInputs: HMOInputs;
  flipInputs: FlipInputs;
  savedScenarios: CalculatorScenario[];
  
  setActiveTab: (tab: 'btl' | 'brr' | 'hmo' | 'flip' | 'commercial') => void;
  setBTLInputs: (inputs: Partial<BTLInputs>) => void;
  setBRRInputs: (inputs: Partial<BRRInputs>) => void;
  setHMOInputs: (inputs: Partial<HMOInputs>) => void;
  setFlipInputs: (inputs: Partial<FlipInputs>) => void;
  saveScenario: (scenario: CalculatorScenario) => void;
  resetBTL: () => void;
  resetBRR: () => void;
  resetHMO: () => void;
  resetFlip: () => void;
}

const defaultBTLInputs: BTLInputs = {
  purchasePrice: 250000,
  depositPercent: 25,
  mortgageRate: 5.5,
  mortgageTerm: 25,
  legalFees: 1500,
  surveyFees: 500,
  brokerFees: 500,
  refurbCosts: 0,
  monthlyRent: 1200,
  voidPercent: 5,
  lettingAgentFee: 8,
  managementFee: 10,
  insurance: 300,
  maintenancePercent: 10,
  serviceCharge: 0,
  groundRent: 0,
};

const defaultBRRInputs: BRRInputs = {
  purchasePrice: 150000,
  refurbBudget: 30000,
  refurbTimeline: 3,
  bridgingRate: 0.75,
  bridgingFee: 2,
  estimatedARV: 220000,
  newMortgageLTV: 75,
  newMortgageRate: 5.5,
  newMortgageTerm: 25,
  monthlyRent: 1100,
  voidPercent: 5,
  managementFee: 10,
  insurance: 350,
  maintenancePercent: 10,
};

const defaultHMOInputs: HMOInputs = {
  purchasePrice: 200000,
  refurbCosts: 20000,
  conversionCosts: 15000,
  licensingFees: 1000,
  depositPercent: 25,
  mortgageRate: 6.0,
  mortgageTerm: 25,
  numberOfRooms: 5,
  roomRents: [650, 650, 600, 600, 550],
  billsIncluded: true,
  utilityCosts: 400,
  managementFee: 15,
  insurance: 600,
  safetyCertificates: 500,
  maintenanceReserve: 12,
};

const defaultFlipInputs: FlipInputs = {
  purchasePrice: 180000,
  refurbBudget: 40000,
  refurbTimeline: 4,
  bridgingRate: 0.75,
  bridgingFee: 2,
  legalFees: 3000,
  estateAgentFee: 1.5,
  targetSalePrice: 280000,
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  activeTab: 'btl',
  btlInputs: defaultBTLInputs,
  brrInputs: defaultBRRInputs,
  hmoInputs: defaultHMOInputs,
  flipInputs: defaultFlipInputs,
  savedScenarios: [],
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setBTLInputs: (inputs) => set((state) => ({ btlInputs: { ...state.btlInputs, ...inputs } })),
  setBRRInputs: (inputs) => set((state) => ({ brrInputs: { ...state.brrInputs, ...inputs } })),
  setHMOInputs: (inputs) => set((state) => ({ hmoInputs: { ...state.hmoInputs, ...inputs } })),
  setFlipInputs: (inputs) => set((state) => ({ flipInputs: { ...state.flipInputs, ...inputs } })),
  saveScenario: (scenario) => set((state) => ({ savedScenarios: [scenario, ...state.savedScenarios] })),
  resetBTL: () => set({ btlInputs: defaultBTLInputs }),
  resetBRR: () => set({ brrInputs: defaultBRRInputs }),
  resetHMO: () => set({ hmoInputs: defaultHMOInputs }),
  resetFlip: () => set({ flipInputs: defaultFlipInputs }),
}));

// Calculation helper functions
export const calculateStampDuty = (price: number, isAdditional = true): number => {
  let duty = 0;
  
  if (price <= 250000) {
    duty = 0;
  } else if (price <= 925000) {
    duty = (price - 250000) * 0.05;
  } else if (price <= 1500000) {
    duty = 33750 + (price - 925000) * 0.10;
  } else {
    duty = 91250 + (price - 1500000) * 0.12;
  }
  
  // Additional property surcharge (3%)
  if (isAdditional) {
    duty += price * 0.03;
  }
  
  return Math.round(duty);
};

export const calculateMortgagePayment = (principal: number, annualRate: number, years: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                  (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Math.round(payment * 100) / 100;
};

export const calculateBTLResults = (inputs: BTLInputs) => {
  const depositAmount = inputs.purchasePrice * (inputs.depositPercent / 100);
  const mortgageAmount = inputs.purchasePrice - depositAmount;
  const stampDuty = calculateStampDuty(inputs.purchasePrice);
  
  const totalCashRequired = depositAmount + stampDuty + inputs.legalFees + 
                            inputs.surveyFees + inputs.brokerFees + inputs.refurbCosts;
  
  const monthlyMortgage = calculateMortgagePayment(mortgageAmount, inputs.mortgageRate, inputs.mortgageTerm);
  
  // Annual income with voids
  const effectiveAnnualRent = inputs.monthlyRent * 12 * (1 - inputs.voidPercent / 100);
  
  // Annual costs
  const lettingAgentCost = effectiveAnnualRent * (inputs.lettingAgentFee / 100);
  const managementCost = effectiveAnnualRent * (inputs.managementFee / 100);
  const maintenanceCost = effectiveAnnualRent * (inputs.maintenancePercent / 100);
  const annualMortgage = monthlyMortgage * 12;
  const totalAnnualCosts = annualMortgage + inputs.insurance + lettingAgentCost + 
                           managementCost + maintenanceCost + inputs.serviceCharge + inputs.groundRent;
  
  const annualCashFlow = effectiveAnnualRent - totalAnnualCosts;
  const monthlyCashFlow = annualCashFlow / 12;
  
  const grossYield = (inputs.monthlyRent * 12 / inputs.purchasePrice) * 100;
  const netYield = (annualCashFlow / inputs.purchasePrice) * 100;
  const roi = (annualCashFlow / totalCashRequired) * 100;
  
  // Break-even occupancy
  const breakEvenOccupancy = ((totalAnnualCosts) / (inputs.monthlyRent * 12)) * 100;
  
  return {
    depositAmount,
    mortgageAmount,
    stampDuty,
    totalCashRequired,
    monthlyMortgage,
    effectiveAnnualRent,
    totalAnnualCosts,
    annualCashFlow,
    monthlyCashFlow,
    grossYield,
    netYield,
    roi,
    breakEvenOccupancy,
    costBreakdown: {
      mortgage: annualMortgage,
      insurance: inputs.insurance,
      lettingAgent: lettingAgentCost,
      management: managementCost,
      maintenance: maintenanceCost,
      serviceCharge: inputs.serviceCharge,
      groundRent: inputs.groundRent,
    },
  };
};

export const calculateBRRResults = (inputs: BRRInputs) => {
  const totalInitialCost = inputs.purchasePrice + inputs.refurbBudget;
  const bridgingAmount = inputs.purchasePrice * 0.75; // Typical 75% LTV on bridging
  const cashRequired = totalInitialCost - bridgingAmount;
  
  // Bridging costs
  const bridgingInterest = bridgingAmount * (inputs.bridgingRate / 100) * inputs.refurbTimeline;
  const bridgingFeeAmount = bridgingAmount * (inputs.bridgingFee / 100);
  const totalBridgingCosts = bridgingInterest + bridgingFeeAmount;
  
  // Refinance
  const newMortgageAmount = inputs.estimatedARV * (inputs.newMortgageLTV / 100);
  const cashOutAtRefinance = newMortgageAmount - bridgingAmount - totalBridgingCosts;
  const cashLeftInDeal = totalInitialCost - newMortgageAmount + totalBridgingCosts;
  const equityGained = inputs.estimatedARV - totalInitialCost - totalBridgingCosts;
  
  // After refinance rental
  const monthlyMortgage = calculateMortgagePayment(newMortgageAmount, inputs.newMortgageRate, inputs.newMortgageTerm);
  const effectiveAnnualRent = inputs.monthlyRent * 12 * (1 - inputs.voidPercent / 100);
  const managementCost = effectiveAnnualRent * (inputs.managementFee / 100);
  const maintenanceCost = effectiveAnnualRent * (inputs.maintenancePercent / 100);
  const totalAnnualCosts = (monthlyMortgage * 12) + inputs.insurance + managementCost + maintenanceCost;
  const annualCashFlow = effectiveAnnualRent - totalAnnualCosts;
  const monthlyCashFlow = annualCashFlow / 12;
  
  const cashOnCashReturn = cashLeftInDeal > 0 ? (annualCashFlow / cashLeftInDeal) * 100 : Infinity;
  
  return {
    totalInitialCost,
    bridgingAmount,
    cashRequired,
    totalBridgingCosts,
    newMortgageAmount,
    cashOutAtRefinance,
    cashLeftInDeal,
    equityGained,
    monthlyMortgage,
    effectiveAnnualRent,
    totalAnnualCosts,
    annualCashFlow,
    monthlyCashFlow,
    cashOnCashReturn,
  };
};

export const calculateHMOResults = (inputs: HMOInputs) => {
  const totalPurchaseCost = inputs.purchasePrice + inputs.refurbCosts + 
                            inputs.conversionCosts + inputs.licensingFees;
  const depositAmount = inputs.purchasePrice * (inputs.depositPercent / 100);
  const mortgageAmount = inputs.purchasePrice - depositAmount;
  const stampDuty = calculateStampDuty(inputs.purchasePrice);
  
  const totalCashRequired = depositAmount + stampDuty + inputs.refurbCosts + 
                            inputs.conversionCosts + inputs.licensingFees;
  
  // Room income
  const totalMonthlyRent = inputs.roomRents.reduce((sum, rent) => sum + rent, 0);
  const annualGrossRent = totalMonthlyRent * 12;
  
  // Costs
  const monthlyMortgage = calculateMortgagePayment(mortgageAmount, inputs.mortgageRate, inputs.mortgageTerm);
  const annualMortgage = monthlyMortgage * 12;
  const managementCost = annualGrossRent * (inputs.managementFee / 100);
  const maintenanceCost = annualGrossRent * (inputs.maintenanceReserve / 100);
  const annualUtilities = inputs.billsIncluded ? inputs.utilityCosts * 12 : 0;
  
  const totalAnnualCosts = annualMortgage + inputs.insurance + managementCost + 
                           maintenanceCost + inputs.safetyCertificates + annualUtilities;
  
  const annualCashFlow = annualGrossRent - totalAnnualCosts;
  const monthlyProfit = annualCashFlow / 12;
  const grossYield = (annualGrossRent / totalPurchaseCost) * 100;
  const netYield = (annualCashFlow / totalPurchaseCost) * 100;
  const roi = (annualCashFlow / totalCashRequired) * 100;
  
  // BTL comparison (single let equivalent)
  const btlRent = inputs.purchasePrice * 0.005; // Approximate single let rent
  const btlAnnualRent = btlRent * 12;
  const btlCosts = annualMortgage + inputs.insurance + (btlAnnualRent * 0.2);
  const btlCashFlow = btlAnnualRent - btlCosts;
  
  return {
    totalPurchaseCost,
    depositAmount,
    mortgageAmount,
    stampDuty,
    totalCashRequired,
    totalMonthlyRent,
    annualGrossRent,
    monthlyMortgage,
    totalAnnualCosts,
    annualCashFlow,
    monthlyProfit,
    grossYield,
    netYield,
    roi,
    btlComparison: {
      hmoMonthlyProfit: monthlyProfit,
      btlMonthlyProfit: btlCashFlow / 12,
      difference: monthlyProfit - (btlCashFlow / 12),
    },
  };
};

export const calculateFlipResults = (inputs: FlipInputs) => {
  const totalCosts = inputs.purchasePrice + inputs.refurbBudget;
  const bridgingAmount = inputs.purchasePrice * 0.70;
  const cashRequired = totalCosts - bridgingAmount;
  
  // Bridging costs
  const bridgingInterest = bridgingAmount * (inputs.bridgingRate / 100) * inputs.refurbTimeline;
  const bridgingFeeAmount = bridgingAmount * (inputs.bridgingFee / 100);
  const stampDuty = calculateStampDuty(inputs.purchasePrice);
  
  // Sale costs
  const agentFee = inputs.targetSalePrice * (inputs.estateAgentFee / 100);
  
  const totalProjectCosts = totalCosts + bridgingInterest + bridgingFeeAmount + 
                            stampDuty + inputs.legalFees + agentFee;
  
  const grossProfit = inputs.targetSalePrice - totalProjectCosts;
  const profitMargin = (grossProfit / inputs.targetSalePrice) * 100;
  const roiOnCash = (grossProfit / cashRequired) * 100;
  const monthlyROI = roiOnCash / inputs.refurbTimeline;
  
  return {
    totalCosts,
    bridgingAmount,
    cashRequired,
    bridgingInterest,
    bridgingFeeAmount,
    stampDuty,
    agentFee,
    totalProjectCosts,
    grossProfit,
    profitMargin,
    roiOnCash,
    monthlyROI,
  };
};

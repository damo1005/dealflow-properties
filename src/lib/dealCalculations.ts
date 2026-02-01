import {
  PropertyInput,
  FinancialsInput,
  StrategyInput,
  DealAnalysis,
  ScoreBreakdown,
  CostsBreakdown,
  YearProjection,
  RiskItem,
  StressTestResult,
  BTLStrategyInputs,
  HMOStrategyInputs,
  SAStrategyInputs,
  ComparableProperty,
  AreaData,
  TaxImplications,
} from '@/types/dealAnalysis';

// SDLT Calculation for additional properties
export function calculateSDLT(price: number): number {
  if (price <= 0) return 0;
  
  let sdlt = 0;
  
  // Additional property surcharge bands (3% extra on all bands)
  if (price <= 250000) {
    sdlt = price * 0.03;
  } else if (price <= 925000) {
    sdlt = (250000 * 0.03) + ((price - 250000) * 0.08);
  } else if (price <= 1500000) {
    sdlt = (250000 * 0.03) + (675000 * 0.08) + ((price - 925000) * 0.13);
  } else {
    sdlt = (250000 * 0.03) + (675000 * 0.08) + (575000 * 0.13) + ((price - 1500000) * 0.15);
  }
  
  return Math.round(sdlt);
}

// Calculate monthly mortgage payment
export function calculateMortgagePayment(
  loanAmount: number,
  interestRate: number,
  termYears: number,
  interestOnly: boolean
): number {
  if (loanAmount <= 0 || interestRate <= 0) return 0;
  
  const monthlyRate = interestRate / 100 / 12;
  
  if (interestOnly) {
    return loanAmount * monthlyRate;
  }
  
  const numPayments = termYears * 12;
  const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return payment;
}

// Calculate annual income based on strategy
export function calculateAnnualIncome(strategy: StrategyInput): number {
  const { strategy: type, inputs } = strategy;
  
  switch (type) {
    case 'btl':
    case 'student': {
      const btlInputs = inputs as BTLStrategyInputs;
      const monthlyRent = btlInputs.monthlyRent;
      const voidWeeks = btlInputs.voidWeeksPerYear || 2;
      return monthlyRent * 12 * (1 - voidWeeks / 52);
    }
    case 'hmo': {
      const hmoInputs = inputs as HMOStrategyInputs;
      const monthlyIncome = hmoInputs.numberOfRooms * hmoInputs.rentPerRoom;
      return monthlyIncome * 12 * 0.95; // 5% void allowance
    }
    case 'sa': {
      const saInputs = inputs as SAStrategyInputs;
      const nightsPerYear = 365 * (saInputs.occupancyPercent / 100);
      const grossIncome = nightsPerYear * saInputs.nightlyRate;
      const platformFees = grossIncome * (saInputs.platformFeesPercent / 100);
      const cleaningCosts = (nightsPerYear / 3) * saInputs.cleaningPerStay; // Avg 3 nights per stay
      return grossIncome - platformFees - cleaningCosts;
    }
    default:
      return 0;
  }
}

// Calculate annual expenses
export function calculateAnnualExpenses(
  strategy: StrategyInput,
  mortgagePayment: number,
  insuranceAnnual: number = 500
): number {
  const { strategy: type, inputs } = strategy;
  const annualMortgage = mortgagePayment * 12;
  
  switch (type) {
    case 'btl':
    case 'student': {
      const btlInputs = inputs as BTLStrategyInputs;
      const annualIncome = calculateAnnualIncome(strategy);
      const management = annualIncome * (btlInputs.managementPercent / 100);
      const maintenance = annualIncome * (btlInputs.maintenancePercent / 100);
      return annualMortgage + management + maintenance + insuranceAnnual;
    }
    case 'hmo': {
      const hmoInputs = inputs as HMOStrategyInputs;
      const annualIncome = calculateAnnualIncome(strategy);
      const bills = hmoInputs.billsIncluded ? hmoInputs.estimatedBills * 12 : 0;
      const management = annualIncome * 0.12; // 12% for HMO
      const maintenance = annualIncome * 0.15; // Higher maintenance for HMO
      return annualMortgage + management + maintenance + bills + insuranceAnnual + 800; // HMO license
    }
    case 'sa': {
      const annualIncome = calculateAnnualIncome(strategy);
      const management = annualIncome * 0.2; // Higher management for SA
      const maintenance = annualIncome * 0.08;
      const utilities = 200 * 12; // Estimated utilities
      return annualMortgage + management + maintenance + utilities + insuranceAnnual;
    }
    default:
      return annualMortgage + insuranceAnnual;
  }
}

// Main analysis calculation
export function calculateDealAnalysis(
  property: PropertyInput,
  financials: FinancialsInput,
  strategy: StrategyInput
): Omit<DealAnalysis, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  const purchasePrice = financials.offerPrice || financials.askingPrice;
  const totalRefurb = financials.refurbLight + financials.refurbMedium + financials.refurbHeavy;
  
  // Calculate costs
  const deposit = financials.financeType === 'cash' ? purchasePrice : purchasePrice * (1 - financials.ltv / 100);
  const sdlt = calculateSDLT(purchasePrice);
  const legalFees = Math.max(1500, purchasePrice * 0.01);
  const survey = 600;
  const brokerFee = financials.financeType === 'cash' ? 0 : 500;
  
  const costsBreakdown: CostsBreakdown = {
    deposit,
    sdlt,
    legalFees,
    survey,
    brokerFee,
    refurb: totalRefurb,
    otherCosts: 500,
  };
  
  const totalCashRequired = deposit + sdlt + legalFees + survey + brokerFee + totalRefurb + 500;
  
  // Calculate mortgage
  const loanAmount = purchasePrice * (financials.ltv / 100);
  const monthlyMortgage = calculateMortgagePayment(
    loanAmount,
    financials.interestRate,
    financials.mortgageTerm,
    financials.interestOnly
  );
  
  // Calculate income and expenses
  const annualIncome = calculateAnnualIncome(strategy);
  const annualExpenses = calculateAnnualExpenses(strategy, monthlyMortgage);
  const annualCashFlow = annualIncome - annualExpenses;
  const monthlyCashFlow = annualCashFlow / 12;
  
  // Calculate yields
  const grossYield = (annualIncome / purchasePrice) * 100;
  const netYield = (annualCashFlow / purchasePrice) * 100;
  const cashOnCash = (annualCashFlow / totalCashRequired) * 100;
  const roiYear1 = cashOnCash; // Simplified - could include equity growth
  
  // Calculate score
  const scoreBreakdown = calculateScore(grossYield, netYield, cashOnCash, monthlyCashFlow, strategy.strategy);
  const dealScore = Math.round(
    (scoreBreakdown.cashFlow + scoreBreakdown.roi + scoreBreakdown.risk + 
     scoreBreakdown.growth + scoreBreakdown.exitOptions) / 5 * 10
  );
  
  // 5-year projection
  const fiveYearProjection = calculateProjection(purchasePrice, annualCashFlow, loanAmount, financials.interestOnly);
  
  // Risk assessment
  const riskAssessment = assessRisks(grossYield, netYield, financials, strategy);
  
  // Stress test
  const stressTest = runStressTest(loanAmount, financials.interestRate, annualIncome, annualExpenses - monthlyMortgage * 12);
  
  // Mock comparables (in real app, fetch from API)
  const soldComparables = generateMockComparables(purchasePrice, property.postcode);
  const rentalComparables = generateMockRentalComparables(strategy, property.postcode);
  
  // Area data (mock)
  const areaData: AreaData = {
    epcRating: 'C',
    floodRisk: 'Low',
    crimeScore: 85,
    schoolsRating: 'B',
    planningApplications: 3,
  };
  
  // Tax implications (simplified)
  const taxImplications = calculateTaxImplications(annualIncome, monthlyMortgage * 12, sdlt);
  
  return {
    propertyAddress: property.address,
    postcode: property.postcode,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    squareFootage: property.squareFootage,
    sourceUrl: property.sourceUrl,
    sourcePlatform: property.sourcePlatform,
    askingPrice: financials.askingPrice,
    offerPrice: financials.offerPrice,
    purchaseType: financials.purchaseType,
    refurbLight: financials.refurbLight,
    refurbMedium: financials.refurbMedium,
    refurbHeavy: financials.refurbHeavy,
    arv: financials.arv,
    financeType: financials.financeType,
    ltv: financials.ltv,
    interestRate: financials.interestRate,
    mortgageTerm: financials.mortgageTerm,
    interestOnly: financials.interestOnly,
    strategy: strategy.strategy,
    strategyInputs: strategy.inputs,
    dealScore,
    scoreBreakdown,
    grossYield,
    netYield,
    cashOnCash,
    roiYear1,
    monthlyCashFlow,
    annualCashFlow,
    totalCashRequired,
    costsBreakdown,
    fiveYearProjection,
    riskAssessment,
    stressTest,
    soldComparables,
    rentalComparables,
    areaData,
    taxImplications,
    status: 'analysed',
  };
}

function calculateScore(
  grossYield: number,
  netYield: number,
  cashOnCash: number,
  monthlyCashFlow: number,
  strategy: string
): ScoreBreakdown {
  // Cash flow score (0-10)
  let cashFlowScore = 5;
  if (monthlyCashFlow >= 500) cashFlowScore = 10;
  else if (monthlyCashFlow >= 300) cashFlowScore = 8;
  else if (monthlyCashFlow >= 150) cashFlowScore = 6;
  else if (monthlyCashFlow >= 0) cashFlowScore = 4;
  else cashFlowScore = 2;
  
  // ROI score
  let roiScore = 5;
  if (cashOnCash >= 15) roiScore = 10;
  else if (cashOnCash >= 12) roiScore = 8;
  else if (cashOnCash >= 8) roiScore = 6;
  else if (cashOnCash >= 5) roiScore = 5;
  else roiScore = 3;
  
  // Risk score (lower is more risky)
  let riskScore = 7;
  if (grossYield >= 8) riskScore = 9;
  else if (grossYield >= 6) riskScore = 7;
  else if (grossYield >= 4) riskScore = 5;
  else riskScore = 3;
  
  // Growth score (simplified)
  const growthScore = 7;
  
  // Exit options
  let exitScore = 7;
  if (strategy === 'btl') exitScore = 9;
  else if (strategy === 'flip') exitScore = 8;
  else if (strategy === 'hmo') exitScore = 6;
  else if (strategy === 'sa') exitScore = 7;
  
  return {
    cashFlow: cashFlowScore,
    roi: roiScore,
    risk: riskScore,
    growth: growthScore,
    exitOptions: exitScore,
  };
}

function calculateProjection(
  purchasePrice: number,
  annualCashFlow: number,
  loanAmount: number,
  interestOnly: boolean
): YearProjection[] {
  const projections: YearProjection[] = [];
  const growthRate = 0.04; // 4% annual growth
  const rentGrowthRate = 0.03; // 3% rent growth
  
  let cumulativeCashFlow = 0;
  let currentCashFlow = annualCashFlow;
  let currentValue = purchasePrice;
  let currentLoan = loanAmount;
  
  for (let year = 1; year <= 5; year++) {
    currentValue *= (1 + growthRate);
    currentCashFlow *= (1 + rentGrowthRate);
    cumulativeCashFlow += currentCashFlow;
    
    if (!interestOnly) {
      // Simplified principal reduction
      currentLoan *= 0.97;
    }
    
    const equity = currentValue - currentLoan;
    const totalReturn = cumulativeCashFlow + (currentValue - purchasePrice);
    
    projections.push({
      year,
      cumulativeCashFlow: Math.round(cumulativeCashFlow),
      propertyValue: Math.round(currentValue),
      equity: Math.round(equity),
      totalReturn: Math.round(totalReturn),
    });
  }
  
  return projections;
}

function assessRisks(
  grossYield: number,
  netYield: number,
  financials: FinancialsInput,
  strategy: StrategyInput
): RiskItem[] {
  const risks: RiskItem[] = [];
  
  // Low risk items
  if (grossYield >= 6) {
    risks.push({ level: 'low', description: 'Strong rental demand indicated by yield' });
  }
  
  if (financials.ltv <= 75) {
    risks.push({ level: 'low', description: 'Conservative LTV provides equity buffer' });
  }
  
  // Medium risk items
  risks.push({
    level: 'medium',
    description: `Interest rate sensitivity: +2% rates reduces cash flow significantly`,
  });
  
  risks.push({
    level: 'medium',
    description: 'Void risk: Average 2-4 weeks/year between tenants',
  });
  
  // High risk items
  if (strategy.strategy === 'hmo') {
    risks.push({
      level: 'high',
      description: 'Article 4 may be in force - HMO requires planning permission',
    });
  }
  
  if (financials.ltv > 80) {
    risks.push({
      level: 'high',
      description: 'High LTV increases risk in market downturn',
    });
  }
  
  return risks;
}

function runStressTest(
  loanAmount: number,
  baseRate: number,
  annualIncome: number,
  nonMortgageExpenses: number
): StressTestResult[] {
  const results: StressTestResult[] = [];
  const rateIncreases = [0, 1, 2, 3, 4];
  
  for (const increase of rateIncreases) {
    const rate = baseRate + increase;
    const monthlyPayment = calculateMortgagePayment(loanAmount, rate, 25, true);
    const annualMortgage = monthlyPayment * 12;
    const annualCashFlow = annualIncome - annualMortgage - nonMortgageExpenses;
    const monthlyCashFlow = annualCashFlow / 12;
    
    let status: 'positive' | 'warning' | 'negative' = 'positive';
    if (monthlyCashFlow < 0) status = 'negative';
    else if (monthlyCashFlow < 100) status = 'warning';
    
    results.push({
      rate,
      monthlyPayment: Math.round(monthlyPayment),
      cashFlow: Math.round(monthlyCashFlow),
      status,
    });
  }
  
  return results;
}

function generateMockComparables(price: number, postcode?: string): ComparableProperty[] {
  const variance = 0.05;
  return [
    {
      address: `14 ${postcode || 'XX1'} Street`,
      price: Math.round(price * (1 + (Math.random() * variance * 2 - variance))),
      date: 'Oct 2025',
      type: 'Terraced',
    },
    {
      address: `28 ${postcode || 'XX1'} Street`,
      price: Math.round(price * (1 - (Math.random() * variance))),
      date: 'Aug 2025',
      type: 'Terraced',
    },
    {
      address: `7 Nearby Road`,
      price: Math.round(price * (1 + (Math.random() * variance))),
      date: 'Nov 2025',
      type: 'Terraced',
    },
  ];
}

function generateMockRentalComparables(strategy: StrategyInput, postcode?: string): ComparableProperty[] {
  const btlInputs = strategy.inputs as BTLStrategyInputs;
  const baseRent = btlInputs.monthlyRent || 900;
  
  return [
    {
      address: `22 ${postcode || 'XX1'} Street`,
      price: Math.round(baseRent * 0.99),
      status: 'Available',
      beds: 3,
    },
    {
      address: `5 Nearby Road`,
      price: Math.round(baseRent * 0.95),
      status: 'Let Agreed',
      beds: 3,
    },
    {
      address: `31 Area Avenue`,
      price: Math.round(baseRent * 1.03),
      status: 'Available',
      beds: 3,
    },
  ];
}

function calculateTaxImplications(
  annualIncome: number,
  annualMortgageInterest: number,
  sdlt: number
): TaxImplications {
  // Simplified higher rate taxpayer calculation
  const taxRate = 0.40;
  const incomeTaxOnRent = annualIncome * taxRate;
  const section24Relief = annualMortgageInterest * 0.20; // 20% tax credit
  const section24Restriction = annualMortgageInterest * (taxRate - 0.20);
  const effectiveTaxRate = ((incomeTaxOnRent - section24Relief) / annualIncome) * 100;
  const afterTaxCashFlow = annualIncome - incomeTaxOnRent + section24Relief;
  
  return {
    sdlt,
    incomeTaxOnRent: Math.round(incomeTaxOnRent),
    section24Restriction: Math.round(section24Restriction),
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    afterTaxCashFlow: Math.round(afterTaxCashFlow),
    recommendation: section24Restriction > 500 ? 'Consider purchasing via Ltd company for tax efficiency' : undefined,
  };
}

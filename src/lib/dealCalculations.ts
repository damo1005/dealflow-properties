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

// SA-specific: calculate monthly SA revenue
export function calculateSAMonthlyRevenue(saInputs: SAStrategyInputs): number {
  const daysInMonth = 30;
  const occupiedNights = daysInMonth * (saInputs.occupancyPercent / 100);
  return saInputs.nightlyRate * occupiedNights;
}

// SA-specific: calculate monthly SA costs
export function calculateSAMonthlyCosts(saInputs: SAStrategyInputs): {
  leaseCost: number;
  platformFees: number;
  utilities: number;
  cleaning: number;
  total: number;
} {
  const revenue = calculateSAMonthlyRevenue(saInputs);
  const leaseCost = saInputs.propertyStrategy === 'r2sa' ? saInputs.monthlyLeaseCost : 0;
  const platformFees = revenue * (saInputs.platformFeesPercent / 100);
  const utilities = 150;
  const cleaning = saInputs.cleaningPerStay > 0 ? saInputs.cleaningPerStay * 8 : 100; // ~8 turnovers/month or default £100
  
  return {
    leaseCost,
    platformFees: Math.round(platformFees),
    utilities,
    cleaning,
    total: Math.round(leaseCost + platformFees + utilities + cleaning),
  };
}

// SA-specific: calculate break-even occupancy %
export function calculateSABreakEvenOccupancy(saInputs: SAStrategyInputs): number {
  if (saInputs.nightlyRate <= 0) return 100;
  
  const leaseCost = saInputs.propertyStrategy === 'r2sa' ? saInputs.monthlyLeaseCost : 0;
  const fixedCosts = 150 + (saInputs.cleaningPerStay > 0 ? saInputs.cleaningPerStay * 8 : 100); // utilities + cleaning
  const totalFixedCosts = leaseCost + fixedCosts;
  
  // Revenue per night after platform fees
  const netNightlyRate = saInputs.nightlyRate * (1 - saInputs.platformFeesPercent / 100);
  
  const breakEvenNights = totalFixedCosts / netNightlyRate;
  const breakEvenPercent = (breakEvenNights / 30) * 100;
  
  return Math.round(Math.min(100, Math.max(0, breakEvenPercent)) * 10) / 10;
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
      return monthlyIncome * 12 * 0.95;
    }
    case 'sa': {
      const saInputs = inputs as SAStrategyInputs;
      return calculateSAMonthlyRevenue(saInputs) * 12;
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
      const management = annualIncome * 0.12;
      const maintenance = annualIncome * 0.15;
      return annualMortgage + management + maintenance + bills + insuranceAnnual + 800;
    }
    case 'sa': {
      const saInputs = inputs as SAStrategyInputs;
      const monthlyCosts = calculateSAMonthlyCosts(saInputs);
      // For SA: annual costs = lease + platform fees + utilities + cleaning + mortgage (if own property)
      // Mortgage only applies to own-property SA
      const mortgageCost = saInputs.propertyStrategy === 'own' ? annualMortgage : 0;
      return (monthlyCosts.total * 12) + mortgageCost + insuranceAnnual;
    }
    default:
      return annualMortgage + insuranceAnnual;
  }
}

// SA-specific deal score based on break-even occupancy
function calculateSADealScore(breakEvenOccupancy: number): number {
  if (breakEvenOccupancy < 50) return Math.round(80 + ((50 - breakEvenOccupancy) / 50) * 20); // 80-100
  if (breakEvenOccupancy <= 65) return Math.round(65 + ((65 - breakEvenOccupancy) / 15) * 14); // 65-79
  if (breakEvenOccupancy <= 75) return Math.round(50 + ((75 - breakEvenOccupancy) / 10) * 14); // 50-64
  return Math.round(Math.max(10, 50 - ((breakEvenOccupancy - 75) / 25) * 40)); // below 50
}

// Main analysis calculation
export function calculateDealAnalysis(
  property: PropertyInput,
  financials: FinancialsInput,
  strategy: StrategyInput
): Omit<DealAnalysis, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  const purchasePrice = financials.offerPrice || financials.askingPrice;
  const totalRefurb = financials.refurbLight + financials.refurbMedium + financials.refurbHeavy;
  const isSA = strategy.strategy === 'sa';
  const saInputs = isSA ? (strategy.inputs as SAStrategyInputs) : null;
  const isR2SA = isSA && saInputs?.propertyStrategy === 'r2sa';
  
  // Calculate costs
  const deposit = financials.financeType === 'cash' ? purchasePrice : purchasePrice * (1 - financials.ltv / 100);
  const sdlt = isR2SA ? 0 : calculateSDLT(purchasePrice); // No SDLT for R2SA (renting, not buying)
  const legalFees = isR2SA ? 500 : Math.max(1500, purchasePrice * 0.01); // Lower legal for lease
  const survey = isR2SA ? 0 : 600;
  const brokerFee = financials.financeType === 'cash' || isR2SA ? 0 : 500;
  
  const costsBreakdown: CostsBreakdown = {
    deposit: isR2SA ? 0 : deposit,
    sdlt,
    legalFees,
    survey,
    brokerFee,
    refurb: totalRefurb,
    otherCosts: 500,
  };
  
  const totalCashRequired = isR2SA
    ? totalRefurb + legalFees + 500 // R2SA: just setup costs, no deposit/SDLT
    : deposit + sdlt + legalFees + survey + brokerFee + totalRefurb + 500;
  
  // Calculate mortgage (only for own-property SA or non-SA)
  const loanAmount = isR2SA ? 0 : purchasePrice * (financials.ltv / 100);
  const monthlyMortgage = isR2SA ? 0 : calculateMortgagePayment(
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
  
  // Calculate yields / metrics
  let grossYield: number;
  let netYield: number;
  let cashOnCash: number;
  let roiYear1: number;
  let dealScore: number;
  let scoreBreakdown: ScoreBreakdown;
  
  if (isSA && saInputs) {
    const breakEvenOccupancy = calculateSABreakEvenOccupancy(saInputs);
    const annualLeaseCost = isR2SA ? saInputs.monthlyLeaseCost * 12 : 0;
    
    // SA-specific metrics
    grossYield = annualLeaseCost > 0 ? (annualIncome / annualLeaseCost) * 100 : 0;
    netYield = annualLeaseCost > 0 ? (annualCashFlow / annualLeaseCost) * 100 : 0;
    roiYear1 = annualLeaseCost > 0 ? (annualCashFlow / annualLeaseCost) * 100 : 0; // ROI vs lease cost
    cashOnCash = totalCashRequired > 0 ? (annualCashFlow / totalCashRequired) * 100 : 0;
    
    // SA deal score based on break-even occupancy
    dealScore = calculateSADealScore(breakEvenOccupancy);
    scoreBreakdown = calculateSAScoreBreakdown(breakEvenOccupancy, monthlyCashFlow, roiYear1);
  } else {
    grossYield = purchasePrice > 0 ? (annualIncome / purchasePrice) * 100 : 0;
    netYield = purchasePrice > 0 ? (annualCashFlow / purchasePrice) * 100 : 0;
    cashOnCash = totalCashRequired > 0 ? (annualCashFlow / totalCashRequired) * 100 : 0;
    roiYear1 = cashOnCash;
    scoreBreakdown = calculateScore(grossYield, netYield, cashOnCash, monthlyCashFlow, strategy.strategy);
    dealScore = Math.round(
      (scoreBreakdown.cashFlow + scoreBreakdown.roi + scoreBreakdown.risk +
       scoreBreakdown.growth + scoreBreakdown.exitOptions) / 5 * 10
    );
  }
  
  // 5-year projection
  const fiveYearProjection = isSA && isR2SA
    ? calculateSAProjection(annualCashFlow)
    : calculateProjection(purchasePrice, annualCashFlow, loanAmount, financials.interestOnly);
  
  // Risk assessment
  const riskAssessment = isSA && saInputs
    ? assessSARisks(saInputs, monthlyCashFlow)
    : assessRisks(grossYield, netYield, financials, strategy);
  
  // Stress test
  const stressTest = isSA
    ? [] // Stress test not applicable to lease-based SA in the same way
    : runStressTest(loanAmount, financials.interestRate, annualIncome, annualExpenses - monthlyMortgage * 12);
  
  // Comparables
  const soldComparables = isR2SA ? [] : generateMockComparables(purchasePrice, property.postcode);
  const rentalComparables = generateMockRentalComparables(strategy, property.postcode);
  
  const areaData: AreaData = {
    epcRating: 'C',
    floodRisk: 'Low',
    crimeScore: 85,
    schoolsRating: 'B',
    planningApplications: 3,
  };
  
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
    dealScore: Math.min(100, Math.max(0, dealScore)),
    scoreBreakdown,
    grossYield: Math.round(grossYield * 10) / 10,
    netYield: Math.round(netYield * 10) / 10,
    cashOnCash: Math.round(cashOnCash * 10) / 10,
    roiYear1: Math.round(roiYear1 * 10) / 10,
    monthlyCashFlow: Math.round(monthlyCashFlow),
    annualCashFlow: Math.round(annualCashFlow),
    totalCashRequired: Math.round(totalCashRequired),
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

// SA-specific score breakdown based on break-even occupancy
function calculateSAScoreBreakdown(
  breakEvenOccupancy: number,
  monthlyCashFlow: number,
  roiVsLease: number
): ScoreBreakdown {
  // Cash flow score
  let cashFlowScore = 5;
  if (monthlyCashFlow >= 1000) cashFlowScore = 10;
  else if (monthlyCashFlow >= 600) cashFlowScore = 8;
  else if (monthlyCashFlow >= 300) cashFlowScore = 6;
  else if (monthlyCashFlow >= 0) cashFlowScore = 4;
  else cashFlowScore = 2;
  
  // ROI score (vs lease cost)
  let roiScore = 5;
  if (roiVsLease >= 100) roiScore = 10;
  else if (roiVsLease >= 60) roiScore = 8;
  else if (roiVsLease >= 30) roiScore = 6;
  else if (roiVsLease >= 10) roiScore = 4;
  else roiScore = 2;
  
  // Risk based on break-even occupancy
  let riskScore = 5;
  if (breakEvenOccupancy < 45) riskScore = 10;
  else if (breakEvenOccupancy < 55) riskScore = 8;
  else if (breakEvenOccupancy < 65) riskScore = 6;
  else if (breakEvenOccupancy < 75) riskScore = 4;
  else riskScore = 2;
  
  return {
    cashFlow: cashFlowScore,
    roi: roiScore,
    risk: riskScore,
    growth: 6, // SA growth is moderate
    exitOptions: 5, // R2SA exit = walk away from lease
  };
}

function calculateScore(
  grossYield: number,
  netYield: number,
  cashOnCash: number,
  monthlyCashFlow: number,
  strategy: string
): ScoreBreakdown {
  let cashFlowScore = 5;
  if (monthlyCashFlow >= 500) cashFlowScore = 10;
  else if (monthlyCashFlow >= 300) cashFlowScore = 8;
  else if (monthlyCashFlow >= 150) cashFlowScore = 6;
  else if (monthlyCashFlow >= 0) cashFlowScore = 4;
  else cashFlowScore = 2;
  
  let roiScore = 5;
  if (cashOnCash >= 15) roiScore = 10;
  else if (cashOnCash >= 12) roiScore = 8;
  else if (cashOnCash >= 8) roiScore = 6;
  else if (cashOnCash >= 5) roiScore = 5;
  else roiScore = 3;
  
  let riskScore = 7;
  if (grossYield >= 8) riskScore = 9;
  else if (grossYield >= 6) riskScore = 7;
  else if (grossYield >= 4) riskScore = 5;
  else riskScore = 3;
  
  const growthScore = 7;
  
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
  const growthRate = 0.04;
  const rentGrowthRate = 0.03;
  
  let cumulativeCashFlow = 0;
  let currentCashFlow = annualCashFlow;
  let currentValue = purchasePrice;
  let currentLoan = loanAmount;
  
  for (let year = 1; year <= 5; year++) {
    currentValue *= (1 + growthRate);
    currentCashFlow *= (1 + rentGrowthRate);
    cumulativeCashFlow += currentCashFlow;
    
    if (!interestOnly) {
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

// SA-specific projection (no property appreciation for R2SA)
function calculateSAProjection(annualCashFlow: number): YearProjection[] {
  const projections: YearProjection[] = [];
  const revenueGrowth = 0.05; // 5% ADR growth assumed
  
  let cumulativeCashFlow = 0;
  let currentCashFlow = annualCashFlow;
  
  for (let year = 1; year <= 5; year++) {
    currentCashFlow *= (1 + revenueGrowth);
    cumulativeCashFlow += currentCashFlow;
    
    projections.push({
      year,
      cumulativeCashFlow: Math.round(cumulativeCashFlow),
      propertyValue: 0, // R2SA: no property owned
      equity: 0,
      totalReturn: Math.round(cumulativeCashFlow),
    });
  }
  
  return projections;
}

// SA-specific risk assessment
function assessSARisks(saInputs: SAStrategyInputs, monthlyCashFlow: number): RiskItem[] {
  const risks: RiskItem[] = [];
  const breakEven = calculateSABreakEvenOccupancy(saInputs);
  
  if (breakEven < 50) {
    risks.push({ level: 'low', description: `Break-even at ${breakEven}% occupancy — strong margins` });
  } else if (breakEven < 65) {
    risks.push({ level: 'medium', description: `Break-even at ${breakEven}% occupancy — moderate buffer` });
  } else {
    risks.push({ level: 'high', description: `Break-even at ${breakEven}% occupancy — tight margins, seasonal dips could cause losses` });
  }
  
  if (saInputs.propertyStrategy === 'r2sa') {
    risks.push({ level: 'medium', description: 'R2SA: landlord could end lease — ensure contract terms protect you' });
    if (saInputs.monthlyLeaseCost > 0 && monthlyCashFlow < saInputs.monthlyLeaseCost * 0.3) {
      risks.push({ level: 'high', description: 'Monthly profit is less than 30% of lease cost — low margin for error' });
    }
  }
  
  if (saInputs.guestType === 'tourists') {
    risks.push({ level: 'medium', description: 'Tourist demand is seasonal — occupancy may drop 20-30% in low season' });
  }
  
  if (saInputs.platformMix?.length === 1) {
    risks.push({ level: 'medium', description: 'Single platform dependency — diversify to reduce risk' });
  }
  
  if (saInputs.occupancyPercent > 85) {
    risks.push({ level: 'medium', description: 'Target occupancy above 85% is ambitious — allow buffer for reality' });
  }
  
  risks.push({ level: 'low', description: 'SA offers flexible exit — walk away from lease with notice period' });
  
  return risks;
}

function assessRisks(
  grossYield: number,
  netYield: number,
  financials: FinancialsInput,
  strategy: StrategyInput
): RiskItem[] {
  const risks: RiskItem[] = [];
  
  if (grossYield >= 6) {
    risks.push({ level: 'low', description: 'Strong rental demand indicated by yield' });
  }
  
  if (financials.ltv <= 75) {
    risks.push({ level: 'low', description: 'Conservative LTV provides equity buffer' });
  }
  
  risks.push({
    level: 'medium',
    description: 'Interest rate sensitivity: +2% rates reduces cash flow significantly',
  });
  
  risks.push({
    level: 'medium',
    description: 'Void risk: Average 2-4 weeks/year between tenants',
  });
  
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
  if (strategy.strategy === 'sa') {
    const saInputs = strategy.inputs as SAStrategyInputs;
    const baseRate = saInputs.nightlyRate || 100;
    return [
      { address: `SA listing near ${postcode || 'XX1'}`, price: Math.round(baseRate * 0.95), status: 'Active', beds: 2 },
      { address: `SA listing near ${postcode || 'XX1'}`, price: Math.round(baseRate * 1.05), status: 'Active', beds: 3 },
      { address: `SA listing near ${postcode || 'XX1'}`, price: Math.round(baseRate * 0.90), status: 'Active', beds: 2 },
    ];
  }
  
  const btlInputs = strategy.inputs as BTLStrategyInputs;
  const baseRent = btlInputs.monthlyRent || 900;
  
  return [
    { address: `22 ${postcode || 'XX1'} Street`, price: Math.round(baseRent * 0.99), status: 'Available', beds: 3 },
    { address: `5 Nearby Road`, price: Math.round(baseRent * 0.95), status: 'Let Agreed', beds: 3 },
    { address: `31 Area Avenue`, price: Math.round(baseRent * 1.03), status: 'Available', beds: 3 },
  ];
}

function calculateTaxImplications(
  annualIncome: number,
  annualMortgageInterest: number,
  sdlt: number
): TaxImplications {
  const taxRate = 0.40;
  const incomeTaxOnRent = annualIncome * taxRate;
  const section24Relief = annualMortgageInterest * 0.20;
  const section24Restriction = annualMortgageInterest * (taxRate - 0.20);
  const effectiveTaxRate = annualIncome > 0 ? ((incomeTaxOnRent - section24Relief) / annualIncome) * 100 : 0;
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

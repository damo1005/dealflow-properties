// SDLT Calculation Types and Functions

export interface SDLTInput {
  purchasePrice: number;
  propertyType: 'residential' | 'non_residential' | 'mixed';
  location: 'england' | 'scotland' | 'wales';
  isFirstTimeBuyer: boolean;
  isAdditionalProperty: boolean;
  isNonUKResident: boolean;
  isCompanyPurchase: boolean;
  isHighValueCompanyPurchase: boolean;
}

export interface SDLTBand {
  band: string;
  rate: number;
  taxableAmount: number;
  tax: number;
}

export interface SDLTResult {
  totalSDLT: number;
  effectiveRate: number;
  breakdown: SDLTBand[];
  standardSDLT: number;
  additionalPropertySurcharge: number;
  nonUKResidentSurcharge: number;
  explanation: string;
}

export function calculateSDLT(input: SDLTInput): SDLTResult {
  const { 
    purchasePrice, 
    location,
    isFirstTimeBuyer, 
    isAdditionalProperty, 
    isNonUKResident,
    isCompanyPurchase,
    isHighValueCompanyPurchase 
  } = input;

  // Handle Scotland (LBTT)
  if (location === 'scotland') {
    return calculateLBTT(input);
  }

  // Handle Wales (LTT)
  if (location === 'wales') {
    return calculateLTT(input);
  }

  // Company purchase over £500k = 15% flat rate
  if (isCompanyPurchase && isHighValueCompanyPurchase && purchasePrice > 500000) {
    const totalSDLT = purchasePrice * 0.15;
    return {
      totalSDLT,
      effectiveRate: 15,
      breakdown: [{
        band: '£0+',
        rate: 15,
        taxableAmount: purchasePrice,
        tax: totalSDLT
      }],
      standardSDLT: totalSDLT,
      additionalPropertySurcharge: 0,
      nonUKResidentSurcharge: 0,
      explanation: 'Company purchase over £500,000 is subject to the 15% ATED-related rate.'
    };
  }

  // Determine rate bands
  let rateBands: Array<{ threshold: number; rate: number }>;

  if (isFirstTimeBuyer && purchasePrice <= 625000 && !isAdditionalProperty) {
    // First-Time Buyer Relief
    rateBands = [
      { threshold: 0, rate: 0 },
      { threshold: 425000, rate: 5 }
    ];
  } else if (isAdditionalProperty) {
    // Additional Property (3% surcharge built into bands)
    rateBands = [
      { threshold: 0, rate: 3 },
      { threshold: 250000, rate: 8 },
      { threshold: 925000, rate: 13 },
      { threshold: 1500000, rate: 15 }
    ];
  } else {
    // Standard residential
    rateBands = [
      { threshold: 0, rate: 0 },
      { threshold: 250000, rate: 5 },
      { threshold: 925000, rate: 10 },
      { threshold: 1500000, rate: 12 }
    ];
  }

  // Calculate band-by-band
  let standardSDLT = 0;
  const breakdown: SDLTBand[] = [];

  for (let i = 0; i < rateBands.length; i++) {
    const band = rateBands[i];
    const nextBand = rateBands[i + 1];

    const bandStart = band.threshold;
    const bandEnd = nextBand ? nextBand.threshold : Infinity;

    if (purchasePrice > bandStart) {
      const taxableInBand = Math.min(purchasePrice, bandEnd) - bandStart;
      const taxInBand = (taxableInBand * band.rate) / 100;

      standardSDLT += taxInBand;

      breakdown.push({
        band: `£${bandStart.toLocaleString()} - £${nextBand ? nextBand.threshold.toLocaleString() : 'and above'}`,
        rate: band.rate,
        taxableAmount: taxableInBand,
        tax: taxInBand
      });
    }
  }

  // Non-UK resident surcharge (2% on entire price)
  let nonUKResidentSurcharge = 0;
  if (isNonUKResident) {
    nonUKResidentSurcharge = (purchasePrice * 2) / 100;
  }

  const totalSDLT = standardSDLT + nonUKResidentSurcharge;
  const effectiveRate = purchasePrice > 0 ? (totalSDLT / purchasePrice) * 100 : 0;

  // Generate explanation
  let explanation = '';
  if (isFirstTimeBuyer && purchasePrice <= 625000) {
    explanation = 'As a first-time buyer, you pay no SDLT on the first £425,000. You only pay 5% on the portion from £425,001 to £625,000.';
  } else if (isAdditionalProperty) {
    explanation = 'You\'re buying an additional property, so you pay a 3% surcharge on all bands. This applies to second homes and buy-to-let investments.';
  } else {
    explanation = 'Standard SDLT rates apply. You pay no tax on the first £250,000 of the property value.';
  }

  if (isNonUKResident) {
    explanation += ' An additional 2% surcharge applies for non-UK residents.';
  }

  // Calculate additional property surcharge for display
  const additionalPropertySurcharge = isAdditionalProperty ? (purchasePrice * 3) / 100 : 0;

  return {
    totalSDLT,
    effectiveRate,
    breakdown,
    standardSDLT,
    additionalPropertySurcharge,
    nonUKResidentSurcharge,
    explanation
  };
}

// Scotland LBTT (Land and Buildings Transaction Tax)
function calculateLBTT(input: SDLTInput): SDLTResult {
  const { purchasePrice, isAdditionalProperty } = input;

  const rateBands = isAdditionalProperty
    ? [
        { threshold: 0, rate: 6 },      // ADS surcharge
        { threshold: 145000, rate: 8 }, // 2% + 6%
        { threshold: 250000, rate: 11 }, // 5% + 6%
        { threshold: 325000, rate: 16 }, // 10% + 6%
        { threshold: 750000, rate: 18 }  // 12% + 6%
      ]
    : [
        { threshold: 0, rate: 0 },
        { threshold: 145000, rate: 2 },
        { threshold: 250000, rate: 5 },
        { threshold: 325000, rate: 10 },
        { threshold: 750000, rate: 12 }
      ];

  let standardSDLT = 0;
  const breakdown: SDLTBand[] = [];

  for (let i = 0; i < rateBands.length; i++) {
    const band = rateBands[i];
    const nextBand = rateBands[i + 1];
    const bandStart = band.threshold;
    const bandEnd = nextBand ? nextBand.threshold : Infinity;

    if (purchasePrice > bandStart) {
      const taxableInBand = Math.min(purchasePrice, bandEnd) - bandStart;
      const taxInBand = (taxableInBand * band.rate) / 100;
      standardSDLT += taxInBand;

      breakdown.push({
        band: `£${bandStart.toLocaleString()} - £${nextBand ? nextBand.threshold.toLocaleString() : 'and above'}`,
        rate: band.rate,
        taxableAmount: taxableInBand,
        tax: taxInBand
      });
    }
  }

  const additionalPropertySurcharge = isAdditionalProperty ? (purchasePrice * 6) / 100 : 0;
  const nonUKResidentSurcharge = 0; // Scotland doesn't have this surcharge
  const totalSDLT = standardSDLT;
  const effectiveRate = purchasePrice > 0 ? (totalSDLT / purchasePrice) * 100 : 0;

  return {
    totalSDLT,
    effectiveRate,
    breakdown,
    standardSDLT,
    additionalPropertySurcharge,
    nonUKResidentSurcharge,
    explanation: isAdditionalProperty 
      ? 'Scotland applies the Additional Dwelling Supplement (ADS) of 6% on additional properties.'
      : 'Scottish LBTT rates apply. You pay no tax on the first £145,000.'
  };
}

// Wales LTT (Land Transaction Tax)
function calculateLTT(input: SDLTInput): SDLTResult {
  const { purchasePrice, isAdditionalProperty } = input;

  const rateBands = isAdditionalProperty
    ? [
        { threshold: 0, rate: 4 },       // 4% surcharge
        { threshold: 225000, rate: 10 }, // 6% + 4%
        { threshold: 400000, rate: 11.5 }, // 7.5% + 4%
        { threshold: 750000, rate: 14 },  // 10% + 4%
        { threshold: 1500000, rate: 16 }  // 12% + 4%
      ]
    : [
        { threshold: 0, rate: 0 },
        { threshold: 225000, rate: 6 },
        { threshold: 400000, rate: 7.5 },
        { threshold: 750000, rate: 10 },
        { threshold: 1500000, rate: 12 }
      ];

  let standardSDLT = 0;
  const breakdown: SDLTBand[] = [];

  for (let i = 0; i < rateBands.length; i++) {
    const band = rateBands[i];
    const nextBand = rateBands[i + 1];
    const bandStart = band.threshold;
    const bandEnd = nextBand ? nextBand.threshold : Infinity;

    if (purchasePrice > bandStart) {
      const taxableInBand = Math.min(purchasePrice, bandEnd) - bandStart;
      const taxInBand = (taxableInBand * band.rate) / 100;
      standardSDLT += taxInBand;

      breakdown.push({
        band: `£${bandStart.toLocaleString()} - £${nextBand ? nextBand.threshold.toLocaleString() : 'and above'}`,
        rate: band.rate,
        taxableAmount: taxableInBand,
        tax: taxInBand
      });
    }
  }

  const additionalPropertySurcharge = isAdditionalProperty ? (purchasePrice * 4) / 100 : 0;
  const nonUKResidentSurcharge = 0;
  const totalSDLT = standardSDLT;
  const effectiveRate = purchasePrice > 0 ? (totalSDLT / purchasePrice) * 100 : 0;

  return {
    totalSDLT,
    effectiveRate,
    breakdown,
    standardSDLT,
    additionalPropertySurcharge,
    nonUKResidentSurcharge,
    explanation: isAdditionalProperty 
      ? 'Wales applies a 4% Higher Rates surcharge on additional properties.'
      : 'Welsh LTT rates apply. You pay no tax on the first £225,000.'
  };
}

// CGT Calculation Types and Functions

export interface CGTInput {
  purchasePrice: number;
  purchaseCosts: number;
  purchaseDate: Date;
  salePrice: number;
  saleCosts: number;
  saleDate: Date;
  improvementCosts: number;
  monthsLivedIn: number;
  totalOwnershipMonths: number;
  wasMainResidence: 'never' | 'entire' | 'partial';
  annualIncome: number;
  taxBand: 'basic' | 'higher' | 'additional';
  allowanceUsed: number;
  ownershipSplit: number;
}

export interface CGTResult {
  grossGain: number;
  privateResidenceRelief: number;
  lettingsRelief: number;
  chargeableGain: number;
  annualAllowance: number;
  taxableGain: number;
  cgtDue: number;
  yourShare: number;
  effectiveRate: number;
  paymentDeadline: Date;
  reportingDeadline: Date;
  breakdown: {
    basicRatePortion: number;
    basicRateTax: number;
    higherRatePortion: number;
    higherRateTax: number;
  };
}

export function calculateCGT(input: CGTInput): CGTResult {
  const {
    purchasePrice,
    purchaseCosts,
    salePrice,
    saleCosts,
    improvementCosts,
    monthsLivedIn,
    totalOwnershipMonths,
    wasMainResidence,
    annualIncome,
    allowanceUsed,
    ownershipSplit,
    saleDate
  } = input;

  // 1. Calculate gross gain
  const grossGain = salePrice - purchasePrice - purchaseCosts - improvementCosts - saleCosts;

  // 2. Calculate Private Residence Relief (PRR)
  let privateResidenceRelief = 0;

  if (wasMainResidence === 'entire') {
    // Full relief - no CGT
    privateResidenceRelief = grossGain;
  } else if (wasMainResidence === 'partial' && monthsLivedIn > 0) {
    // Proportional relief + last 9 months exemption
    const prrMonths = monthsLivedIn + 9; // Always get last 9 months
    const prrProportion = Math.min(prrMonths / totalOwnershipMonths, 1);
    privateResidenceRelief = Math.round(grossGain * prrProportion);
  }

  // 3. Lettings Relief (abolished April 2020 for most cases)
  const lettingsRelief = 0;

  // 4. Chargeable gain
  const chargeableGain = Math.max(0, grossGain - privateResidenceRelief - lettingsRelief);

  // 5. Annual allowance (2026/27: £3,000)
  const annualAllowance = 3000;
  const availableAllowance = Math.max(0, annualAllowance - allowanceUsed);

  // 6. Taxable gain
  const taxableGain = Math.max(0, chargeableGain - availableAllowance);

  // 7. Calculate CGT - Residential property rates: 18% (basic) / 24% (higher/additional)
  const basicRateLimit = 50270; // 2026/27 estimate
  const basicRateRemaining = Math.max(0, basicRateLimit - annualIncome);

  const basicRatePortion = Math.min(taxableGain, basicRateRemaining);
  const higherRatePortion = Math.max(0, taxableGain - basicRatePortion);

  const basicRateTax = basicRatePortion * 0.18;
  const higherRateTax = higherRatePortion * 0.24;

  const cgtDue = Math.round(basicRateTax + higherRateTax);

  // 8. Apply ownership split
  const yourShare = Math.round((cgtDue * ownershipSplit) / 100);

  // 9. Effective rate
  const effectiveRate = grossGain > 0 ? (cgtDue / grossGain) * 100 : 0;

  // 10. Deadlines
  // Reporting deadline: 60 days from completion
  const reportingDeadline = new Date(saleDate);
  reportingDeadline.setDate(reportingDeadline.getDate() + 60);

  // Payment deadline: 31 January following tax year end
  const taxYearEnd = new Date(saleDate.getFullYear(), 3, 5); // 5 April
  const saleTaxYear = saleDate > taxYearEnd ? saleDate.getFullYear() : saleDate.getFullYear() - 1;
  const paymentDeadline = new Date(saleTaxYear + 2, 0, 31); // 31 January following year

  return {
    grossGain,
    privateResidenceRelief,
    lettingsRelief,
    chargeableGain,
    annualAllowance: availableAllowance,
    taxableGain,
    cgtDue,
    yourShare,
    effectiveRate,
    paymentDeadline,
    reportingDeadline,
    breakdown: {
      basicRatePortion,
      basicRateTax: Math.round(basicRateTax),
      higherRatePortion,
      higherRateTax: Math.round(higherRateTax)
    }
  };
}

// Income Tax on Rental Income Types and Functions

export interface RentalIncomeTaxInput {
  // Rental income
  annualRent: number;
  otherRentalIncome: number;
  voidMonths: number;
  
  // Expenses
  lettingAgentFees: number;
  repairsMaintenance: number;
  insurance: number;
  groundRent: number;
  utilities: number;
  councilTax: number;
  legalFees: number;
  otherCosts: number;
  
  // Mortgage
  mortgageInterest: number;
  
  // Other income
  employmentIncome: number;
  selfEmploymentIncome: number;
  dividends: number;
  otherIncome: number;
  
  // Personal
  personalAllowanceUsed: number;
  isScottish: boolean;
}

export interface RentalIncomeTaxResult {
  // Rental calculation
  grossRentalIncome: number;
  totalExpenses: number;
  rentalProfitBeforeMortgage: number;
  
  // Finance costs
  mortgageInterest: number;
  financeCostRelief: number;
  
  // Total income
  totalIncome: number;
  personalAllowance: number;
  taxableIncome: number;
  
  // Tax calculation
  basicRateTax: number;
  higherRateTax: number;
  additionalRateTax: number;
  totalIncomeTax: number;
  
  // After relief
  taxAfterRelief: number;
  taxOnRentalPortion: number;
  
  // Comparison
  preSection24Tax: number;
  section24Impact: number;
  
  effectiveRate: number;
  
  // Tax bands breakdown
  taxBands: Array<{
    name: string;
    rate: number;
    amount: number;
    tax: number;
  }>;
}

export function calculateRentalIncomeTax(input: RentalIncomeTaxInput): RentalIncomeTaxResult {
  const {
    annualRent,
    otherRentalIncome,
    voidMonths,
    lettingAgentFees,
    repairsMaintenance,
    insurance,
    groundRent,
    utilities,
    councilTax,
    legalFees,
    otherCosts,
    mortgageInterest,
    employmentIncome,
    selfEmploymentIncome,
    dividends,
    otherIncome,
    personalAllowanceUsed,
    isScottish
  } = input;

  // 1. Calculate gross rental income
  const voidAdjustment = (annualRent * voidMonths) / 12;
  const grossRentalIncome = annualRent + otherRentalIncome - voidAdjustment;

  // 2. Calculate allowable expenses (NOT including mortgage interest)
  const totalExpenses =
    lettingAgentFees +
    repairsMaintenance +
    insurance +
    groundRent +
    utilities +
    councilTax +
    legalFees +
    otherCosts;

  // 3. Rental profit (excluding mortgage interest - Section 24)
  const rentalProfitBeforeMortgage = Math.max(0, grossRentalIncome - totalExpenses);

  // 4. Calculate total income
  const otherTotalIncome = employmentIncome + selfEmploymentIncome + dividends + otherIncome;
  const totalIncome = rentalProfitBeforeMortgage + otherTotalIncome;

  // 5. Personal allowance (2026/27: £12,570)
  const fullPersonalAllowance = 12570;
  const availableAllowance = Math.max(0, fullPersonalAllowance - personalAllowanceUsed);

  // Taper if income > £100,000
  let adjustedAllowance = availableAllowance;
  if (totalIncome > 100000) {
    const taper = Math.min(availableAllowance, (totalIncome - 100000) / 2);
    adjustedAllowance = Math.max(0, availableAllowance - taper);
  }

  const taxableIncome = Math.max(0, totalIncome - adjustedAllowance);

  // 6. Calculate income tax
  const taxBands: Array<{ name: string; rate: number; amount: number; tax: number }> = [];
  let basicRateTax = 0;
  let higherRateTax = 0;
  let additionalRateTax = 0;

  if (isScottish) {
    // Scottish rates 2026/27
    const bands = [
      { name: 'Starter Rate', threshold: 0, limit: 2306, rate: 0.19 },
      { name: 'Basic Rate', threshold: 2306, limit: 13118, rate: 0.20 },
      { name: 'Intermediate Rate', threshold: 15424, limit: 31092, rate: 0.21 },
      { name: 'Higher Rate', threshold: 46516, limit: 78624, rate: 0.42 },
      { name: 'Top Rate', threshold: 125140, limit: Infinity, rate: 0.47 },
    ];

    let remainingIncome = taxableIncome;
    for (const band of bands) {
      if (remainingIncome <= 0) break;
      const bandSize = band.limit;
      const amountInBand = Math.min(remainingIncome, bandSize);
      if (amountInBand > 0) {
        const taxInBand = amountInBand * band.rate;
        taxBands.push({ name: band.name, rate: band.rate * 100, amount: amountInBand, tax: taxInBand });
        if (band.rate <= 0.21) basicRateTax += taxInBand;
        else if (band.rate <= 0.42) higherRateTax += taxInBand;
        else additionalRateTax += taxInBand;
        remainingIncome -= amountInBand;
      }
    }
  } else {
    // England, Wales, NI rates 2026/27
    const basicRateLimit = 37700;
    const higherRateLimit = 125140;

    if (taxableIncome > 0) {
      const basicPortion = Math.min(taxableIncome, basicRateLimit);
      basicRateTax = basicPortion * 0.20;
      taxBands.push({ name: 'Basic Rate', rate: 20, amount: basicPortion, tax: basicRateTax });
    }

    if (taxableIncome > basicRateLimit) {
      const higherPortion = Math.min(taxableIncome - basicRateLimit, higherRateLimit - basicRateLimit);
      higherRateTax = higherPortion * 0.40;
      taxBands.push({ name: 'Higher Rate', rate: 40, amount: higherPortion, tax: higherRateTax });
    }

    if (taxableIncome > higherRateLimit) {
      const additionalPortion = taxableIncome - higherRateLimit;
      additionalRateTax = additionalPortion * 0.45;
      taxBands.push({ name: 'Additional Rate', rate: 45, amount: additionalPortion, tax: additionalRateTax });
    }
  }

  const totalIncomeTax = basicRateTax + higherRateTax + additionalRateTax;

  // 7. Finance cost tax reduction (20% of mortgage interest)
  const financeCostRelief = mortgageInterest * 0.20;
  const taxAfterRelief = Math.max(0, totalIncomeTax - financeCostRelief);

  // 8. Tax attributable to rental income (proportional)
  const rentalProportion = totalIncome > 0 ? rentalProfitBeforeMortgage / totalIncome : 0;
  const taxOnRentalPortion = Math.round(taxAfterRelief * rentalProportion);

  // 9. Pre-Section 24 comparison
  const preSection24Profit = rentalProfitBeforeMortgage - mortgageInterest;
  const preSection24TotalIncome = Math.max(0, preSection24Profit) + otherTotalIncome;
  const preSection24TaxableIncome = Math.max(0, preSection24TotalIncome - adjustedAllowance);

  let preSection24FullTax = 0;
  if (preSection24TaxableIncome > 0) {
    const basicPortion = Math.min(preSection24TaxableIncome, 37700);
    preSection24FullTax = basicPortion * 0.20;
    if (preSection24TaxableIncome > 37700) {
      const higherPortion = Math.min(preSection24TaxableIncome - 37700, 125140 - 37700);
      preSection24FullTax += higherPortion * 0.40;
    }
    if (preSection24TaxableIncome > 125140) {
      preSection24FullTax += (preSection24TaxableIncome - 125140) * 0.45;
    }
  }

  const preSection24RentalProportion = preSection24TotalIncome > 0 ? Math.max(0, preSection24Profit) / preSection24TotalIncome : 0;
  const preSection24Tax = Math.round(preSection24FullTax * preSection24RentalProportion);
  const section24Impact = taxOnRentalPortion - preSection24Tax;

  // 10. Effective rate
  const effectiveRate = rentalProfitBeforeMortgage > 0 ? (taxOnRentalPortion / rentalProfitBeforeMortgage) * 100 : 0;

  return {
    grossRentalIncome,
    totalExpenses,
    rentalProfitBeforeMortgage,
    mortgageInterest,
    financeCostRelief: Math.round(financeCostRelief),
    totalIncome,
    personalAllowance: adjustedAllowance,
    taxableIncome,
    basicRateTax: Math.round(basicRateTax),
    higherRateTax: Math.round(higherRateTax),
    additionalRateTax: Math.round(additionalRateTax),
    totalIncomeTax: Math.round(totalIncomeTax),
    taxAfterRelief: Math.round(taxAfterRelief),
    taxOnRentalPortion,
    preSection24Tax,
    section24Impact,
    effectiveRate,
    taxBands
  };
}

// Section 24 Impact Calculator

export interface Section24Input {
  annualRent: number;
  allowableExpenses: number;
  mortgageInterest: number;
  otherIncome: number;
  taxBand: 'basic' | 'higher' | 'additional';
  numberOfProperties: number;
}

export interface Section24Result {
  // Pre-2017
  preSection24Profit: number;
  preSection24Tax: number;
  
  // Post-2020
  postSection24Profit: number;
  postSection24TaxBeforeCredit: number;
  financeCostCredit: number;
  postSection24Tax: number;
  
  // Impact
  extraTaxPerYear: number;
  extraTax10Years: number;
  extraTax25Years: number;
  
  // Cash position
  actualCashProfit: number;
  taxAsPercentOfCash: number;
  
  // Percentages
  effectiveRateOld: number;
  effectiveRateNew: number;
  
  // Warnings
  isLossmaking: boolean;
  warningMessage?: string;
  
  // Year-by-year transition
  transitionYears: Array<{
    year: string;
    deductiblePercent: number;
    creditPercent: number;
    tax: number;
  }>;
}

export function calculateSection24Impact(input: Section24Input): Section24Result {
  const {
    annualRent,
    allowableExpenses,
    mortgageInterest,
    taxBand
  } = input;

  // Tax rates
  const taxRate = taxBand === 'basic' ? 0.20 : taxBand === 'higher' ? 0.40 : 0.45;

  // PRE-2017: Mortgage fully deductible
  const preSection24Profit = annualRent - allowableExpenses - mortgageInterest;
  const preSection24Tax = Math.max(0, preSection24Profit * taxRate);

  // POST-2020: Mortgage not deductible, but 20% credit
  const postSection24Profit = annualRent - allowableExpenses;
  const postSection24TaxBeforeCredit = postSection24Profit * taxRate;
  const financeCostCredit = mortgageInterest * 0.20;
  const postSection24Tax = Math.max(0, postSection24TaxBeforeCredit - financeCostCredit);

  // Impact
  const extraTaxPerYear = Math.round(postSection24Tax - preSection24Tax);
  const extraTax10Years = extraTaxPerYear * 10;
  const extraTax25Years = extraTaxPerYear * 25;

  // Cash position
  const actualCashProfit = annualRent - allowableExpenses - mortgageInterest;
  const taxAsPercentOfCash = actualCashProfit > 0 ? (postSection24Tax / actualCashProfit) * 100 : 0;

  // Effective rates
  const effectiveRateOld = preSection24Profit > 0 ? (preSection24Tax / preSection24Profit) * 100 : 0;
  const effectiveRateNew = postSection24Profit > 0 ? (postSection24Tax / postSection24Profit) * 100 : 0;

  // Check if loss-making
  const isLossmaking = actualCashProfit < postSection24Tax;

  let warningMessage: string | undefined;
  if (isLossmaking) {
    warningMessage = '⚠️ WARNING: Your tax bill exceeds your actual cash profit! You\'re effectively running at a loss.';
  } else if (actualCashProfit > 0 && postSection24Tax > actualCashProfit * 0.5) {
    warningMessage = '⚠️ Section 24 is taking more than 50% of your cash profit. Consider restructuring.';
  }

  // Year-by-year transition
  const transitionYears = [
    { year: '2016/17', deductiblePercent: 100, creditPercent: 0, tax: Math.round(preSection24Tax) },
    { year: '2017/18', deductiblePercent: 75, creditPercent: 25, tax: 0 },
    { year: '2018/19', deductiblePercent: 50, creditPercent: 50, tax: 0 },
    { year: '2019/20', deductiblePercent: 25, creditPercent: 75, tax: 0 },
    { year: '2020/21+', deductiblePercent: 0, creditPercent: 100, tax: Math.round(postSection24Tax) },
  ];

  // Calculate transition years tax
  for (let i = 1; i < 4; i++) {
    const year = transitionYears[i];
    const deductiblePortion = mortgageInterest * (year.deductiblePercent / 100);
    const creditPortion = mortgageInterest * (year.creditPercent / 100);
    const profit = annualRent - allowableExpenses - deductiblePortion;
    const taxBeforeCredit = profit * taxRate;
    const credit = creditPortion * 0.20;
    year.tax = Math.round(Math.max(0, taxBeforeCredit - credit));
  }

  return {
    preSection24Profit: Math.round(preSection24Profit),
    preSection24Tax: Math.round(preSection24Tax),
    postSection24Profit: Math.round(postSection24Profit),
    postSection24TaxBeforeCredit: Math.round(postSection24TaxBeforeCredit),
    financeCostCredit: Math.round(financeCostCredit),
    postSection24Tax: Math.round(postSection24Tax),
    extraTaxPerYear,
    extraTax10Years,
    extraTax25Years,
    actualCashProfit: Math.round(actualCashProfit),
    taxAsPercentOfCash: Math.round(taxAsPercentOfCash),
    effectiveRateOld: Math.round(effectiveRateOld * 10) / 10,
    effectiveRateNew: Math.round(effectiveRateNew * 10) / 10,
    isLossmaking,
    warningMessage,
    transitionYears
  };
}

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

import type { ComparisonProperty, ComparisonRow, HighlightType } from "@/types/comparison";
import { formatCurrency } from "@/services/propertyDataApi";

export function getHighlight(
  values: (number | null | undefined)[],
  currentValue: number | null | undefined,
  higherIsBetter: boolean = true
): HighlightType {
  const numericValues = values.filter((v): v is number => v != null && !isNaN(v));
  
  if (numericValues.length < 2 || currentValue == null) return "neutral";
  
  const sortedValues = [...numericValues].sort((a, b) => 
    higherIsBetter ? b - a : a - b
  );
  
  const best = sortedValues[0];
  const secondBest = sortedValues[1];
  const worst = sortedValues[sortedValues.length - 1];
  
  if (currentValue === best) return "best";
  if (currentValue === secondBest && numericValues.length > 2) return "second-best";
  if (currentValue === worst && best !== worst) return "worst";
  return "neutral";
}

export function getHighlightClasses(highlight: HighlightType): string {
  switch (highlight) {
    case "best":
      return "bg-green-50 dark:bg-green-950/50 border-l-4 border-l-green-500";
    case "second-best":
      return "bg-green-50/50 dark:bg-green-950/25";
    case "worst":
      return "bg-red-50 dark:bg-red-950/50 border-l-4 border-l-red-500";
    default:
      return "";
  }
}

export function formatValue(value: unknown, format?: (v: unknown) => string): string {
  if (value == null || value === "") return "-";
  if (format) return format(value);
  if (typeof value === "number") {
    return value.toLocaleString("en-GB");
  }
  return String(value);
}

export const comparisonRows: ComparisonRow[] = [
  // Financial Metrics
  {
    key: "price",
    label: "Asking Price",
    category: "financial",
    getValue: (p) => p.price,
    format: (v) => formatCurrency(v as number),
    higherIsBetter: false,
  },
  {
    key: "estimatedValue",
    label: "Estimated Value",
    category: "financial",
    getValue: (p) => p.estimatedValue,
    format: (v) => formatCurrency(v as number),
    higherIsBetter: true,
  },
  {
    key: "priceGap",
    label: "Price vs Value Gap",
    category: "financial",
    getValue: (p) => (p.estimatedValue && p.price) ? p.estimatedValue - p.price : null,
    format: (v) => {
      const val = v as number;
      if (val > 0) return `${formatCurrency(val)} below market`;
      if (val < 0) return `${formatCurrency(Math.abs(val))} above market`;
      return "At market value";
    },
    higherIsBetter: true,
  },
  {
    key: "estimatedRent",
    label: "Monthly Rental Income",
    category: "financial",
    getValue: (p) => p.estimatedRent,
    format: (v) => formatCurrency(v as number) + "/mo",
    higherIsBetter: true,
  },
  {
    key: "calculatedYield",
    label: "Gross Yield %",
    category: "financial",
    getValue: (p) => p.calculatedYield,
    format: (v) => `${(v as number).toFixed(2)}%`,
    higherIsBetter: true,
  },
  {
    key: "calculatedCashFlow",
    label: "Monthly Cash Flow",
    category: "financial",
    getValue: (p) => p.calculatedCashFlow,
    format: (v) => formatCurrency(v as number) + "/mo",
    higherIsBetter: true,
  },
  {
    key: "calculatedROI",
    label: "ROI %",
    category: "financial",
    getValue: (p) => p.calculatedROI,
    format: (v) => `${(v as number).toFixed(2)}%`,
    higherIsBetter: true,
  },
  {
    key: "totalCashRequired",
    label: "Total Cash Required",
    category: "financial",
    getValue: (p) => p.totalCashRequired,
    format: (v) => formatCurrency(v as number),
    higherIsBetter: false,
  },
  
  // Property Details
  {
    key: "bedrooms",
    label: "Bedrooms",
    category: "property",
    getValue: (p) => p.bedrooms,
    higherIsBetter: true,
  },
  {
    key: "bathrooms",
    label: "Bathrooms",
    category: "property",
    getValue: (p) => p.bathrooms,
    higherIsBetter: true,
  },
  {
    key: "propertyType",
    label: "Property Type",
    category: "property",
    getValue: (p) => p.propertyType || "-",
  },
  {
    key: "tenure",
    label: "Tenure",
    category: "property",
    getValue: (p) => p.tenure || "-",
  },
  {
    key: "sqft",
    label: "Square Footage",
    category: "property",
    getValue: (p) => p.sqft,
    format: (v) => `${(v as number).toLocaleString()} sqft`,
    higherIsBetter: true,
  },
  {
    key: "pricePerSqft",
    label: "Price per sqft",
    category: "property",
    getValue: (p) => (p.price && p.sqft) ? Math.round(p.price / p.sqft) : null,
    format: (v) => formatCurrency(v as number),
    higherIsBetter: false,
  },
  {
    key: "epcRating",
    label: "EPC Rating",
    category: "property",
    getValue: (p) => p.epcRating || "-",
  },
  {
    key: "councilTaxBand",
    label: "Council Tax Band",
    category: "property",
    getValue: (p) => p.councilTaxBand || "-",
  },
  
  // Location
  {
    key: "postcode",
    label: "Postcode Area",
    category: "location",
    getValue: (p) => p.postcode || "-",
  },
  
  // Investment Metrics
  {
    key: "daysOnMarket",
    label: "Days on Market",
    category: "investment",
    getValue: (p) => p.daysOnMarket,
    format: (v) => `${v} days`,
    higherIsBetter: true, // More days = more negotiating power
  },
  {
    key: "priceReduced",
    label: "Price Reduced",
    category: "investment",
    getValue: (p) => p.priceReduced ? "Yes" : "No",
  },
  {
    key: "priceReduction",
    label: "Reduction Amount",
    category: "investment",
    getValue: (p) => (p.originalPrice && p.price) ? p.originalPrice - p.price : null,
    format: (v) => formatCurrency(v as number),
    higherIsBetter: true,
  },
];

export function getRowsByCategory(
  category: "all" | "financial" | "property" | "location" | "investment"
): ComparisonRow[] {
  if (category === "all") return comparisonRows;
  return comparisonRows.filter((row) => row.category === category);
}

export function calculateWinnerScores(properties: ComparisonProperty[]): Record<string, number> {
  const scores: Record<string, number> = {};
  
  properties.forEach((p) => {
    scores[p.id] = 0;
  });
  
  const scoringRows = [
    { key: "calculatedCashFlow", points: 5 },
    { key: "calculatedYield", points: 4 },
    { key: "calculatedROI", points: 4 },
    { key: "priceGap", points: 3 },
    { key: "totalCashRequired", points: 2 },
  ];
  
  scoringRows.forEach(({ key, points }) => {
    const row = comparisonRows.find((r) => r.key === key);
    if (!row) return;
    
    const values = properties.map((p) => {
      const val = row.getValue(p);
      return typeof val === "number" ? val : null;
    });
    
    properties.forEach((p, idx) => {
      const highlight = getHighlight(values, values[idx], row.higherIsBetter !== false);
      if (highlight === "best") scores[p.id] += points;
      if (highlight === "second-best") scores[p.id] += Math.floor(points / 2);
    });
  });
  
  return scores;
}

export function getPropertyBadges(
  property: ComparisonProperty,
  allProperties: ComparisonProperty[]
): string[] {
  const badges: string[] = [];
  
  const checkBest = (getValue: (p: ComparisonProperty) => number | null | undefined, label: string, higherIsBetter = true) => {
    const values = allProperties.map(getValue);
    const currentValue = getValue(property);
    if (getHighlight(values, currentValue, higherIsBetter) === "best") {
      badges.push(label);
    }
  };
  
  checkBest((p) => p.calculatedCashFlow, "Best Cash Flow");
  checkBest((p) => p.calculatedYield, "Highest Yield");
  checkBest((p) => p.calculatedROI, "Best ROI");
  checkBest((p) => p.totalCashRequired, "Lowest Entry Cost", false);
  checkBest((p) => (p.estimatedValue && p.price) ? p.estimatedValue - p.price : null, "Best Value");
  
  return badges;
}

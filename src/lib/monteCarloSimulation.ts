import type { BTLInputs } from "@/stores/calculatorStore";
import { calculateBTLResults } from "@/stores/calculatorStore";

export interface VariableRange {
  min: number;
  max: number;
  mostLikely: number;
  distribution: "normal" | "uniform" | "triangular";
}

export interface SimulationConfig {
  iterations: number;
  ranges: {
    mortgageRate: VariableRange;
    monthlyRent: VariableRange;
    voidPercent: VariableRange;
    maintenancePercent: VariableRange;
  };
}

export interface SimulationResult {
  cashFlows: number[];
  yields: number[];
  rois: number[];
  iterations: SimulationIteration[];
}

export interface SimulationIteration {
  inputs: Partial<BTLInputs>;
  cashFlow: number;
  yield: number;
  roi: number;
}

export interface SimulationStats {
  cashFlow: MetricStats;
  yield: MetricStats;
  roi: MetricStats;
}

export interface MetricStats {
  mean: number;
  median: number;
  mode: number;
  stdDev: number;
  min: number;
  max: number;
  percentile10: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
}

// Statistical helper functions
function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mode(arr: number[]): number {
  const bins = 20;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max === min) return min;
  const binWidth = (max - min) / bins;

  const histogram = new Array(bins).fill(0);
  arr.forEach((val) => {
    const bin = Math.min(Math.floor((val - min) / binWidth), bins - 1);
    histogram[bin]++;
  });

  const maxBin = histogram.indexOf(Math.max(...histogram));
  return min + (maxBin + 0.5) * binWidth;
}

function stdDev(arr: number[]): number {
  const avg = mean(arr);
  const squareDiffs = arr.map((val) => Math.pow(val - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// Distribution functions
function normalDistribution(mean: number, stdDev: number): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z0;
}

function uniformDistribution(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function triangularDistribution(min: number, max: number, mode: number): number {
  const u = Math.random();
  const f = (mode - min) / (max - min);

  if (u < f) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

function generateRandomValue(range: VariableRange): number {
  switch (range.distribution) {
    case "normal":
      // StdDev is roughly (max-min)/6 for 99.7% of values within range
      const stdDev = (range.max - range.min) / 6;
      let value = normalDistribution(range.mostLikely, stdDev);
      // Clamp to range
      return Math.max(range.min, Math.min(range.max, value));
    case "uniform":
      return uniformDistribution(range.min, range.max);
    case "triangular":
      return triangularDistribution(range.min, range.max, range.mostLikely);
    default:
      return range.mostLikely;
  }
}

function calculateMetricStats(values: number[]): MetricStats {
  return {
    mean: mean(values),
    median: median(values),
    mode: mode(values),
    stdDev: stdDev(values),
    min: Math.min(...values),
    max: Math.max(...values),
    percentile10: percentile(values, 10),
    percentile25: percentile(values, 25),
    percentile75: percentile(values, 75),
    percentile90: percentile(values, 90),
  };
}

export function runSimulation(
  baseInputs: BTLInputs,
  config: SimulationConfig,
  onProgress?: (current: number, total: number) => void
): { results: SimulationResult; stats: SimulationStats } {
  const results: SimulationResult = {
    cashFlows: [],
    yields: [],
    rois: [],
    iterations: [],
  };

  for (let i = 0; i < config.iterations; i++) {
    // Generate random scenario
    const scenarioInputs: BTLInputs = {
      ...baseInputs,
      mortgageRate: generateRandomValue(config.ranges.mortgageRate),
      monthlyRent: generateRandomValue(config.ranges.monthlyRent),
      voidPercent: generateRandomValue(config.ranges.voidPercent),
      maintenancePercent: generateRandomValue(config.ranges.maintenancePercent),
    };

    // Calculate metrics
    const calcResults = calculateBTLResults(scenarioInputs);

    results.cashFlows.push(calcResults.monthlyCashFlow);
    results.yields.push(calcResults.netYield);
    results.rois.push(calcResults.roi);
    results.iterations.push({
      inputs: {
        mortgageRate: scenarioInputs.mortgageRate,
        monthlyRent: scenarioInputs.monthlyRent,
        voidPercent: scenarioInputs.voidPercent,
        maintenancePercent: scenarioInputs.maintenancePercent,
      },
      cashFlow: calcResults.monthlyCashFlow,
      yield: calcResults.netYield,
      roi: calcResults.roi,
    });

    // Progress update every 50 iterations
    if (onProgress && i % 50 === 0) {
      onProgress(i, config.iterations);
    }
  }

  const stats: SimulationStats = {
    cashFlow: calculateMetricStats(results.cashFlows),
    yield: calculateMetricStats(results.yields),
    roi: calculateMetricStats(results.rois),
  };

  return { results, stats };
}

export function getDefaultRanges(baseInputs: BTLInputs): SimulationConfig["ranges"] {
  return {
    mortgageRate: {
      min: Math.max(2, baseInputs.mortgageRate - 2),
      max: baseInputs.mortgageRate + 3,
      mostLikely: baseInputs.mortgageRate,
      distribution: "normal",
    },
    monthlyRent: {
      min: baseInputs.monthlyRent * 0.85,
      max: baseInputs.monthlyRent * 1.15,
      mostLikely: baseInputs.monthlyRent,
      distribution: "normal",
    },
    voidPercent: {
      min: 2,
      max: 15,
      mostLikely: baseInputs.voidPercent,
      distribution: "triangular",
    },
    maintenancePercent: {
      min: 5,
      max: 15,
      mostLikely: baseInputs.maintenancePercent,
      distribution: "normal",
    },
  };
}

export function calculateProbabilities(
  cashFlows: number[],
  thresholds: number[]
): Record<number, number> {
  const result: Record<number, number> = {};
  const total = cashFlows.length;

  thresholds.forEach((threshold) => {
    const count = cashFlows.filter((cf) => cf >= threshold).length;
    result[threshold] = (count / total) * 100;
  });

  return result;
}

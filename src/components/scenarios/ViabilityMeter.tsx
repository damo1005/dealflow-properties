import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ScenarioMetrics } from "@/types/scenario";
import type { BTLInputs } from "@/stores/calculatorStore";

interface ViabilityMeterProps {
  metrics: ScenarioMetrics;
  baseMetrics: ScenarioMetrics;
  inputs: BTLInputs;
}

export function calculateViability(metrics: ScenarioMetrics): number {
  let score = 0;

  // Cash flow (40 pts)
  if (metrics.monthlyCashFlow > 300) score += 40;
  else if (metrics.monthlyCashFlow > 200) score += 35;
  else if (metrics.monthlyCashFlow > 100) score += 28;
  else if (metrics.monthlyCashFlow > 0) score += 20;
  else if (metrics.monthlyCashFlow > -100) score += 10;
  else score += 0;

  // Yield (30 pts)
  if (metrics.netYield > 10) score += 30;
  else if (metrics.netYield > 8) score += 25;
  else if (metrics.netYield > 7) score += 20;
  else if (metrics.netYield > 6) score += 15;
  else if (metrics.netYield > 5) score += 10;
  else score += 5;

  // ROI (30 pts)
  if (metrics.roi > 20) score += 30;
  else if (metrics.roi > 15) score += 25;
  else if (metrics.roi > 12) score += 20;
  else if (metrics.roi > 10) score += 15;
  else if (metrics.roi > 8) score += 10;
  else score += 5;

  return Math.min(score, 100);
}

function getViabilityLabel(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 86) return { label: "Excellent", color: "text-green-700", bgColor: "bg-green-500" };
  if (score >= 76) return { label: "Good Deal", color: "text-green-600", bgColor: "bg-green-400" };
  if (score >= 61) return { label: "Acceptable", color: "text-yellow-600", bgColor: "bg-yellow-400" };
  if (score >= 41) return { label: "Risky", color: "text-orange-600", bgColor: "bg-orange-400" };
  return { label: "Avoid", color: "text-red-600", bgColor: "bg-red-500" };
}

export function ViabilityMeter({ metrics, baseMetrics }: ViabilityMeterProps) {
  const currentScore = calculateViability(metrics);
  const baseScore = calculateViability(baseMetrics);
  const diff = currentScore - baseScore;
  const { label, color, bgColor } = getViabilityLabel(currentScore);

  // Create gradient zones
  const zones = [
    { min: 0, max: 40, color: "bg-red-500", label: "Avoid" },
    { min: 40, max: 60, color: "bg-orange-400", label: "Risky" },
    { min: 60, max: 75, color: "bg-yellow-400", label: "Acceptable" },
    { min: 75, max: 85, color: "bg-green-400", label: "Good" },
    { min: 85, max: 100, color: "bg-green-600", label: "Excellent" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Deal Viability Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("text-4xl font-bold tabular-nums", color)}>
              {currentScore}
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <div className="text-right">
            <span className={cn("text-lg font-semibold", color)}>{label}</span>
            {diff !== 0 && (
              <p className={cn(
                "text-sm",
                diff > 0 ? "text-green-600" : "text-red-600"
              )}>
                {diff > 0 ? "+" : ""}{diff} from base
              </p>
            )}
          </div>
        </div>

        {/* Meter visualization */}
        <div className="relative h-8 rounded-full overflow-hidden">
          {/* Zone backgrounds */}
          <div className="absolute inset-0 flex">
            {zones.map((zone, i) => (
              <div
                key={i}
                className={cn(zone.color, "h-full")}
                style={{ width: `${zone.max - zone.min}%` }}
              />
            ))}
          </div>

          {/* Base pointer */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-muted-foreground/50 transition-all"
            style={{ left: `${baseScore}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
              Base
            </div>
          </div>

          {/* Current pointer */}
          <div
            className="absolute top-0 bottom-0 w-2 bg-foreground rounded transition-all shadow-lg"
            style={{ left: `calc(${currentScore}% - 4px)` }}
          >
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-bold whitespace-nowrap">
              {currentScore}
            </div>
          </div>
        </div>

        {/* Zone labels */}
        <div className="flex text-xs text-muted-foreground pt-4">
          <span className="w-[40%]">Avoid</span>
          <span className="w-[20%] text-center">Risky</span>
          <span className="w-[15%] text-center">OK</span>
          <span className="w-[10%] text-center">Good</span>
          <span className="w-[15%] text-right">Excellent</span>
        </div>

        {/* Scoring breakdown */}
        <div className="pt-4 border-t space-y-2 text-sm">
          <p className="text-muted-foreground">Score breakdown:</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">Cash Flow</p>
              <p className="font-semibold">{Math.min(40, metrics.monthlyCashFlow > 0 ? Math.round((metrics.monthlyCashFlow / 300) * 40) : 0)}/40</p>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">Yield</p>
              <p className="font-semibold">{Math.min(30, Math.round((metrics.netYield / 10) * 30))}/30</p>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">ROI</p>
              <p className="font-semibold">{Math.min(30, Math.round((metrics.roi / 20) * 30))}/30</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

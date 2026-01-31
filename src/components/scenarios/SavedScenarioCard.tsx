import { ArrowUp, ArrowDown, Play, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/scenarioConfig";
import type { ScenarioVariation, ScenarioMetrics } from "@/types/scenario";

interface SavedScenarioCardProps {
  variation: ScenarioVariation;
  baseMetrics: ScenarioMetrics;
  onLoad: () => void;
  onDelete: () => void;
}

export function SavedScenarioCard({
  variation,
  baseMetrics,
  onLoad,
  onDelete,
}: SavedScenarioCardProps) {
  const { metrics, changes, name } = variation;
  
  const cashFlowDiff = metrics.monthlyCashFlow - baseMetrics.monthlyCashFlow;
  const yieldDiff = metrics.netYield - baseMetrics.netYield;
  const roiDiff = metrics.roi - baseMetrics.roi;

  const changedKeys = Object.keys(changes);

  return (
    <Card className="group">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">
              {changedKeys.length} variable{changedKeys.length !== 1 ? "s" : ""} changed
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLoad}>
              <Play className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive" 
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Changed variables */}
        <div className="flex flex-wrap gap-1">
          {changedKeys.slice(0, 3).map((key) => (
            <Badge key={key} variant="secondary" className="text-xs">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Badge>
          ))}
          {changedKeys.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{changedKeys.length - 3} more
            </Badge>
          )}
        </div>

        {/* Metrics comparison */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <MetricDiff 
            label="Cash Flow" 
            diff={cashFlowDiff} 
            unit="currency" 
          />
          <MetricDiff 
            label="Yield" 
            diff={yieldDiff} 
            unit="percent" 
          />
          <MetricDiff 
            label="ROI" 
            diff={roiDiff} 
            unit="percent" 
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricDiff({ 
  label, 
  diff, 
  unit 
}: { 
  label: string; 
  diff: number; 
  unit: "currency" | "percent";
}) {
  const isPositive = diff > 0;
  const isNegative = diff < 0;
  const formattedDiff = unit === "currency" 
    ? formatCurrency(Math.abs(diff))
    : `${Math.abs(diff).toFixed(1)}%`;

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className={cn(
        "flex items-center justify-center gap-0.5 font-medium",
        isPositive && "text-green-600",
        isNegative && "text-red-600"
      )}>
        {isPositive && <ArrowUp className="h-3 w-3" />}
        {isNegative && <ArrowDown className="h-3 w-3" />}
        {diff === 0 ? "-" : formattedDiff}
      </div>
    </div>
  );
}

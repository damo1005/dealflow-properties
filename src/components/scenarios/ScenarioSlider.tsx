import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/scenarioConfig";

interface ScenarioSliderProps {
  label: string;
  description: string;
  value: number;
  baseValue: number;
  min: number;
  max: number;
  step: number;
  unit: "currency" | "percent" | "years" | "months" | "number";
  onChange: (value: number) => void;
  showBaseMarker?: boolean;
}

export function ScenarioSlider({
  label,
  description,
  value,
  baseValue,
  min,
  max,
  step,
  unit,
  onChange,
  showBaseMarker = true,
}: ScenarioSliderProps) {
  const diff = value - baseValue;
  const hasChanged = Math.abs(diff) > 0.01;

  const formattedValue = useMemo(() => {
    switch (unit) {
      case "currency":
        return formatCurrency(value);
      case "percent":
        return formatPercent(value);
      case "years":
        return `${value} years`;
      case "months":
        return `${value} months`;
      default:
        return value.toString();
    }
  }, [value, unit]);

  const formattedDiff = useMemo(() => {
    if (!hasChanged) return null;
    const prefix = diff > 0 ? "+" : "";
    switch (unit) {
      case "currency":
        return `${prefix}${formatCurrency(diff)}`;
      case "percent":
        return `${prefix}${diff.toFixed(2)}%`;
      case "years":
        return `${prefix}${diff} years`;
      default:
        return `${prefix}${diff}`;
    }
  }, [diff, hasChanged, unit]);

  // Calculate base position on slider (as percentage)
  const basePosition = useMemo(() => {
    if (!showBaseMarker) return null;
    const range = max - min;
    return ((baseValue - min) / range) * 100;
  }, [baseValue, min, max, showBaseMarker]);

  return (
    <div className="space-y-3 p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-lg font-bold tabular-nums",
            hasChanged && (diff > 0 ? "text-foreground" : "text-foreground")
          )}>
            {formattedValue}
          </p>
          {formattedDiff && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-mono",
                diff > 0 ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-950" : 
                          "text-red-600 border-red-200 bg-red-50 dark:bg-red-950"
              )}
            >
              {formattedDiff}
            </Badge>
          )}
        </div>
      </div>

      <div className="relative pt-2">
        {/* Base marker */}
        {showBaseMarker && basePosition !== null && basePosition >= 0 && basePosition <= 100 && (
          <div
            className="absolute top-0 w-0.5 h-2 bg-primary/50"
            style={{ left: `calc(${basePosition}% - 1px)` }}
          />
        )}
        
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={min}
          max={max}
          step={step}
          className={cn(
            hasChanged && "slider-changed"
          )}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>
            {unit === "currency" ? formatCurrency(min) : 
             unit === "percent" ? formatPercent(min) :
             min}
          </span>
          <span>
            {unit === "currency" ? formatCurrency(max) : 
             unit === "percent" ? formatPercent(max) :
             max}
          </span>
        </div>
      </div>
    </div>
  );
}

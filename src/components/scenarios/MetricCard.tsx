import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/scenarioConfig";

interface MetricCardProps {
  label: string;
  value: number;
  baseValue: number;
  unit: "currency" | "percent";
  higherIsBetter?: boolean;
  size?: "sm" | "lg";
}

export function MetricCard({
  label,
  value,
  baseValue,
  unit,
  higherIsBetter = true,
  size = "lg",
}: MetricCardProps) {
  const diff = value - baseValue;
  const hasChanged = Math.abs(diff) > 0.01;
  const isPositive = higherIsBetter ? diff > 0 : diff < 0;
  const isNegative = higherIsBetter ? diff < 0 : diff > 0;

  const formattedValue = unit === "currency" 
    ? formatCurrency(value)
    : formatPercent(value);

  const formattedDiff = unit === "currency"
    ? formatCurrency(Math.abs(diff))
    : `${Math.abs(diff).toFixed(2)}%`;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-colors",
      hasChanged && isPositive && "ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-950/20",
      hasChanged && isNegative && "ring-2 ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
    )}>
      <CardContent className={cn("p-4", size === "sm" && "p-3")}>
        <p className={cn(
          "text-muted-foreground",
          size === "lg" ? "text-sm" : "text-xs"
        )}>
          {label}
        </p>
        
        <p className={cn(
          "font-bold tabular-nums",
          size === "lg" ? "text-2xl mt-1" : "text-lg",
          value < 0 && "text-red-600"
        )}>
          {formattedValue}
        </p>

        {hasChanged && (
          <div className={cn(
            "flex items-center gap-1 mt-1",
            size === "lg" ? "text-sm" : "text-xs"
          )}>
            {diff > 0 ? (
              <ArrowUp className={cn(
                "h-3 w-3",
                isPositive ? "text-green-600" : "text-red-600"
              )} />
            ) : diff < 0 ? (
              <ArrowDown className={cn(
                "h-3 w-3",
                isPositive ? "text-green-600" : "text-red-600"
              )} />
            ) : (
              <Minus className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={cn(
              "font-medium",
              isPositive && "text-green-600",
              isNegative && "text-red-600"
            )}>
              {formattedDiff}
            </span>
            <span className="text-muted-foreground">vs base</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

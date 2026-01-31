import { CheckCircle2, AlertCircle, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ComparisonProperty, ComparisonRow, HighlightType } from "@/types/comparison";
import {
  getHighlight,
  getHighlightClasses,
  formatValue,
} from "@/lib/comparisonUtils";
import { cn } from "@/lib/utils";

interface ComparisonTableRowProps {
  row: ComparisonRow;
  properties: ComparisonProperty[];
}

const epcColors: Record<string, string> = {
  A: "bg-green-600 text-white",
  B: "bg-green-500 text-white",
  C: "bg-yellow-400 text-black",
  D: "bg-yellow-500 text-black",
  E: "bg-orange-400 text-white",
  F: "bg-orange-500 text-white",
  G: "bg-red-500 text-white",
};

export function ComparisonTableRow({ row, properties }: ComparisonTableRowProps) {
  const values = properties.map((p) => row.getValue(p));
  const numericValues = values.map((v) => (typeof v === "number" ? v : null));

  const getIcon = (highlight: HighlightType) => {
    switch (highlight) {
      case "best":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "worst":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground opacity-30" />;
    }
  };

  // Special handling for EPC Rating
  if (row.key === "epcRating") {
    return (
      <div
        className="grid items-center border-b"
        style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}
      >
        <div className="sticky left-0 z-10 bg-background px-4 py-3 font-medium text-sm border-r">
          {row.label}
        </div>
        {properties.map((property, idx) => {
          const value = String(values[idx]);
          const rating = value.charAt(0).toUpperCase();
          const isGood = rating === "A" || rating === "B";

          return (
            <div
              key={property.id}
              className={cn(
                "px-4 py-3 flex items-center gap-2",
                isGood && "bg-green-50 dark:bg-green-950/30"
              )}
            >
              {rating && rating !== "-" ? (
                <Badge className={cn("font-bold", epcColors[rating] || "bg-muted")}>
                  {rating}
                </Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Special handling for Tenure
  if (row.key === "tenure") {
    return (
      <div
        className="grid items-center border-b"
        style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}
      >
        <div className="sticky left-0 z-10 bg-background px-4 py-3 font-medium text-sm border-r">
          {row.label}
        </div>
        {properties.map((property, idx) => {
          const value = String(values[idx]);
          const isFreehold = value.toLowerCase().includes("freehold");

          return (
            <div
              key={property.id}
              className={cn(
                "px-4 py-3 flex items-center gap-2",
                isFreehold && "bg-green-50 dark:bg-green-950/30 border-l-4 border-l-green-500"
              )}
            >
              <span className={isFreehold ? "font-medium text-green-700 dark:text-green-400" : ""}>
                {value || "-"}
              </span>
              {isFreehold && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            </div>
          );
        })}
      </div>
    );
  }

  // Regular rows with numeric comparison
  return (
    <div
      className="grid items-center border-b"
      style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}
    >
      <div className="sticky left-0 z-10 bg-background px-4 py-3 font-medium text-sm border-r">
        {row.label}
      </div>
      {properties.map((property, idx) => {
        const value = values[idx];
        const numericValue = typeof value === "number" ? value : null;
        const highlight = row.higherIsBetter !== undefined
          ? getHighlight(numericValues, numericValue, row.higherIsBetter)
          : "neutral";

        const formattedValue = formatValue(value, row.format);
        const isNegative = typeof value === "number" && value < 0;

        return (
          <div
            key={property.id}
            className={cn(
              "px-4 py-3 flex items-center justify-between gap-2",
              getHighlightClasses(highlight)
            )}
          >
            <span
              className={cn(
                "font-medium",
                isNegative && "text-red-600 dark:text-red-400",
                highlight === "best" && "text-green-700 dark:text-green-400"
              )}
            >
              {formattedValue}
            </span>
            {row.higherIsBetter !== undefined && numericValue != null && (
              getIcon(highlight)
            )}
          </div>
        );
      })}
    </div>
  );
}

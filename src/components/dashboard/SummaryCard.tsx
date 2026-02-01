import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  className,
}: SummaryCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.positive === undefined) {
      return trend.value > 0 ? "text-green-600" : trend.value < 0 ? "text-red-600" : "text-muted-foreground";
    }
    return trend.positive ? "text-green-600" : "text-red-600";
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {(subtitle || trend) && (
              <div className="flex items-center gap-2 text-sm">
                {trend && (
                  <span className={cn("flex items-center gap-0.5", getTrendColor())}>
                    {getTrendIcon()}
                    {trend.value > 0 ? "+" : ""}
                    {trend.value}%{" "}
                    {trend.label && <span className="text-muted-foreground">{trend.label}</span>}
                  </span>
                )}
                {subtitle && !trend && (
                  <span className="text-muted-foreground">{subtitle}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

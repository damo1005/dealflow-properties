import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, DollarSign, Percent, PiggyBank, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "positive" | "negative" | "neutral";
  size?: "default" | "large";
}

export function ResultCard({ title, value, subtitle, icon, trend, size = "default" }: ResultCardProps) {
  return (
    <div className={cn(
      "p-4 rounded-lg bg-muted/50",
      size === "large" && "p-6"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={cn(
            "font-bold text-foreground",
            size === "large" ? "text-3xl" : "text-xl"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            trend === "positive" && "bg-success/10 text-success",
            trend === "negative" && "bg-destructive/10 text-destructive",
            trend === "neutral" && "bg-primary/10 text-primary",
            !trend && "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface CostBreakdownChartProps {
  data: { name: string; value: number; color: string }[];
  total: number;
}

export function CostBreakdownChart({ data, total }: CostBreakdownChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-medium">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SensitivityTableProps {
  baseRent: number;
  baseRate: number;
  calculateCashFlow: (rent: number, rate: number) => number;
}

export function SensitivityTable({ baseRent, baseRate, calculateCashFlow }: SensitivityTableProps) {
  const rentVariations = [-10, -5, 0, 5, 10];
  const rateVariations = [-1, -0.5, 0, 0.5, 1];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left text-muted-foreground">Rent / Rate</th>
            {rateVariations.map((rateVar) => (
              <th key={rateVar} className="p-2 text-center text-muted-foreground">
                {rateVar >= 0 ? "+" : ""}{rateVar}%
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rentVariations.map((rentVar) => (
            <tr key={rentVar} className="border-t border-border">
              <td className="p-2 font-medium">
                {rentVar >= 0 ? "+" : ""}{rentVar}% rent
              </td>
              {rateVariations.map((rateVar) => {
                const adjustedRent = baseRent * (1 + rentVar / 100);
                const adjustedRate = baseRate + rateVar;
                const cashFlow = calculateCashFlow(adjustedRent, adjustedRate);
                return (
                  <td
                    key={rateVar}
                    className={cn(
                      "p-2 text-center font-medium",
                      cashFlow > 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {formatCurrency(cashFlow)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

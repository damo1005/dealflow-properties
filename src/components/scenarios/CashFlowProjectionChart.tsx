import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BTLInputs } from "@/stores/calculatorStore";
import { calculateBTLResults } from "@/stores/calculatorStore";
import { formatCurrency } from "@/lib/scenarioConfig";

interface CashFlowProjectionChartProps {
  inputs: BTLInputs;
  years?: number;
  rentGrowth?: number;
  expenseGrowth?: number;
}

export function CashFlowProjectionChart({
  inputs,
  years = 5,
  rentGrowth = 3,
  expenseGrowth = 2.5,
}: CashFlowProjectionChartProps) {
  const data = useMemo(() => {
    const months = years * 12;
    const results: { month: number; cashFlow: number; cumulative: number; label: string }[] = [];
    
    let cumulative = -inputs.refurbCosts; // Initial costs
    
    for (let m = 1; m <= months; m++) {
      // Apply annual growth at the start of each year
      const yearIndex = Math.floor((m - 1) / 12);
      const rentMultiplier = Math.pow(1 + rentGrowth / 100, yearIndex);
      const expenseMultiplier = Math.pow(1 + expenseGrowth / 100, yearIndex);
      
      const adjustedInputs: BTLInputs = {
        ...inputs,
        monthlyRent: inputs.monthlyRent * rentMultiplier,
        insurance: inputs.insurance * expenseMultiplier,
        maintenancePercent: inputs.maintenancePercent,
      };
      
      const monthlyResults = calculateBTLResults(adjustedInputs);
      const monthlyCashFlow = monthlyResults.monthlyCashFlow;
      cumulative += monthlyCashFlow;
      
      results.push({
        month: m,
        cashFlow: monthlyCashFlow,
        cumulative: cumulative,
        label: m % 12 === 0 ? `Year ${m / 12}` : `M${m}`,
      });
    }
    
    return results;
  }, [inputs, years, rentGrowth, expenseGrowth]);

  const breakEvenMonth = useMemo(() => {
    let cumulative = -inputs.refurbCosts;
    for (let m = 1; m <= years * 12; m++) {
      const yearIndex = Math.floor((m - 1) / 12);
      const rentMultiplier = Math.pow(1 + rentGrowth / 100, yearIndex);
      const adjustedInputs = { ...inputs, monthlyRent: inputs.monthlyRent * rentMultiplier };
      const monthlyResults = calculateBTLResults(adjustedInputs);
      cumulative += monthlyResults.monthlyCashFlow;
      if (cumulative >= 0) return m;
    }
    return null;
  }, [inputs, years, rentGrowth]);

  const finalCumulative = data[data.length - 1]?.cumulative || 0;

  // Sample data points for better performance (every 3 months)
  const sampledData = data.filter((_, i) => i % 3 === 0 || i === data.length - 1);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{years}-Year Cash Flow Projection</span>
          <span className={finalCumulative >= 0 ? "text-green-600" : "text-red-600"}>
            {formatCurrency(finalCumulative)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampledData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
                interval={Math.floor(sampledData.length / 6)}
              />
              <YAxis
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Cumulative"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
              {breakEvenMonth && (
                <ReferenceLine
                  x={sampledData.find((d) => d.month >= breakEvenMonth)?.label}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="3 3"
                  label={{ value: "Break-even", fill: "hsl(var(--primary))", fontSize: 10 }}
                />
              )}
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="hsl(var(--primary))"
                fill="url(#positiveGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
          <div className="text-center p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">Break-even</p>
            <p className="font-semibold">
              {breakEvenMonth ? `Month ${breakEvenMonth}` : "N/A"}
            </p>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">{years}-Year Total</p>
            <p className={`font-semibold ${finalCumulative >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(finalCumulative)}
            </p>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">Avg Monthly</p>
            <p className="font-semibold">
              {formatCurrency(finalCumulative / (years * 12))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

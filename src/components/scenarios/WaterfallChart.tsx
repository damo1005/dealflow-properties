import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BTLInputs } from "@/stores/calculatorStore";
import { calculateBTLResults } from "@/stores/calculatorStore";
import { formatCurrency } from "@/lib/scenarioConfig";

interface WaterfallChartProps {
  inputs: BTLInputs;
}

export function WaterfallChart({ inputs }: WaterfallChartProps) {
  const data = useMemo(() => {
    const results = calculateBTLResults(inputs);
    const monthlyRent = inputs.monthlyRent * (1 - inputs.voidPercent / 100);
    
    return [
      { 
        name: "Rent", 
        value: monthlyRent, 
        fill: "hsl(var(--primary))",
        cumulative: monthlyRent,
      },
      { 
        name: "Mortgage", 
        value: -results.monthlyMortgage, 
        fill: "hsl(var(--destructive))",
        cumulative: monthlyRent - results.monthlyMortgage,
      },
      { 
        name: "Management", 
        value: -results.costBreakdown.management / 12, 
        fill: "hsl(var(--destructive))",
        cumulative: monthlyRent - results.monthlyMortgage - results.costBreakdown.management / 12,
      },
      { 
        name: "Maintenance", 
        value: -results.costBreakdown.maintenance / 12, 
        fill: "hsl(var(--destructive))",
        cumulative: monthlyRent - results.monthlyMortgage - results.costBreakdown.management / 12 - results.costBreakdown.maintenance / 12,
      },
      { 
        name: "Insurance", 
        value: -inputs.insurance / 12, 
        fill: "hsl(var(--destructive))",
        cumulative: results.monthlyCashFlow,
      },
      { 
        name: "Net CF", 
        value: results.monthlyCashFlow, 
        fill: results.monthlyCashFlow >= 0 ? "hsl(142 76% 36%)" : "hsl(var(--destructive))",
        cumulative: results.monthlyCashFlow,
        isTotal: true,
      },
    ];
  }, [inputs]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Monthly Cash Flow Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis 
              tickFormatter={(v) => `£${v}`}
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(Math.abs(value)), value < 0 ? "Cost" : "Income"]}
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

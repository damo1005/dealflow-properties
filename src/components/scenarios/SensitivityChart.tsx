import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { BTLInputs } from "@/stores/calculatorStore";
import { calculateBTLResults } from "@/stores/calculatorStore";
import { formatCurrency } from "@/lib/scenarioConfig";

interface SensitivityChartProps {
  baseInputs: BTLInputs;
  currentInputs: BTLInputs;
}

type SensitivityType = "rate" | "rent" | "void" | "price";

function generateSensitivityData(
  inputs: BTLInputs,
  type: SensitivityType
): { label: string; base: number; current: number; xValue: number }[] {
  const data: { label: string; base: number; current: number; xValue: number }[] = [];

  const ranges: Record<SensitivityType, { key: keyof BTLInputs; min: number; max: number; step: number; format: (v: number) => string }> = {
    rate: { 
      key: "mortgageRate", 
      min: 2, 
      max: 10, 
      step: 0.5,
      format: (v) => `${v}%`,
    },
    rent: { 
      key: "monthlyRent", 
      min: inputs.monthlyRent * 0.7, 
      max: inputs.monthlyRent * 1.3, 
      step: (inputs.monthlyRent * 0.6) / 12,
      format: (v) => `£${Math.round(v)}`,
    },
    void: { 
      key: "voidPercent", 
      min: 0, 
      max: 25, 
      step: 2.5,
      format: (v) => `${v}%`,
    },
    price: { 
      key: "purchasePrice", 
      min: inputs.purchasePrice * 0.8, 
      max: inputs.purchasePrice * 1.2, 
      step: (inputs.purchasePrice * 0.4) / 8,
      format: (v) => `£${Math.round(v / 1000)}k`,
    },
  };

  const config = ranges[type];

  for (let v = config.min; v <= config.max; v += config.step) {
    const testInputs = { ...inputs, [config.key]: v };
    const results = calculateBTLResults(testInputs);
    
    data.push({
      label: config.format(v),
      xValue: v,
      base: results.monthlyCashFlow,
      current: results.monthlyCashFlow,
    });
  }

  return data;
}

export function SensitivityChart({ baseInputs, currentInputs }: SensitivityChartProps) {
  const chartData = useMemo(() => ({
    rate: generateSensitivityData(baseInputs, "rate"),
    rent: generateSensitivityData(baseInputs, "rent"),
    void: generateSensitivityData(baseInputs, "void"),
    price: generateSensitivityData(baseInputs, "price"),
  }), [baseInputs]);

  const currentMarkers = useMemo(() => ({
    rate: currentInputs.mortgageRate,
    rent: currentInputs.monthlyRent,
    void: currentInputs.voidPercent,
    price: currentInputs.purchasePrice,
  }), [currentInputs]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Sensitivity Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rate">Rate</TabsTrigger>
            <TabsTrigger value="rent">Rent</TabsTrigger>
            <TabsTrigger value="void">Void</TabsTrigger>
            <TabsTrigger value="price">Price</TabsTrigger>
          </TabsList>

          {(["rate", "rent", "void", "price"] as SensitivityType[]).map((type) => (
            <TabsContent key={type} value={type} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData[type]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tickFormatter={(v) => `£${v}`}
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), "Cash Flow"]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                  <ReferenceLine 
                    x={chartData[type].find(d => Math.abs(d.xValue - currentMarkers[type]) < 0.01)?.label}
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="base"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

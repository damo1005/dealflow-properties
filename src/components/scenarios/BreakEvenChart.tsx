import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { BTLInputs } from "@/stores/calculatorStore";
import { calculateBTLResults } from "@/stores/calculatorStore";
import { formatCurrency } from "@/lib/scenarioConfig";
import { cn } from "@/lib/utils";

interface BreakEvenChartProps {
  inputs: BTLInputs;
}

type BreakEvenType = "rent" | "occupancy" | "rate";

interface BreakEvenResult {
  current: number;
  breakEven: number;
  buffer: number;
  bufferPercent: number;
  isSafe: boolean;
}

function calculateBreakEven(inputs: BTLInputs, type: BreakEvenType): BreakEvenResult {
  const baseResults = calculateBTLResults(inputs);
  
  switch (type) {
    case "rent": {
      // Find rent where cash flow = 0
      let testRent = inputs.monthlyRent * 0.5;
      for (let r = inputs.monthlyRent * 0.5; r <= inputs.monthlyRent * 1.5; r += 10) {
        const testInputs = { ...inputs, monthlyRent: r };
        const results = calculateBTLResults(testInputs);
        if (results.monthlyCashFlow >= 0) {
          testRent = r;
          break;
        }
      }
      return {
        current: inputs.monthlyRent,
        breakEven: Math.round(testRent),
        buffer: inputs.monthlyRent - testRent,
        bufferPercent: ((inputs.monthlyRent - testRent) / inputs.monthlyRent) * 100,
        isSafe: inputs.monthlyRent > testRent,
      };
    }
    case "occupancy": {
      // Find void % where cash flow = 0
      let breakEvenVoid = inputs.voidPercent;
      for (let v = 0; v <= 50; v += 1) {
        const testInputs = { ...inputs, voidPercent: v };
        const results = calculateBTLResults(testInputs);
        if (results.monthlyCashFlow <= 0) {
          breakEvenVoid = v;
          break;
        }
      }
      const occupancy = 100 - inputs.voidPercent;
      const breakEvenOccupancy = 100 - breakEvenVoid;
      return {
        current: occupancy,
        breakEven: breakEvenOccupancy,
        buffer: occupancy - breakEvenOccupancy,
        bufferPercent: occupancy - breakEvenOccupancy,
        isSafe: occupancy > breakEvenOccupancy,
      };
    }
    case "rate": {
      // Find rate where cash flow = 0
      let breakEvenRate = inputs.mortgageRate;
      for (let r = inputs.mortgageRate; r <= 15; r += 0.25) {
        const testInputs = { ...inputs, mortgageRate: r };
        const results = calculateBTLResults(testInputs);
        if (results.monthlyCashFlow <= 0) {
          breakEvenRate = r;
          break;
        }
      }
      return {
        current: inputs.mortgageRate,
        breakEven: breakEvenRate,
        buffer: breakEvenRate - inputs.mortgageRate,
        bufferPercent: breakEvenRate - inputs.mortgageRate,
        isSafe: breakEvenRate > inputs.mortgageRate,
      };
    }
  }
}

function generateChartData(inputs: BTLInputs, type: BreakEvenType) {
  const data: { label: string; cashFlow: number; value: number }[] = [];
  
  const config = {
    rent: {
      key: "monthlyRent" as keyof BTLInputs,
      min: inputs.monthlyRent * 0.6,
      max: inputs.monthlyRent * 1.4,
      step: inputs.monthlyRent * 0.05,
      format: (v: number) => `£${Math.round(v)}`,
    },
    occupancy: {
      key: "voidPercent" as keyof BTLInputs,
      min: 0,
      max: 30,
      step: 2.5,
      format: (v: number) => `${100 - v}%`,
    },
    rate: {
      key: "mortgageRate" as keyof BTLInputs,
      min: 2,
      max: 12,
      step: 0.5,
      format: (v: number) => `${v}%`,
    },
  };
  
  const c = config[type];
  
  for (let v = c.min; v <= c.max; v += c.step) {
    const testInputs = { ...inputs, [c.key]: v };
    const results = calculateBTLResults(testInputs);
    data.push({
      label: c.format(v),
      cashFlow: results.monthlyCashFlow,
      value: type === "occupancy" ? 100 - v : v,
    });
  }
  
  return data;
}

export function BreakEvenChart({ inputs }: BreakEvenChartProps) {
  const [activeType, setActiveType] = useState<BreakEvenType>("rent");
  
  const breakEvenResults = useMemo(() => ({
    rent: calculateBreakEven(inputs, "rent"),
    occupancy: calculateBreakEven(inputs, "occupancy"),
    rate: calculateBreakEven(inputs, "rate"),
  }), [inputs]);
  
  const chartData = useMemo(() => ({
    rent: generateChartData(inputs, "rent"),
    occupancy: generateChartData(inputs, "occupancy"),
    rate: generateChartData(inputs, "rate"),
  }), [inputs]);

  const current = breakEvenResults[activeType];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Break-Even Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeType} onValueChange={(v) => setActiveType(v as BreakEvenType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rent" className="text-xs">Rent</TabsTrigger>
            <TabsTrigger value="occupancy" className="text-xs">Occupancy</TabsTrigger>
            <TabsTrigger value="rate" className="text-xs">Rate</TabsTrigger>
          </TabsList>

          {(["rent", "occupancy", "rate"] as BreakEvenType[]).map((type) => (
            <TabsContent key={type} value={type}>
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="font-semibold text-sm">
                    {type === "rent" ? formatCurrency(breakEvenResults[type].current) :
                     `${breakEvenResults[type].current.toFixed(1)}%`}
                  </p>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">Break-even</p>
                  <p className="font-semibold text-sm">
                    {type === "rent" ? formatCurrency(breakEvenResults[type].breakEven) :
                     `${breakEvenResults[type].breakEven.toFixed(1)}%`}
                  </p>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">Buffer</p>
                  <Badge variant={breakEvenResults[type].isSafe ? "default" : "destructive"} className="text-xs">
                    {type === "rent" ? formatCurrency(breakEvenResults[type].buffer) :
                     `${breakEvenResults[type].buffer.toFixed(1)}%`}
                  </Badge>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData[type]} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      className="text-muted-foreground"
                      interval={Math.floor(chartData[type].length / 5)}
                    />
                    <YAxis
                      tickFormatter={(v) => `£${v}`}
                      tick={{ fontSize: 10 }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Cash Flow"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                    <Line
                      type="monotone"
                      dataKey="cashFlow"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Insight */}
              <p className={cn(
                "text-sm mt-3 p-2 rounded",
                current.isSafe ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" :
                                 "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
              )}>
                {type === "rent" && (
                  current.isSafe
                    ? `You have £${Math.round(current.buffer)} (${current.bufferPercent.toFixed(1)}%) buffer above break-even rent.`
                    : `Warning: Current rent is below break-even by £${Math.abs(Math.round(current.buffer))}.`
                )}
                {type === "occupancy" && (
                  current.isSafe
                    ? `You can handle ${current.buffer.toFixed(0)}% lower occupancy before breaking even.`
                    : `Warning: Occupancy needs to be at least ${current.breakEven.toFixed(0)}% to break even.`
                )}
                {type === "rate" && (
                  current.isSafe
                    ? `You can withstand a ${current.buffer.toFixed(2)}% rate increase before breaking even.`
                    : `Warning: Current rate is already past break-even threshold.`
                )}
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

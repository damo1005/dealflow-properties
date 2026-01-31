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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { ScenarioMetrics, ScenarioVariation } from "@/types/scenario";
import { formatCurrency, formatPercent } from "@/lib/scenarioConfig";

interface ScenarioComparisonChartProps {
  baseMetrics: ScenarioMetrics;
  currentMetrics: ScenarioMetrics;
  variations: ScenarioVariation[];
}

type MetricKey = "monthlyCashFlow" | "netYield" | "roi" | "totalCashRequired";

const metricLabels: Record<MetricKey, string> = {
  monthlyCashFlow: "Monthly Cash Flow",
  netYield: "Net Yield %",
  roi: "ROI %",
  totalCashRequired: "Cash Required",
};

export function ScenarioComparisonChart({
  baseMetrics,
  currentMetrics,
  variations,
}: ScenarioComparisonChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("monthlyCashFlow");

  const data = useMemo(() => {
    const items = [
      { name: "Base", value: baseMetrics[selectedMetric], isBase: true },
      { name: "Current", value: currentMetrics[selectedMetric], isCurrent: true },
      ...variations.map((v) => ({
        name: v.name.slice(0, 10),
        value: v.metrics[selectedMetric],
      })),
    ];
    return items;
  }, [baseMetrics, currentMetrics, variations, selectedMetric]);

  const formatValue = (value: number) => {
    if (selectedMetric === "monthlyCashFlow" || selectedMetric === "totalCashRequired") {
      return formatCurrency(value);
    }
    return formatPercent(value);
  };

  const higherIsBetter = selectedMetric !== "totalCashRequired";

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Scenario Comparison</CardTitle>
        <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricKey)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(metricLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              tickFormatter={(v) => selectedMetric.includes("Cash") ? `£${Math.round(v / 1000)}k` : `${v}%`}
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <Tooltip 
              formatter={(value: number) => [formatValue(value), metricLabels[selectedMetric]]}
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => {
                let fill = "hsl(var(--muted-foreground))";
                if ('isBase' in entry && entry.isBase) {
                  fill = "hsl(var(--muted-foreground))";
                } else if ('isCurrent' in entry && entry.isCurrent) {
                  fill = "hsl(var(--primary))";
                } else {
                  // Color based on comparison to base
                  const diff = entry.value - baseMetrics[selectedMetric];
                  const isGood = higherIsBetter ? diff > 0 : diff < 0;
                  fill = isGood ? "hsl(142 76% 36%)" : "hsl(var(--destructive))";
                }
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

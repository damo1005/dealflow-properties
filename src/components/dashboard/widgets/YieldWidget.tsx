import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Percent, Target, Check, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface YieldWidgetProps {
  grossYield: number;
  netYield: number;
  targetYield?: number;
  yieldDistribution: { range: string; count: number }[];
  bestProperty?: { address: string; yield: number };
  worstProperty?: { address: string; yield: number };
}

export function YieldWidget({
  grossYield,
  netYield,
  targetYield = 6,
  yieldDistribution,
  bestProperty,
  worstProperty,
}: YieldWidgetProps) {
  const aboveTarget = netYield >= targetYield;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Percent className="h-4 w-4 text-blue-500" />
          Portfolio Yields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Gross Yield</p>
            <p className="text-2xl font-bold text-primary">{grossYield.toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Net Yield</p>
            <p className="text-2xl font-bold text-primary">{netYield.toFixed(1)}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Gross</span>
            <span>{grossYield.toFixed(1)}%</span>
          </div>
          <Progress value={(grossYield / 10) * 100} className="h-2" />

          <div className="flex items-center justify-between text-sm">
            <span>Net</span>
            <span>{netYield.toFixed(1)}%</span>
          </div>
          <Progress value={(netYield / 10) * 100} className="h-2 bg-muted" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>Target</span>
            </div>
            <span>{targetYield.toFixed(1)}%</span>
          </div>
          <Progress value={(targetYield / 10) * 100} className="h-2 bg-muted" />
        </div>

        <div className={`flex items-center gap-2 p-2 rounded-lg ${aboveTarget ? "bg-green-50 text-green-700 dark:bg-green-950/30" : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30"}`}>
          {aboveTarget ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          <span className="text-sm font-medium">
            {aboveTarget ? "Above target ✅" : `Below target by ${(targetYield - netYield).toFixed(1)}%`}
          </span>
        </div>

        {yieldDistribution.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Yield Distribution</p>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldDistribution}>
                  <XAxis
                    dataKey="range"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} properties`, "Count"]}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
          {bestProperty && (
            <div>
              <p className="text-muted-foreground text-xs">Best</p>
              <p className="font-medium text-green-600 truncate">{bestProperty.yield.toFixed(1)}%</p>
              <p className="text-xs truncate">{bestProperty.address}</p>
            </div>
          )}
          {worstProperty && (
            <div>
              <p className="text-muted-foreground text-xs">Worst</p>
              <p className="font-medium text-red-600 truncate">{worstProperty.yield.toFixed(1)}%</p>
              <p className="text-xs truncate">{worstProperty.address}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

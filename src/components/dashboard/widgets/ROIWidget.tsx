import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, PiggyBank, Building } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ROIWidgetProps {
  totalInvested: number;
  currentEquity: number;
  totalReturn: number;
  roiPercentage: number;
  annualizedROI: number;
  targetROI?: number;
  rentalProfit: number;
  capitalGrowth: number;
  propertyROIs: { address: string; roi: number }[];
}

export function ROIWidget({
  totalInvested,
  currentEquity,
  totalReturn,
  roiPercentage,
  annualizedROI,
  targetROI = 15,
  rentalProfit,
  capitalGrowth,
  propertyROIs,
}: ROIWidgetProps) {
  const aboveTarget = annualizedROI >= targetROI;
  const rentalPct = totalReturn > 0 ? (rentalProfit / totalReturn) * 100 : 0;
  const capitalPct = totalReturn > 0 ? (capitalGrowth / totalReturn) * 100 : 0;

  const chartData = propertyROIs.slice(0, 6).map((p) => ({
    name: p.address.split(" ")[0],
    roi: p.roi,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Return on Investment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <PiggyBank className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Invested</p>
            <p className="font-semibold text-sm">£{(totalInvested / 1000).toFixed(0)}k</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <Building className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Equity</p>
            <p className="font-semibold text-sm">£{(currentEquity / 1000).toFixed(0)}k</p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <p className="text-xs text-muted-foreground">Return</p>
            <p className="font-semibold text-sm text-green-600">£{(totalReturn / 1000).toFixed(0)}k</p>
          </div>
        </div>

        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground">Overall ROI</p>
          <p className="text-3xl font-bold text-primary">{roiPercentage.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">
            Annualized: {annualizedROI.toFixed(1)}%
          </p>
        </div>

        <div className={`flex items-center justify-between p-2 rounded-lg ${aboveTarget ? "bg-green-50 dark:bg-green-950/30" : "bg-yellow-50 dark:bg-yellow-950/30"}`}>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="text-sm">Target: {targetROI}% annualized</span>
          </div>
          <span className={`text-sm font-medium ${aboveTarget ? "text-green-600" : "text-yellow-600"}`}>
            {aboveTarget ? "✅" : `${(targetROI - annualizedROI).toFixed(1)}% below`}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Return Breakdown</p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>Rental Profit</span>
                <span>£{rentalProfit.toLocaleString()} ({rentalPct.toFixed(0)}%)</span>
              </div>
              <Progress value={rentalPct} className="h-1.5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>Capital Growth</span>
                <span>£{capitalGrowth.toLocaleString()} ({capitalPct.toFixed(0)}%)</span>
              </div>
              <Progress value={capitalPct} className="h-1.5 bg-muted" />
            </div>
          </div>
        </div>

        {chartData.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">ROI by Property</p>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
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
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "ROI"]}
                  />
                  <Bar dataKey="roi" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, PoundSterling } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface IncomeWidgetProps {
  totalIncome: number;
  rentalIncome: number;
  otherIncome: number;
  budget?: number;
  monthlyData: { month: string; amount: number }[];
}

export function IncomeWidget({
  totalIncome,
  rentalIncome,
  otherIncome,
  budget = totalIncome * 0.95,
  monthlyData,
}: IncomeWidgetProps) {
  const budgetPercentage = budget > 0 ? (totalIncome / budget) * 100 : 100;
  const rentalPercentage = totalIncome > 0 ? (rentalIncome / totalIncome) * 100 : 0;
  const otherPercentage = totalIncome > 0 ? (otherIncome / totalIncome) * 100 : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <PoundSterling className="h-4 w-4 text-green-500" />
          Income This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-2xl font-bold">£{totalIncome.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">Budget: £{budget.toLocaleString()}</span>
          </div>
          <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {budgetPercentage.toFixed(0)}% of budget
          </p>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Rental Income</span>
              <span className="font-medium">£{rentalIncome.toLocaleString()} ({rentalPercentage.toFixed(0)}%)</span>
            </div>
            <Progress value={rentalPercentage} className="h-1.5 bg-muted" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Other Income</span>
              <span className="font-medium">£{otherIncome.toLocaleString()} ({otherPercentage.toFixed(0)}%)</span>
            </div>
            <Progress value={otherPercentage} className="h-1.5 bg-muted" />
          </div>
        </div>

        {monthlyData.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Trend (Last 6 months)</p>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`£${value.toLocaleString()}`, "Income"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

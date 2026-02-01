import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowDown, ArrowUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CashFlowWidgetProps {
  income: number;
  expenses: number;
  monthlyData: { month: string; cashFlow: number }[];
}

export function CashFlowWidget({ income, expenses, monthlyData }: CashFlowWidgetProps) {
  const netCashFlow = income - expenses;
  const margin = income > 0 ? (netCashFlow / income) * 100 : 0;
  const isPositive = netCashFlow >= 0;

  const average = monthlyData.length > 0
    ? monthlyData.reduce((sum, d) => sum + d.cashFlow, 0) / monthlyData.length
    : 0;
  const totalYTD = monthlyData.reduce((sum, d) => sum + d.cashFlow, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Monthly Cash Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-2">
          <div
            className={`text-3xl font-bold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}£{netCashFlow.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Margin: {margin.toFixed(1)}%
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <ArrowDown className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Income</p>
            <p className="font-semibold text-green-600">£{income.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <ArrowUp className="h-4 w-4 text-red-600 mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="font-semibold text-red-600">£{expenses.toLocaleString()}</p>
          </div>
        </div>

        {monthlyData.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">12-Month Cash Flow</p>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis
                    dataKey="month"
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
                    formatter={(value: number) => [
                      `${value >= 0 ? "+" : ""}£${value.toLocaleString()}`,
                      "Cash Flow",
                    ]}
                  />
                  <Bar dataKey="cashFlow" radius={[2, 2, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.cashFlow >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
          <div>
            <p className="text-muted-foreground">Average/mo</p>
            <p className="font-medium">£{average.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total YTD</p>
            <p className="font-medium">£{totalYTD.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

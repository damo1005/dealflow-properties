import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PoundSterling, TrendingUp, Building, PiggyBank } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FinancialPerformanceProps {
  investment: {
    purchasePrice: number;
    initialCosts: number;
    totalInvestment: number;
    currentValue: number;
    mortgageBalance: number;
    currentEquity: number;
    equityGain: number;
    equityGainPercent: number;
    capitalAppreciation: number;
  };
  income: {
    rentalIncome: number;
    otherIncome: number;
    totalIncome: number;
    targetIncome: number;
  };
  expenses: {
    mortgage: number;
    maintenance: number;
    management: number;
    insurance: number;
    other: number;
    totalExpenses: number;
    budget: number;
  };
  profit: {
    monthlyProfit: number;
    annualProfit: number;
    targetProfit: number;
    profitMargin: number;
  };
  yieldData: { year: string; yield: number }[];
}

export function FinancialPerformance({
  investment,
  income,
  expenses,
  profit,
  yieldData,
}: FinancialPerformanceProps) {
  const incomePerformance = income.targetIncome > 0 
    ? (income.totalIncome / income.targetIncome) * 100 
    : 100;
  const expensePerformance = expenses.budget > 0 
    ? (expenses.totalExpenses / expenses.budget) * 100 
    : 100;
  const profitPerformance = profit.targetProfit > 0 
    ? (profit.annualProfit / profit.targetProfit) * 100 
    : 100;

  return (
    <div className="space-y-6">
      {/* Investment Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            Investment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Purchase Price</p>
              <p className="font-semibold">£{investment.purchasePrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Initial Costs</p>
              <p className="font-semibold">£{investment.initialCosts.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Investment</p>
              <p className="font-semibold text-primary">£{investment.totalInvestment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="font-semibold text-green-600">£{investment.currentValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mortgage Balance</p>
              <p className="font-semibold">£{investment.mortgageBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Equity</p>
              <p className="font-semibold text-primary">£{investment.currentEquity.toLocaleString()}</p>
            </div>
          </div>
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Equity Gain</span>
              <span className="font-bold text-green-600">
                £{investment.equityGain.toLocaleString()} ({investment.equityGainPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Income Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Income (Last 12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rental Income</span>
                <span>£{income.rentalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Other Income</span>
                <span>£{income.otherIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Income</span>
                <span>£{income.totalIncome.toLocaleString()}</span>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">vs Target (£{income.targetIncome.toLocaleString()})</span>
                <span className={incomePerformance >= 100 ? "text-green-600" : "text-red-600"}>
                  {incomePerformance >= 100 ? "+" : ""}£{(income.totalIncome - income.targetIncome).toLocaleString()} 
                  {incomePerformance >= 100 ? " ✅" : " ⚠️"}
                </span>
              </div>
              <Progress value={Math.min(incomePerformance, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{incomePerformance.toFixed(0)}% of target</p>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PoundSterling className="h-4 w-4 text-orange-500" />
              Expenses (Last 12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mortgage</span>
                <span>£{expenses.mortgage.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance</span>
                <span>£{expenses.maintenance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Management</span>
                <span>£{expenses.management.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance</span>
                <span>£{expenses.insurance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Expenses</span>
                <span>£{expenses.totalExpenses.toLocaleString()}</span>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">vs Budget (£{expenses.budget.toLocaleString()})</span>
                <span className={expensePerformance <= 100 ? "text-green-600" : "text-red-600"}>
                  {expensePerformance <= 100 ? "-" : "+"}£{Math.abs(expenses.totalExpenses - expenses.budget).toLocaleString()}
                  {expensePerformance <= 100 ? " ✅" : " ⚠️"}
                </span>
              </div>
              <Progress value={Math.min(expensePerformance, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{expensePerformance.toFixed(0)}% of budget</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-primary" />
            Profit Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Monthly Profit</p>
              <p className="text-xl font-bold text-green-600">£{profit.monthlyProfit}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Annual Profit</p>
              <p className="text-xl font-bold text-green-600">£{profit.annualProfit.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className="text-xl font-bold">{profit.profitMargin}%</p>
            </div>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">vs Target (£{profit.targetProfit.toLocaleString()})</span>
            <span className={profitPerformance >= 100 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {profitPerformance >= 100 ? "+" : ""}£{(profit.annualProfit - profit.targetProfit).toLocaleString()} 
              ({profitPerformance.toFixed(0)}% of target) {profitPerformance >= 100 ? "✅" : "⚠️"}
            </span>
          </div>
          <Progress value={Math.min(profitPerformance, 100)} className="h-2" />
        </CardContent>
      </Card>

      {/* Yield Trend Chart */}
      {yieldData.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Yield Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yieldData}>
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    domain={[4, 8]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Gross Yield"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Download, Plus, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { EXPENSE_CATEGORIES } from "@/types/portfolio";

// Mock data
const monthlyData = [
  { month: "Aug", income: 2350, expenses: 3200, cashFlow: -850 },
  { month: "Sep", income: 2350, expenses: 3150, cashFlow: -800 },
  { month: "Oct", income: 2350, expenses: 3400, cashFlow: -1050 },
  { month: "Nov", income: 2350, expenses: 3100, cashFlow: -750 },
  { month: "Dec", income: 2350, expenses: 3500, cashFlow: -1150 },
  { month: "Jan", income: 2350, expenses: 3344, cashFlow: -994 },
];

const expenseBreakdown = [
  { name: "Mortgage", value: 3344, color: "hsl(var(--chart-1))" },
  { name: "Insurance", value: 180, color: "hsl(var(--chart-2))" },
  { name: "Repairs", value: 450, color: "hsl(var(--chart-3))" },
  { name: "Agent Fees", value: 235, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 120, color: "hsl(var(--chart-5))" },
];

const cashFlowForecast = [
  { month: "Feb", projected: -900, best: -500, worst: -1200 },
  { month: "Mar", projected: -850, best: -400, worst: -1100 },
  { month: "Apr", projected: -800, best: -300, worst: -1000 },
  { month: "May", projected: 500, best: 900, worst: 200 },
  { month: "Jun", projected: 550, best: 950, worst: 250 },
  { month: "Jul", projected: 600, best: 1000, worst: 300 },
];

export function PortfolioFinancials() {
  const { properties, summary } = usePortfolioStore();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const totalIncomeYTD = properties.reduce((sum, p) => sum + p.total_income_ytd, 0);
  const totalExpensesYTD = properties.reduce((sum, p) => sum + p.total_expenses_ytd, 0);
  const netProfitYTD = totalIncomeYTD - totalExpensesYTD;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Income YTD</p>
            <p className="text-2xl font-bold text-green-500">
              {formatCurrency(totalIncomeYTD)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Expenses YTD</p>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalExpensesYTD)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Net Profit YTD</p>
            <p className={`text-2xl font-bold ${netProfitYTD >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(netProfitYTD)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Avg Yield</p>
            <p className="text-2xl font-bold">{summary?.portfolio_yield || 0}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Est. Tax Liability</p>
            <p className="text-2xl font-bold">£0</p>
            <p className="text-xs text-muted-foreground">No profit = No tax</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `£${v}`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cash Flow Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `£${v}`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cashFlow"
                  name="Cash Flow"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Property Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Property</th>
                  <th className="text-right py-3 px-2 font-medium">Income YTD</th>
                  <th className="text-right py-3 px-2 font-medium">Expenses YTD</th>
                  <th className="text-right py-3 px-2 font-medium">Net</th>
                  <th className="text-right py-3 px-2 font-medium">Yield</th>
                  <th className="text-right py-3 px-2 font-medium">ROI</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => {
                  const net = property.total_income_ytd - property.total_expenses_ytd;
                  return (
                    <tr key={property.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <p className="font-medium">{property.address}</p>
                        <p className="text-xs text-muted-foreground">{property.postcode}</p>
                      </td>
                      <td className="py-3 px-2 text-right text-green-600">
                        {formatCurrency(property.total_income_ytd)}
                      </td>
                      <td className="py-3 px-2 text-right text-red-600">
                        {formatCurrency(property.total_expenses_ytd)}
                      </td>
                      <td className={`py-3 px-2 text-right font-medium ${net >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(net)}
                      </td>
                      <td className="py-3 px-2 text-right">
                        {property.current_yield ? `${property.current_yield}%` : "-"}
                      </td>
                      <td className="py-3 px-2 text-right">
                        {property.current_yield ? `${(property.current_yield * 1.2).toFixed(1)}%` : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50 font-medium">
                  <td className="py-3 px-2">Total</td>
                  <td className="py-3 px-2 text-right text-green-600">
                    {formatCurrency(totalIncomeYTD)}
                  </td>
                  <td className="py-3 px-2 text-right text-red-600">
                    {formatCurrency(totalExpensesYTD)}
                  </td>
                  <td className={`py-3 px-2 text-right ${netProfitYTD >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(netProfitYTD)}
                  </td>
                  <td className="py-3 px-2 text-right">{summary?.portfolio_yield || 0}%</td>
                  <td className="py-3 px-2 text-right">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">12-Month Cash Flow Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowForecast}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `£${v}`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="best"
                  name="Best Case"
                  stroke="hsl(var(--chart-2))"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  name="Expected"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="worst"
                  name="Worst Case"
                  stroke="hsl(var(--chart-1))"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            💡 Forecast shows improvement from May when void property is let
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

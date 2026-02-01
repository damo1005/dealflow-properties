import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/stores/portfolioStore";
import {
  Building2,
  TrendingUp,
  Percent,
  Users,
  Shield,
  AlertTriangle,
  XCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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
  Legend,
} from "recharts";
import { PROPERTY_STATUSES } from "@/types/portfolio";

// Mock chart data
const valueOverTime = [
  { month: "Aug", value: 750000, equity: 200000 },
  { month: "Sep", value: 760000, equity: 210000 },
  { month: "Oct", value: 775000, equity: 225000 },
  { month: "Nov", value: 790000, equity: 240000 },
  { month: "Dec", value: 810000, equity: 255000 },
  { month: "Jan", value: 825000, equity: 262500 },
];

const incomeVsExpenses = [
  { month: "Aug", income: 2350, expenses: 3200 },
  { month: "Sep", income: 2350, expenses: 3150 },
  { month: "Oct", income: 2350, expenses: 3400 },
  { month: "Nov", income: 2350, expenses: 3100 },
  { month: "Dec", income: 2350, expenses: 3500 },
  { month: "Jan", income: 2350, expenses: 3344 },
];

export function PortfolioOverview() {
  const { properties, tenancies, compliance, summary } = usePortfolioStore();

  const activeTenancies = tenancies.filter((t) => t.status === "active");
  const letProperties = properties.filter((p) => p.property_status === "let");
  const voidProperties = properties.filter((p) => p.property_status === "void");

  const validCompliance = compliance.filter((c) => c.status === "valid");
  const expiringCompliance = compliance.filter((c) => c.status === "expiring");
  const expiredCompliance = compliance.filter((c) => c.status === "expired");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Portfolio Value</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(summary?.total_value || 0)}
            </p>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              +£45,000 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Monthly Cash Flow</span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${(summary?.monthly_cash_flow || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(summary?.monthly_cash_flow || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Income: {formatCurrency(summary?.monthly_income || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Percent className="h-4 w-4" />
              <span className="text-sm">Portfolio Yield</span>
            </div>
            <p className="text-2xl font-bold mt-1">{summary?.portfolio_yield || 0}%</p>
            <p className="text-xs text-green-500 mt-1">Above average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">Occupancy</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {Math.round(summary?.occupancy_rate || 0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {letProperties.length}/{properties.length} units let
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Compliance</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {validCompliance.length}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                {expiringCompliance.length}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <XCircle className="h-4 w-4 text-red-500" />
                {expiredCompliance.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(expiredCompliance.length > 0 || voidProperties.length > 0) && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiredCompliance.map((item) => {
              const property = properties.find(
                (p) => p.id === item.portfolio_property_id
              );
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-background rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">
                        {item.compliance_type.replace("_", " ")} Expired
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {property?.address}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Schedule Renewal</Button>
                </div>
              );
            })}
            {voidProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between bg-background rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Property Void</p>
                    <p className="text-sm text-muted-foreground">
                      {property.address} - No rental income
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Find Tenant
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Value Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={valueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(v) => `£${v / 1000}k`}
                  />
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
                    dataKey="value"
                    name="Total Value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="equity"
                    name="Equity"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeVsExpenses}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(v) => `£${v}`}
                  />
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
      </div>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Properties Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Property</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium">Tenant</th>
                  <th className="text-right py-3 px-2 font-medium">Rent</th>
                  <th className="text-right py-3 px-2 font-medium">Value</th>
                  <th className="text-right py-3 px-2 font-medium">Yield</th>
                  <th className="text-center py-3 px-2 font-medium">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => {
                  const tenancy = tenancies.find(
                    (t) =>
                      t.portfolio_property_id === property.id &&
                      t.status === "active"
                  );
                  const propertyCompliance = compliance.filter(
                    (c) => c.portfolio_property_id === property.id
                  );
                  const hasExpired = propertyCompliance.some(
                    (c) => c.status === "expired"
                  );
                  const hasExpiring = propertyCompliance.some(
                    (c) => c.status === "expiring"
                  );

                  const status = PROPERTY_STATUSES.find(
                    (s) => s.value === property.property_status
                  );

                  return (
                    <tr key={property.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{property.address}</p>
                          <p className="text-xs text-muted-foreground">
                            {property.property_type} • {property.bedrooms} bed
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant="secondary"
                          className={`${status?.color} text-white`}
                        >
                          {status?.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        {tenancy ? tenancy.tenant_name : "-"}
                      </td>
                      <td className="py-3 px-2 text-right">
                        {tenancy ? formatCurrency(tenancy.monthly_rent) : "-"}
                      </td>
                      <td className="py-3 px-2 text-right">
                        {formatCurrency(property.current_value || property.purchase_price)}
                      </td>
                      <td className="py-3 px-2 text-right">
                        {property.current_yield
                          ? `${property.current_yield}%`
                          : "-"}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {hasExpired ? (
                          <XCircle className="h-5 w-5 text-destructive mx-auto" />
                        ) : hasExpiring ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mx-auto" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

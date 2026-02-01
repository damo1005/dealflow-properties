import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Target,
  PoundSterling,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Mail,
  Save,
  Plus,
  RefreshCw,
  BarChart3,
  Home,
  Shield,
  Calculator,
  ArrowRight,
} from "lucide-react";
import { useDealAnalysisStore } from "@/stores/dealAnalysisStore";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function AnalysisResults() {
  const { analysis, resetWizard } = useDealAnalysisStore();

  if (!analysis) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: "EXCELLENT INVESTMENT", color: "text-green-500" };
    if (score >= 65) return { label: "GOOD INVESTMENT", color: "text-primary" };
    if (score >= 50) return { label: "FAIR INVESTMENT", color: "text-yellow-500" };
    return { label: "POOR INVESTMENT", color: "text-red-500" };
  };

  const scoreInfo = getScoreLabel(analysis.dealScore);

  const projectionData = analysis.fiveYearProjection.map((p) => ({
    name: `Year ${p.year}`,
    "Cash Flow": p.cumulativeCashFlow,
    "Property Value": p.propertyValue,
    Equity: p.equity,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Deal Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * analysis.dealScore) / 100}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{analysis.dealScore}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </div>
              <p className={cn("font-semibold mt-2", scoreInfo.color)}>
                {scoreInfo.label}
              </p>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <h3 className="font-semibold">Score Breakdown</h3>
              {Object.entries(analysis.scoreBreakdown).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium">{value}/10</span>
                  </div>
                  <Progress value={value * 10} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PoundSterling className="h-4 w-4 text-primary" />
              Cash Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(analysis.costsBreakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span>{formatCurrency(value)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(analysis.totalCashRequired)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gross Yield</span>
              <span className="font-medium">{formatPercent(analysis.grossYield)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Net Yield</span>
              <span className="font-medium">{formatPercent(analysis.netYield)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cash-on-Cash</span>
              <span className="font-medium">{formatPercent(analysis.cashOnCash)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ROI (Year 1)</span>
              <span className="font-medium">{formatPercent(analysis.roiYear1)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Cash Flow</span>
              <span className={cn("font-semibold", analysis.monthlyCashFlow >= 0 ? "text-green-500" : "text-red-500")}>
                {formatCurrency(analysis.monthlyCashFlow)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Cash Flow</span>
              <span className={cn("font-semibold", analysis.annualCashFlow >= 0 ? "text-green-500" : "text-red-500")}>
                {formatCurrency(analysis.annualCashFlow)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5-Year Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            5-Year Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis
                  tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                  className="text-xs"
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
                  dataKey="Cash Flow"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Property Value"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Equity"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Cash Flow</TableHead>
                <TableHead className="text-right">Property Value</TableHead>
                <TableHead className="text-right">Equity</TableHead>
                <TableHead className="text-right">Total Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.fiveYearProjection.map((p) => (
                <TableRow key={p.year}>
                  <TableCell>Year {p.year}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.cumulativeCashFlow)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.propertyValue)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.equity)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(p.totalReturn)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Risk Assessment & Stress Test */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.riskAssessment.map((risk, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg border-l-4",
                  risk.level === "low" && "bg-green-500/10 border-green-500",
                  risk.level === "medium" && "bg-yellow-500/10 border-yellow-500",
                  risk.level === "high" && "bg-red-500/10 border-red-500"
                )}
              >
                <div className="flex items-start gap-2">
                  {risk.level === "low" && <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />}
                  {risk.level === "medium" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                  {risk.level === "high" && <XCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                  <p className="text-sm">{risk.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Interest Rate Stress Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Payment</TableHead>
                  <TableHead className="text-right">Cash Flow</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.stressTest.map((test) => (
                  <TableRow key={test.rate}>
                    <TableCell>{test.rate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(test.monthlyPayment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(test.cashFlow)}</TableCell>
                    <TableCell className="text-right">
                      {test.status === "positive" && <CheckCircle2 className="h-4 w-4 text-green-500 inline" />}
                      {test.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 inline" />}
                      {test.status === "negative" && <XCircle className="h-4 w-4 text-red-500 inline" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-2">
              Break-even rate: {analysis.stressTest.find((t) => t.status === "negative")?.rate.toFixed(1) || ">9.5"}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparables */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              Sold Comparables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.soldComparables.map((comp, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{comp.address}</TableCell>
                    <TableCell className="text-right">{formatCurrency(comp.price)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{comp.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              Rental Comparables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Rent/pcm</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.rentalComparables.map((comp, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{comp.address}</TableCell>
                    <TableCell className="text-right">{formatCurrency(comp.price)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {comp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Tax Implications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Tax Implications
          </CardTitle>
          <p className="text-sm text-muted-foreground">Based on higher rate taxpayer (40%)</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">SDLT</p>
              <p className="text-lg font-semibold">{formatCurrency(analysis.taxImplications.sdlt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Income Tax</p>
              <p className="text-lg font-semibold">{formatCurrency(analysis.taxImplications.incomeTaxOnRent)}/yr</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">S24 Restriction</p>
              <p className="text-lg font-semibold">{formatCurrency(analysis.taxImplications.section24Restriction)}/yr</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Effective Rate</p>
              <p className="text-lg font-semibold">{analysis.taxImplications.effectiveTaxRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">After-Tax CF</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(analysis.taxImplications.afterTaxCashFlow)}/yr</p>
            </div>
          </div>
          {analysis.taxImplications.recommendation && (
            <div className="mt-4 p-3 rounded-lg bg-primary/10 flex items-start gap-2">
              <Target className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Recommendation</p>
                <p className="text-sm text-muted-foreground">{analysis.taxImplications.recommendation}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Analysis
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email Report
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add to Pipeline
            </Button>
            <Button onClick={resetWizard}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Analyse Another
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  History,
  LineChart,
  Bell,
  Download,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PerformanceOverview } from "./PerformanceOverview";
import { FinancialPerformance } from "./FinancialPerformance";
import { ROITracker } from "./ROITracker";
import { InvestmentTimeline } from "./InvestmentTimeline";
import { PerformanceAlerts } from "./PerformanceAlerts";
import type { PerformanceMetric, InvestmentMilestone, PerformanceAlert } from "@/types/investment";

// Mock data
const MOCK_METRICS: PerformanceMetric[] = [
  { name: "Gross Yield", target: 6.0, actual: 7.2, unit: "%", status: "above", variance: 1.2, varianceLabel: "+1.2%" },
  { name: "Net Yield", target: 4.5, actual: 5.8, unit: "%", status: "above", variance: 1.3, varianceLabel: "+1.3%" },
  { name: "ROI", target: 30, actual: 34, unit: "%", status: "above", variance: 4, varianceLabel: "+4%" },
  { name: "Monthly Cash Flow", target: 400, actual: 510, unit: "", status: "above", variance: 110, varianceLabel: "+£110" },
  { name: "Occupancy Rate", target: 95, actual: 98, unit: "%", status: "above", variance: 3, varianceLabel: "+3%" },
  { name: "Void Days (Avg)", target: 14, actual: 8, unit: "", status: "above", variance: -6, varianceLabel: "-6 days" },
];

const MOCK_INVESTMENT = {
  purchasePrice: 285000,
  initialCosts: 15500,
  totalInvestment: 300500,
  currentValue: 340000,
  mortgageBalance: 215000,
  currentEquity: 125000,
  equityGain: 55500,
  equityGainPercent: 18.5,
  capitalAppreciation: 55000,
};

const MOCK_INCOME = {
  rentalIncome: 20400,
  otherIncome: 300,
  totalIncome: 20700,
  targetIncome: 19200,
};

const MOCK_EXPENSES = {
  mortgage: 10800,
  maintenance: 1850,
  management: 1224,
  insurance: 420,
  other: 250,
  totalExpenses: 14544,
  budget: 15000,
};

const MOCK_PROFIT = {
  monthlyProfit: 510,
  annualProfit: 6120,
  targetProfit: 4800,
  profitMargin: 30,
};

const MOCK_YIELD_DATA = [
  { year: "2020", yield: 6.2 },
  { year: "2021", yield: 6.5 },
  { year: "2022", yield: 6.8 },
  { year: "2023", yield: 7.0 },
  { year: "2024", yield: 7.1 },
  { year: "2025", yield: 7.2 },
];

const MOCK_MILESTONES: InvestmentMilestone[] = [
  { id: "1", property_id: "1", milestone_type: "purchase_completed", milestone_date: "2020-03-15", milestone_value: 285000, notes: "Purchase price: £285,000, Deposit: £71,250 (25%)", created_at: "" },
  { id: "2", property_id: "1", milestone_type: "first_tenant", milestone_date: "2020-06-01", milestone_value: 1700, notes: "Rent: £1,700/month, AST: 12 months", created_at: "" },
  { id: "3", property_id: "1", milestone_type: "break_even", milestone_date: "2021-09-08", notes: "Time to break even: 18 months", created_at: "" },
  { id: "4", property_id: "1", milestone_type: "major_renovation", milestone_date: "2022-05-15", milestone_value: 8500, notes: "Kitchen renovation - Value added: ~£15,000", created_at: "" },
  { id: "5", property_id: "1", milestone_type: "refinance_completed", milestone_date: "2024-03-15", milestone_value: 25000, notes: "Equity released for deposit on property #4", created_at: "" },
];

const MOCK_RESOLVED_ALERTS: PerformanceAlert[] = [
  { id: "1", user_id: "1", property_id: "1", alert_type: "expenses_high", severity: "medium", alert_message: "Maintenance at 15% of rent - Kitchen renovation completed", metric_name: "maintenance", target_value: 10, actual_value: 15, variance: 5, is_resolved: true, resolved_at: "2022-06-01", created_at: "2022-03-15" },
  { id: "2", user_id: "1", property_id: "1", alert_type: "yield_below_target", severity: "low", alert_message: "Yield dropped to 5.7% - Rent review completed (+8.8%)", metric_name: "gross_yield", target_value: 6, actual_value: 5.7, variance: -0.3, is_resolved: true, resolved_at: "2023-06-15", created_at: "2023-06-08" },
];

interface PropertyPerformancePageProps {
  propertyId?: string;
  propertyAddress?: string;
}

export function PropertyPerformancePage({
  propertyId = "1",
  propertyAddress = "123 High Street",
}: PropertyPerformancePageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("performance");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Property Performance</h1>
            <p className="text-muted-foreground">{propertyAddress}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="targets" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            Targets
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="forecasts" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Forecasts
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <PerformanceOverview
            performanceRating="Excellent"
            performanceScore={87}
            purchaseDate="15 Mar 2020"
            holdingPeriod="3 years 10 months"
            metrics={MOCK_METRICS}
          />
          <FinancialPerformance
            investment={MOCK_INVESTMENT}
            income={MOCK_INCOME}
            expenses={MOCK_EXPENSES}
            profit={MOCK_PROFIT}
            yieldData={MOCK_YIELD_DATA}
          />
          <ROITracker
            totalInvestment={300500}
            returns={{
              rentalProfit: 23200,
              rentalProfitYears: 3.8,
              capitalGrowth: 55000,
              currentEquity: 125000,
            }}
            totalReturn={78200}
            roi={26.0}
            annualizedROI={7.4}
            targetROI={30}
            targetYears={5}
            projectedROI={34}
            isOnTrack={true}
          />
        </TabsContent>

        <TabsContent value="targets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {MOCK_METRICS.map((metric, i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{metric.name}</span>
                      <Badge variant={metric.status === "above" ? "default" : "destructive"}>
                        {metric.status === "above" ? "Achieved ✅" : "Below Target"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Target: {metric.target}{metric.unit}</span>
                      <span className="font-medium">Actual: {metric.actual}{metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full" variant="outline">
                Edit Targets
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <InvestmentTimeline milestones={MOCK_MILESTONES} />
        </TabsContent>

        <TabsContent value="forecasts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>10-Year Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Assumptions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Rental growth: 3% per year</li>
                    <li>• Property appreciation: 4% per year</li>
                    <li>• Mortgage paydown: £400/month</li>
                    <li>• 98% occupancy maintained</li>
                  </ul>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Year</th>
                        <th className="text-right p-2">Value</th>
                        <th className="text-right p-2">Equity</th>
                        <th className="text-right p-2">Mortgage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[2026, 2028, 2030, 2032, 2034, 2036].map((year, i) => (
                        <tr key={year} className="border-b">
                          <td className="p-2">{year}</td>
                          <td className="text-right p-2">£{(340000 * Math.pow(1.04, i * 2)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="text-right p-2">£{(125000 + i * 37500).toLocaleString()}</td>
                          <td className="text-right p-2">£{Math.max(0, 215000 - i * 7500).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <PerformanceAlerts
            activeAlerts={[]}
            resolvedAlerts={MOCK_RESOLVED_ALERTS}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

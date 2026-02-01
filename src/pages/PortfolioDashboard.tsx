import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, PoundSterling, Users, TrendingUp, Download, Settings } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { IncomeWidget } from "@/components/dashboard/widgets/IncomeWidget";
import { ExpensesWidget } from "@/components/dashboard/widgets/ExpensesWidget";
import { CashFlowWidget } from "@/components/dashboard/widgets/CashFlowWidget";
import { YieldWidget } from "@/components/dashboard/widgets/YieldWidget";
import { ROIWidget } from "@/components/dashboard/widgets/ROIWidget";
import { OccupancyWidget } from "@/components/dashboard/widgets/OccupancyWidget";
import { TopPerformersWidget } from "@/components/dashboard/widgets/TopPerformersWidget";
import { NeedsAttentionWidget } from "@/components/dashboard/widgets/NeedsAttentionWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { PERIOD_OPTIONS } from "@/types/dashboard";

// Mock data for demonstration
const MOCK_METRICS = {
  portfolioValue: 2450000,
  portfolioValueTrend: 5.2,
  netProfit: 4250,
  netProfitTrend: 12,
  occupancyRate: 95,
  occupancyTrend: -2,
  totalProperties: 12,
  newProperties: 1,
};

const MOCK_INCOME_DATA = {
  totalIncome: 18500,
  rentalIncome: 17800,
  otherIncome: 700,
  budget: 18000,
  monthlyData: [
    { month: "Aug", amount: 17000 },
    { month: "Sep", amount: 17200 },
    { month: "Oct", amount: 17500 },
    { month: "Nov", amount: 18000 },
    { month: "Dec", amount: 18200 },
    { month: "Jan", amount: 18500 },
  ],
};

const MOCK_EXPENSES_DATA = {
  totalExpenses: 14250,
  breakdown: {
    mortgages: 9500,
    maintenance: 2100,
    management: 1400,
    insurance: 850,
    utilities: 0,
    other: 400,
  },
  budget: 14500,
  previousMonth: {
    mortgages: 9500,
    maintenance: 1650,
    management: 1400,
    insurance: 850,
    utilities: 0,
    other: 400,
  },
};

const MOCK_CASHFLOW_DATA = {
  income: 18500,
  expenses: 14250,
  monthlyData: [
    { month: "Feb", cashFlow: 3800 },
    { month: "Mar", cashFlow: 4100 },
    { month: "Apr", cashFlow: 3900 },
    { month: "May", cashFlow: 4200 },
    { month: "Jun", cashFlow: 4400 },
    { month: "Jul", cashFlow: 4000 },
    { month: "Aug", cashFlow: 4100 },
    { month: "Sep", cashFlow: 4300 },
    { month: "Oct", cashFlow: 4100 },
    { month: "Nov", cashFlow: 4200 },
    { month: "Dec", cashFlow: 4100 },
    { month: "Jan", cashFlow: 4250 },
  ],
};

const MOCK_YIELD_DATA = {
  grossYield: 6.8,
  netYield: 5.2,
  targetYield: 6.0,
  yieldDistribution: [
    { range: "4-5%", count: 1 },
    { range: "5-6%", count: 2 },
    { range: "6-7%", count: 4 },
    { range: "7-8%", count: 3 },
    { range: "8%+", count: 2 },
  ],
  bestProperty: { address: "456 Oak Ave", yield: 8.2 },
  worstProperty: { address: "789 Elm St", yield: 4.5 },
};

const MOCK_ROI_DATA = {
  totalInvested: 450000,
  currentEquity: 612500,
  totalReturn: 162500,
  roiPercentage: 36.1,
  annualizedROI: 12.7,
  targetROI: 15,
  rentalProfit: 89200,
  capitalGrowth: 73300,
  propertyROIs: [
    { address: "456 Oak", roi: 42 },
    { address: "321 Pine", roi: 38 },
    { address: "123 High", roi: 34 },
    { address: "654 Ash", roi: 28 },
    { address: "987 Birch", roi: 22 },
    { address: "789 Elm", roi: 8 },
  ],
};

const MOCK_OCCUPANCY_DATA = {
  occupancyRate: 95,
  targetRate: 97,
  totalUnits: 12,
  occupiedUnits: 11,
  vacantUnits: 1,
  avgVoidDays: 12,
  industryAvg: 18,
  vacantProperties: [
    {
      address: "789 Elm Street",
      vacantSince: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
      listed: true,
      viewings: 5,
    },
  ],
  upcomingEnds: [
    { address: "123 High St", endDate: new Date(Date.now() + 59 * 24 * 60 * 60 * 1000) },
    { address: "456 Oak Ave", endDate: new Date(Date.now() + 103 * 24 * 60 * 60 * 1000) },
  ],
  monthlyData: [
    { month: "Feb", rate: 100 },
    { month: "Mar", rate: 100 },
    { month: "Apr", rate: 100 },
    { month: "May", rate: 92 },
    { month: "Jun", rate: 100 },
    { month: "Jul", rate: 100 },
    { month: "Aug", rate: 100 },
    { month: "Sep", rate: 92 },
    { month: "Oct", rate: 100 },
    { month: "Nov", rate: 100 },
    { month: "Dec", rate: 100 },
    { month: "Jan", rate: 95 },
  ],
};

const MOCK_TOP_PERFORMERS = [
  { id: "1", address: "456 Oak Avenue", netYield: 8.2, cashFlow: 625, roi: 42, roiYears: 3.2, status: "excellent" as const },
  { id: "2", address: "321 Pine Road", netYield: 7.8, cashFlow: 580, roi: 38, roiYears: 2.8, status: "excellent" as const },
  { id: "3", address: "123 High Street", netYield: 7.2, cashFlow: 510, roi: 34, roiYears: 4.1, status: "good" as const },
];

const MOCK_ATTENTION_ITEMS = [
  { id: "1", type: "low_roi" as const, property: "789 Elm Street", issue: "Low ROI (1.6% annual)", detail: "Cash Flow: +£95/mo (marginal)", action: "Analyze Options", severity: "medium" as const },
  { id: "2", type: "arrears" as const, property: "654 Ash Lane", issue: "Rent arrears (£1,250)", detail: "35 days overdue", action: "View Tenant", severity: "high" as const },
  { id: "3", type: "compliance" as const, property: "987 Birch Close", issue: "EPC expires in 45 days", detail: "Current: D (62)", action: "Book Assessment", severity: "medium" as const },
  { id: "4", type: "compliance" as const, property: "123 High Street", issue: "Gas Safety due in 14 days", detail: "Annual inspection required", action: "Book Service", severity: "high" as const },
];

const MOCK_ACTIVITIES = [
  { id: "1", type: "income" as const, title: "Rent received", property: "123 High St", amount: 1400, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "2", type: "document" as const, title: "Gas Safety uploaded", property: "456 Oak Ave", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: "3", type: "maintenance" as const, title: "Boiler repair completed", property: "789 Elm St", amount: 285, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: "4", type: "viewing" as const, title: "Viewing scheduled", property: "789 Elm St", timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000) },
  { id: "5", type: "compliance" as const, title: "EICR expiring alert", property: "987 Birch", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) },
  { id: "6", type: "income" as const, title: "Rent received", property: "456 Oak Ave", amount: 1250, timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000) },
];

export default function PortfolioDashboard() {
  const [period, setPeriod] = useState("month");

  return (
    <AppLayout
      title="Portfolio Dashboard"
      actions={
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Portfolio Value"
            value={`£${(MOCK_METRICS.portfolioValue / 1000000).toFixed(2)}M`}
            trend={{ value: MOCK_METRICS.portfolioValueTrend, label: "", positive: true }}
            icon={<Building2 className="h-5 w-5" />}
          />
          <SummaryCard
            title="Net Profit"
            value={`£${MOCK_METRICS.netProfit.toLocaleString()}/mo`}
            trend={{ value: MOCK_METRICS.netProfitTrend, label: "", positive: true }}
            icon={<PoundSterling className="h-5 w-5" />}
          />
          <SummaryCard
            title="Occupancy"
            value={`${MOCK_METRICS.occupancyRate}%`}
            trend={{ value: MOCK_METRICS.occupancyTrend, label: "", positive: false }}
            icon={<Users className="h-5 w-5" />}
          />
          <SummaryCard
            title="Properties"
            value={MOCK_METRICS.totalProperties.toString()}
            subtitle={`+${MOCK_METRICS.newProperties} this month`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Row 1 */}
          <IncomeWidget {...MOCK_INCOME_DATA} />
          <ExpensesWidget {...MOCK_EXPENSES_DATA} />
          <CashFlowWidget {...MOCK_CASHFLOW_DATA} />

          {/* Row 2 */}
          <YieldWidget {...MOCK_YIELD_DATA} />
          <ROIWidget {...MOCK_ROI_DATA} />
          <OccupancyWidget {...MOCK_OCCUPANCY_DATA} />

          {/* Row 3 */}
          <TopPerformersWidget
            properties={MOCK_TOP_PERFORMERS}
            reasons={[
              "Prime locations",
              "Below-market purchase prices",
              "Low maintenance costs",
              "Stable long-term tenants",
            ]}
          />
          <NeedsAttentionWidget items={MOCK_ATTENTION_ITEMS} totalIssues={7} />
          <RecentActivityWidget activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </AppLayout>
  );
}

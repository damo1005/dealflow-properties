import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, TrendingUp, BarChart3, AlertTriangle, PiggyBank, Download } from "lucide-react";
import { ForecastSummaryCard } from "@/components/scenarios/ForecastSummaryCard";
import { MonthlyBreakdownTable } from "@/components/scenarios/MonthlyBreakdownTable";
import { ScheduledEventsCard } from "@/components/scenarios/ScheduledEventsCard";

import type { MonthlyForecast, ScheduledEvent, ScenarioSummary } from "@/types/scenario";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

// Mock data
const MOCK_FORECASTS: MonthlyForecast[] = [
  { month: "Feb 26", income: 18500, expenses: 14250, netCashFlow: 4250, cumulative: 4250, confidence: "high", notes: "Actual data" },
  { month: "Mar 26", income: 18500, expenses: 14250, netCashFlow: 4250, cumulative: 8500, confidence: "high", notes: "Confirmed" },
  { month: "Apr 26", income: 18500, expenses: 18750, netCashFlow: -250, cumulative: 8250, confidence: "medium", notes: "Boiler service £4.5K" },
  { month: "May 26", income: 17200, expenses: 14250, netCashFlow: 2950, cumulative: 11200, confidence: "medium", notes: "Elm St void" },
  { month: "Jun 26", income: 19100, expenses: 14250, netCashFlow: 4850, cumulative: 16050, confidence: "high", notes: "Rent review +£600" },
  { month: "Jul 26", income: 19100, expenses: 14250, netCashFlow: 4850, cumulative: 20900, confidence: "high" },
  { month: "Aug 26", income: 19100, expenses: 14250, netCashFlow: 4850, cumulative: 25750, confidence: "high" },
  { month: "Sep 26", income: 19100, expenses: 14250, netCashFlow: 4850, cumulative: 30600, confidence: "high" },
  { month: "Oct 26", income: 19100, expenses: 14250, netCashFlow: 4850, cumulative: 35450, confidence: "medium" },
  { month: "Nov 26", income: 19100, expenses: 14250, netCashFlow: 4850, cumulative: 40300, confidence: "medium" },
  { month: "Dec 26", income: 19100, expenses: 14250, netCashFlow: 4850, cumulative: 45150, confidence: "medium" },
  { month: "Jan 27", income: 19100, expenses: 14250, netCashFlow: 4850, cumulative: 50000, confidence: "medium" },
];

const MOCK_EVENTS: ScheduledEvent[] = [
  { id: "1", user_id: "1", property_id: "1", event_type: "planned_maintenance", event_date: "2026-04-15", estimated_cost: 450, description: "Boiler service (5 properties)", is_confirmed: true, is_completed: false, created_at: "" },
  { id: "2", user_id: "1", property_id: "2", event_type: "gas_safety", event_date: "2026-04-20", estimated_cost: 225, description: "Gas safety (3 properties)", is_confirmed: false, is_completed: false, created_at: "" },
  { id: "3", user_id: "1", property_id: "3", event_type: "tenancy_end", event_date: "2026-05-15", description: "789 Elm Street - Expected void: 14 days", is_confirmed: false, is_completed: false, created_at: "" },
  { id: "4", user_id: "1", property_id: "1", event_type: "rent_review", event_date: "2026-06-01", income_impact: 150, description: "123 High Street - Current: £1,850, Proposed: £2,000 (+8%)", is_confirmed: false, is_completed: false, created_at: "" },
  { id: "5", user_id: "1", property_id: "2", event_type: "rent_review", event_date: "2026-06-15", income_impact: 62, description: "456 Oak Avenue - +5% increase", is_confirmed: false, is_completed: false, created_at: "" },
  { id: "6", user_id: "1", property_id: "4", event_type: "mortgage_end", event_date: "2026-09-01", description: "321 Pine Road - Options: Remortgage or pay off", is_confirmed: true, is_completed: false, created_at: "" },
];

const MOCK_SCENARIOS: ScenarioSummary[] = [
  { name: "Optimistic", type: "optimistic", totalIncome: 235000, totalExpenses: 165000, netCashFlow: 70000, color: "hsl(142, 76%, 36%)" },
  { name: "Base Case", type: "base", totalIncome: 222000, totalExpenses: 171000, netCashFlow: 51000, color: "hsl(var(--primary))" },
  { name: "Pessimistic", type: "pessimistic", totalIncome: 205000, totalExpenses: 188000, netCashFlow: 17000, color: "hsl(0, 84%, 60%)" },
];

const SCENARIO_CHART_DATA = [
  { month: "Feb", optimistic: 5200, base: 4250, pessimistic: 2800 },
  { month: "Mar", optimistic: 5400, base: 4250, pessimistic: 2600 },
  { month: "Apr", optimistic: 5000, base: -250, pessimistic: -1500 },
  { month: "May", optimistic: 5800, base: 2950, pessimistic: 1200 },
  { month: "Jun", optimistic: 6200, base: 4850, pessimistic: 2000 },
  { month: "Jul", optimistic: 6000, base: 4850, pessimistic: 2200 },
];

export default function Forecasting() {
  const [selectedScenario, setSelectedScenario] = useState("base");
  const [timeRange, setTimeRange] = useState("12");

  const projectedIncome = MOCK_FORECASTS.reduce((sum, f) => sum + f.income, 0);
  const projectedExpenses = MOCK_FORECASTS.reduce((sum, f) => sum + f.expenses, 0);
  const projectedNetCashFlow = projectedIncome - projectedExpenses;
  const averageMonthly = Math.round(projectedNetCashFlow / 12);
  const highConfidenceMonths = MOCK_FORECASTS.filter(f => f.confidence === 'high').length;
  const mediumConfidenceMonths = MOCK_FORECASTS.filter(f => f.confidence === 'medium').length;

  return (
    <AppLayout title="Cash Flow Forecasting">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Cash Flow Forecasting
            </h1>
            <p className="text-muted-foreground">
              12-month rolling forecast with scenario planning
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Next 6 Months</SelectItem>
                <SelectItem value="12">Next 12 Months</SelectItem>
                <SelectItem value="24">Next 24 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <ForecastSummaryCard
          projectedIncome={projectedIncome}
          projectedExpenses={projectedExpenses}
          projectedNetCashFlow={projectedNetCashFlow}
          averageMonthly={averageMonthly}
          highConfidenceMonths={highConfidenceMonths}
          mediumConfidenceMonths={mediumConfidenceMonths}
        />

        <Tabs defaultValue="forecast" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forecast" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="reserves" className="flex items-center gap-1">
              <PiggyBank className="h-4 w-4" />
              Reserves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-6">
            {/* Cash Flow Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Monthly Cash Flow Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_FORECASTS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(v) => `£${(v / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                        formatter={(value: number) => [`£${value.toLocaleString()}`, "Net Cash Flow"]}
                      />
                      <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <Bar dataKey="netCashFlow" radius={[4, 4, 0, 0]}>
                        {MOCK_FORECASTS.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.netCashFlow >= 0
                                ? entry.confidence === 'high'
                                  ? "hsl(142, 76%, 36%)"
                                  : entry.confidence === 'medium'
                                  ? "hsl(142, 60%, 50%)"
                                  : "hsl(142, 40%, 60%)"
                                : "hsl(0, 84%, 60%)"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-600" />
                    <span>High Confidence</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span>Negative</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Breakdown Table */}
            <MonthlyBreakdownTable forecasts={MOCK_FORECASTS} />

            {/* Alerts */}
            <Card className="border-yellow-300 dark:border-yellow-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Cash Flow Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                  <p className="font-medium text-yellow-800 dark:text-yellow-400">
                    ⚠️ April 2026 - NEGATIVE CASH FLOW
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                    Due to scheduled boiler services (£4,500). Shortfall: -£250
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommendation: Set aside £250 from March surplus
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                  <p className="font-medium text-yellow-800 dark:text-yellow-400">
                    ⚠️ May 2026 - REDUCED CASH FLOW
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                    Due to expected void (789 Elm Street). Lost income: ~£650
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommendation: Start marketing property early
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <ScheduledEventsCard events={MOCK_EVENTS} />
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Viewing:</span>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="optimistic">Optimistic</SelectItem>
                  <SelectItem value="base">Base Case</SelectItem>
                  <SelectItem value="pessimistic">Pessimistic</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">Create Scenario</Button>
            </div>

            {/* Scenario comparison chart placeholder */}
            <Card>
              <CardHeader><CardTitle>Scenario Comparison</CardTitle></CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                Scenario comparison chart - select scenarios above to compare
              </CardContent>
            </Card>

            {/* Scenario Details */}
            <div className="grid gap-4 md:grid-cols-3">
              {MOCK_SCENARIOS.map((scenario) => (
                <Card key={scenario.name} className={selectedScenario === scenario.type ? "ring-2 ring-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      {scenario.name}
                      {scenario.type === 'base' && <Badge>Default</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Income</span>
                      <span>£{scenario.totalIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Expenses</span>
                      <span>£{scenario.totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Net Cash Flow</span>
                      <span style={{ color: scenario.color }}>
                        £{scenario.netCashFlow.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reserves" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Cash Reserve Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Target Reserve</p>
                    <p className="text-2xl font-bold text-red-600">£42,000</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Reserve</p>
                    <p className="text-2xl font-bold">£28,500</p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Shortfall</p>
                    <p className="text-2xl font-bold text-yellow-600">£13,500</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium">Reserve Calculation</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>3 months expenses</span>
                      <span>£42,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency repairs</span>
                      <span>£5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Void coverage (2 months)</span>
                      <span>£18,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legal/eviction fund</span>
                      <span>£5,000</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Recommended total</span>
                      <span>£71,250</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Monthly Contribution Plan</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Current surplus</span>
                      <span>£4,250/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommended save</span>
                      <span>£1,500/month</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Time to target</span>
                      <span>9 months</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Set Up Auto-Transfer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAlertsStore } from "@/stores/alertsStore";
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
} from "recharts";

// Mock data for charts
const matchesOverTime = [
  { day: "Mon", matches: 3 },
  { day: "Tue", matches: 5 },
  { day: "Wed", matches: 2 },
  { day: "Thu", matches: 7 },
  { day: "Fri", matches: 4 },
  { day: "Sat", matches: 1 },
  { day: "Sun", matches: 3 },
];

const alertPerformance = [
  { name: "Enfield Studios", sent: 12, opened: 10, clicked: 7, enquiries: 3 },
  { name: "North London", sent: 8, opened: 6, clicked: 4, enquiries: 1 },
  { name: "Hackney", sent: 5, opened: 4, clicked: 2, enquiries: 1 },
];

const qualityDistribution = [
  { name: "90-100%", value: 15, color: "hsl(var(--chart-1))" },
  { name: "80-89%", value: 35, color: "hsl(var(--chart-2))" },
  { name: "70-79%", value: 40, color: "hsl(var(--chart-3))" },
  { name: "60-69%", value: 10, color: "hsl(var(--chart-4))" },
];

const engagementFunnel = [
  { stage: "Sent", count: 47, pct: 100 },
  { stage: "Opened", count: 38, pct: 81 },
  { stage: "Clicked", count: 24, pct: 51 },
  { stage: "Enquired", count: 8, pct: 17 },
];

export function AlertsAnalytics() {
  const { alerts } = useAlertsStore();

  const totalMatches = alerts.reduce((sum, a) => sum + a.total_matches_sent, 0);
  const activeAlerts = alerts.filter((a) => a.is_active).length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Alerts</p>
            <p className="text-2xl font-bold">{alerts.length}</p>
            <p className="text-xs text-muted-foreground">
              {activeAlerts} active, {alerts.length - activeAlerts} paused
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Matches This Month</p>
            <p className="text-2xl font-bold">{totalMatches}</p>
            <p className="text-xs text-green-500">↑ 12% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Open Rate</p>
            <p className="text-2xl font-bold">81%</p>
            <p className="text-xs text-green-500">↑ 5% vs average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Enquiry Rate</p>
            <p className="text-2xl font-bold">17%</p>
            <p className="text-xs text-muted-foreground">8 total enquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matches Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Matches This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchesOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="matches"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Match Quality Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {qualityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {qualityDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Alert Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis type="category" dataKey="name" className="text-xs" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="sent" fill="hsl(var(--chart-1))" name="Sent" />
                  <Bar dataKey="opened" fill="hsl(var(--chart-2))" name="Opened" />
                  <Bar dataKey="clicked" fill="hsl(var(--chart-3))" name="Clicked" />
                  <Bar dataKey="enquiries" fill="hsl(var(--chart-4))" name="Enquiries" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementFunnel.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.count} ({stage.pct}%)
                    </span>
                  </div>
                  <div className="h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${stage.pct}%`,
                        backgroundColor: `hsl(var(--chart-${index + 1}))`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Your "Enfield Studios" alert performs 40% better than similar alerts.</strong>
                <br />
                <span className="text-muted-foreground">
                  Consider creating more alerts with similar criteria.
                </span>
              </p>
            </div>
            <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <p className="text-sm">
                <strong>📈 Increasing your budget to £1,600 would add ~3 matches per week.</strong>
                <br />
                <span className="text-muted-foreground">
                  There's more activity in the £1,500-£1,600 range.
                </span>
              </p>
            </div>
            <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
              <p className="text-sm">
                <strong>⏰ Most matches are posted between 9-11 AM.</strong>
                <br />
                <span className="text-muted-foreground">
                  Switch to instant alerts to be first to respond.
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

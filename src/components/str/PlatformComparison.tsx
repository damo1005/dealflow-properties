import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, Lightbulb, Crown } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { STRBooking, PlatformConnection, PlatformName } from "@/types/str";
import { useState } from "react";

interface PlatformComparisonProps {
  bookings: STRBooking[];
  connections: PlatformConnection[];
}

const PLATFORM_COLORS: Record<PlatformName, string> = {
  airbnb: "#3B82F6",
  booking_com: "#EAB308",
  vrbo: "#10B981",
  expedia: "#F97316",
  tripadvisor: "#22C55E",
  google: "#2563EB",
  hotels_com: "#EF4444",
  agoda: "#8B5CF6",
  plum_guide: "#EC4899",
  marriott: "#6366F1",
  direct: "#6B7280",
};

const PLATFORM_LABELS: Record<PlatformName, string> = {
  airbnb: "Airbnb",
  booking_com: "Booking.com",
  vrbo: "VRBO",
  expedia: "Expedia",
  tripadvisor: "TripAdvisor",
  google: "Google",
  hotels_com: "Hotels.com",
  agoda: "Agoda",
  plum_guide: "Plum Guide",
  marriott: "Marriott",
  direct: "Direct",
};

const PLATFORM_FEE_RATES: Record<PlatformName, number> = {
  airbnb: 0.15,
  booking_com: 0.15,
  vrbo: 0.05,
  expedia: 0.15,
  tripadvisor: 0.12,
  google: 0.0,
  hotels_com: 0.15,
  agoda: 0.15,
  plum_guide: 0.15,
  marriott: 0.10,
  direct: 0.0,
};

export function PlatformComparison({
  bookings,
  connections,
}: PlatformComparisonProps) {
  const [period, setPeriod] = useState("month");

  // Calculate metrics per platform
  const platformMetrics = useMemo(() => {
    const metrics: Record<
      string,
      {
        platform: PlatformName;
        bookings: number;
        nights: number;
        revenue: number;
        avgRate: number;
        fees: number;
        netRevenue: number;
      }
    > = {};

    connections.forEach((conn) => {
      metrics[conn.platform_name] = {
        platform: conn.platform_name,
        bookings: 0,
        nights: 0,
        revenue: 0,
        avgRate: 0,
        fees: 0,
        netRevenue: 0,
      };
    });

    bookings.forEach((booking) => {
      const platform = booking.platform as PlatformName;
      if (!metrics[platform]) return;

      const revenue = booking.total_payout || 0;
      const nights = booking.nights || 1;
      const feeRate = PLATFORM_FEE_RATES[platform] || 0.15;
      const estimatedFees = revenue * feeRate;

      metrics[platform].bookings += 1;
      metrics[platform].nights += nights;
      metrics[platform].revenue += revenue;
      metrics[platform].fees += estimatedFees;
    });

    // Calculate averages and net revenue
    Object.values(metrics).forEach((m) => {
      m.avgRate = m.nights > 0 ? m.revenue / m.nights : 0;
      m.netRevenue = m.revenue - m.fees;
    });

    return Object.values(metrics).sort((a, b) => b.revenue - a.revenue);
  }, [bookings, connections]);

  // Totals
  const totals = useMemo(() => {
    return platformMetrics.reduce(
      (acc, m) => ({
        bookings: acc.bookings + m.bookings,
        nights: acc.nights + m.nights,
        revenue: acc.revenue + m.revenue,
        fees: acc.fees + m.fees,
        netRevenue: acc.netRevenue + m.netRevenue,
      }),
      { bookings: 0, nights: 0, revenue: 0, fees: 0, netRevenue: 0 }
    );
  }, [platformMetrics]);

  // Best performer
  const bestPerformer = platformMetrics[0];

  // Pie chart data
  const pieData = platformMetrics.map((m) => ({
    name: PLATFORM_LABELS[m.platform],
    value: m.revenue,
    color: PLATFORM_COLORS[m.platform],
  }));

  // Mock trend data
  const trendData = [
    { month: "Sep", airbnb: 1200, booking_com: 800, vrbo: 400 },
    { month: "Oct", airbnb: 1400, booking_com: 900, vrbo: 500 },
    { month: "Nov", airbnb: 1300, booking_com: 850, vrbo: 450 },
    { month: "Dec", airbnb: 1600, booking_com: 1000, vrbo: 600 },
    { month: "Jan", airbnb: 1500, booking_com: 950, vrbo: 550 },
    { month: "Feb", airbnb: 1440, booking_com: 920, vrbo: 720 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Platform Performance</h2>
          <p className="text-sm text-muted-foreground">
            Compare revenue across all your booking platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">£{totals.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {totals.bookings} bookings
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Nightly Rate</p>
                <p className="text-2xl font-bold">
                  £{totals.nights > 0 ? Math.round(totals.revenue / totals.nights) : 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totals.nights} nights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platform Fees</p>
                <p className="text-2xl font-bold text-destructive">
                  £{totals.fees.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totals.revenue > 0
                    ? Math.round((totals.fees / totals.revenue) * 100)
                    : 0}
                  % of gross
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">Best Performer</p>
                </div>
                <p className="text-xl font-bold">
                  {bestPerformer ? PLATFORM_LABELS[bestPerformer.platform] : "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {bestPerformer?.bookings || 0} bookings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `£${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `£${v}`} />
                  <Tooltip formatter={(value: number) => `£${value}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="airbnb"
                    name="Airbnb"
                    stroke={PLATFORM_COLORS.airbnb}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="booking_com"
                    name="Booking.com"
                    stroke={PLATFORM_COLORS.booking_com}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="vrbo"
                    name="VRBO"
                    stroke={PLATFORM_COLORS.vrbo}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Bookings</TableHead>
                  <TableHead className="text-right">Nights</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Avg Rate</TableHead>
                  <TableHead className="text-right">Fees</TableHead>
                  <TableHead className="text-right">Net Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platformMetrics.map((m) => (
                  <TableRow key={m.platform}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: PLATFORM_COLORS[m.platform] }}
                        />
                        <span className="font-medium">
                          {PLATFORM_LABELS[m.platform]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{m.bookings}</TableCell>
                    <TableCell className="text-right">{m.nights}</TableCell>
                    <TableCell className="text-right font-medium">
                      £{m.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      £{Math.round(m.avgRate)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      £{Math.round(m.fees)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">
                      £{Math.round(m.netRevenue).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{totals.bookings}</TableCell>
                  <TableCell className="text-right">{totals.nights}</TableCell>
                  <TableCell className="text-right">
                    £{totals.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    £{totals.nights > 0 ? Math.round(totals.revenue / totals.nights) : 0}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    £{Math.round(totals.fees)}
                  </TableCell>
                  <TableCell className="text-right text-emerald-600">
                    £{Math.round(totals.netRevenue).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platformMetrics[0] && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="font-medium">
                  🏆 {PLATFORM_LABELS[platformMetrics[0].platform]} drives{" "}
                  {totals.revenue > 0
                    ? Math.round((platformMetrics[0].revenue / totals.revenue) * 100)
                    : 0}
                  % of revenue
                </p>
                <p className="text-sm text-muted-foreground">
                  Keep this listing optimized!
                </p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-muted/50 space-y-1">
              <p className="font-medium">
                💰 Total platform fees: £{Math.round(totals.fees)}/month
              </p>
              <p className="text-sm text-muted-foreground">
                Direct bookings could save ~£{Math.round(totals.fees * 0.3)}/month
              </p>
            </div>

            {platformMetrics.length > 1 && platformMetrics[1].avgRate < platformMetrics[0].avgRate && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
                <p className="font-medium text-amber-700">
                  ⚠️ {PLATFORM_LABELS[platformMetrics[1].platform]} has lower avg rate
                </p>
                <p className="text-sm text-amber-600">
                  Consider increasing prices by £
                  {Math.round(platformMetrics[0].avgRate - platformMetrics[1].avgRate)}
                </p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <p className="font-medium text-emerald-700">
                ✓ Multi-platform strategy working
              </p>
              <p className="text-sm text-emerald-600">
                You're maximizing exposure across {connections.length} platforms
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

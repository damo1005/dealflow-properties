import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, TrendingUp, DollarSign, Percent, Users } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { RevenueLog } from "@/types/admin";

// Mock revenue data
const mockRevenueData = [
  { month: "Sep", subscription: 26000, affiliate: 6000 },
  { month: "Oct", subscription: 28000, affiliate: 7500 },
  { month: "Nov", subscription: 30000, affiliate: 9000 },
  { month: "Dec", subscription: 31000, affiliate: 10500 },
  { month: "Jan", subscription: 33000, affiliate: 11000 },
  { month: "Feb", subscription: 34500, affiliate: 12000 },
];

export default function AdminRevenue() {
  const { revenueLog, isLoadingRevenue, setRevenueLog, setIsLoadingRevenue } = useAdminStore();
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    setIsLoadingRevenue(true);
    try {
      const { data, error } = await supabase
        .from("revenue_log")
        .select("*")
        .order("transaction_date", { ascending: false })
        .limit(100);

      if (error) throw error;
      setRevenueLog((data || []) as RevenueLog[]);
    } catch (error) {
      console.error("Error fetching revenue:", error);
    } finally {
      setIsLoadingRevenue(false);
    }
  };

  // Calculate stats
  const totalRevenue = mockRevenueData.reduce(
    (sum, d) => sum + d.subscription + d.affiliate,
    0
  );
  const subscriptionRevenue = mockRevenueData.reduce((sum, d) => sum + d.subscription, 0);
  const affiliateRevenue = mockRevenueData.reduce((sum, d) => sum + d.affiliate, 0);
  const mrr = 34526;
  const growth = 18;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Revenue Analytics</h1>
            <p className="text-muted-foreground">
              Track platform revenue and growth
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">£{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-emerald-500">+{growth}% vs last period</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Subscriptions</p>
                  <p className="text-2xl font-bold">£{subscriptionRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">847 Pro, 124 Premium</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Affiliate Revenue</p>
                  <p className="text-2xl font-bold">£{affiliateRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">56 conversions</p>
                </div>
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Percent className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">MRR</p>
                  <p className="text-2xl font-bold">£{mrr.toLocaleString()}</p>
                  <p className="text-xs text-emerald-500">+£4,200 this month</p>
                </div>
                <div className="p-3 rounded-full bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `£${v / 1000}k`} />
                  <Tooltip formatter={(value: number) => `£${value.toLocaleString()}`} />
                  <Area
                    type="monotone"
                    dataKey="subscription"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    name="Subscriptions"
                  />
                  <Area
                    type="monotone"
                    dataKey="affiliate"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                    name="Affiliate"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subscription Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Free</Badge>
                    <span>1,876 users</span>
                  </div>
                  <span className="text-muted-foreground">£0/mo</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-500">Pro</Badge>
                    <span>847 users</span>
                  </div>
                  <span className="font-medium">£24,563/mo</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500">Premium</Badge>
                    <span>124 users</span>
                  </div>
                  <span className="font-medium">£12,276/mo</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total MRR</span>
                    <span>£36,839/mo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Churn Rate</span>
                  <span className="font-medium">3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg Customer LTV</span>
                  <span className="font-medium">£420</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pro LTV (12mo avg)</span>
                  <span className="font-medium">£348</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Premium LTV (12mo avg)</span>
                  <span className="font-medium">£1,188</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Free → Pro Conversion</span>
                  <span className="font-medium">18 this month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pro → Premium Upgrade</span>
                  <span className="font-medium">5 this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

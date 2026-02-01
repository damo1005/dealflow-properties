import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/stores/adminStore";
import { useAdminStats } from "@/hooks/useAdminStats";
import { 
  Users, 
  TicketCheck, 
  DollarSign, 
  Settings,
  ArrowUpCircle,
  MessageSquare,
  CheckCircle2,
  UserPlus
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
} from "recharts";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { setStats } = useAdminStore();
  const { data: adminStats, isLoading, error } = useAdminStats();

  useEffect(() => {
    if (adminStats) {
      setStats({
        totalUsers: adminStats.totalUsers,
        newUsersThisWeek: adminStats.newUsersThisWeek,
        proSubscriptions: adminStats.proSubscriptions,
        premiumSubscriptions: adminStats.premiumSubscriptions,
        mrr: adminStats.mrr,
        pendingCommissions: adminStats.pendingCommissions,
        pendingCommissionCount: adminStats.pendingCommissionCount,
        openTickets: adminStats.openTickets,
        urgentTickets: adminStats.urgentTickets,
        avgResponseTime: adminStats.avgResponseTime,
      });
    }
  }, [adminStats, setStats]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upgrade":
        return <ArrowUpCircle className="h-4 w-4 text-emerald-500" />;
      case "ticket":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "commission":
        return <CheckCircle2 className="h-4 w-4 text-amber-500" />;
      case "signup":
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Access denied. Admin privileges required.</p>
        </div>
      </AdminLayout>
    );
  }

  const revenueData = adminStats?.revenueByMonth || [
    { name: "Jan", subscription: 28000, affiliate: 8000 },
    { name: "Feb", subscription: 30000, affiliate: 10000 },
    { name: "Mar", subscription: 32000, affiliate: 9500 },
    { name: "Apr", subscription: 34000, affiliate: 11000 },
  ];

  const featureUsageData = adminStats?.featureUsage || [
    { name: "Calculator", uses: 1247 },
    { name: "Search", uses: 892 },
    { name: "Scout", uses: 234 },
    { name: "Network", uses: 567 },
    { name: "STR", uses: 189 },
  ];

  const recentActivity = adminStats?.recentActivity || [
    { id: "1", type: "upgrade", message: 'User "john@example.com" upgraded to Pro', time: new Date(Date.now() - 2 * 60 * 1000) },
    { id: "2", type: "ticket", message: "New support ticket #1234", time: new Date(Date.now() - 5 * 60 * 1000) },
    { id: "3", type: "commission", message: "Mortgage commission approved: £450", time: new Date(Date.now() - 15 * 60 * 1000) },
    { id: "4", type: "signup", message: "5 new users signed up", time: new Date(Date.now() - 60 * 60 * 1000) },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening on your platform.
          </p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <AdminStatsCards stats={adminStats ? {
            totalUsers: adminStats.totalUsers,
            newUsersThisWeek: adminStats.newUsersThisWeek,
            proSubscriptions: adminStats.proSubscriptions,
            premiumSubscriptions: adminStats.premiumSubscriptions,
            mrr: adminStats.mrr,
            pendingCommissions: adminStats.pendingCommissions,
            pendingCommissionCount: adminStats.pendingCommissionCount,
            openTickets: adminStats.openTickets,
            urgentTickets: adminStats.urgentTickets,
            avgResponseTime: adminStats.avgResponseTime,
          } : null} />
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue (Last 4 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(v) => `£${v / 1000}k`} />
                      <Tooltip formatter={(value: number) => `£${value.toLocaleString()}`} />
                      <Line
                        type="monotone"
                        dataKey="subscription"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Subscriptions"
                      />
                      <Line
                        type="monotone"
                        dataKey="affiliate"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        name="Affiliate"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feature Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feature Usage (This Week)</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureUsageData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar
                        dataKey="uses"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.time, { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/users")}
              >
                <Users className="h-4 w-4 mr-2" />
                View All Users
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/support")}
              >
                <TicketCheck className="h-4 w-4 mr-2" />
                Pending Tickets
                {(adminStats?.openTickets || 0) > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {adminStats?.openTickets}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/affiliates")}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Commission Reports
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

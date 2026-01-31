import { Building2, Bell, GitBranch } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { PropertiesChart } from "@/components/dashboard/PropertiesChart";

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Properties Saved"
            value={47}
            subtitle="12 added this month"
            icon={<Building2 className="h-6 w-6" />}
            trend={{ value: 12, positive: true }}
          />
          <MetricCard
            title="Active Alerts"
            value={8}
            subtitle="2 triggered today"
            icon={<Bell className="h-6 w-6" />}
          />
          <MetricCard
            title="Deals in Pipeline"
            value={15}
            subtitle="3 in negotiation"
            icon={<GitBranch className="h-6 w-6" />}
            trend={{ value: 8, positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart - spans 2 columns */}
          <div className="lg:col-span-2">
            <PropertiesChart />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityFeed />
          <div className="hidden lg:block" />
        </div>
      </div>
    </AppLayout>
  );
}

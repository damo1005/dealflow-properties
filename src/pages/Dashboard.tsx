import { Building2, Bell, GitBranch } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { PropertiesChart } from "@/components/dashboard/PropertiesChart";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <AppLayout 
      title="Dashboard"
      actions={<UpgradeButton variant="outline" size="sm" />}
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <MetricCard
                title="Properties Saved"
                value={stats?.propertiesSaved || 0}
                subtitle={`${stats?.propertiesLastMonth || 0} added this month`}
                icon={<Building2 className="h-6 w-6" />}
                trend={stats?.propertiesLastMonth ? { value: stats.propertiesLastMonth, positive: true } : undefined}
              />
              <MetricCard
                title="Active Alerts"
                value={stats?.activeAlerts || 0}
                subtitle={`${stats?.alertsTriggeredToday || 0} triggered today`}
                icon={<Bell className="h-6 w-6" />}
              />
              <MetricCard
                title="Deals in Pipeline"
                value={stats?.dealsInPipeline || 0}
                subtitle={`${stats?.dealsInNegotiation || 0} in negotiation`}
                icon={<GitBranch className="h-6 w-6" />}
                trend={stats?.dealsInNegotiation ? { value: stats.dealsInNegotiation, positive: true } : undefined}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart - spans 2 columns */}
          <div className="lg:col-span-2">
            <PropertiesChart data={stats?.propertiesOverTime} isLoading={isLoading} />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityFeed activities={stats?.recentActivity} isLoading={isLoading} />
          <div className="hidden lg:block" />
        </div>
      </div>
    </AppLayout>
  );
}

import { useNavigate } from "react-router-dom";
import { Building2, Bell, GitBranch, Calculator, Home } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { PropertiesChart } from "@/components/dashboard/PropertiesChart";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  const navigate = useNavigate();

  const isAllZero = !isLoading && stats &&
    stats.propertiesSaved === 0 &&
    stats.dealsInPipeline === 0 &&
    stats.activeAlerts === 0;

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
                title="Properties Tracked"
                value={stats?.propertiesSaved || 0}
                subtitle={isAllZero ? "Add properties to track your SA business" : `${stats?.propertiesLastMonth || 0} added this month`}
                icon={<Building2 className="h-6 w-6" />}
                trend={stats?.propertiesLastMonth ? { value: stats.propertiesLastMonth, positive: true } : undefined}
              />
              <MetricCard
                title="Active Alerts"
                value={stats?.activeAlerts || 0}
                subtitle={isAllZero ? "Set up alerts to find new deals" : `${stats?.alertsTriggeredToday || 0} triggered today`}
                icon={<Bell className="h-6 w-6" />}
              />
              <MetricCard
                title="Deals in Pipeline"
                value={stats?.dealsInPipeline || 0}
                subtitle={isAllZero ? "Analyse a deal to get started" : `${stats?.dealsInNegotiation || 0} in negotiation`}
                icon={<GitBranch className="h-6 w-6" />}
                trend={stats?.dealsInNegotiation ? { value: stats.dealsInNegotiation, positive: true } : undefined}
              />
            </>
          )}
        </div>

        {/* Zero-state CTA */}
        {isAllZero && (
          <div className="flex flex-col items-center justify-center py-10 border rounded-lg border-dashed bg-muted/20">
            <Calculator className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-1">Get started with your first deal</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Run a deal analysis to see if a property stacks up, then generate a landlord pitch and track it in your pipeline.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/deal-analyser")}>
                Analyse a Deal
              </Button>
              <Button variant="outline" onClick={() => navigate("/pipeline")}>
                View Pipeline
              </Button>
            </div>
          </div>
        )}

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

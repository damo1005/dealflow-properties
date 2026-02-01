import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bell, BellOff, History, BarChart3 } from "lucide-react";
import { AlertsList } from "@/components/alerts/AlertsList";
import { CreateAlertWizard } from "@/components/alerts/CreateAlertWizard";
import { AlertsAnalytics } from "@/components/alerts/AlertsAnalytics";
import { useAlertsStore, mockAlerts, mockAlertMatches } from "@/stores/alertsStore";
import { Card, CardContent } from "@/components/ui/card";

const Alerts = () => {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const { alerts, setAlerts, setMatches } = useAlertsStore();

  useEffect(() => {
    // Load mock data for development
    setAlerts(mockAlerts);
    setMatches(mockAlertMatches);
  }, [setAlerts, setMatches]);

  const activeAlerts = alerts.filter((a) => a.is_active);
  const pausedAlerts = alerts.filter((a) => !a.is_active);
  const totalMatchesToday = alerts.reduce((sum, a) => sum + a.alerts_sent_today, 0);
  const totalMatchesWeek = alerts.reduce((sum, a) => sum + a.total_matches_sent, 0);

  if (showCreateWizard) {
    return (
      <AppLayout>
        <CreateAlertWizard onClose={() => setShowCreateWizard(false)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Alerts</h1>
            <p className="text-muted-foreground">
              Get notified when matching requests are posted
            </p>
          </div>
          <Button onClick={() => setShowCreateWizard(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Total Alerts</span>
              </div>
              <p className="text-2xl font-bold mt-1">{alerts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Matches Today</span>
              </div>
              <p className="text-2xl font-bold mt-1">{totalMatchesToday}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">This Week</span>
              </div>
              <p className="text-2xl font-bold mt-1">{totalMatchesWeek}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Best Performing</span>
              </div>
              <p className="text-lg font-semibold mt-1 truncate">
                {alerts[0]?.name || "No alerts"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Bell className="h-4 w-4" />
              Active ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="paused" className="gap-2">
              <BellOff className="h-4 w-4" />
              Paused ({pausedAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <AlertsList 
              alerts={activeAlerts} 
              emptyMessage="No active alerts. Create one to get started!"
              onCreateClick={() => setShowCreateWizard(true)}
            />
          </TabsContent>

          <TabsContent value="paused" className="mt-6">
            <AlertsList 
              alerts={pausedAlerts} 
              emptyMessage="No paused alerts."
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AlertsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Alerts;

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Bell, BellOff, Settings, BarChart3 } from "lucide-react";
import { NotificationsList } from "@/components/alerts/NotificationsList";
import { SavedSearchesList } from "@/components/alerts/SavedSearchesList";
import { NotificationSettings } from "@/components/alerts/NotificationSettings";
import { CreateSearchDialog } from "@/components/alerts/CreateSearchDialog";
import { useUnreadCount, useMarkAllAsRead } from "@/hooks/useNotifications";
import { useSavedSearches } from "@/hooks/useSavedSearches";

const Alerts = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: savedSearches = [] } = useSavedSearches();
  const markAllAsRead = useMarkAllAsRead();

  const activeSearches = savedSearches.filter((s) => s.alert_enabled);
  const pausedSearches = savedSearches.filter((s) => !s.alert_enabled);
  const totalNewListings = savedSearches.reduce((sum, s) => sum + (s.new_listings_count || 0), 0);

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Property Alerts</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Get notified when new listings match your saved searches
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="lg">
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
                <span className="text-sm text-muted-foreground">Saved Searches</span>
              </div>
              <p className="text-2xl font-bold mt-1">{savedSearches.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Active Alerts</span>
              </div>
              <p className="text-2xl font-bold mt-1">{activeSearches.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">New Listings</span>
              </div>
              <p className="text-2xl font-bold mt-1">{totalNewListings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Unread</span>
              </div>
              <p className="text-2xl font-bold mt-1">{unreadCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="searches" className="gap-2">
              <BellOff className="h-4 w-4" />
              Saved Searches ({savedSearches.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsList 
              onMarkAllRead={() => markAllAsRead.mutate()} 
              unreadCount={unreadCount}
            />
          </TabsContent>

          <TabsContent value="searches" className="mt-6">
            <SavedSearchesList onCreateNew={() => setShowCreateDialog(true)} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>

      <CreateSearchDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </AppLayout>
  );
};

export default Alerts;

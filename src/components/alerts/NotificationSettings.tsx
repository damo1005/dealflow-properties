import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { PushNotificationSettings } from "./PushNotificationSettings";

export function NotificationSettings() {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const updatePrefs = useUpdateNotificationPreferences();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Push Notifications */}
      <PushNotificationSettings />

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Listings</p>
                <p className="text-sm text-muted-foreground">Get emailed when new properties match your searches</p>
              </div>
              <Switch
                checked={prefs?.email_new_listings ?? true}
                onCheckedChange={(checked) => updatePrefs.mutate({ email_new_listings: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Price Drops</p>
                <p className="text-sm text-muted-foreground">Get emailed when saved properties reduce in price</p>
              </div>
              <Switch
                checked={prefs?.email_price_drops ?? true}
                onCheckedChange={(checked) => updatePrefs.mutate({ email_price_drops: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Digest</p>
                <p className="text-sm text-muted-foreground">Receive a summary of all new listings</p>
              </div>
              <Switch
                checked={prefs?.email_digest ?? true}
                onCheckedChange={(checked) => updatePrefs.mutate({ email_digest: checked })}
              />
            </div>

            {prefs?.email_digest && (
              <div className="pl-4 border-l-2 border-muted">
                <p className="text-sm font-medium mb-2">Digest Frequency</p>
                <Select
                  value={prefs?.email_digest_frequency || "daily"}
                  onValueChange={(v) => updatePrefs.mutate({ email_digest_frequency: v })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Quiet Hours</p>
              <p className="text-sm text-muted-foreground">No notifications during specified hours</p>
            </div>
            <Switch
              checked={prefs?.quiet_hours_enabled ?? false}
              onCheckedChange={(checked) => updatePrefs.mutate({ quiet_hours_enabled: checked })}
            />
          </div>

          {prefs?.quiet_hours_enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Start</p>
                <Select
                  value={prefs?.quiet_hours_start?.slice(0, 5) || "22:00"}
                  onValueChange={(v) => updatePrefs.mutate({ quiet_hours_start: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                        {i.toString().padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">End</p>
                <Select
                  value={prefs?.quiet_hours_end?.slice(0, 5) || "08:00"}
                  onValueChange={(v) => updatePrefs.mutate({ quiet_hours_end: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                        {i.toString().padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

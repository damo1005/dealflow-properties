import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Smartphone, Monitor, Bell, BellOff, Loader2, AlertTriangle, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  device_name: string | null;
  last_used: string | null;
  created_at: string;
  is_active: boolean;
  failed_count: number;
}

export function PushNotificationSettings() {
  const queryClient = useQueryClient();
  const { 
    isSupported, 
    isSubscribed, 
    isLoading: pushLoading, 
    permission,
    subscribe, 
    unsubscribe,
    sendTestNotification 
  } = usePushNotifications();

  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ['push-subscriptions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as PushSubscription[];
    },
  });

  const removeDevice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Device removed');
      queryClient.invalidateQueries({ queryKey: ['push-subscriptions'] });
    },
    onError: () => {
      toast.error('Failed to remove device');
    },
  });

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Push notifications not supported</p>
              <p className="text-sm text-amber-700 mt-1">
                Your browser doesn't support push notifications. Try Chrome, Firefox, Edge, or Safari.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isLoading = pushLoading || subsLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Push */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Bell className="h-5 w-5 text-primary" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">
                {isSubscribed ? 'Push notifications enabled' : 'Push notifications disabled'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed 
                  ? 'You will receive instant alerts on this device' 
                  : 'Enable to get real-time property alerts'}
              </p>
            </div>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={(checked) => {
              if (checked) {
                subscribe();
              } else {
                unsubscribe();
              }
            }}
            disabled={isLoading}
          />
        </div>

        {/* Permission denied warning */}
        {permission === 'denied' && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Notifications blocked</p>
              <p className="text-sm text-red-700 mt-1">
                You've blocked notifications for this site. To enable them, click the lock icon 
                in your browser's address bar and allow notifications.
              </p>
            </div>
          </div>
        )}

        {/* Registered devices */}
        {subscriptions && subscriptions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Registered Devices
            </h4>
            <div className="space-y-2">
              {subscriptions.map(sub => (
                <div 
                  key={sub.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3">
                    {sub.device_name?.includes('iPhone') || 
                     sub.device_name?.includes('Android') || 
                     sub.device_name?.includes('iPad') ? (
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{sub.device_name || 'Unknown Device'}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.last_used 
                          ? `Last used: ${formatDistanceToNow(new Date(sub.last_used), { addSuffix: true })}` 
                          : `Added: ${formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDevice.mutate(sub.id)}
                    disabled={removeDevice.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test notification */}
        {isSubscribed && (
          <Button
            variant="outline"
            onClick={sendTestNotification}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Test Notification
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

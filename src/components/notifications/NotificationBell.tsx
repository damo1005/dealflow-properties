import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, CheckCheck, Home, TrendingDown, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, Notification } from "@/hooks/useNotifications";

const notificationIcons: Record<string, React.ReactNode> = {
  new_listing: <Home className="h-4 w-4" />,
  price_drop: <TrendingDown className="h-4 w-4" />,
  digest: <Bell className="h-4 w-4" />,
};

const notificationColors: Record<string, string> = {
  new_listing: "bg-primary/10 text-primary",
  price_drop: "bg-green-500/10 text-green-600",
  digest: "bg-blue-500/10 text-blue-600",
};

export function NotificationBell() {
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    
    if (notification.listing_id && notification.data?.listing_url) {
      window.open(notification.data.listing_url, "_blank");
    } else {
      navigate("/alerts");
    }
    setOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => markAllAsRead.mutate()} className="h-8 text-xs">
                <CheckCheck className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setOpen(false); navigate("/alerts"); }}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a saved search to get notified of new properties
              </p>
            </div>
          ) : (
            <div>
              {notifications.slice(0, 10).map((notification, index) => (
                <div key={notification.id}>
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full flex gap-3 p-4 text-left hover:bg-muted/50 transition-colors",
                      !notification.is_read && "bg-primary/5"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        notificationColors[notification.type] || "bg-muted"
                      )}
                    >
                      {notificationIcons[notification.type] || <Bell className="h-4 w-4" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-medium line-clamp-1", !notification.is_read && "text-foreground")}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      {notification.message && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                      )}
                      {notification.data?.price && (
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatCurrency(notification.data.price)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Property Image */}
                    {notification.data?.thumbnail_url && (
                      <div className="shrink-0">
                        <img
                          src={notification.data.thumbnail_url}
                          alt=""
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </button>
                  {index < Math.min(notifications.length, 10) - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button variant="ghost" className="w-full" onClick={() => { setOpen(false); navigate("/alerts"); }}>
              View All Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

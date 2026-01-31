import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, CheckCheck, Home, TrendingDown, RefreshCw, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSavedSearchesStore, Notification } from "@/stores/savedSearchesStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const notificationIcons: Record<Notification["type"], React.ReactNode> = {
  new_match: <Home className="h-4 w-4" />,
  price_drop: <TrendingDown className="h-4 w-4" />,
  back_on_market: <RefreshCw className="h-4 w-4" />,
  digest: <Bell className="h-4 w-4" />,
};

const notificationColors: Record<Notification["type"], string> = {
  new_match: "bg-primary/10 text-primary",
  price_drop: "bg-success/10 text-success",
  back_on_market: "bg-chart-4/10 text-chart-4",
  digest: "bg-chart-3/10 text-chart-3",
};

export function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead } = useSavedSearchesStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.property_id) {
      navigate(`/property/${notification.property_id}`);
    } else if (notification.saved_search_id) {
      navigate("/saved-searches");
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
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                <CheckCheck className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href="/settings">
                <Settings className="h-4 w-4" />
              </a>
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
                We'll notify you when new properties match
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full flex gap-3 p-4 text-left hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        notificationColors[notification.type]
                      )}
                    >
                      {notificationIcons[notification.type]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-medium", !notification.read && "text-foreground")}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      {notification.message && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                      )}
                      {notification.property_price && (
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatCurrency(notification.property_price)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Property Image */}
                    {notification.property_image && (
                      <div className="shrink-0">
                        <img
                          src={notification.property_image}
                          alt=""
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </button>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button variant="ghost" className="w-full" asChild>
              <a href="/saved-searches">View All Saved Searches</a>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

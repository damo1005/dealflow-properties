import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Home, TrendingDown, Bell, ExternalLink, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNotifications, useMarkAsRead, useArchiveNotification, Notification } from "@/hooks/useNotifications";

interface NotificationsListProps {
  onMarkAllRead: () => void;
  unreadCount: number;
}

export function NotificationsList({ onMarkAllRead, unreadCount }: NotificationsListProps) {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const archiveNotification = useArchiveNotification();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_listing':
        return <Home className="h-4 w-4" />;
      case 'price_drop':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'new_listing':
        return 'bg-primary/10 text-primary';
      case 'price_drop':
        return 'bg-green-500/10 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No notifications yet</h3>
          <p className="text-muted-foreground text-sm text-center mt-1">
            Create a saved search with alerts enabled to get notified of new properties
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {unreadCount > 0 && (
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
            Mark all as read
          </Button>
        </div>
      )}

      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            "cursor-pointer transition-colors hover:bg-muted/50",
            !notification.is_read && "border-primary/50 bg-primary/5"
          )}
          onClick={() => handleNotificationClick(notification)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={cn("p-2 rounded-full shrink-0", getNotificationStyle(notification.type))}>
                {getNotificationIcon(notification.type)}
              </div>

              {/* Thumbnail */}
              {notification.data?.thumbnail_url && (
                <img
                  src={notification.data.thumbnail_url}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold line-clamp-1">{notification.title}</h4>
                  {!notification.is_read && (
                    <Badge variant="default" className="shrink-0">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                  {notification.data?.price && (
                    <span className="font-medium text-foreground">
                      £{notification.data.price.toLocaleString()}
                    </span>
                  )}
                  {notification.data?.gross_yield && (
                    <span className="text-green-600">
                      {notification.data.gross_yield}% yield
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {notification.data?.listing_url && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={notification.data.listing_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    archiveNotification.mutate(notification.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Building2, Bell, Calculator, Bookmark, FileText, Eye, TrendingUp, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string | null;
  time: string;
  entityType: string | null;
  entityId: string | null;
}

interface ActivityFeedProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  property_added: Building2,
  alert_triggered: Bell,
  scout_discovery: TrendingUp,
  document_uploaded: FileText,
  calculation_saved: Calculator,
  property_viewed: Eye,
  offer_made: TrendingUp,
  pipeline_updated: GitBranch,
  comparison_saved: Bookmark,
};

const iconStyles: Record<string, string> = {
  property_added: "bg-primary/10 text-primary",
  alert_triggered: "bg-secondary/10 text-secondary",
  scout_discovery: "bg-emerald-500/10 text-emerald-500",
  document_uploaded: "bg-blue-500/10 text-blue-500",
  calculation_saved: "bg-warning/10 text-warning",
  property_viewed: "bg-muted text-muted-foreground",
  offer_made: "bg-amber-500/10 text-amber-500",
  pipeline_updated: "bg-purple-500/10 text-purple-500",
  comparison_saved: "bg-accent text-accent-foreground",
};

// Fallback mock data when no real activity exists
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "property_added",
    title: "New property added",
    description: "123 Oak Street added to pipeline",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    entityType: "property",
    entityId: null,
  },
  {
    id: "2",
    type: "alert_triggered",
    title: "Price alert triggered",
    description: "Property below £500k in Downtown",
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    entityType: "alert",
    entityId: null,
  },
  {
    id: "3",
    type: "calculation_saved",
    title: "Analysis completed",
    description: "ROI calculation for 456 Elm Ave",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    entityType: "calculation",
    entityId: null,
  },
  {
    id: "4",
    type: "scout_discovery",
    title: "New deals found",
    description: "Deal Scout found 3 matching properties",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    entityType: "scout",
    entityId: null,
  },
];

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  const displayActivities = activities && activities.length > 0 ? activities : mockActivities;

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayActivities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No recent activity. Start by adding properties to your pipeline!
          </p>
        ) : (
          displayActivities.map((activity, index) => {
            const Icon = iconMap[activity.type] || Building2;
            const style = iconStyles[activity.type] || "bg-muted text-muted-foreground";

            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start gap-4 animate-fade-in",
                  index > 0 && "pt-4 border-t border-border"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    style
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

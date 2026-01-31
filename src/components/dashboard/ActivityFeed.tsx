import { Building2, Bell, Calculator, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "property",
    title: "New property added",
    description: "123 Oak Street added to pipeline",
    time: "2 hours ago",
    icon: Building2,
  },
  {
    id: 2,
    type: "alert",
    title: "Price alert triggered",
    description: "Property below $500k in Downtown",
    time: "5 hours ago",
    icon: Bell,
  },
  {
    id: 3,
    type: "calculator",
    title: "Analysis completed",
    description: "ROI calculation for 456 Elm Ave",
    time: "Yesterday",
    icon: Calculator,
  },
  {
    id: 4,
    type: "search",
    title: "Search saved",
    description: "Multi-family in Riverside area",
    time: "2 days ago",
    icon: Bookmark,
  },
];

const iconStyles = {
  property: "bg-primary/10 text-primary",
  alert: "bg-secondary/10 text-secondary",
  calculator: "bg-warning/10 text-warning",
  search: "bg-accent text-accent-foreground",
};

export function ActivityFeed() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
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
                iconStyles[activity.type as keyof typeof iconStyles]
              )}
            >
              <activity.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

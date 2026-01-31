import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  MessageSquare,
  Eye,
  Tag,
  FileText,
  Plus,
  Edit,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { usePipelineStore, PipelineActivity } from "@/stores/pipelineStore";
import { cn } from "@/lib/utils";

const activityIcons: Record<PipelineActivity["type"], React.ReactNode> = {
  created: <Plus className="h-4 w-4" />,
  moved: <ArrowRight className="h-4 w-4" />,
  commented: <MessageSquare className="h-4 w-4" />,
  viewed: <Eye className="h-4 w-4" />,
  updated: <Edit className="h-4 w-4" />,
  labeled: <Tag className="h-4 w-4" />,
  document_added: <FileText className="h-4 w-4" />,
};

const activityColors: Record<PipelineActivity["type"], string> = {
  created: "bg-success/10 text-success",
  moved: "bg-primary/10 text-primary",
  commented: "bg-chart-3/10 text-chart-3",
  viewed: "bg-muted text-muted-foreground",
  updated: "bg-chart-4/10 text-chart-4",
  labeled: "bg-chart-5/10 text-chart-5",
  document_added: "bg-chart-2/10 text-chart-2",
};

export function PipelineActivitySidebar() {
  const { properties, toggleActivitySidebar } = usePipelineStore();

  // Collect all activities from all properties
  const allActivities = useMemo(() => {
    const activities: (PipelineActivity & { propertyAddress: string })[] = [];
    
    properties.forEach((property) => {
      property.activities.forEach((activity) => {
        activities.push({
          ...activity,
          propertyAddress: property.address,
        });
      });
    });

    // Sort by timestamp, newest first
    return activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [properties]);

  return (
    <div className="w-80 border-l border-border bg-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">Activity Timeline</h3>
        <Button variant="ghost" size="icon" onClick={toggleActivitySidebar}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Activity List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {allActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity yet
            </p>
          ) : (
            allActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-3">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    activityColors[activity.type]
                  )}
                >
                  {activityIcons[activity.type]}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.description}</span>
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {activity.propertyAddress}
                  </p>
                  {activity.type === "moved" && activity.from_stage && activity.to_stage && (
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="text-xs">
                        {activity.from_stage}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">
                        {activity.to_stage}
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  PoundSterling,
  FileText,
  Wrench,
  Eye,
  AlertTriangle,
  Check,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "income" | "expense" | "maintenance" | "viewing" | "compliance" | "document";
  title: string;
  property?: string;
  amount?: number;
  timestamp: Date;
}

interface RecentActivityWidgetProps {
  activities: ActivityItem[];
}

const TYPE_CONFIG = {
  income: { icon: PoundSterling, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  expense: { icon: PoundSterling, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  maintenance: { icon: Wrench, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  viewing: { icon: Eye, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  compliance: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  document: { icon: FileText, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/30" },
};

export function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let group = "Earlier";
    if (date.toDateString() === today.toDateString()) {
      group = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = "Yesterday";
    }

    if (!acc[group]) acc[group] = [];
    acc[group].push(activity);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          {Object.entries(groupedActivities).map(([group, items]) => (
            <div key={group} className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">{group}</p>
              <div className="space-y-2">
                {items.map((activity) => {
                  const config = TYPE_CONFIG[activity.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg ${config.bg}`}>
                        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        {activity.property && (
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.property}
                          </p>
                        )}
                        {activity.amount && (
                          <p
                            className={`text-xs font-medium ${
                              activity.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {activity.type === "income" ? "+" : "-"}£{activity.amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

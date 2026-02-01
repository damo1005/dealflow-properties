import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  Shield,
  Flame,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AttentionItem {
  id: string;
  type: "low_roi" | "arrears" | "compliance" | "maintenance" | "void";
  property: string;
  issue: string;
  detail: string;
  action: string;
  severity: "high" | "medium" | "low";
  daysOverdue?: number;
  amount?: number;
}

interface NeedsAttentionWidgetProps {
  items: AttentionItem[];
  totalIssues: number;
}

const TYPE_ICONS = {
  low_roi: TrendingDown,
  arrears: Clock,
  compliance: Shield,
  maintenance: AlertTriangle,
  void: AlertTriangle,
};

const SEVERITY_STYLES = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200",
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
};

export function NeedsAttentionWidget({ items, totalIssues }: NeedsAttentionWidgetProps) {
  const navigate = useNavigate();

  return (
    <Card className="h-full border-yellow-200 dark:border-yellow-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Needs Attention
          </div>
          {totalIssues > 0 && (
            <Badge variant="destructive">{totalIssues}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">All properties in good standing! ✅</p>
          </div>
        ) : (
          items.slice(0, 4).map((item) => {
            const Icon = TYPE_ICONS[item.type];
            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg border ${SEVERITY_STYLES[item.severity]}`}
              >
                <div className="flex items-start gap-2">
                  <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.property}</p>
                    <p className="text-xs font-medium mt-0.5">{item.issue}</p>
                    <p className="text-xs opacity-80 mt-0.5">{item.detail}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 mt-1 text-xs"
                      onClick={() => navigate("/portfolio")}
                    >
                      {item.action}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {totalIssues > 4 && (
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={() => navigate("/portfolio")}
          >
            View All Issues ({totalIssues})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

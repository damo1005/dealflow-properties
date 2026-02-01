import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PerformingProperty {
  id: string;
  address: string;
  netYield: number;
  cashFlow: number;
  roi: number;
  roiYears: number;
  status: "excellent" | "good" | "average";
}

interface TopPerformersWidgetProps {
  properties: PerformingProperty[];
  reasons?: string[];
}

const STATUS_STYLES = {
  excellent: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  average: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const MEDALS = ["🏆", "🥈", "🥉"];

export function TopPerformersWidget({ properties, reasons }: TopPerformersWidgetProps) {
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Top Performing Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {properties.slice(0, 3).map((property, index) => (
          <div
            key={property.id}
            className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{MEDALS[index]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{property.address}</p>
                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Net Yield</p>
                    <p className="font-medium text-green-600">{property.netYield.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cash Flow</p>
                    <p className="font-medium">+£{property.cashFlow}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="font-medium">{property.roi.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge className={STATUS_STYLES[property.status]}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ({property.roiYears.toFixed(1)} years)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {reasons && reasons.length > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">
              Why they're performing well:
            </p>
            <ul className="text-xs text-green-700 dark:text-green-500 space-y-0.5">
              {reasons.map((reason, i) => (
                <li key={i}>• {reason}</li>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={() => navigate("/portfolio")}
        >
          View All Rankings
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

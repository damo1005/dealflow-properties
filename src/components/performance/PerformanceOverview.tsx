import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Check, X, Target } from "lucide-react";
import type { PerformanceMetric } from "@/types/investment";
import { RATING_STYLES } from "@/types/investment";

interface PerformanceOverviewProps {
  performanceRating: 'Excellent' | 'Good' | 'On Target' | 'Below Target' | 'Poor';
  performanceScore: number;
  purchaseDate: string;
  holdingPeriod: string;
  metrics: PerformanceMetric[];
}

export function PerformanceOverview({
  performanceRating,
  performanceScore,
  purchaseDate,
  holdingPeriod,
  metrics,
}: PerformanceOverviewProps) {
  const getStatusIcon = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'above':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'below':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVarianceColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'above':
        return 'text-green-600';
      case 'below':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={RATING_STYLES[performanceRating]}>
                  {performanceRating === 'Excellent' && '🟢 '}
                  {performanceRating === 'Good' && '🔵 '}
                  {performanceRating === 'On Target' && '⚪ '}
                  {performanceRating === 'Below Target' && '🟡 '}
                  {performanceRating === 'Poor' && '🔴 '}
                  {performanceRating.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Performance Score</p>
              <p className="text-2xl font-bold">{performanceScore}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Purchase Date</p>
              <p className="font-medium">{purchaseDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Holding Period</p>
              <p className="font-medium">{holdingPeriod}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Key Metrics (Actual vs Target)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium">{metric.name}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center w-20">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-medium">{metric.target}{metric.unit}</p>
                  </div>
                  <div className="text-center w-20">
                    <p className="text-xs text-muted-foreground">Actual</p>
                    <p className="font-medium">{metric.actual}{metric.unit}</p>
                  </div>
                  <div className={`flex items-center gap-1 w-24 justify-end ${getVarianceColor(metric.status)}`}>
                    {getStatusIcon(metric.status)}
                    <span className="font-medium">{metric.varianceLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Check, AlertTriangle, PiggyBank, Building } from "lucide-react";

interface ROITrackerProps {
  totalInvestment: number;
  returns: {
    rentalProfit: number;
    rentalProfitYears: number;
    capitalGrowth: number;
    currentEquity: number;
  };
  totalReturn: number;
  roi: number;
  annualizedROI: number;
  targetROI: number;
  targetYears: number;
  projectedROI: number;
  isOnTrack: boolean;
}

export function ROITracker({
  totalInvestment,
  returns,
  totalReturn,
  roi,
  annualizedROI,
  targetROI,
  targetYears,
  projectedROI,
  isOnTrack,
}: ROITrackerProps) {
  const roiProgress = targetROI > 0 ? (roi / targetROI) * 100 : 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Return on Investment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Investment Summary */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Investment</span>
            <span className="font-semibold">£{totalInvestment.toLocaleString()}</span>
          </div>
          <div className="space-y-1 border-t pt-3">
            <p className="text-sm font-medium text-muted-foreground">Returns:</p>
            <div className="flex justify-between text-sm">
              <span>• Rental Profit ({returns.rentalProfitYears.toFixed(1)}yr)</span>
              <span>£{returns.rentalProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>• Capital Growth</span>
              <span>£{returns.capitalGrowth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>• Current Equity</span>
              <span>£{returns.currentEquity.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold border-t pt-3 text-green-600">
            <span>Total Return</span>
            <span>£{totalReturn.toLocaleString()}</span>
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className="text-3xl font-bold text-primary">{roi.toFixed(1)}%</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Annualized</p>
            <p className="text-3xl font-bold">{annualizedROI.toFixed(1)}%</p>
          </div>
        </div>

        {/* Target Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Target ROI: {targetROI}% in {targetYears} years</span>
            </div>
            <Badge variant={isOnTrack ? "default" : "destructive"}>
              {isOnTrack ? "On Track" : "Behind"}
            </Badge>
          </div>
          <Progress value={Math.min(roiProgress, 100)} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current: {roi.toFixed(1)}%</span>
            <span className="text-muted-foreground">Projected at {targetYears}yr: {projectedROI}%</span>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          isOnTrack 
            ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
        }`}>
          {isOnTrack ? (
            <>
              <Check className="h-5 w-5" />
              <span className="font-medium">On track to exceed target ROI ✅</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Currently behind target - action may be needed</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

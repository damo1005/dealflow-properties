import { useState } from "react";
import { TrendingUp, DollarSign, Percent, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyDetail } from "@/data/mockPropertyDetail";
import { cn } from "@/lib/utils";

interface PropertyInvestmentProps {
  property: PropertyDetail;
}

export function PropertyInvestment({ property }: PropertyInvestmentProps) {
  const [rentPeriod, setRentPeriod] = useState<"monthly" | "annual">("monthly");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRentValue = () => {
    return rentPeriod === "monthly"
      ? property.estimatedRent
      : property.estimatedRent * 12;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success" />
          Investment Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estimated Rental Yield */}
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Estimated Yield</span>
            <Percent className="h-4 w-4 text-success" />
          </div>
          <div className="text-3xl font-bold text-success">{property.estimatedYield}%</div>
          <p className="text-sm text-muted-foreground mt-1">Gross rental yield</p>
        </div>

        {/* Projected Rental Income */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Projected Rent</span>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 rounded-none text-xs",
                  rentPeriod === "monthly" && "bg-background"
                )}
                onClick={() => setRentPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 rounded-none text-xs",
                  rentPeriod === "annual" && "bg-background"
                )}
                onClick={() => setRentPeriod("annual")}
              >
                Annual
              </Button>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(getRentValue())}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Based on local market data
          </p>
        </div>

        {/* Cash Flow */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Cash Flow</p>
              <p className={cn(
                "font-semibold",
                property.cashFlow > 0 ? "text-success" : "text-destructive"
              )}>
                {property.cashFlow > 0 ? "+" : ""}{formatCurrency(property.cashFlow)}
              </p>
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ROI Potential</p>
              <p className="font-semibold text-foreground">{property.roiPotential}%</p>
            </div>
          </div>
        </div>

        {/* Cap Rate */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cap Rate</p>
              <p className="font-semibold text-foreground">{property.capRate}%</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground">
          * Estimates based on local market data and may vary. Consult with a financial advisor for accurate projections.
        </p>
      </CardContent>
    </Card>
  );
}

import { TrendingDown, TrendingUp, Calendar, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PropertyDetail } from "@/data/mockPropertyDetail";

interface PropertyFinancialsProps {
  property: PropertyDetail;
}

export function PropertyFinancials({ property }: PropertyFinancialsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Asking Price */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Asking Price</span>
          <span className="font-semibold text-foreground">{formatPrice(property.price)}</span>
        </div>

        {/* Estimated Value Range */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Estimated Value</span>
          <span className="font-medium text-foreground">
            {formatPrice(property.estimatedValueLow)} - {formatPrice(property.estimatedValueHigh)}
          </span>
        </div>

        {/* Price per sqft */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Price per sqft</span>
          <span className="font-medium text-foreground">£{property.pricePerSqft}</span>
        </div>

        {/* Stamp Duty */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Stamp Duty (estimate)</span>
          <span className="font-medium text-foreground">{formatPrice(property.stampDuty)}</span>
        </div>

        <Separator />

        {/* Price History */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground text-sm">Price History</h4>
          <div className="space-y-2">
            {property.priceHistory.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {event.event}
                  </Badge>
                  <span className="font-medium">{formatPrice(event.price)}</span>
                  {index > 0 && (
                    <span className="flex items-center text-destructive">
                      <TrendingDown className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Sales */}
        {property.previousSales.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-foreground text-sm">Previous Sales</h4>
              <div className="space-y-2">
                {property.previousSales.map((sale, index) => {
                  const prevSale = property.previousSales[index + 1];
                  const appreciation = prevSale
                    ? ((sale.price - prevSale.price) / prevSale.price * 100).toFixed(1)
                    : null;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-muted-foreground">{formatDate(sale.date)}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatPrice(sale.price)}</span>
                        {appreciation && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +{appreciation}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

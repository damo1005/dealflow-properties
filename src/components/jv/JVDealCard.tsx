import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Users, TrendingUp, DollarSign, ExternalLink } from "lucide-react";
import { JVDeal } from "@/types/jv";
import { cn } from "@/lib/utils";

interface JVDealCardProps {
  deal: JVDeal;
  onViewDetails?: () => void;
  onRecordDistribution?: () => void;
  onExit?: () => void;
}

export function JVDealCard({
  deal,
  onViewDetails,
  onRecordDistribution,
  onExit,
}: JVDealCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const selfPartner = deal.partners?.find((p) => p.is_self);
  const otherPartners = deal.partners?.filter((p) => !p.is_self) || [];
  
  const currentValue = deal.property?.current_value || deal.total_investment || 0;
  const yourEquity = selfPartner 
    ? currentValue * (selfPartner.equity_percentage / 100)
    : 0;
  const investmentReturn = selfPartner 
    ? ((yourEquity - selfPartner.initial_investment) / selfPartner.initial_investment) * 100
    : 0;
  
  const totalDistributions = deal.partners?.reduce(
    (sum, p) => sum + (p.distributions_received || 0), 0
  ) || 0;

  const partnerSummary = otherPartners.length === 1
    ? otherPartners[0].partner_name
    : otherPartners.length > 1
    ? `${otherPartners[0].partner_name} + ${otherPartners.length - 1} more`
    : "";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{deal.deal_name || deal.property?.address}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>
                  You ({selfPartner?.equity_percentage}%) + {partnerSummary} ({100 - (selfPartner?.equity_percentage || 0)}%)
                </span>
              </div>
            </div>
          </div>
          <Badge variant={deal.status === "active" ? "default" : "secondary"}>
            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Invested</p>
            <p className="font-semibold">{formatCurrency(deal.total_investment || 0)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Value</p>
            <p className="font-semibold">{formatCurrency(currentValue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your Equity</p>
            <p className="font-semibold">
              {formatCurrency(yourEquity)}
              <span className={cn(
                "text-xs ml-1",
                investmentReturn >= 0 ? "text-green-500" : "text-red-500"
              )}>
                ({investmentReturn >= 0 ? "+" : ""}{investmentReturn.toFixed(1)}%)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">YTD Distributions</p>
            <p className="font-semibold">
              {formatCurrency(totalDistributions)}
              {selfPartner && (
                <span className="text-xs text-muted-foreground ml-1">
                  (Your share: {formatCurrency(selfPartner.distributions_received)})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <ExternalLink className="mr-1 h-4 w-4" />
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={onRecordDistribution}>
            <DollarSign className="mr-1 h-4 w-4" />
            Record Distribution
          </Button>
          <Button variant="ghost" size="sm" onClick={onExit}>
            Exit Deal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

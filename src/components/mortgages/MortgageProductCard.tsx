import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, TrendingDown, Award, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MortgageProduct } from "@/stores/mortgageStore";

interface MortgageProductCardProps {
  product: MortgageProduct;
  monthlyPayment: number;
  totalCost: number;
  rank?: number;
  onApply: (product: MortgageProduct) => void;
}

export function MortgageProductCard({
  product,
  monthlyPayment,
  totalCost,
  rank,
  onApply,
}: MortgageProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatFee = (pence: number) => {
    if (pence === 0) return 'Free';
    return formatCurrency(pence / 100);
  };

  const getFixedPeriodText = (months: number) => {
    if (months === 0) return 'Variable';
    const years = months / 12;
    return `${years} Year`;
  };

  const getRateTypeBadge = () => {
    switch (product.rate_type) {
      case 'fixed':
        return <Badge variant="secondary">{getFixedPeriodText(product.initial_rate_period)} Fixed</Badge>;
      case 'tracker':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Tracker</Badge>;
      case 'variable':
        return <Badge variant="outline">Variable</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${rank === 1 ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-0">
        {/* Main Row */}
        <div className="p-4 grid grid-cols-12 gap-4 items-center">
          {/* Rank & Lender */}
          <div className="col-span-3 flex items-center gap-3">
            {rank && rank <= 3 && (
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                rank === 1 ? 'bg-yellow-500 text-white' :
                rank === 2 ? 'bg-gray-400 text-white' :
                'bg-amber-600 text-white'
              }`}>
                {rank}
              </div>
            )}
            <div>
              <p className="font-semibold">{product.lender}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{product.product_name}</p>
            </div>
          </div>

          {/* Rate */}
          <div className="col-span-2 text-center">
            <p className="text-2xl font-bold text-primary">{product.rate.toFixed(2)}%</p>
            {getRateTypeBadge()}
          </div>

          {/* Fee */}
          <div className="col-span-2 text-center">
            <p className="text-lg font-semibold">
              {formatFee(product.product_fee)}
            </p>
            <p className="text-xs text-muted-foreground">Product fee</p>
          </div>

          {/* Monthly Payment */}
          <div className="col-span-2 text-center">
            <p className="text-lg font-semibold">{formatCurrency(monthlyPayment)}</p>
            <p className="text-xs text-muted-foreground">per month</p>
          </div>

          {/* Total Cost */}
          <div className="col-span-2 text-center">
            <p className="text-lg font-semibold">{formatCurrency(totalCost)}</p>
            <p className="text-xs text-muted-foreground">
              Total ({product.initial_rate_period / 12}yr)
            </p>
          </div>

          {/* Actions */}
          <div className="col-span-1 flex justify-end">
            <Button onClick={() => onApply(product)} className="gap-1">
              Apply
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Badges Row */}
        {(rank === 1 || product.product_fee === 0 || product.cashback > 0) && (
          <div className="px-4 pb-2 flex gap-2">
            {rank === 1 && (
              <Badge className="bg-primary/10 text-primary border-0">
                <Award className="h-3 w-3 mr-1" />
                Best Rate
              </Badge>
            )}
            {product.product_fee === 0 && (
              <Badge variant="outline" className="border-green-500 text-green-500">
                <Zap className="h-3 w-3 mr-1" />
                No Fee
              </Badge>
            )}
            {product.cashback > 0 && (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                <TrendingDown className="h-3 w-3 mr-1" />
                {formatCurrency(product.cashback / 100)} Cashback
              </Badge>
            )}
          </div>
        )}

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full rounded-none border-t text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  View Details
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 bg-muted/50 border-t space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Max LTV</p>
                  <p className="font-medium">{product.max_ltv}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Min Loan</p>
                  <p className="font-medium">{formatCurrency(product.min_loan)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Loan</p>
                  <p className="font-medium">{formatCurrency(product.max_loan)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Initial Period</p>
                  <p className="font-medium">{product.initial_rate_period} months</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Eligibility</p>
                <ul className="text-sm space-y-1">
                  <li>✓ Portfolio landlords accepted</li>
                  <li>✓ Limited company applications</li>
                  <li>✓ Rental coverage: 125% @ 5.5%</li>
                </ul>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Early Repayment Charges</p>
                <p className="text-sm">
                  Year 1: 5% • Year 2: 4% • Year 3: 3% • Year 4: 2% • Year 5: 1%
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

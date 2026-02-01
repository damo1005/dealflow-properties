import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProviderQuote, InsuranceProvider } from "@/types/insurance";
import { Star, Check, X, Shield, ExternalLink } from "lucide-react";

interface QuoteCardProps {
  quote: ProviderQuote;
  provider: InsuranceProvider | undefined;
  isBestPrice?: boolean;
  isBestRated?: boolean;
  onGetQuote: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function QuoteCard({ quote, provider, isBestPrice, isBestRated, onGetQuote }: QuoteCardProps) {
  return (
    <Card className={`relative overflow-hidden ${isBestPrice ? 'border-green-500 border-2' : isBestRated ? 'border-blue-500 border-2' : ''}`}>
      {(isBestPrice || isBestRated) && (
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium text-white ${isBestPrice ? 'bg-green-500' : 'bg-blue-500'}`}>
          {isBestPrice ? '⭐ BEST VALUE' : '⭐ BEST RATED'}
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Provider Info */}
          <div className="flex-shrink-0">
            <div className="w-24 h-12 bg-muted rounded flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">{quote.provider_name}</h3>
            {provider && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm ml-1">{provider.trustpilot_rating}</span>
                </div>
                {provider.defaqto_rating && (
                  <Badge variant="outline" className="text-xs">
                    Defaqto {provider.defaqto_rating}★
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(quote.annual_premium)}
              <span className="text-sm font-normal text-muted-foreground">/year</span>
            </p>
            <p className="text-muted-foreground">
              {formatCurrency(quote.monthly_premium)}/month
            </p>
          </div>

          {/* Cover Details */}
          <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Buildings: {formatCurrency(quote.buildings_cover)}</span>
            </div>
            {quote.rent_guarantee_limit && (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Rent Guarantee: {formatCurrency(quote.rent_guarantee_limit)}/mo ({quote.rent_guarantee_months}mo)</span>
              </div>
            )}
            {quote.legal_expenses_limit && (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Legal: {formatCurrency(quote.legal_expenses_limit)}</span>
              </div>
            )}
            {quote.has_emergency_cover ? (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Emergency 24/7</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <X className="h-4 w-4" />
                <span>No Emergency Cover</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Excess:</span>
              <span className="font-medium">{formatCurrency(quote.excess)}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <Button onClick={onGetQuote} className="whitespace-nowrap">
              <ExternalLink className="h-4 w-4 mr-2" />
              Get This Quote
            </Button>
            <Button variant="ghost" size="sm">
              View Full Details
            </Button>
          </div>
        </div>

        {/* Features */}
        {quote.features.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">KEY FEATURES:</p>
            <div className="flex flex-wrap gap-2">
              {quote.features.slice(0, 4).map((feature, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { AlertTriangle, Clock, TrendingDown, Zap, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DistressedProperty } from '@/types/marketIntel';

interface DistressedPropertyCardProps {
  property: DistressedProperty;
  onViewDetails: () => void;
  onAddToPipeline: () => void;
}

export function DistressedPropertyCard({ 
  property, 
  onViewDetails, 
  onAddToPipeline 
}: DistressedPropertyCardProps) {
  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const potentialSaving = property.estimated_value && property.current_price
    ? property.estimated_value - property.current_price
    : 0;

  const getDistressIcon = (type: string) => {
    switch (type) {
      case 'long_on_market': return Clock;
      case 'price_reduction': return TrendingDown;
      case 'poor_condition': return AlertTriangle;
      default: return Zap;
    }
  };

  const getDistressLabel = (type: string) => {
    switch (type) {
      case 'long_on_market': return 'Long on market';
      case 'price_reduction': return 'Price reduced';
      case 'poor_condition': return 'Needs work';
      case 'negative_equity': return 'Negative equity';
      case 'probate': return 'Probate sale';
      case 'repossession': return 'Repossession';
      default: return type;
    }
  };

  const scoreColor = property.distress_score >= 80 
    ? 'text-green-600 bg-green-50' 
    : property.distress_score >= 60 
    ? 'text-yellow-600 bg-yellow-50' 
    : 'text-orange-600 bg-orange-50';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold truncate">{property.address}</h3>
            <p className="text-sm text-muted-foreground">{property.postcode}</p>
          </div>
          <div className={`px-2 py-1 rounded-lg text-sm font-bold ${scoreColor}`}>
            {property.distress_score}/100
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-4">
        {/* Price Comparison */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="font-semibold">{formatCurrency(property.current_price)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Estimated Value</span>
            <span className="font-semibold">{formatCurrency(property.estimated_value)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Potential Saving</span>
            <span className="font-bold text-green-600 flex items-center gap-1">
              💎 {formatCurrency(potentialSaving)}
              {property.potential_discount_pct && (
                <span className="text-xs">({property.potential_discount_pct.toFixed(0)}%)</span>
              )}
            </span>
          </div>
        </div>

        {/* Distress Signals */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Distress Signals:</p>
          <div className="flex flex-wrap gap-1">
            {property.distress_type?.map((type) => {
              const Icon = getDistressIcon(type);
              return (
                <Badge key={type} variant="outline" className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {getDistressLabel(type)}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded p-2">
            <p className="text-xs text-muted-foreground">Days Listed</p>
            <p className="font-semibold text-sm">{property.days_on_market || 'N/A'}</p>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <p className="text-xs text-muted-foreground">Reductions</p>
            <p className="font-semibold text-sm">{property.price_reductions || 0}x</p>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <p className="text-xs text-muted-foreground">EPC</p>
            <p className="font-semibold text-sm">{property.epc_rating || 'N/A'}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onAddToPipeline}>
          <Plus className="h-4 w-4 mr-1" />
          Pipeline
        </Button>
        <Button size="sm" className="flex-1" onClick={onViewDetails}>
          Details
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}

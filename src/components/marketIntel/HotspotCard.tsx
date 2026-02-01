import { TrendingUp, Bookmark, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InvestmentHotspot } from '@/types/marketIntel';

interface HotspotCardProps {
  hotspot: InvestmentHotspot;
  rank: number;
  isSaved: boolean;
  onSave: () => void;
  onViewDetails: () => void;
}

export function HotspotCard({ hotspot, rank, isSaved, onSave, onViewDetails }: HotspotCardProps) {
  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (risk: string | undefined) => {
    switch (risk) {
      case 'low': return 'bg-green-500/10 text-green-700';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700';
      case 'high': return 'bg-red-500/10 text-red-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'btl': return 'bg-blue-500';
      case 'growth': return 'bg-green-500';
      case 'yield': return 'bg-purple-500';
      case 'hmo': return 'bg-orange-500';
      default: return 'bg-primary';
    }
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {/* Rank Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
          #{rank}
        </div>
      </div>

      <CardHeader className="pt-12 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{hotspot.area_name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {hotspot.postcode_district}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={getTypeColor(hotspot.hotspot_type)}>
              {hotspot.hotspot_type?.toUpperCase() || 'BTL'}
            </Badge>
            {hotspot.risk_level && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(hotspot.risk_level)}`}>
                {hotspot.risk_level} risk
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Avg Price</p>
            <p className="font-semibold">{formatCurrency(hotspot.avg_price)}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Avg Yield</p>
            <p className="font-semibold text-green-600">{hotspot.avg_yield?.toFixed(1)}%</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Price Growth</p>
            <p className="font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +{hotspot.price_growth_12m?.toFixed(1)}%
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Opportunity</p>
            <p className="font-semibold">{hotspot.opportunity_score}/100</p>
          </div>
        </div>

        {/* Reasons */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Why it's hot:</p>
          <ul className="space-y-1">
            {hotspot.reasons?.slice(0, 3).map((reason, i) => (
              <li key={i} className="text-xs flex items-start gap-1">
                <span className="text-green-500">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Strategies */}
        {hotspot.suitable_strategies && hotspot.suitable_strategies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {hotspot.suitable_strategies.map((strategy) => (
              <Badge key={strategy} variant="outline" className="text-xs">
                {strategy}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onSave}>
          <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </Button>
        <Button size="sm" className="flex-1" onClick={onViewDetails}>
          View Details
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}

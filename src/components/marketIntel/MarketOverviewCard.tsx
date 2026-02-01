import { 
  TrendingUp, 
  Clock, 
  PoundSterling,
  Home,
  Users,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MarketData } from '@/types/marketIntel';

interface MarketOverviewCardProps {
  marketData: MarketData;
}

export function MarketOverviewCard({ marketData }: MarketOverviewCardProps) {
  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const priceGrowth = marketData.price_growth_pct || 0;
  const isGrowthPositive = priceGrowth > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Market Overview: {marketData.postcode}
          </CardTitle>
          <Badge variant={isGrowthPositive ? 'default' : 'destructive'}>
            {formatPercent(priceGrowth)} YoY
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Price Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PoundSterling className="h-4 w-4" />
              Prices
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Average Price</span>
                <span className="font-medium">{formatCurrency(marketData.avg_sold_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price/sqft</span>
                <span className="font-medium">{formatCurrency(marketData.price_per_sqft)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sale vs Asking</span>
                <span className="font-medium">{marketData.sale_vs_asking_pct?.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Rental Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Home className="h-4 w-4" />
              Rentals
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Average Rent</span>
                <span className="font-medium">{formatCurrency(marketData.avg_rent_pcm)}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Gross Yield</span>
                <span className="font-medium text-green-600">{marketData.gross_yield?.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">3-bed Rent</span>
                <span className="font-medium">{formatCurrency(marketData.avg_rent_3bed)}/mo</span>
              </div>
            </div>
          </div>

          {/* Market Activity */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Activity
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">For Sale</span>
                <span className="font-medium">{marketData.properties_for_sale || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sold (3m)</span>
                <span className="font-medium">{marketData.properties_sold_3m || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Avg Days
                </span>
                <span className="font-medium">{marketData.avg_time_on_market_days || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Demographics
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Population</span>
                <span className="font-medium">{marketData.population?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Median Age</span>
                <span className="font-medium">{marketData.median_age || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Employment
                </span>
                <span className="font-medium">{marketData.employment_rate?.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

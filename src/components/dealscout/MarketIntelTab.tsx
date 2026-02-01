import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Home,
  Wallet,
  Clock,
  Target,
  Lightbulb,
  Search,
  MapPin,
  Percent,
} from "lucide-react";
import { useDealScoutStore, MarketIntelligence } from "@/stores/dealScoutStore";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/types/dealScout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MarketIntelTab() {
  const { marketIntel, setMarketIntel, scouts } = useDealScoutStore();
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [searchArea, setSearchArea] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Get unique areas from scouts
  const scoutAreas = [...new Set(scouts.flatMap(s => s.location_areas || []))];

  useEffect(() => {
    if (scoutAreas.length > 0 && !selectedArea) {
      setSelectedArea(scoutAreas[0]);
    }
  }, [scoutAreas]);

  useEffect(() => {
    if (selectedArea) {
      loadMarketIntel(selectedArea);
    }
  }, [selectedArea]);

  const loadMarketIntel = async (area: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('market_intelligence')
        .select('*')
        .eq('area', area)
        .order('data_date', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setMarketIntel([data[0] as MarketIntelligence]);
      } else {
        // Generate mock data for demo
        setMarketIntel([generateMockIntel(area)]);
      }
    } catch (error) {
      console.error('Error loading market intel:', error);
      setMarketIntel([generateMockIntel(selectedArea)]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentIntel = marketIntel[0];

  // Mock chart data
  const priceHistory = [
    { month: 'Jul', price: 275000 },
    { month: 'Aug', price: 278000 },
    { month: 'Sep', price: 280000 },
    { month: 'Oct', price: 282000 },
    { month: 'Nov', price: 281000 },
    { month: 'Dec', price: 285000 },
  ];

  const supplyDemand = [
    { month: 'Jul', forSale: 45, sold: 12 },
    { month: 'Aug', forSale: 48, sold: 15 },
    { month: 'Sep', forSale: 52, sold: 18 },
    { month: 'Oct', forSale: 50, sold: 14 },
    { month: 'Nov', forSale: 47, sold: 11 },
    { month: 'Dec', forSale: 42, sold: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Area Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Select Area:</span>
            </div>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose area" />
              </SelectTrigger>
              <SelectContent>
                {scoutAreas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">or</span>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter postcode area (e.g. EN3)"
                value={searchArea}
                onChange={(e) => setSearchArea(e.target.value.toUpperCase())}
                className="w-48"
              />
              <Button 
                variant="outline"
                onClick={() => {
                  if (searchArea) {
                    setSelectedArea(searchArea);
                    setSearchArea('');
                  }
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : currentIntel ? (
        <>
          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Wallet className="h-4 w-4" />
                  Average Price
                </div>
                <div className="text-2xl font-bold">
                  {currentIntel.avg_price ? formatCurrency(currentIntel.avg_price) : '—'}
                </div>
                {currentIntel.price_trend_12mo && (
                  <div className={`flex items-center gap-1 text-sm ${currentIntel.price_trend_12mo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentIntel.price_trend_12mo >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {currentIntel.price_trend_12mo >= 0 ? '+' : ''}{currentIntel.price_trend_12mo}% (12 months)
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Percent className="h-4 w-4" />
                  Average Yield
                </div>
                <div className="text-2xl font-bold">
                  {currentIntel.avg_yield ? `${currentIntel.avg_yield}%` : '—'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Rental demand: <span className="capitalize font-medium">{currentIntel.rental_demand || 'Medium'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  Days to Sell
                </div>
                <div className="text-2xl font-bold">
                  {currentIntel.avg_days_to_sell || '—'} days
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentIntel.properties_sold_30d || 0} sold in last 30 days
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Target className="h-4 w-4" />
                  Investment Score
                </div>
                <div className="text-2xl font-bold">
                  {currentIntel.investment_score || '—'}/100
                </div>
                <Badge 
                  variant="outline"
                  className={
                    (currentIntel.investment_score || 0) >= 75 
                      ? 'border-green-500 text-green-600' 
                      : (currentIntel.investment_score || 0) >= 50 
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-red-500 text-red-600'
                  }
                >
                  Good for BTL
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Supply & Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplyDemand}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="forSale" name="For Sale" fill="hsl(var(--muted-foreground))" />
                      <Bar dataKey="sold" name="Sold" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Activity & Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Market Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{currentIntel.properties_for_sale || 0}</div>
                    <div className="text-sm text-muted-foreground">For Sale</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{currentIntel.new_listings_30d || 0}</div>
                    <div className="text-sm text-muted-foreground">New This Month</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{currentIntel.properties_sold_30d || 0}</div>
                    <div className="text-sm text-muted-foreground">Sold This Month</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{currentIntel.avg_sale_vs_asking || 97}%</div>
                    <div className="text-sm text-muted-foreground">Sale vs Asking</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 12 properties have been on market 60+ days in {selectedArea}. These may accept 5-10% below asking.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    📈 Rental demand increased 15% this quarter. Good time for BTL investment.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    ⚠️ New supply: {currentIntel.new_listings_30d || 23} properties listed this month. Above average - may pressure prices down.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Recommendation */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Investment Recommendation for {selectedArea}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-green-100 text-green-800">GOOD</Badge>
                    <span className="text-muted-foreground">{currentIntel.investment_score || 74}/100</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Strengths:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>✓ Stable prices</li>
                        <li>✓ High rental demand</li>
                        <li>✓ Good transport links</li>
                        <li>✓ Low crime area</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Considerations:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>⚠️ Yields declining slightly</li>
                        <li>⚠️ High current supply</li>
                        <li>⚠️ Competition strong</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-background rounded-lg">
                    <p className="text-sm">
                      <strong>Best Strategy:</strong> Buy-to-Let with 7%+ yield focus. Negotiate on properties 50+ days on market.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="p-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Select an area to view market intelligence</h3>
          <p className="text-muted-foreground">
            Choose from your scout areas or enter a postcode to see detailed market data.
          </p>
        </Card>
      )}
    </div>
  );
}

function generateMockIntel(area: string): MarketIntelligence {
  return {
    id: crypto.randomUUID(),
    area,
    avg_price: 285000,
    median_price: 275000,
    price_per_sqft: 450,
    price_trend_3mo: 1.2,
    price_trend_12mo: 3.5,
    avg_rent: 1350,
    median_rent: 1300,
    avg_yield: 6.8,
    rental_demand: 'high',
    avg_void_period_days: 14,
    properties_for_sale: 42,
    new_listings_30d: 23,
    properties_sold_30d: 12,
    avg_days_to_sell: 52,
    avg_sale_vs_asking: 97.2,
    investment_score: 74,
    growth_potential: 'medium',
    cash_flow_potential: 'high',
    data_date: new Date().toISOString().split('T')[0],
  };
}

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketIntelSearch } from '@/components/marketIntel/MarketIntelSearch';
import { MarketOverviewCard } from '@/components/marketIntel/MarketOverviewCard';
import { InvestmentScoreCard } from '@/components/marketIntel/InvestmentScoreCard';
import { MarketTrendsChart } from '@/components/marketIntel/MarketTrendsChart';
import { HotspotCard } from '@/components/marketIntel/HotspotCard';
import { DistressedPropertyCard } from '@/components/marketIntel/DistressedPropertyCard';
import { useMarketIntelStore } from '@/stores/marketIntelStore';
import { supabase } from '@/integrations/supabase/client';
import { 
  Map, 
  TrendingUp, 
  AlertTriangle, 
  Flame,
  FileText,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import type { InvestmentHotspot, DistressedProperty } from '@/types/marketIntel';

// Mock data for hotspots
const mockHotspots: InvestmentHotspot[] = [
  {
    id: '1',
    area_name: 'Leicester LE2',
    postcode_district: 'LE2',
    hotspot_type: 'yield',
    avg_price: 185000,
    avg_yield: 8.2,
    price_growth_12m: 6.8,
    forecast_growth_12m: 8,
    reasons: ['Strong rental demand (university area)', 'Price growth accelerating', 'Below national average prices', 'New Leicester East development'],
    opportunity_score: 91,
    suitable_strategies: ['BTL', 'HMO'],
    entry_price_range: '£150K - £220K',
    risk_level: 'medium',
    infrastructure_projects: ['Leicester East regeneration (£200M)'],
    is_active: true,
    rank: 1,
    calculated_at: new Date().toISOString(),
  },
  {
    id: '2',
    area_name: 'Nottingham NG7',
    postcode_district: 'NG7',
    hotspot_type: 'btl',
    avg_price: 165000,
    avg_yield: 7.8,
    price_growth_12m: 5.2,
    forecast_growth_12m: 7,
    reasons: ['Two universities nearby', 'Strong tenant demand', 'Affordable entry prices', 'City centre regeneration'],
    opportunity_score: 87,
    suitable_strategies: ['BTL', 'HMO', 'Student'],
    entry_price_range: '£130K - £200K',
    risk_level: 'low',
    is_active: true,
    rank: 2,
    calculated_at: new Date().toISOString(),
  },
  {
    id: '3',
    area_name: 'Coventry CV1',
    postcode_district: 'CV1',
    hotspot_type: 'growth',
    avg_price: 175000,
    avg_yield: 7.1,
    price_growth_12m: 9.5,
    forecast_growth_12m: 10,
    reasons: ['City of Culture investment', 'Major infrastructure upgrades', 'University expansion', 'Rising employment'],
    opportunity_score: 85,
    suitable_strategies: ['BTL', 'Flip'],
    entry_price_range: '£140K - £210K',
    risk_level: 'medium',
    is_active: true,
    rank: 3,
    calculated_at: new Date().toISOString(),
  },
];

// Mock distressed properties
const mockDistressed: DistressedProperty[] = [
  {
    id: '1',
    address: '45 Victoria Road',
    postcode: 'EN3 4QT',
    distress_type: ['long_on_market', 'price_reduction'],
    distress_score: 82,
    current_price: 185000,
    estimated_value: 215000,
    potential_discount_pct: 14,
    days_on_market: 127,
    price_reductions: 3,
    last_reduction_pct: 8,
    epc_rating: 'E',
    is_active: true,
    detected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    address: '12 High Street',
    postcode: 'M4 1HQ',
    distress_type: ['poor_condition', 'price_reduction'],
    distress_score: 75,
    current_price: 125000,
    estimated_value: 155000,
    potential_discount_pct: 19,
    days_on_market: 95,
    price_reductions: 2,
    last_reduction_pct: 12,
    epc_rating: 'F',
    is_active: true,
    detected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function MarketIntel() {
  const [mainTab, setMainTab] = useState('overview');
  const { 
    currentPostcode,
    currentMarketData,
    isLoading,
    setCurrentPostcode,
    setCurrentMarketData,
    setIsLoading,
    hotspotFilter,
    setHotspotFilter,
    savedHotspotIds,
    toggleSavedHotspot,
  } = useMarketIntelStore();

  const handleSearch = async (postcode: string) => {
    setIsLoading(true);
    setCurrentPostcode(postcode);

    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: { postcode },
      });

      if (error) throw error;

      if (data.success) {
        setCurrentMarketData(data.data);
        toast.success(`Market data loaded for ${postcode}`);
      } else {
        throw new Error(data.error || 'Failed to fetch market data');
      }
    } catch (error: any) {
      console.error('Market data fetch error:', error);
      toast.error(error.message || 'Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHotspots = hotspotFilter === 'all' 
    ? mockHotspots 
    : mockHotspots.filter(h => h.hotspot_type === hotspotFilter);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Search Section */}
        <MarketIntelSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Main Content Tabs */}
        <Tabs value={mainTab} onValueChange={setMainTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="hotspots" className="gap-2">
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">Hotspots</span>
            </TabsTrigger>
            <TabsTrigger value="distressed" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Distressed</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Planning</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {currentMarketData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <MarketOverviewCard marketData={currentMarketData} />
                  <MarketTrendsChart postcode={currentPostcode} />
                </div>
                <div className="space-y-6">
                  <InvestmentScoreCard marketData={currentMarketData} />
                  
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate CMA Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Find Properties Here
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Set Up Area Alert
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search a Postcode</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter a UK postcode above to view comprehensive market intelligence,
                  investment scores, and area analysis.
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Hotspots Tab */}
          <TabsContent value="hotspots" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Investment Hotspots</h2>
                <p className="text-muted-foreground">AI-powered area discovery for maximum returns</p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-1">
                  {['all', 'btl', 'growth', 'yield', 'hmo'].map((filter) => (
                    <Button
                      key={filter}
                      variant={hotspotFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHotspotFilter(filter as any)}
                    >
                      {filter === 'all' ? 'All' : filter.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotspots.map((hotspot, index) => (
                <HotspotCard
                  key={hotspot.id}
                  hotspot={hotspot}
                  rank={index + 1}
                  isSaved={savedHotspotIds.includes(hotspot.id)}
                  onSave={() => toggleSavedHotspot(hotspot.id)}
                  onViewDetails={() => handleSearch(hotspot.postcode_district)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Distressed Tab */}
          <TabsContent value="distressed" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Distressed Properties</h2>
                <p className="text-muted-foreground">Below-market opportunities from motivated sellers</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {mockDistressed.length} opportunities
              </Badge>
            </div>

            {/* Stats Banner */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{mockDistressed.length}</p>
                <p className="text-sm text-muted-foreground">New This Week</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">12%</p>
                <p className="text-sm text-muted-foreground">Avg Discount</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">£45K</p>
                <p className="text-sm text-muted-foreground">Best Saving</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDistressed.map((property) => (
                <DistressedPropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={() => toast.info('Property details coming soon')}
                  onAddToPipeline={() => toast.success('Added to pipeline')}
                />
              ))}
            </div>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Planning Applications</h2>
                <p className="text-muted-foreground">Track development activity in your target areas</p>
              </div>
              <Button variant="outline">
                Set Up Alerts
              </Button>
            </div>

            <Card className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Planning Intelligence Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Track new developments, HMO conversions, and infrastructure projects
                that could impact property values in your investment areas.
              </p>
              <Button className="mt-4" variant="outline">
                Get Notified When Available
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

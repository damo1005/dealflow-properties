import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, MapPin, Home, BedDouble, Users, Star, TrendingUp, 
  PoundSterling, BarChart3, Plus, ExternalLink, Bookmark, 
  Calculator, Building, Percent, X
} from 'lucide-react';
import { toast } from 'sonner';

export default function AirbnbRadar() {
  const queryClient = useQueryClient();
  const [selectedCity, setSelectedCity] = useState('London');
  const [selectedArea, setSelectedArea] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [bedroomFilter, setBedroomFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch cities
  const { data: cities } = useQuery({
    queryKey: ['airbnb-cities'],
    queryFn: async () => {
      const { data } = await supabase
        .from('airbnb_listings')
        .select('city')
        .not('city', 'is', null);
      const uniqueCities = [...new Set(data?.map(d => d.city))].filter(Boolean).sort();
      return uniqueCities as string[];
    },
  });

  // Fetch areas for selected city
  const { data: areas } = useQuery({
    queryKey: ['airbnb-areas', selectedCity],
    queryFn: async () => {
      const { data } = await supabase
        .from('airbnb_listings')
        .select('neighbourhood')
        .eq('city', selectedCity)
        .not('neighbourhood', 'is', null);
      const uniqueAreas = [...new Set(data?.map(d => d.neighbourhood))].filter(Boolean).sort();
      return uniqueAreas as string[];
    },
    enabled: !!selectedCity,
  });

  // Fetch city stats
  const { data: cityStats } = useQuery({
    queryKey: ['airbnb-city-stats', selectedCity],
    queryFn: async () => {
      const { data } = await supabase
        .from('airbnb_area_stats')
        .select('*')
        .eq('city', selectedCity)
        .eq('area_type', 'city')
        .single();
      return data;
    },
    enabled: !!selectedCity,
  });

  // Fetch area stats
  const { data: areaStats } = useQuery({
    queryKey: ['airbnb-area-stats', selectedCity],
    queryFn: async () => {
      const { data } = await supabase
        .from('airbnb_area_stats')
        .select('*')
        .eq('city', selectedCity)
        .eq('area_type', 'neighbourhood')
        .order('avg_price_entire_home', { ascending: false });
      return data || [];
    },
    enabled: !!selectedCity,
  });

  // Fetch listings
  const { data: listings, isLoading } = useQuery({
    queryKey: ['airbnb-listings', selectedCity, selectedArea, roomTypeFilter, priceRange, bedroomFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('airbnb_listings')
        .select('*')
        .eq('city', selectedCity)
        .gte('price_per_night', priceRange[0])
        .lte('price_per_night', priceRange[1]);
      
      if (selectedArea !== 'all') query = query.eq('neighbourhood', selectedArea);
      if (roomTypeFilter !== 'all') query = query.eq('room_type', roomTypeFilter);
      if (bedroomFilter !== 'all') query = query.eq('bedrooms', parseInt(bedroomFilter));
      if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);
      
      const { data } = await query
        .order('estimated_monthly_revenue', { ascending: false })
        .limit(100);
      return data || [];
    },
    enabled: !!selectedCity,
  });

  // Calculate summary stats from filtered listings
  const summaryStats = useMemo(() => {
    if (!listings || listings.length === 0) return null;
    const entireHomes = listings.filter(l => l.room_type === 'Entire home/apt');
    const avgPrice = entireHomes.length > 0 
      ? entireHomes.reduce((sum, l) => sum + (Number(l.price_per_night) || 0), 0) / entireHomes.length 
      : 0;
    const avgOccupancy = listings.reduce((sum, l) => sum + (Number(l.estimated_occupancy_rate) || 0), 0) / listings.length;
    const avgRevenue = listings.reduce((sum, l) => sum + (Number(l.estimated_monthly_revenue) || 0), 0) / listings.length;
    return { 
      count: listings.length, 
      avgPrice: avgPrice.toFixed(0), 
      avgOccupancy: avgOccupancy.toFixed(0), 
      avgRevenue: avgRevenue.toFixed(0) 
    };
  }, [listings]);

  const getOccupancyColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Home className="h-8 w-8 text-primary" />
              Airbnb Radar
            </h1>
            <p className="text-muted-foreground">
              Competitor pricing, occupancy & yield analysis for serviced accommodation
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Data: Inside Airbnb (Jan 2025)
          </Badge>
        </div>

        {/* City & Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas?.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Entire home/apt">Entire Home</SelectItem>
                  <SelectItem value="Private room">Private Room</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                <SelectTrigger>
                  <BedDouble className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Any Beds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Beds</SelectItem>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1 Bed</SelectItem>
                  <SelectItem value="2">2 Beds</SelectItem>
                  <SelectItem value="3">3+ Beds</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search listings..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-10" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Price Range: £{priceRange[0]} - £{priceRange[1]}/night
              </label>
              <Slider 
                value={priceRange} 
                onValueChange={setPriceRange} 
                min={0} 
                max={500} 
                step={10} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {summaryStats?.count || cityStats?.total_listings?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Listings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <PoundSterling className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    £{summaryStats?.avgPrice || cityStats?.avg_price_entire_home || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg/Night</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Percent className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {summaryStats?.avgOccupancy || cityStats?.avg_occupancy_rate || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Est. Occupancy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    £{summaryStats?.avgRevenue || cityStats?.avg_monthly_revenue?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Est. Monthly Rev</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-warning fill-warning" />
                <div>
                  <p className="text-2xl font-bold">{cityStats?.superhost_count?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Superhosts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="overview">Area Analysis</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="calculator">Yield Calc</TabsTrigger>
            <TabsTrigger value="properties">My SA</TabsTrigger>
          </TabsList>

          {/* Area Analysis Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Area Comparison - {selectedCity}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Area</TableHead>
                        <TableHead className="text-right">Listings</TableHead>
                        <TableHead className="text-right">Avg £/Night</TableHead>
                        <TableHead className="text-right">Est. Occupancy</TableHead>
                        <TableHead className="text-right">Est. Monthly Rev</TableHead>
                        <TableHead className="text-right">Superhosts</TableHead>
                        <TableHead className="text-right">Avg Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {areaStats?.map(area => (
                        <TableRow 
                          key={area.id} 
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => { setSelectedArea(area.area_name); setActiveTab('listings'); }}
                        >
                          <TableCell className="font-medium">{area.area_name}</TableCell>
                          <TableCell className="text-right">{area.total_listings}</TableCell>
                          <TableCell className="text-right">£{area.avg_price_entire_home}</TableCell>
                          <TableCell className={`text-right ${getOccupancyColor(Number(area.avg_occupancy_rate))}`}>
                            {area.avg_occupancy_rate}%
                          </TableCell>
                          <TableCell className="text-right">£{Number(area.avg_monthly_revenue)?.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{area.superhost_count}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Star className="h-3 w-3 fill-warning text-warning" />
                              {(Number(area.avg_review_score) / 20).toFixed(1)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Host Competition & Revenue */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Host Competition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Hosts</span>
                    <span className="font-medium">{cityStats?.total_hosts?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Multi-listing Hosts</span>
                    <span className="font-medium">{cityStats?.multi_listing_hosts?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Listings/Host</span>
                    <span className="font-medium">
                      {cityStats?.total_hosts ? (cityStats.total_listings / cityStats.total_hosts).toFixed(1) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Professional Operators</span>
                    <span className="font-medium">
                      {cityStats?.total_hosts ? ((cityStats.multi_listing_hosts / cityStats.total_hosts) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Potential</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Annual Revenue</span>
                    <span className="font-medium">£{cityStats?.avg_annual_revenue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top 25% Earn Above</span>
                    <span className="font-medium text-green-600">
                      £{cityStats?.avg_annual_revenue ? (cityStats.avg_annual_revenue * 1.5).toLocaleString() : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entire Home Premium</span>
                    <span className="font-medium text-green-600">
                      +{cityStats?.avg_price_private_room 
                        ? (((cityStats.avg_price_entire_home - cityStats.avg_price_private_room) / cityStats.avg_price_private_room) * 100).toFixed(0) 
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Superhost Premium</span>
                    <span className="font-medium text-green-600">+15-20%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading listings...</div>
            ) : (
              <div className="grid gap-4">
                {listings?.map(listing => (
                  <Card key={listing.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {listing.picture_url && (
                          <img 
                            src={listing.picture_url} 
                            alt={listing.name || ''} 
                            className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                              <h3 className="font-medium truncate">{listing.name}</h3>
                              <p className="text-sm text-muted-foreground">{listing.neighbourhood}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-lg">£{listing.price_per_night}/night</p>
                              {listing.cleaning_fee && (
                                <p className="text-xs text-muted-foreground">+£{listing.cleaning_fee} cleaning</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">{listing.room_type}</Badge>
                            <Badge variant="outline">
                              <BedDouble className="h-3 w-3 mr-1" />
                              {listing.bedrooms || 0} bed
                            </Badge>
                            <Badge variant="outline">
                              <Users className="h-3 w-3 mr-1" />
                              {listing.accommodates} guests
                            </Badge>
                            {listing.host_is_superhost && (
                              <Badge className="bg-warning/20 text-warning border-warning">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Superhost
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <span className={getOccupancyColor(Number(listing.estimated_occupancy_rate))}>
                              {listing.estimated_occupancy_rate}% occupancy
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-warning text-warning" />
                              {listing.review_scores_rating ? (listing.review_scores_rating / 20).toFixed(1) : '-'} 
                              ({listing.number_of_reviews} reviews)
                            </span>
                            <span className="text-green-600 font-medium">
                              ~£{listing.estimated_monthly_revenue?.toLocaleString()}/mo
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {listing.listing_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={listing.listing_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {listings?.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No listings found matching your filters
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Yield Calculator Tab */}
          <TabsContent value="calculator">
            <YieldCalculator cityStats={cityStats} />
          </TabsContent>

          {/* My SA Properties Tab */}
          <TabsContent value="properties">
            <MySAProperties />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// Yield Calculator Component
function YieldCalculator({ cityStats }: { cityStats: any }) {
  const [purchasePrice, setPurchasePrice] = useState(300000);
  const [nightlyRate, setNightlyRate] = useState(Number(cityStats?.avg_price_entire_home) || 120);
  const [occupancy, setOccupancy] = useState([Number(cityStats?.avg_occupancy_rate) || 55]);
  const [monthlyExpenses, setMonthlyExpenses] = useState(500);
  const [btlRent, setBtlRent] = useState(1500);

  const annualRevenue = nightlyRate * 365 * (occupancy[0] / 100);
  const annualExpenses = monthlyExpenses * 12;
  const netIncome = annualRevenue - annualExpenses;
  const grossYield = (annualRevenue / purchasePrice) * 100;
  const netYield = (netIncome / purchasePrice) * 100;
  const btlYield = ((btlRent * 12) / purchasePrice) * 100;
  const saPremium = btlYield > 0 ? ((netYield - btlYield) / btlYield) * 100 : 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            SA Yield Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Purchase Price</label>
            <Input 
              type="number" 
              value={purchasePrice} 
              onChange={(e) => setPurchasePrice(Number(e.target.value))} 
              className="mt-1" 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Nightly Rate: £{nightlyRate}</label>
            <Slider 
              value={[nightlyRate]} 
              onValueChange={(v) => setNightlyRate(v[0])} 
              min={50} 
              max={400} 
              className="mt-2" 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Occupancy Rate: {occupancy[0]}%</label>
            <Slider 
              value={occupancy} 
              onValueChange={setOccupancy} 
              min={20} 
              max={95} 
              className="mt-2" 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Monthly Expenses (bills, cleaning, fees)</label>
            <Input 
              type="number" 
              value={monthlyExpenses} 
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))} 
              className="mt-1" 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">BTL Monthly Rent (for comparison)</label>
            <Input 
              type="number" 
              value={btlRent} 
              onChange={(e) => setBtlRent(Number(e.target.value))} 
              className="mt-1" 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Estimated Annual Revenue</p>
            <p className="text-3xl font-bold text-primary">£{annualRevenue.toLocaleString()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Gross Yield</p>
              <p className="text-xl font-bold">{grossYield.toFixed(1)}%</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Net Yield</p>
              <p className="text-xl font-bold text-primary">{netYield.toFixed(1)}%</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">BTL Yield</p>
              <p className="text-xl font-bold">{btlYield.toFixed(1)}%</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">SA Premium</p>
              <p className={`text-xl font-bold ${saPremium > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {saPremium > 0 ? '+' : ''}{saPremium.toFixed(0)}%
              </p>
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Net Monthly Income</span>
              <span className="font-medium">£{(netIncome / 12).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">vs BTL Monthly</span>
              <span className={`font-medium ${(netIncome / 12) > btlRent ? 'text-green-600' : 'text-red-600'}`}>
                £{((netIncome / 12) - btlRent).toFixed(0)}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Difference</span>
              <span className={`font-medium ${netIncome > (btlRent * 12) ? 'text-green-600' : 'text-red-600'}`}>
                £{(netIncome - (btlRent * 12)).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// My SA Properties Component
function MySAProperties() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newProperty, setNewProperty] = useState({ 
    name: '', 
    postcode: '', 
    bedrooms: 1, 
    nightly_rate: 100, 
    btl_monthly_rent: 1200 
  });

  const { data: properties } = useQuery({
    queryKey: ['user-sa-properties'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('user_sa_properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const addProperty = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('user_sa_properties')
        .insert({ ...newProperty, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => { 
      toast.success('Property added!'); 
      queryClient.invalidateQueries({ queryKey: ['user-sa-properties'] }); 
      setShowAdd(false); 
      setNewProperty({ name: '', postcode: '', bedrooms: 1, nightly_rate: 100, btl_monthly_rent: 1200 }); 
    },
    onError: () => toast.error('Failed to add property'),
  });

  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_sa_properties').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Property removed');
      queryClient.invalidateQueries({ queryKey: ['user-sa-properties'] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My SA Properties</h3>
        <Button onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "secondary" : "default"}>
          {showAdd ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showAdd ? 'Cancel' : 'Add Property'}
        </Button>
      </div>
      
      {showAdd && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input 
                placeholder="Property name" 
                value={newProperty.name}
                onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })} 
              />
              <Input 
                placeholder="Postcode" 
                value={newProperty.postcode}
                onChange={(e) => setNewProperty({ ...newProperty, postcode: e.target.value })} 
              />
              <Input 
                type="number" 
                placeholder="Bedrooms"
                value={newProperty.bedrooms}
                onChange={(e) => setNewProperty({ ...newProperty, bedrooms: Number(e.target.value) })} 
              />
              <Input 
                type="number" 
                placeholder="Nightly rate £"
                value={newProperty.nightly_rate}
                onChange={(e) => setNewProperty({ ...newProperty, nightly_rate: Number(e.target.value) })} 
              />
              <Button onClick={() => addProperty.mutate()} disabled={!newProperty.name}>
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {properties?.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No SA properties yet. Add your first property to compare with competitors.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {properties?.map(prop => (
            <Card key={prop.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{prop.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {prop.postcode} • {prop.bedrooms} bed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">£{prop.nightly_rate}/night</p>
                    <p className="text-sm text-muted-foreground">
                      {prop.actual_occupancy_rate || '??'}% occupancy
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteProperty.mutate(prop.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

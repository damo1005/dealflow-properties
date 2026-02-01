import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Heart,
  Share2,
  TrendingDown,
  Flame,
  Clock,
  ArrowUpRight,
  Grid,
  List,
} from "lucide-react";
import { useDealScoutStore, ScoutDiscovery } from "@/stores/dealScoutStore";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, getScoreBgColor, getScoreLabel } from "@/types/dealScout";
import { useNavigate } from "react-router-dom";

export function DiscoveriesList() {
  const { discoveries, setDiscoveries, scouts, isLoading, setIsLoading } = useDealScoutStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [scoutFilter, setScoutFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('7days');
  const [scoreFilter, setScoreFilter] = useState<number[]>([70]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadDiscoveries();
  }, []);

  const loadDiscoveries = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's scout IDs first
      const { data: scoutIds } = await supabase
        .from('deal_scouts')
        .select('id')
        .eq('user_id', user.id);

      if (!scoutIds || scoutIds.length === 0) {
        setDiscoveries([]);
        return;
      }

      const { data, error } = await supabase
        .from('scout_discoveries')
        .select(`
          *,
          property:cached_properties(*)
        `)
        .in('scout_id', scoutIds.map(s => s.id))
        .order('discovered_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setDiscoveries((data || []) as unknown as ScoutDiscovery[]);
    } catch (error) {
      console.error('Error loading discoveries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter discoveries
  const filteredDiscoveries = discoveries.filter(d => {
    if (scoutFilter !== 'all' && d.scout_id !== scoutFilter) return false;
    if (d.overall_score < scoreFilter[0]) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    
    // Date filter
    const discovered = new Date(d.discovered_at);
    const now = new Date();
    if (dateFilter === '24hrs') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      if (discovered < yesterday) return false;
    } else if (dateFilter === '7days') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (discovered < weekAgo) return false;
    } else if (dateFilter === '30days') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (discovered < monthAgo) return false;
    }
    
    return true;
  });

  // Stats
  const totalFound = filteredDiscoveries.length;
  const highScore = filteredDiscoveries.filter(d => d.overall_score >= 90).length;
  const avgScore = totalFound > 0
    ? Math.round(filteredDiscoveries.reduce((acc, d) => acc + d.overall_score, 0) / totalFound)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded w-full animate-pulse" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="pt-4">
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={scoutFilter} onValueChange={setScoutFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Scouts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scouts</SelectItem>
            {scouts.map(scout => (
              <SelectItem key={scout.id} value={scout.id}>{scout.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24hrs">Last 24 hours</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Min Score:</span>
          <div className="w-32">
            <Slider
              value={scoreFilter}
              onValueChange={setScoreFilter}
              min={50}
              max={100}
              step={5}
            />
          </div>
          <span className="text-sm font-medium">{scoreFilter[0]}</span>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="saved">Saved</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Found:</span>{' '}
          <span className="font-medium">{totalFound}</span>
        </div>
        <div>
          <span className="text-muted-foreground">High Score (90+):</span>{' '}
          <span className="font-medium text-green-600">{highScore}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Average Score:</span>{' '}
          <span className="font-medium">{avgScore}/100</span>
        </div>
      </div>

      {/* Discoveries Grid */}
      {filteredDiscoveries.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No discoveries yet</h3>
          <p className="text-muted-foreground">
            Your scouts are working hard. Check back soon!
          </p>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-4"
        }>
          {filteredDiscoveries.map((discovery) => (
            <DiscoveryCard 
              key={discovery.id} 
              discovery={discovery}
              viewMode={viewMode}
              onClick={() => navigate(`/deal-scout/discovery/${discovery.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DiscoveryCardProps {
  discovery: ScoutDiscovery;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

function DiscoveryCard({ discovery, viewMode, onClick }: DiscoveryCardProps) {
  const property = discovery.property;
  
  if (viewMode === 'list') {
    return (
      <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={onClick}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-24 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            {property?.images?.[0] ? (
              <img 
                src={property.images[0]} 
                alt={property?.address || 'Property'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{property?.address || 'Property'}</h3>
              <Badge className={getScoreBgColor(discovery.overall_score)}>
                {discovery.overall_score}/100
              </Badge>
            </div>
            <div className="text-lg font-bold">{property?.price ? formatCurrency(property.price) : 'Price TBC'}</div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span>{property?.bedrooms} bed • {property?.property_type}</span>
              {discovery.estimated_yield && <span>{discovery.estimated_yield}% yield</span>}
              {discovery.estimated_cash_flow && <span>+£{discovery.estimated_cash_flow}/mo</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">View</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={onClick}>
      {/* Image */}
      <div className="relative h-48 bg-muted">
        {property?.images?.[0] ? (
          <img 
            src={property.images[0]} 
            alt={property?.address || 'Property'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge className={getScoreBgColor(discovery.overall_score)}>
            {discovery.overall_score}/100 {getScoreLabel(discovery.overall_score)}
          </Badge>
        </div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {discovery.opportunity_flags?.hot_deal && (
            <Badge className="bg-red-500 text-white gap-1">
              <Flame className="h-3 w-3" />
              Hot Deal
            </Badge>
          )}
          {discovery.is_price_reduced && (
            <Badge className="bg-orange-500 text-white gap-1">
              <TrendingDown className="h-3 w-3" />
              Reduced
            </Badge>
          )}
          {discovery.opportunity_flags?.long_on_market && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {discovery.days_on_market}d
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-medium line-clamp-1">{property?.address || 'Property Address'}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">{property?.price ? formatCurrency(property.price) : 'Price TBC'}</span>
            {discovery.is_price_reduced && discovery.reduction_percentage && (
              <Badge variant="outline" className="text-orange-600">
                -{discovery.reduction_percentage}%
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>{property?.bedrooms} bed</span>
          <span>•</span>
          <span>{property?.bathrooms} bath</span>
          <span>•</span>
          <span className="capitalize">{property?.property_type}</span>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 border-y mb-3">
          <div>
            <div className="text-sm font-semibold text-green-600">
              {discovery.estimated_yield ? `${discovery.estimated_yield}%` : '-'}
            </div>
            <div className="text-xs text-muted-foreground">Yield</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-blue-600">
              {discovery.estimated_cash_flow ? `+£${discovery.estimated_cash_flow}` : '-'}
            </div>
            <div className="text-xs text-muted-foreground">Cash Flow</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-purple-600">
              {discovery.bmv_percentage ? `${discovery.bmv_percentage}%` : '-'}
            </div>
            <div className="text-xs text-muted-foreground">BMV</div>
          </div>
        </div>
        
        {/* Why it scored high */}
        {discovery.score_reasoning && (
          <div className="text-xs text-muted-foreground mb-3 line-clamp-2">
            ⭐ {discovery.score_reasoning}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-1">
            View Details
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

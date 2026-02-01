import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  MoreVertical,
  ChevronDown,
  MapPin,
  Wallet,
  Home,
  Target,
  Bell,
  Trash2,
  Copy,
  Edit,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useDealScoutStore, DealScout } from "@/stores/dealScoutStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/types/dealScout";

export function ScoutsList() {
  const { scouts, setScouts, updateScout, deleteScout, setWizardOpen, setIsLoading, isLoading } = useDealScoutStore();
  const { toast } = useToast();
  const [openScouts, setOpenScouts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadScouts();
  }, []);

  const loadScouts = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('deal_scouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScouts((data || []) as DealScout[]);
    } catch (error) {
      console.error('Error loading scouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleScout = (id: string) => {
    const newOpen = new Set(openScouts);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenScouts(newOpen);
  };

  const handleToggleActive = async (scout: DealScout) => {
    try {
      const { error } = await supabase
        .from('deal_scouts')
        .update({ is_active: !scout.is_active })
        .eq('id', scout.id);

      if (error) throw error;
      updateScout(scout.id, { is_active: !scout.is_active });
      toast({
        title: scout.is_active ? "Scout Paused" : "Scout Activated",
        description: `"${scout.name}" is now ${scout.is_active ? 'paused' : 'active'}`,
      });
    } catch (error) {
      console.error('Error updating scout:', error);
      toast({ title: "Error", description: "Failed to update scout", variant: "destructive" });
    }
  };

  const handleDeleteScout = async (scout: DealScout) => {
    try {
      const { error } = await supabase
        .from('deal_scouts')
        .delete()
        .eq('id', scout.id);

      if (error) throw error;
      deleteScout(scout.id);
      toast({ title: "Scout Deleted", description: `"${scout.name}" has been deleted` });
    } catch (error) {
      console.error('Error deleting scout:', error);
      toast({ title: "Error", description: "Failed to delete scout", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-2/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (scouts.length === 0) {
    return <EmptyScoutsState onCreateClick={() => setWizardOpen(true)} />;
  }

  return (
    <div className="space-y-4">
      {scouts.map((scout) => (
        <ScoutCard
          key={scout.id}
          scout={scout}
          isOpen={openScouts.has(scout.id)}
          onToggle={() => toggleScout(scout.id)}
          onToggleActive={() => handleToggleActive(scout)}
          onDelete={() => handleDeleteScout(scout)}
        />
      ))}
    </div>
  );
}

interface ScoutCardProps {
  scout: DealScout;
  isOpen: boolean;
  onToggle: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

function ScoutCard({ scout, isOpen, onToggle, onToggleActive, onDelete }: ScoutCardProps) {
  const newDealsCount = 0; // Would come from discoveries
  
  return (
    <Card className={!scout.is_active ? 'opacity-60' : ''}>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {scout.name}
                  {newDealsCount > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {newDealsCount} new
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>Created {new Date(scout.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{scout.properties_found} deals found</span>
                  {scout.avg_score && (
                    <>
                      <span>•</span>
                      <span>Avg score: {scout.avg_score}/100</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={scout.is_active}
                onCheckedChange={onToggleActive}
              />
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Scout
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Scout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-4 border-t">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Criteria */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Search Criteria
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{scout.location_areas?.join(', ') || 'Not set'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {scout.price_min && scout.price_max
                        ? `${formatCurrency(scout.price_min)} - ${formatCurrency(scout.price_max)}`
                        : 'Any budget'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {scout.property_types?.length > 0
                        ? scout.property_types.join(', ')
                        : 'Any type'}
                      {scout.bedrooms_min && scout.bedrooms_max && (
                        <> • {scout.bedrooms_min}-{scout.bedrooms_max} beds</>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{scout.investment_strategy || 'BTL'}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {scout.yield_min && (
                    <Badge variant="outline">Min {scout.yield_min}% yield</Badge>
                  )}
                  {scout.cash_flow_min && (
                    <Badge variant="outline">Min £{scout.cash_flow_min}/mo</Badge>
                  )}
                  {scout.bmv_min && (
                    <Badge variant="outline">{scout.bmv_min}%+ BMV</Badge>
                  )}
                  {scout.require_parking && (
                    <Badge variant="outline">Parking</Badge>
                  )}
                  {scout.require_garden && (
                    <Badge variant="outline">Garden</Badge>
                  )}
                </div>
              </div>
              
              {/* Performance */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold">{scout.properties_found}</div>
                    <div className="text-xs text-muted-foreground">Deals Found</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold">{scout.properties_viewed}</div>
                    <div className="text-xs text-muted-foreground">Viewed</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold">{scout.properties_saved}</div>
                    <div className="text-xs text-muted-foreground">Saved</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold">{scout.avg_score || '-'}</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bell className="h-4 w-4" />
                  <span className="capitalize">{scout.alert_frequency} alerts</span>
                  <span>•</span>
                  <span>Score ≥{scout.alert_score_threshold}</span>
                </div>
                
                {scout.last_scan_at && (
                  <p className="text-xs text-muted-foreground">
                    Last scan: {new Date(scout.last_scan_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" size="sm">View All Deals</Button>
              <Button variant="outline" size="sm">Edit Scout</Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function EmptyScoutsState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <Card className="p-12 text-center">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Create Your First Deal Scout</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Set your criteria once, and AI will hunt properties for you around the clock.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Never miss a deal
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Get alerts instantly
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          Score every property
        </div>
      </div>
      <Button onClick={onCreateClick} size="lg" className="gap-2">
        <Zap className="h-4 w-4" />
        Create Scout
      </Button>
    </Card>
  );
}

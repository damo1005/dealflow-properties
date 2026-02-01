import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, MapPin, Building2, Hammer, Thermometer, Users, TrendingUp, 
  Phone, Mail, Star, Award, Shield, Bookmark, ExternalLink, Globe 
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContractorDemandPage() {
  const queryClient = useQueryClient();
  const [searchPostcode, setSearchPostcode] = useState('');
  const [radius, setRadius] = useState([5]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchLocation, setSearchLocation] = useState<{lat: number, lng: number} | null>(null);

  // Filters
  const [planningStatus, setPlanningStatus] = useState('all');
  const [minCcsScore, setMinCcsScore] = useState([0]);
  const [ultraOnly, setUltraOnly] = useState(false);
  const [epcRating, setEpcRating] = useState<string[]>(['D', 'E', 'F', 'G']);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [contractorSearch, setContractorSearch] = useState('');

  const geocodePostcode = async (postcode: string) => {
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
      const data = await response.json();
      if (data.result) {
        setSearchLocation({ lat: data.result.latitude, lng: data.result.longitude });
        toast.success(`Found location: ${data.result.admin_district || postcode}`);
        return data.result;
      }
    } catch (error) {
      toast.error('Could not find postcode');
    }
    return null;
  };

  const { data: demandScore } = useQuery({
    queryKey: ['demand-score', searchPostcode],
    queryFn: async () => {
      if (!searchPostcode) return null;
      const district = searchPostcode.split(' ')[0].toUpperCase();
      const { data } = await supabase.from('demand_scores').select('*').eq('postcode_district', district).single();
      return data;
    },
    enabled: !!searchPostcode,
  });

  const { data: planning } = useQuery({
    queryKey: ['planning', planningStatus],
    queryFn: async () => {
      let query = supabase.from('planning_applications').select('*').order('received_date', { ascending: false });
      if (planningStatus !== 'all') query = query.eq('status', planningStatus);
      const { data } = await query.limit(50);
      return data || [];
    },
  });

  const { data: ccsSites } = useQuery({
    queryKey: ['ccs-sites', minCcsScore[0], ultraOnly],
    queryFn: async () => {
      let query = supabase.from('ccs_projects').select('*').order('overall_score', { ascending: false });
      if (minCcsScore[0] > 0) query = query.gte('overall_score', minCcsScore[0]);
      if (ultraOnly) query = query.eq('is_ultra_site', true);
      const { data } = await query.limit(50);
      return data || [];
    },
  });

  const { data: epcProperties } = useQuery({
    queryKey: ['epc', epcRating],
    queryFn: async () => {
      const { data } = await supabase.from('epc_properties').select('*').in('current_rating', epcRating).order('current_score', { ascending: true }).limit(50);
      return data || [];
    },
  });

  const { data: contractors } = useQuery({
    queryKey: ['contractors', selectedTrades, contractorSearch],
    queryFn: async () => {
      let query = supabase.from('area_contractors').select('*').eq('is_verified', true);
      if (selectedTrades.length > 0) query = query.overlaps('trade_categories', selectedTrades);
      if (contractorSearch) query = query.ilike('company_name', `%${contractorSearch}%`);
      const { data } = await query.order('ccs_score', { ascending: false, nullsFirst: false }).limit(50);
      return data || [];
    },
  });

  const saveContractor = useMutation({
    mutationFn: async (contractorId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('user_contractors').insert({ user_id: user.id, contractor_id: contractorId, status: 'saved' });
      if (error?.code === '23505') throw new Error('Already saved');
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Contractor saved!'); queryClient.invalidateQueries({ queryKey: ['user-contractors'] }); },
    onError: (e: Error) => toast.error(e.message === 'Already saved' ? 'Already in your list' : 'Failed to save'),
  });

  const trackPlanning = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      await supabase.from('user_tracked_planning').insert({ user_id: user.id, planning_id: id });
    },
    onSuccess: () => toast.success('Now tracking!'),
    onError: () => toast.error('Already tracking or not logged in'),
  });

  const trackSite = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      await supabase.from('user_tracked_sites').insert({ user_id: user.id, site_id: id });
    },
    onSuccess: () => toast.success('Now tracking!'),
    onError: () => toast.error('Already tracking or not logged in'),
  });

  const getDemandLevel = (score: number) => {
    if (score >= 70) return { label: 'High Demand', color: 'bg-destructive' };
    if (score >= 40) return { label: 'Medium', color: 'bg-warning' };
    return { label: 'Low', color: 'bg-success' };
  };

  const renderStars = (score: number | null) => {
    if (!score) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3 w-3 ${i < Math.floor(score) ? 'fill-warning text-warning' : 'text-muted'}`} 
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{score.toFixed(1)}</span>
      </div>
    );
  };

  const getEpcColor = (rating: string) => {
    const colors: Record<string, string> = { 
      A: 'bg-green-600', B: 'bg-green-500', C: 'bg-lime-500', 
      D: 'bg-yellow-500', E: 'bg-orange-500', F: 'bg-red-500', G: 'bg-red-700' 
    };
    return colors[rating] || 'bg-muted';
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-muted';
    if (status === 'approved') return 'bg-success';
    if (status === 'pending') return 'bg-warning';
    return 'bg-destructive';
  };

  const TRADES = ['builder', 'main_contractor', 'electrician', 'plumber', 'roofer', 'extensions', 'heating'];

  const toggleTrade = (trade: string) => {
    setSelectedTrades(prev => 
      prev.includes(trade) ? prev.filter(t => t !== trade) : [...prev, trade]
    );
  };

  const toggleEpcRating = (rating: string) => {
    setEpcRating(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Hammer className="h-8 w-8 text-primary" />
          Contractor Demand
        </h1>
        <p className="text-muted-foreground">
          Find construction activity and quality contractors in any area
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Enter postcode (e.g. AL5 2PQ)" 
                value={searchPostcode} 
                onChange={(e) => setSearchPostcode(e.target.value.toUpperCase())} 
                onKeyDown={(e) => e.key === 'Enter' && geocodePostcode(searchPostcode)} 
                className="pl-10" 
              />
            </div>
            <div className="w-48">
              <label className="text-sm text-muted-foreground block mb-2">
                Radius: {radius[0]} miles
              </label>
              <Slider value={radius} onValueChange={setRadius} min={1} max={25} step={1} />
            </div>
            <Button onClick={() => geocodePostcode(searchPostcode)}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab('planning')}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{planning?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Planning Apps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab('sites')}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Hammer className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{ccsSites?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Active Sites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab('epc')}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Thermometer className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{epcProperties?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Need Work</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab('contractors')}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{contractors?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Contractors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {demandScore && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{demandScore.overall_demand_score}</p>
                    <Badge className={getDemandLevel(demandScore.overall_demand_score).color}>
                      {getDemandLevel(demandScore.overall_demand_score).label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Demand Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="sites">Active Sites</TabsTrigger>
          <TabsTrigger value="epc">Renovation</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
        </TabsList>

        {/* Planning Tab */}
        <TabsContent value="planning" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={planningStatus} onValueChange={setPlanningStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="refused">Refused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4">
            {planning?.map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getStatusColor(app.status)}>
                          {app.status || 'Unknown'}
                        </Badge>
                        <span className="font-mono text-sm">{app.application_reference}</span>
                      </div>
                      <p className="font-medium">{app.property_address}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {app.proposal_description}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                        {app.number_of_units_proposed && (
                          <span className="font-medium">{app.number_of_units_proposed} units</span>
                        )}
                        <span>Submitted: {app.received_date ? new Date(app.received_date).toLocaleDateString() : 'N/A'}</span>
                        {app.applicant_name && <span>By: {app.applicant_name}</span>}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => trackPlanning.mutate(app.id)}>
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {planning?.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No planning applications found
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* CCS Sites Tab */}
        <TabsContent value="sites" className="space-y-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="w-64">
              <label className="text-sm text-muted-foreground block mb-2">
                Min Score: {minCcsScore[0]}
              </label>
              <Slider value={minCcsScore} onValueChange={setMinCcsScore} min={0} max={5} step={0.5} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="ultra" 
                checked={ultraOnly} 
                onCheckedChange={(c) => setUltraOnly(!!c)} 
              />
              <label htmlFor="ultra" className="text-sm cursor-pointer">Ultra Sites Only</label>
            </div>
          </div>
          
          <div className="grid gap-4">
            {ccsSites?.map((site) => (
              <Card key={site.id}>
                <CardContent className="pt-4">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {site.is_ultra_site && (
                          <Badge variant="outline" className="border-primary text-primary">
                            <Award className="h-3 w-3 mr-1" />
                            Ultra
                          </Badge>
                        )}
                        {site.has_award && (
                          <Badge variant="outline" className="border-warning text-warning">
                            <Award className="h-3 w-3 mr-1" />
                            Award
                          </Badge>
                        )}
                        <Badge variant="secondary">{site.project_category}</Badge>
                      </div>
                      <p className="font-medium text-lg">{site.project_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {site.address_line1}, {site.town} {site.postcode}
                      </p>
                      {site.overall_score && (
                        <div>{renderStars(site.overall_score)}</div>
                      )}
                      <div className="flex gap-4 text-sm">
                        <span><strong>Client:</strong> {site.client_name}</span>
                        <span><strong>Contractor:</strong> {site.contractor_name}</span>
                      </div>
                    </div>

                    {site.site_manager_name && (
                      <div className="lg:border-l lg:pl-4 space-y-2">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Site Manager</p>
                        <p className="font-medium">{site.site_manager_name}</p>
                        <div className="flex flex-col gap-1">
                          {site.site_manager_phone && (
                            <a 
                              href={`tel:${site.site_manager_phone}`} 
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3" />
                              {site.site_manager_phone}
                            </a>
                          )}
                          {site.site_manager_email && (
                            <a 
                              href={`mailto:${site.site_manager_email}`} 
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <Mail className="h-3 w-3" />
                              {site.site_manager_email}
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex lg:flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => trackSite.mutate(site.id)}>
                        <Bookmark className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {ccsSites?.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No active sites found
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* EPC Tab */}
        <TabsContent value="epc" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Filter by Rating</label>
            <div className="flex gap-2">
              {['D', 'E', 'F', 'G'].map((r) => (
                <Badge 
                  key={r}
                  variant={epcRating.includes(r) ? 'default' : 'outline'}
                  className={`cursor-pointer ${epcRating.includes(r) ? getEpcColor(r) : ''}`}
                  onClick={() => toggleEpcRating(r)}
                >
                  {r}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4">
            {epcProperties?.map((prop) => (
              <Card key={prop.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`${getEpcColor(prop.current_rating || 'G')} text-white text-2xl font-bold w-12 h-12 rounded flex items-center justify-center`}>
                      {prop.current_rating}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-medium">{prop.address}</p>
                      <p className="text-sm text-muted-foreground">{prop.postcode}</p>
                      <p className="text-sm">
                        Could be <Badge className={getEpcColor(prop.potential_rating || 'C')}>{prop.potential_rating}</Badge>
                        <span className="text-muted-foreground ml-2">(score {prop.potential_score})</span>
                      </p>
                      <div className="flex gap-3 text-sm flex-wrap">
                        {prop.walls_efficiency === 'Poor' && <span className="text-orange-500">🧱 Walls: Poor</span>}
                        {prop.walls_efficiency === 'Very Poor' && <span className="text-red-500">🧱 Walls: Very Poor</span>}
                        {prop.roof_efficiency === 'Poor' && <span className="text-orange-500">🏠 Roof: Poor</span>}
                        {prop.roof_efficiency === 'Very Poor' && <span className="text-red-500">🏠 Roof: Very Poor</span>}
                        {prop.windows_efficiency === 'Poor' && <span className="text-orange-500">🪟 Windows: Poor</span>}
                        {prop.windows_efficiency === 'Very Poor' && <span className="text-red-500">🪟 Windows: Very Poor</span>}
                        {prop.heating_efficiency === 'Poor' && <span className="text-orange-500">🔥 Heating: Poor</span>}
                        {prop.heating_efficiency === 'Very Poor' && <span className="text-red-500">🔥 Heating: Very Poor</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {prop.property_type} • {prop.floor_area}m² • 
                        EPC: {prop.lodgement_date ? new Date(prop.lodgement_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {epcProperties?.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No properties found with selected ratings
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Contractors Tab */}
        <TabsContent value="contractors" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Search contractors..." 
              value={contractorSearch}
              onChange={(e) => setContractorSearch(e.target.value)} 
              className="md:w-64"
            />
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Trades</label>
              <div className="flex gap-2 flex-wrap">
                {TRADES.map((t) => (
                  <Badge 
                    key={t}
                    variant={selectedTrades.includes(t) ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleTrade(t)}
                  >
                    {t.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid gap-4">
            {contractors?.map((c) => (
              <Card key={c.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div>
                        <p className="font-medium text-lg">{c.trading_name || c.company_name}</p>
                        {c.trading_name && (
                          <p className="text-sm text-muted-foreground">{c.company_name}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-4 flex-wrap">
                        {c.ccs_score && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">CCS</Badge>
                            {renderStars(c.ccs_score)}
                            <span className="text-xs text-muted-foreground">
                              ({c.ccs_project_count} projects)
                            </span>
                          </div>
                        )}
                        {c.checkatrade_score && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">CT</Badge>
                            {renderStars(c.checkatrade_score)}
                            <span className="text-xs text-muted-foreground">
                              ({c.checkatrade_reviews} reviews)
                            </span>
                          </div>
                        )}
                        {c.trustmark_registered && (
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            <Shield className="h-3 w-3 mr-1" />
                            TrustMark
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {c.trade_categories?.map((t) => (
                          <Badge key={t} variant="outline" className="capitalize">
                            {t.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        {c.phone && (
                          <a href={`tel:${c.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Call
                          </a>
                        )}
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Email
                          </a>
                        )}
                        {c.website && (
                          <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => saveContractor.mutate(c.id)}>
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {contractors?.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No contractors found
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

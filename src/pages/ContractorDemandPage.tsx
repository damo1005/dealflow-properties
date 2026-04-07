import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, MapPin, Building2, Hammer, Thermometer, Users, TrendingUp,
  Phone, Mail, Star, Award, Shield, Globe, Loader2,
  Calendar, PoundSterling, Wrench, Home
} from 'lucide-react';
import { toast } from 'sonner';

interface DemandScore {
  score: number;
  level: string;
  ratio: number;
  avgRating: number;
  interpretation: string;
}

export default function ContractorDemandPage() {
  const [searchPostcode, setSearchPostcode] = useState('');
  const [radius, setRadius] = useState([5]);
  const [activeTab, setActiveTab] = useState('planning');
  const [loading, setLoading] = useState(false);

  // Data state
  const [planningApps, setPlanningApps] = useState<any[]>([]);
  const [activeSites, setActiveSites] = useState<any[]>([]);
  const [renovationOpps, setRenovationOpps] = useState<any[]>([]);
  const [contractors, setContractors] = useState<any[]>([]);
  const [demandScore, setDemandScore] = useState<DemandScore | null>(null);

  // Filters
  const [planningStatus, setPlanningStatus] = useState('all');
  const [siteType, setSiteType] = useState('all');
  const [renoRating, setRenoRating] = useState('all');
  const [tradeFilter, setTradeFilter] = useState('all');

  const searchArea = async () => {
    if (!searchPostcode.trim()) {
      toast.error('Please enter a postcode');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-contractor-demand', {
        body: { postcode: searchPostcode.trim(), radius: radius[0] },
      });

      if (error) throw error;

      if (data?.success && data.data) {
        setPlanningApps(data.data.planningApps || []);
        setActiveSites(data.data.activeSites || []);
        setRenovationOpps(data.data.renovationOpps || []);
        setContractors(data.data.contractors || []);
        setDemandScore(data.data.demandScore || null);

        const total = (data.counts?.planning || 0) + (data.counts?.sites || 0) + (data.counts?.renovation || 0) + (data.counts?.contractors || 0);
        toast.success(`Found ${total} results across all categories`);
      } else {
        throw new Error(data?.error || 'Search failed');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      toast.error(err.message || 'Failed to search area');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-muted';
    if (status === 'approved') return 'bg-green-600';
    if (status === 'pending') return 'bg-yellow-500';
    if (status === 'refused') return 'bg-red-500';
    return 'bg-muted';
  };

  const getEpcColor = (rating: string) => {
    const colors: Record<string, string> = {
      A: 'bg-green-600', B: 'bg-green-500', C: 'bg-lime-500',
      D: 'bg-yellow-500', E: 'bg-orange-500', F: 'bg-red-500', G: 'bg-red-700',
    };
    return colors[rating] || 'bg-muted';
  };

  const getDemandColor = (level: string) => {
    if (level === 'very_high') return 'bg-red-600';
    if (level === 'high') return 'bg-orange-500';
    if (level === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getDemandLabel = (level: string) => {
    if (level === 'very_high') return 'Very High';
    if (level === 'high') return 'High';
    if (level === 'medium') return 'Medium';
    return 'Low';
  };

  const renderStars = (score: number | null) => {
    if (!score) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-3 w-3 ${i < Math.floor(score) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{score}</span>
      </div>
    );
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `£${(val / 1000000).toFixed(1)}m`;
    if (val >= 1000) return `£${(val / 1000).toFixed(0)}k`;
    return `£${val}`;
  };

  // Filtered data
  const filteredPlanning = planningApps.filter(a => planningStatus === 'all' || a.status === planningStatus);
  const filteredSites = activeSites.filter(s => siteType === 'all' || s.project_type === siteType);
  const filteredReno = renovationOpps.filter(r => renoRating === 'all' || r.epc_rating === renoRating);
  const filteredContractors = contractors.filter(c => tradeFilter === 'all' || c.trade_categories?.includes(tradeFilter));

  const allTrades = [...new Set(contractors.flatMap((c: any) => c.trade_categories || []))].sort();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Hammer className="h-8 w-8 text-primary" />
          Contractor Demand
        </h1>
        <p className="text-muted-foreground">
          Find construction activity, renovation opportunities, and quality contractors in any area
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
                onKeyDown={(e) => e.key === 'Enter' && searchArea()}
                className="pl-10"
              />
            </div>
            <div className="w-48">
              <label className="text-sm text-muted-foreground block mb-2">Radius: {radius[0]} miles</label>
              <Slider value={radius} onValueChange={setRadius} min={1} max={25} step={1} />
            </div>
            <Button onClick={searchArea} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
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
                <p className="text-2xl font-bold">{planningApps.length}</p>
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
                <p className="text-2xl font-bold">{activeSites.length}</p>
                <p className="text-sm text-muted-foreground">Active Sites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab('renovation')}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Thermometer className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{renovationOpps.length}</p>
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
                <p className="text-2xl font-bold">{contractors.length}</p>
                <p className="text-sm text-muted-foreground">Contractors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={demandScore ? 'border-primary/50 bg-primary/5' : ''}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                {demandScore ? (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{demandScore.score}</p>
                      <Badge className={getDemandColor(demandScore.level)}>
                        {getDemandLabel(demandScore.level)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Demand Score</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold">—</p>
                    <p className="text-sm text-muted-foreground">Demand Score</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demand interpretation */}
      {demandScore && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm">
              <strong>Market Analysis:</strong> {demandScore.interpretation}
              {' • '}Supply/demand ratio: <strong>{demandScore.ratio}</strong> jobs per contractor
              {' • '}Average contractor rating: <strong>{demandScore.avgRating}/5</strong>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="sites">Active Sites</TabsTrigger>
          <TabsTrigger value="renovation">Renovation</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
        </TabsList>

        {/* ============ PLANNING TAB ============ */}
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
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{filteredPlanning.length} results</span>
          </div>

          {loading && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching for planning applications...
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {!loading && filteredPlanning.map((app, idx) => (
              <Card key={app.application_reference + idx}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                        <span className="font-mono text-sm">{app.application_reference}</span>
                        <Badge variant="outline" className="capitalize">{app.development_type}</Badge>
                      </div>
                      <p className="font-medium">{app.property_address}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{app.proposal_description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Received: {app.received_date ? new Date(app.received_date).toLocaleDateString() : 'N/A'}
                        </span>
                        {app.decision_date && (
                          <span>Decision: {new Date(app.decision_date).toLocaleDateString()}</span>
                        )}
                        {app.applicant_name && <span>Applicant: {app.applicant_name}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!loading && filteredPlanning.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  {planningApps.length > 0 ? 'No results match filter' : 'Search a postcode to find planning applications'}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ============ ACTIVE SITES TAB ============ */}
        <TabsContent value="sites" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={siteType} onValueChange={setSiteType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new_build">New Build</SelectItem>
                <SelectItem value="extension">Extension</SelectItem>
                <SelectItem value="refurbishment">Refurbishment</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{filteredSites.length} results</span>
          </div>

          {loading && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching for active sites...
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {!loading && filteredSites.map((site, idx) => (
              <Card key={site.site_reference + idx}>
                <CardContent className="pt-4">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="capitalize">{site.project_type?.replace('_', ' ')}</Badge>
                        {site.is_ccs_registered && (
                          <Badge variant="outline" className="border-primary text-primary">
                            <Award className="h-3 w-3 mr-1" /> CCS Registered
                          </Badge>
                        )}
                        {site.ccs_score && renderStars(site.ccs_score)}
                      </div>
                      <p className="font-medium text-lg">{site.site_name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {site.address}, {site.postcode}
                      </p>
                      <p className="text-sm text-muted-foreground">{site.description}</p>
                      <div className="flex gap-4 text-sm flex-wrap">
                        {site.estimated_value && (
                          <span className="flex items-center gap-1">
                            <PoundSterling className="h-3 w-3" />
                            <strong>Value:</strong> {formatCurrency(site.estimated_value)}
                          </span>
                        )}
                        {site.units_count && <span><strong>Units:</strong> {site.units_count}</span>}
                        <span><strong>Contractor:</strong> {site.contractor_name}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Started: {site.start_date ? new Date(site.start_date).toLocaleDateString() : 'N/A'}
                        </span>
                        <span>
                          Due: {site.expected_completion ? new Date(site.expected_completion).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {site.site_manager && (
                      <div className="lg:border-l lg:pl-4 space-y-2 min-w-[200px]">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Site Manager</p>
                        <p className="font-medium">{site.site_manager}</p>
                        {site.site_manager_phone && (
                          <a href={`tel:${site.site_manager_phone}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {site.site_manager_phone}
                          </a>
                        )}
                        {site.contractor_phone && (
                          <a href={`tel:${site.contractor_phone}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Office: {site.contractor_phone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {!loading && filteredSites.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Hammer className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  {activeSites.length > 0 ? 'No results match filter' : 'Search a postcode to find active construction sites'}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ============ RENOVATION TAB ============ */}
        <TabsContent value="renovation" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={renoRating} onValueChange={setRenoRating}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="EPC Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
                <SelectItem value="F">F</SelectItem>
                <SelectItem value="G">G</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{filteredReno.length} results</span>
          </div>

          {loading && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching for renovation opportunities...
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {!loading && filteredReno.map((prop, idx) => (
              <Card key={prop.address + idx}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`${getEpcColor(prop.epc_rating)} text-white text-2xl font-bold w-12 h-12 rounded flex items-center justify-center shrink-0`}>
                      {prop.epc_rating}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{prop.address}</p>
                        <Badge variant={prop.renovation_potential === 'high' ? 'destructive' : prop.renovation_potential === 'medium' ? 'secondary' : 'outline'}>
                          {prop.renovation_potential} potential
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{prop.postcode}</p>
                      <div className="flex gap-3 text-sm flex-wrap">
                        <span className="flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          {prop.property_type?.replace('_', ' ')}
                        </span>
                        <span>{prop.bedrooms} bed</span>
                        <span>Built {prop.build_year}</span>
                        <span>Condition: <strong className={prop.estimated_condition === 'poor' ? 'text-red-500' : 'text-yellow-600'}>{prop.estimated_condition}</strong></span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {prop.work_types?.map((w: string) => (
                          <Badge key={w} variant="outline" className="capitalize text-xs">
                            <Wrench className="h-3 w-3 mr-1" />
                            {w.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <PoundSterling className="h-3 w-3 text-muted-foreground" />
                        <span>Estimated cost: <strong>{formatCurrency(prop.estimated_cost_low)}</strong> – <strong>{formatCurrency(prop.estimated_cost_high)}</strong></span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Could reach EPC <Badge className={getEpcColor(prop.epc_potential || 'C')} variant="secondary">{prop.epc_potential}</Badge>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!loading && filteredReno.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Thermometer className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  {renovationOpps.length > 0 ? 'No results match filter' : 'Search a postcode to find renovation opportunities'}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ============ CONTRACTORS TAB ============ */}
        <TabsContent value="contractors" className="space-y-4">
          <div className="flex gap-4 items-center flex-wrap">
            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                {allTrades.map(t => (
                  <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{filteredContractors.length} results</span>
          </div>

          {loading && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching for contractors...
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {!loading && filteredContractors.map((c, idx) => (
              <Card key={c.company_name + idx}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div>
                        <p className="font-medium text-lg">{c.company_name}</p>
                        {c.contact_name && <p className="text-sm text-muted-foreground">Contact: {c.contact_name}</p>}
                      </div>

                      <div className="flex gap-4 flex-wrap items-center">
                        {c.checkatrade_rating && (
                          <div className="flex items-center gap-1">
                            {renderStars(c.checkatrade_rating)}
                            <span className="text-xs text-muted-foreground">({c.checkatrade_reviews} reviews)</span>
                          </div>
                        )}
                        {c.google_rating && (
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">Google</Badge>
                            {renderStars(c.google_rating)}
                            {c.google_reviews && <span className="text-xs text-muted-foreground">({c.google_reviews})</span>}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {c.trade_categories?.map((t: string) => (
                          <Badge key={t} variant="outline" className="capitalize">{t.replace('_', ' ')}</Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {c.is_gas_safe && (
                          <Badge variant="outline" className="border-blue-500 text-blue-600">
                            <Shield className="h-3 w-3 mr-1" /> Gas Safe
                          </Badge>
                        )}
                        {c.is_niceic && (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            <Shield className="h-3 w-3 mr-1" /> NICEIC
                          </Badge>
                        )}
                        {c.is_trustmark && (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            <Shield className="h-3 w-3 mr-1" /> TrustMark
                          </Badge>
                        )}
                        {c.is_federation_master_builders && (
                          <Badge variant="outline" className="border-purple-500 text-purple-600">
                            <Award className="h-3 w-3 mr-1" /> FMB
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-3 flex-wrap text-sm">
                        {c.phone && (
                          <a href={`tel:${c.phone}`} className="text-primary hover:underline flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {c.phone}
                          </a>
                        )}
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="text-primary hover:underline flex items-center gap-1">
                            <Mail className="h-3 w-3" /> Email
                          </a>
                        )}
                        {c.website && (
                          <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            <Globe className="h-3 w-3" /> Website
                          </a>
                        )}
                        {c.checkatrade_url && (
                          <a href={c.checkatrade_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            <Star className="h-3 w-3" /> Checkatrade
                          </a>
                        )}
                      </div>

                      <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                        {c.established_year && <span>Est. {c.established_year}</span>}
                        {c.employees_count && <span>{c.employees_count} employees</span>}
                        {c.service_radius_miles && <span>{c.service_radius_miles} mile radius</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!loading && filteredContractors.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  {contractors.length > 0 ? 'No results match filter' : 'Search a postcode to find local contractors'}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

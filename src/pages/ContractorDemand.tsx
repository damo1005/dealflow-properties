import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { DemandOverviewTab } from '@/components/contractorDemand/DemandOverviewTab';
import { PlanningTab } from '@/components/contractorDemand/PlanningTab';
import { EPCRenovationTab } from '@/components/contractorDemand/EPCRenovationTab';
import { ContractorSearchTab } from '@/components/contractorDemand/ContractorSearchTab';
import { CCSProjectsTab } from '@/components/construction/CCSProjectsTab';
import { useContractorDemand } from '@/hooks/useContractorDemand';
import { 
  Search, 
  Map, 
  FileText, 
  HardHat, 
  Home, 
  Users,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContractorDemand() {
  const [postcode, setPostcode] = useState('');
  const [radius, setRadius] = useState(5);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasSearched, setHasSearched] = useState(false);

  const {
    isLoading,
    planningApplications,
    epcProperties,
    contractors,
    ccsProjects,
    demandScore,
    coordinates,
    searchArea,
    getQuickStats
  } = useContractorDemand();

  const handleSearch = async () => {
    if (!postcode.trim()) {
      toast.error('Please enter a postcode');
      return;
    }

    try {
      await searchArea(postcode, radius);
      setHasSearched(true);
      toast.success(`Found data for ${postcode}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to search area');
    }
  };

  const stats = getQuickStats();

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contractor Demand</h1>
            <p className="text-muted-foreground">
              Find construction activity and quality contractors in any area
            </p>
          </div>
          {demandScore && (
            <Badge 
              variant={stats.demandLevel === 'High' ? 'default' : 
                       stats.demandLevel === 'Medium' ? 'secondary' : 'outline'}
              className="text-lg px-4 py-2"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {stats.demandLevel} Demand Area
            </Badge>
          )}
        </div>

        {/* Search Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[250px] space-y-1">
                <Label>Postcode</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., SE10 0QJ, M1 5JG"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <div className="w-[200px] space-y-1">
                <Label>Radius: {radius} miles</Label>
                <Slider
                  value={[radius]}
                  onValueChange={(v) => setRadius(v[0])}
                  min={1}
                  max={25}
                  step={1}
                />
              </div>

              <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search Area
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Bar - only show after search */}
        {hasSearched && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab('planning')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stats.approvedPlanning}</div>
                  <p className="text-xs text-muted-foreground">Planning Approved</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab('sites')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <HardHat className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stats.activeSites}</div>
                  <p className="text-xs text-muted-foreground">Active Sites</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab('renovation')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Home className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stats.lowEpcCount}</div>
                  <p className="text-xs text-muted-foreground">Need Work</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab('contractors')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stats.verifiedContractors}</div>
                  <p className="text-xs text-muted-foreground">Contractors</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  stats.demandLevel === 'High' ? 'bg-red-100 dark:bg-red-900' :
                  stats.demandLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  'bg-green-100 dark:bg-green-900'
                }`}>
                  <TrendingUp className={`h-5 w-5 ${
                    stats.demandLevel === 'High' ? 'text-red-600' :
                    stats.demandLevel === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {demandScore?.overall_demand_score || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Demand Score</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Planning</span>
              {planningApplications.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {planningApplications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sites" className="gap-2">
              <HardHat className="h-4 w-4" />
              <span className="hidden sm:inline">Active Sites</span>
              {ccsProjects.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {ccsProjects.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="renovation" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Renovation</span>
              {epcProperties.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {epcProperties.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contractors" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Contractors</span>
              {contractors.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {contractors.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <DemandOverviewTab
              coordinates={coordinates}
              planningApplications={planningApplications}
              ccsProjects={ccsProjects}
              epcProperties={epcProperties}
              contractors={contractors}
              radius={radius}
            />
          </TabsContent>

          <TabsContent value="planning" className="mt-6">
            <PlanningTab
              applications={planningApplications}
              onTrack={(app) => toast.success(`Tracking ${app.reference}`)}
            />
          </TabsContent>

          <TabsContent value="sites" className="mt-6">
            <CCSProjectsTab />
          </TabsContent>

          <TabsContent value="renovation" className="mt-6">
            <EPCRenovationTab
              properties={epcProperties}
              onFindContractors={(property) => {
                setActiveTab('contractors');
                toast.info(`Finding contractors for ${property.address}`);
              }}
            />
          </TabsContent>

          <TabsContent value="contractors" className="mt-6">
            <ContractorSearchTab
              contractors={contractors}
              onSave={(contractor) => toast.success(`Saved ${contractor.company_name}`)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

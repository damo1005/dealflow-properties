import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  List,
  Map,
  HardHat,
  Star,
  Trophy,
  Building2,
  Eye,
  Bookmark,
  Filter,
} from "lucide-react";
import { useConstructionProjects, useProjectCompanies, useTrackedProjects, useTrackProject } from "@/hooks/useConstructionData";
import { useConstructionStore } from "@/stores/constructionStore";
import { ConstructionProject, PROJECT_STATUS_CONFIG, PROJECT_TYPE_CONFIG } from "@/types/construction";
import { ProjectDetailModal } from "@/components/construction/ProjectDetailModal";
import { ConstructionMap } from "@/components/construction/ConstructionMap";
import { MyContractorsTab } from "@/components/construction/MyContractorsTab";

export default function ConstructionRadar() {
  const [activeTab, setActiveTab] = useState("projects");
  const [searchPostcode, setSearchPostcode] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    filters,
    setFilters,
    viewMode,
    setViewMode,
    selectedProject,
    setSelectedProject,
    isDetailModalOpen,
    setIsDetailModalOpen,
    setProjects,
    setCompanies,
  } = useConstructionStore();
  
  const { data: projects = [], isLoading: projectsLoading } = useConstructionProjects(
    searchPostcode || undefined
  );
  const projectIds = projects.map(p => p.id);
  const { data: companies = [] } = useProjectCompanies(projectIds);
  const { data: trackedProjects = [] } = useTrackedProjects();
  const trackProject = useTrackProject();
  
  useEffect(() => {
    setProjects(projects);
    setCompanies(companies);
  }, [projects, companies, setProjects, setCompanies]);
  
  // Apply filters
  const filteredProjects = projects.filter((project) => {
    if (filters.status !== 'all' && project.status !== filters.status) return false;
    if (filters.projectType !== 'all' && project.project_type !== filters.projectType) return false;
    if (filters.ccsOnly && !project.is_ccs_registered) return false;
    if (filters.ultraSitesOnly && !project.is_ultra_site) return false;
    if (filters.hasAward && !project.has_national_award) return false;
    return true;
  });
  
  const trackedIds = new Set(trackedProjects.map(t => t.project_id));
  
  // Stats
  const activeCount = filteredProjects.filter(p => p.status === 'active').length;
  const ccsCount = filteredProjects.filter(p => p.is_ccs_registered).length;
  const awardCount = filteredProjects.filter(p => p.has_national_award).length;
  
  const handleViewProject = (project: ConstructionProject) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };
  
  const handleSearch = () => {
    // Trigger refetch with new postcode
    setFilters({ postcode: searchPostcode });
  };
  
  return (
    <AppLayout title="Construction Radar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HardHat className="h-6 w-6 text-primary" />
              Construction Radar
            </h1>
            <p className="text-muted-foreground">
              Find active construction projects and verified contractors in your area
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{filteredProjects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <div className="text-sm text-muted-foreground">Active Sites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                <Star className="h-4 w-4" />
                {ccsCount}
              </div>
              <div className="text-sm text-muted-foreground">CCS Registered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-600 flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {awardCount}
              </div>
              <div className="text-sm text-muted-foreground">Award Winners</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="projects" className="gap-2">
              <Building2 className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="contractors" className="gap-2">
              <HardHat className="h-4 w-4" />
              My Contractors
            </TabsTrigger>
            <TabsTrigger value="tracked" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Tracked ({trackedProjects.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-6">
            {/* Search & Filters */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by postcode (e.g., SE10)"
                      value={searchPostcode}
                      onChange={(e) => setSearchPostcode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select
                  value={filters.radius.toString()}
                  onValueChange={(v) => setFilters({ radius: Number(v) })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5 miles</SelectItem>
                    <SelectItem value="1">1 mile</SelectItem>
                    <SelectItem value="2">2 miles</SelectItem>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('map')}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Expanded Filters */}
              {showFilters && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <Label>Project Status</Label>
                        <Select
                          value={filters.status}
                          onValueChange={(v) => setFilters({ status: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Project Type</Label>
                        <Select
                          value={filters.projectType}
                          onValueChange={(v) => setFilters({ projectType: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="new_build">New Build</SelectItem>
                            <SelectItem value="extension">Extension</SelectItem>
                            <SelectItem value="conversion">Conversion</SelectItem>
                            <SelectItem value="refurbishment">Refurbishment</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={filters.ccsOnly}
                            onCheckedChange={(v) => setFilters({ ccsOnly: v })}
                          />
                          <Label>CCS Only</Label>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={filters.ultraSitesOnly}
                            onCheckedChange={(v) => setFilters({ ultraSitesOnly: v })}
                          />
                          <Label>Ultra Sites</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={filters.hasAward}
                            onCheckedChange={(v) => setFilters({ hasAward: v })}
                          />
                          <Label>Award Winners</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Results */}
            {projectsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : viewMode === 'map' ? (
              <div className="mt-6 h-[600px] rounded-lg overflow-hidden border">
                <ConstructionMap
                  projects={filteredProjects}
                  onProjectClick={handleViewProject}
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {filteredProjects.length === 0 ? (
                  <Card className="col-span-full p-8 text-center">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No projects found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </Card>
                ) : (
                  filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isTracked={trackedIds.has(project.id)}
                      mainContractor={companies.find(
                        (c) => c.project_id === project.id && c.role === 'main_contractor'
                      )?.company_name}
                      onView={() => handleViewProject(project)}
                      onTrack={() => trackProject.mutate({ projectId: project.id })}
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="contractors" className="mt-6">
            <MyContractorsTab />
          </TabsContent>
          
          <TabsContent value="tracked" className="mt-6">
            {trackedProjects.length === 0 ? (
              <Card className="p-8 text-center">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tracked projects</h3>
                <p className="text-muted-foreground">
                  Track projects to get updates on their progress
                </p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trackedProjects.map((tracked) => tracked.project && (
                  <ProjectCard
                    key={tracked.id}
                    project={tracked.project}
                    isTracked
                    onView={() => handleViewProject(tracked.project!)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
    </AppLayout>
  );
}

interface ProjectCardProps {
  project: ConstructionProject;
  isTracked?: boolean;
  mainContractor?: string;
  onView: () => void;
  onTrack?: () => void;
}

function ProjectCard({ project, isTracked, mainContractor, onView, onTrack }: ProjectCardProps) {
  const statusConfig = PROJECT_STATUS_CONFIG[project.status as keyof typeof PROJECT_STATUS_CONFIG];
  const typeConfig = project.project_type ? PROJECT_TYPE_CONFIG[project.project_type as keyof typeof PROJECT_TYPE_CONFIG] : null;
  
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {typeConfig && <span className="text-lg">{typeConfig.icon}</span>}
            <h3 className="font-medium line-clamp-1">
              {project.project_name || 'Unnamed Project'}
            </h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {project.is_ccs_registered && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Star className="h-3 w-3 text-amber-500" />
                {project.ccs_star_rating?.toFixed(1) || 'CCS'}
              </Badge>
            )}
            {project.has_national_award && (
              <Trophy className="h-4 w-4 text-amber-500" />
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{project.address}, {project.postcode}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={statusConfig?.color || 'bg-gray-100'}>
            {statusConfig?.label || project.status}
          </Badge>
          {typeConfig && (
            <Badge variant="outline">{typeConfig.label}</Badge>
          )}
          {project.is_ultra_site && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Ultra Site
            </Badge>
          )}
        </div>
        
        {mainContractor && (
          <div className="text-sm text-muted-foreground mb-3">
            <span className="font-medium">Contractor:</span> {mainContractor}
          </div>
        )}
        
        {project.expected_completion && (
          <div className="text-sm text-muted-foreground mb-3">
            Expected: {new Date(project.expected_completion).toLocaleDateString('en-GB', {
              month: 'short',
              year: 'numeric',
            })}
          </div>
        )}
        
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={onView} className="gap-1">
            <Eye className="h-3 w-3" />
            Details
          </Button>
          {onTrack && !isTracked && (
            <Button variant="outline" size="sm" onClick={onTrack} className="gap-1">
              <Bookmark className="h-3 w-3" />
              Track
            </Button>
          )}
          {isTracked && (
            <Badge variant="secondary" className="ml-auto">
              <Bookmark className="h-3 w-3 mr-1" />
              Tracked
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

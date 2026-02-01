import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Search,
  MapPin,
  Star,
  Trophy,
  Phone,
  Mail,
  RefreshCw,
  Building2,
  Bookmark,
  UserPlus,
  Map,
  List,
} from "lucide-react";
import {
  useCCSProjectsNear,
  useSyncCCSProjects,
  useCCSSyncStatus,
  useTrackCCSProject,
  useSaveCCSContractor,
  CCSProject,
} from "@/hooks/useCCSData";
import { formatDistanceToNow } from "date-fns";

export function CCSProjectsTab() {
  const [searchPostcode, setSearchPostcode] = useState("");
  const [activePostcode, setActivePostcode] = useState("");
  const [radius, setRadius] = useState(10);
  const [minScore, setMinScore] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const { data: ccsProjects = [], isLoading, refetch } = useCCSProjectsNear(
    activePostcode || null,
    radius,
    minScore
  );
  const syncCCS = useSyncCCSProjects();
  const { data: lastSync } = useCCSSyncStatus();
  const trackCCSProject = useTrackCCSProject();
  const saveCCSContractor = useSaveCCSContractor();

  const handleSearch = () => {
    setActivePostcode(searchPostcode.toUpperCase());
  };

  const handleSync = async () => {
    await syncCCS.mutateAsync();
    refetch();
  };

  // Stats
  const ultraSites = ccsProjects.filter((p) => p.is_ultra_site).length;
  const withAwards = ccsProjects.filter((p) => p.has_award).length;
  const withScores = ccsProjects.filter((p) => p.overall_score).length;
  const avgScore =
    withScores > 0
      ? ccsProjects.reduce((sum, p) => sum + (p.overall_score || 0), 0) / withScores
      : 0;

  return (
    <div className="space-y-6">
      {/* Sync Status Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                CCS Insights API
              </h3>
              <p className="text-sm text-muted-foreground">
                {lastSync
                  ? `Last synced ${formatDistanceToNow(lastSync, { addSuffix: true })}`
                  : "Not synced yet"}
                {ccsProjects.length > 0 && ` • ${ccsProjects.length} projects loaded`}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={syncCCS.isPending}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncCCS.isPending ? "animate-spin" : ""}`} />
              {syncCCS.isPending ? "Syncing..." : "Sync from CCS"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <Label>Search by Postcode</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g., SW1A 1AA or SW1"
                  value={searchPostcode}
                  onChange={(e) => setSearchPostcode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Radius: {radius} miles</Label>
              <Slider
                value={[radius]}
                onValueChange={(v) => setRadius(v[0])}
                min={1}
                max={25}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Min Score Filter */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap">Min CCS Score:</Label>
              <div className="flex gap-1">
                {[0, 3, 4, 4.5].map((score) => (
                  <Button
                    key={score}
                    variant={minScore === score ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMinScore(score)}
                  >
                    {score === 0 ? "Any" : `${score}+`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{ccsProjects.length}</div>
            <div className="text-sm text-muted-foreground">Projects Found</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-600 flex items-center gap-1">
              <Star className="h-4 w-4" />
              {avgScore.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg CCS Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{ultraSites}</div>
            <div className="text-sm text-muted-foreground">Ultra Sites</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              {withAwards}
            </div>
            <div className="text-sm text-muted-foreground">Award Winners</div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : ccsProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No CCS Projects Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            {activePostcode
              ? `No projects found within ${radius} miles of ${activePostcode}. Try increasing the radius or searching a different area.`
              : "Click 'Sync from CCS' to fetch live project data, then search by postcode to find projects near you."}
          </p>
          {!activePostcode && (
            <Button onClick={handleSync} disabled={syncCCS.isPending}>
              <RefreshCw className={`h-4 w-4 mr-2 ${syncCCS.isPending ? "animate-spin" : ""}`} />
              {syncCCS.isPending ? "Syncing..." : "Sync CCS Data"}
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ccsProjects.map((project) => (
            <CCSProjectCard
              key={project.id}
              project={project}
              onTrack={() => trackCCSProject.mutate({ ccsProjectId: project.ccs_project_id })}
              onSaveContractor={() => {
                if (project.contractor_name) {
                  saveCCSContractor.mutate({
                    contractor_name: project.contractor_name,
                    avg_ccs_score: project.overall_score,
                  });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CCSProjectCardProps {
  project: CCSProject;
  onTrack: () => void;
  onSaveContractor: () => void;
}

function CCSProjectCard({ project, onTrack, onSaveContractor }: CCSProjectCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium line-clamp-2">
            {project.project_name || "Unnamed Project"}
          </h3>
          {project.overall_score && (
            <Badge variant="outline" className="gap-1 text-xs shrink-0">
              <Star className="h-3 w-3 text-amber-500" />
              {project.overall_score.toFixed(1)}
            </Badge>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">
            {[project.address_line1, project.town, project.postcode].filter(Boolean).join(", ")}
          </span>
        </div>

        {/* Distance if available */}
        {project.distance_miles && (
          <Badge variant="secondary" className="mb-2">
            {project.distance_miles.toFixed(1)} miles away
          </Badge>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.project_category && (
            <Badge variant="outline">{project.project_category}</Badge>
          )}
          {project.is_ultra_site && (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Ultra Site
            </Badge>
          )}
          {project.has_award && (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              <Trophy className="h-3 w-3 mr-1" />
              Award
            </Badge>
          )}
        </div>

        {/* Contractor */}
        {project.contractor_name && (
          <div className="text-sm mb-2">
            <span className="text-muted-foreground">Contractor: </span>
            <span className="font-medium">{project.contractor_name}</span>
          </div>
        )}

        {/* Client */}
        {project.client_name && (
          <div className="text-sm mb-2">
            <span className="text-muted-foreground">Client: </span>
            <span>{project.client_name}</span>
          </div>
        )}

        {/* Site Manager Contact */}
        {project.site_manager_name && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md text-sm">
            <div className="font-medium mb-1">{project.site_manager_name}</div>
            <div className="flex flex-wrap gap-2">
              {project.site_manager_phone && (
                <a
                  href={`tel:${project.site_manager_phone}`}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  {project.site_manager_phone}
                </a>
              )}
              {project.site_manager_email && (
                <a
                  href={`mailto:${project.site_manager_email}`}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  Email
                </a>
              )}
            </div>
          </div>
        )}

        {/* CCS Scores */}
        {(project.community_score || project.environment_score || project.workforce_score) && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-center">
            {project.community_score && (
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded">
                <div className="font-bold text-blue-600">{project.community_score.toFixed(1)}</div>
                <div className="text-muted-foreground">Community</div>
              </div>
            )}
            {project.environment_score && (
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                <div className="font-bold text-green-600">{project.environment_score.toFixed(1)}</div>
                <div className="text-muted-foreground">Environment</div>
              </div>
            )}
            {project.workforce_score && (
              <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded">
                <div className="font-bold text-purple-600">{project.workforce_score.toFixed(1)}</div>
                <div className="text-muted-foreground">Workforce</div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 mt-3 border-t">
          <Button variant="outline" size="sm" onClick={onTrack} className="gap-1">
            <Bookmark className="h-3 w-3" />
            Track
          </Button>
          {project.contractor_name && (
            <Button variant="outline" size="sm" onClick={onSaveContractor} className="gap-1">
              <UserPlus className="h-3 w-3" />
              Save Contractor
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Trophy,
  MapPin,
  Calendar,
  Building2,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Copy,
} from "lucide-react";
import { ConstructionProject, ProjectCompany, PROJECT_STATUS_CONFIG, PROJECT_TYPE_CONFIG, COMPANY_ROLE_CONFIG } from "@/types/construction";
import { useConstructionStore } from "@/stores/constructionStore";
import { useTrackProject, useUntrackProject, useTrackedProjects, useSaveContractor } from "@/hooks/useConstructionData";
import { useToast } from "@/hooks/use-toast";

interface ProjectDetailModalProps {
  project: ConstructionProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailModal({ project, open, onOpenChange }: ProjectDetailModalProps) {
  const { companies } = useConstructionStore();
  const { data: trackedProjects = [] } = useTrackedProjects();
  const trackProject = useTrackProject();
  const untrackProject = useUntrackProject();
  const saveContractor = useSaveContractor();
  const { toast } = useToast();
  
  if (!project) return null;
  
  const projectCompanies = companies.filter(c => c.project_id === project.id);
  const isTracked = trackedProjects.some(t => t.project_id === project.id);
  
  const statusConfig = PROJECT_STATUS_CONFIG[project.status as keyof typeof PROJECT_STATUS_CONFIG];
  const typeConfig = project.project_type ? PROJECT_TYPE_CONFIG[project.project_type as keyof typeof PROJECT_TYPE_CONFIG] : null;
  
  // Group companies by role
  const companiesByRole = projectCompanies.reduce((acc, company) => {
    const role = company.role;
    if (!acc[role]) acc[role] = [];
    acc[role].push(company);
    return acc;
  }, {} as Record<string, ProjectCompany[]>);
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${project.address}, ${project.postcode}`);
    toast({ title: 'Address copied to clipboard' });
  };
  
  const handleGoogleMaps = () => {
    const query = encodeURIComponent(`${project.address}, ${project.postcode}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {typeConfig?.icon}
                {project.project_name || 'Construction Project'}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={statusConfig?.color}>
                  {statusConfig?.label || project.status}
                </Badge>
                {project.is_ccs_registered && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    CCS {project.ccs_star_rating?.toFixed(1)}/5
                  </Badge>
                )}
                {project.is_ultra_site && (
                  <Badge className="bg-purple-100 text-purple-800">Ultra Site</Badge>
                )}
                {project.has_national_award && (
                  <Badge className="bg-amber-100 text-amber-800 gap-1">
                    <Trophy className="h-3 w-3" />
                    National Award
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{project.address}</p>
                    <p className="text-sm text-muted-foreground">{project.postcode}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleGoogleMaps}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {project.project_type && typeConfig && (
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{typeConfig.label}</p>
                  </div>
                )}
                {project.units_count && (
                  <div>
                    <span className="text-muted-foreground">Units:</span>
                    <p className="font-medium">{project.units_count}</p>
                  </div>
                )}
                {project.estimated_value && (
                  <div>
                    <span className="text-muted-foreground">Estimated Value:</span>
                    <p className="font-medium">
                      £{project.estimated_value.toLocaleString()}
                    </p>
                  </div>
                )}
                {project.data_source && (
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <p className="font-medium capitalize">{project.data_source.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
              
              {/* Timeline */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {project.submitted_date && (
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <p className="font-medium">
                        {new Date(project.submitted_date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  )}
                  {project.approved_date && (
                    <div>
                      <span className="text-muted-foreground">Approved:</span>
                      <p className="font-medium">
                        {new Date(project.approved_date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  )}
                  {project.start_date && (
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <p className="font-medium">
                        {new Date(project.start_date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  )}
                  {project.expected_completion && (
                    <div>
                      <span className="text-muted-foreground">Expected Completion:</span>
                      <p className="font-medium">
                        {new Date(project.expected_completion).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {project.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Companies */}
          {Object.keys(companiesByRole).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Companies Involved
              </h3>
              <Accordion type="multiple" className="space-y-2">
                {Object.entries(companiesByRole).map(([role, roleCompanies]) => {
                  const roleConfig = COMPANY_ROLE_CONFIG[role as keyof typeof COMPANY_ROLE_CONFIG];
                  return (
                    <AccordionItem key={role} value={role} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="flex items-center gap-2">
                          {roleConfig?.icon}
                          {roleConfig?.label || role}
                          <Badge variant="secondary" className="ml-2">
                            {roleCompanies.length}
                          </Badge>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {roleCompanies.map((company) => (
                            <CompanyCard
                              key={company.id}
                              company={company}
                              onSave={() => saveContractor.mutate({ company_id: company.id })}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {isTracked ? (
              <Button
                variant="outline"
                onClick={() => untrackProject.mutate(project.id)}
                className="gap-2"
              >
                <BookmarkCheck className="h-4 w-4" />
                Tracking
              </Button>
            ) : (
              <Button
                onClick={() => trackProject.mutate({ projectId: project.id })}
                className="gap-2"
              >
                <Bookmark className="h-4 w-4" />
                Track Project
              </Button>
            )}
            
            {project.source_url && (
              <Button
                variant="outline"
                onClick={() => window.open(project.source_url!, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Source
              </Button>
            )}
            
            {project.planning_reference && (
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(project.planning_reference!);
                  toast({ title: 'Reference copied' });
                }}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                {project.planning_reference}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CompanyCardProps {
  company: ProjectCompany;
  onSave: () => void;
}

function CompanyCard({ company, onSave }: CompanyCardProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{company.company_name}</h4>
              {company.is_ccs_registered && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Star className="h-3 w-3 text-amber-500" />
                  CCS {company.ccs_rating?.toFixed(1) || ''}
                </Badge>
              )}
              {company.is_ccs_partner && (
                <Badge variant="secondary" className="text-xs">Partner</Badge>
              )}
            </div>
            
            {company.company_number && (
              <p className="text-xs text-muted-foreground mt-1">
                Company #{company.company_number}
              </p>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
        
        <div className="mt-3 space-y-2 text-sm">
          {company.site_contact_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium">Site Contact:</span>
              {company.site_contact_name}
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            {company.site_phone && (
              <a href={`tel:${company.site_phone}`} className="flex items-center gap-1 text-primary hover:underline">
                <Phone className="h-3 w-3" />
                {company.site_phone}
              </a>
            )}
            {company.site_email && (
              <a href={`mailto:${company.site_email}`} className="flex items-center gap-1 text-primary hover:underline">
                <Mail className="h-3 w-3" />
                Email
              </a>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                <Globe className="h-3 w-3" />
                Website
              </a>
            )}
          </div>
          
          {company.head_office_phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Head Office:</span>
              <a href={`tel:${company.head_office_phone}`} className="text-primary hover:underline">
                {company.head_office_phone}
              </a>
            </div>
          )}
          
          {company.checkatrade_rating && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                Checkatrade: {company.checkatrade_rating}/10
                {company.checkatrade_reviews && (
                  <span className="text-muted-foreground">
                    ({company.checkatrade_reviews} reviews)
                  </span>
                )}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

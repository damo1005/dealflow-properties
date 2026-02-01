import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import type { PlanningApplication } from "@/types/planning";
import { PLANNING_STATUS_COLORS, PLANNING_STATUS_ICONS } from "@/types/planning";
import {
  RefreshCw,
  FileText,
  Calendar,
  User,
  Building,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
  X,
  Clock,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";

interface PlanningTabProps {
  propertyAddress: string;
  postcode: string;
  localAuthority?: string;
}

function StatusBadge({ status }: { status: string }) {
  const colors = PLANNING_STATUS_COLORS[status] || { bg: "bg-gray-100", text: "text-gray-800" };
  const icon = PLANNING_STATUS_ICONS[status] || "❓";

  return (
    <Badge className={`${colors.bg} ${colors.text} border-0`}>
      {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function ApplicationCard({
  application,
  onViewDetails,
}: {
  application: PlanningApplication;
  onViewDetails: (app: PlanningApplication) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const daysToDecision = application.received_date && application.decision_date
    ? differenceInDays(new Date(application.decision_date), new Date(application.received_date))
    : null;

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-medium">
                    {application.application_reference}
                  </span>
                  <StatusBadge status={application.status} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {application.proposal_description}
                </p>
                {application.decision_date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Decision: {format(new Date(application.decision_date), "dd MMM yyyy")}
                    {daysToDecision && ` (${daysToDecision} days)`}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" className="ml-2">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t bg-muted/30">
            <div className="pt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Received</p>
                <p className="font-medium">
                  {application.received_date
                    ? format(new Date(application.received_date), "dd MMM yyyy")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{application.development_type || "-"}</p>
              </div>
            </div>

            {application.decision && (
              <div className="p-3 bg-background rounded-lg">
                <p className="text-sm font-medium">{application.decision}</p>
                {application.decision_reason && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Reason: {application.decision_reason}
                  </p>
                )}
              </div>
            )}

            {application.conditions && application.conditions.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Conditions ({application.conditions.length})
                </p>
                <ul className="space-y-1">
                  {application.conditions.slice(0, 3).map((condition, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {condition.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(application)}>
                View Full Details
              </Button>
              {application.portal_url && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={application.portal_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Council Portal
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function PlanningTab({ propertyAddress, postcode, localAuthority = "Enfield" }: PlanningTabProps) {
  const [applications, setApplications] = useState<PlanningApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<PlanningApplication | null>(null);

  useEffect(() => {
    fetchData(false);
  }, [propertyAddress, postcode]);

  const fetchData = async (forceRefresh: boolean) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("planning-fetch", {
        body: { address: propertyAddress, postcode, localAuthority, forceRefresh },
      });

      if (error) throw error;

      if (response.success) {
        setApplications(response.applications || []);
        if (response.source === "mock") {
          toast.info("Using demo data", { description: response.message });
        }
      } else {
        toast.error("Failed to fetch planning data", { description: response.error });
      }
    } catch (error) {
      console.error("Error fetching planning data:", error);
      toast.error("Failed to fetch planning data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
    toast.info("Checking planning portal...");
  };

  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const refusedCount = applications.filter(a => a.status === 'refused').length;

  if (isLoading && applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Checking planning portal...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Planning History
          </h3>
          <p className="text-sm text-muted-foreground">
            Local Authority: {localAuthority} Council
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Check Planning
        </Button>
      </div>

      {/* Summary Stats */}
      {applications.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
            <CardContent className="p-4 text-center">
              <Check className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
              <p className="text-xs text-green-600">Approved</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
              <p className="text-xs text-yellow-600">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
            <CardContent className="p-4 text-center">
              <X className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-700">{refusedCount}</p>
              <p className="text-xs text-red-600">Refused</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Planning Applications Found</h3>
            <p className="text-muted-foreground mb-4">
              No planning history recorded for this property
            </p>
            <Button onClick={() => fetchData(true)} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Check Planning Portal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">
            Recent Applications ({applications.length})
          </h4>
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onViewDetails={setSelectedApplication}
            />
          ))}
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Planning Application: {selectedApplication.application_reference}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedApplication.status} />
                  {selectedApplication.decision && (
                    <span className="text-sm font-medium">{selectedApplication.decision}</span>
                  )}
                </div>

                {/* Property */}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Property</h4>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedApplication.property_address}
                  </p>
                </div>

                {/* Proposal */}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Proposal</h4>
                  <p>{selectedApplication.proposal_description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {selectedApplication.development_type || selectedApplication.application_type}
                  </Badge>
                </div>

                {/* Key Dates */}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Dates</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Received:{" "}
                        {selectedApplication.received_date
                          ? format(new Date(selectedApplication.received_date), "dd MMM yyyy")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Validated:{" "}
                        {selectedApplication.validated_date
                          ? format(new Date(selectedApplication.validated_date), "dd MMM yyyy")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Decision:{" "}
                        {selectedApplication.decision_date
                          ? format(new Date(selectedApplication.decision_date), "dd MMM yyyy")
                          : "Pending"}
                      </span>
                    </div>
                    {selectedApplication.received_date && selectedApplication.decision_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Time:{" "}
                          {differenceInDays(
                            new Date(selectedApplication.decision_date),
                            new Date(selectedApplication.received_date)
                          )}{" "}
                          days
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decision Reason */}
                {selectedApplication.decision_reason && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Decision Reason</h4>
                    <p className="text-sm">{selectedApplication.decision_reason}</p>
                  </div>
                )}

                {/* Conditions */}
                {selectedApplication.conditions && selectedApplication.conditions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Conditions ({selectedApplication.conditions.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedApplication.conditions.map((condition, i) => (
                        <div key={i} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">
                            {condition.number}. {condition.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {condition.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Applicant & Agent */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedApplication.applicant_name && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Applicant</h4>
                      <p className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        {selectedApplication.applicant_name}
                      </p>
                    </div>
                  )}
                  {selectedApplication.agent_name && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Agent</h4>
                      <p className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4" />
                        {selectedApplication.agent_name}
                        {selectedApplication.agent_company && (
                          <span className="text-muted-foreground">
                            ({selectedApplication.agent_company})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Case Officer */}
                {selectedApplication.case_officer && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Case Officer</h4>
                    <p className="text-sm">{selectedApplication.case_officer}</p>
                  </div>
                )}

                {/* Documents */}
                {selectedApplication.documents && selectedApplication.documents.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Documents</h4>
                    <div className="space-y-2">
                      {selectedApplication.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Button variant="ghost" size="sm" disabled>
                            View PDF
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedApplication.portal_url && (
                    <Button asChild>
                      <a
                        href={selectedApplication.portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Council Portal
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" disabled>
                    Download All Documents
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

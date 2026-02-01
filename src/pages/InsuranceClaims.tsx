import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  Plus, 
  Phone, 
  Mail, 
  FileText, 
  Upload,
  Clock,
  CheckCircle2,
  Eye
} from "lucide-react";
import { useClaimsStore } from "@/stores/claimsStore";
import { CLAIM_TYPE_LABELS, CLAIM_STATUS_LABELS } from "@/types/claims";
import { format } from "date-fns";

const InsuranceClaims = () => {
  const { claims, getActiveClaims, getSettledClaims, getTotalClaimed, getTotalSettledYTD } = useClaimsStore();
  const activeClaims = getActiveClaims();
  const settledClaims = getSettledClaims();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'settled':
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">{CLAIM_STATUS_LABELS[status as keyof typeof CLAIM_STATUS_LABELS]}</Badge>;
      case 'assessing':
      case 'acknowledged':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">{CLAIM_STATUS_LABELS[status as keyof typeof CLAIM_STATUS_LABELS]}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{CLAIM_STATUS_LABELS[status as keyof typeof CLAIM_STATUS_LABELS]}</Badge>;
      case 'draft':
        return <Badge variant="outline">{CLAIM_STATUS_LABELS[status as keyof typeof CLAIM_STATUS_LABELS]}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout title="Insurance Claims">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Claims</p>
                  <p className="text-2xl font-bold">{activeClaims.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Claimed</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalClaimed())}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Settled YTD</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalSettledYTD())}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Claim Button */}
        <div className="flex justify-end">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Claim
          </Button>
        </div>

        {/* Active Claims */}
        {activeClaims.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Claims</CardTitle>
              <CardDescription>Claims currently being processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeClaims.map((claim) => (
                <Card key={claim.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{claim.property_address}</p>
                          <Badge variant="outline">{CLAIM_TYPE_LABELS[claim.claim_type]}</Badge>
                          {getStatusBadge(claim.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ref: {claim.claim_reference} • Submitted: {claim.submitted_date ? format(new Date(claim.submitted_date), 'd MMM yyyy') : 'Draft'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Claim Amount</p>
                        <p className="font-medium">{claim.claim_amount ? formatCurrency(claim.claim_amount) : '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Excess</p>
                        <p className="font-medium">{claim.excess_amount ? formatCurrency(claim.excess_amount) : '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Incident Date</p>
                        <p className="font-medium">{format(new Date(claim.incident_date), 'd MMM yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Handler</p>
                        <p className="font-medium">{claim.handler_name || '-'}</p>
                      </div>
                    </div>

                    {claim.incident_description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {claim.incident_description}
                      </p>
                    )}

                    {claim.notes && (
                      <div className="p-3 bg-blue-50 rounded-lg mb-4 text-sm">
                        <p className="font-medium text-blue-800">Last Update:</p>
                        <p className="text-blue-700">{claim.notes}</p>
                      </div>
                    )}

                    {/* Timeline Preview */}
                    {claim.timeline && claim.timeline.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-sm font-medium">Recent Activity:</p>
                        {claim.timeline.slice(0, 3).map((event) => (
                          <div key={event.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="text-xs">{format(new Date(event.event_date), 'd MMM')}</span>
                            <span>•</span>
                            <span>{event.event_description}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                      {claim.handler_phone && (
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Insurer
                        </Button>
                      )}
                      {claim.handler_email && (
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Handler
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Claim History */}
        <Card>
          <CardHeader>
            <CardTitle>Claim History</CardTitle>
            <CardDescription>Past claims and their outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            {settledClaims.length > 0 ? (
              <div className="space-y-2">
                {settledClaims.map((claim) => (
                  <div 
                    key={claim.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{claim.property_address}</p>
                        <p className="text-sm text-muted-foreground">
                          {CLAIM_TYPE_LABELS[claim.claim_type]} • 
                          Claimed: {claim.claim_amount ? formatCurrency(claim.claim_amount) : '-'} • 
                          Settled: {claim.settlement_amount ? formatCurrency(claim.settlement_amount) : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {claim.settlement_date ? format(new Date(claim.settlement_date), 'MMM yyyy') : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No claim history</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default InsuranceClaims;
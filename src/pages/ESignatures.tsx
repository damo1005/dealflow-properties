import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileSignature, 
  Plus, 
  Eye, 
  Send, 
  Clock, 
  CheckCircle2,
  XCircle,
  Bell
} from "lucide-react";
import { useSignaturesStore } from "@/stores/signaturesStore";
import { format } from "date-fns";

const ESignatures = () => {
  const { requests, getPendingRequests, getCompletedRequests, getCompletedThisMonth } = useSignaturesStore();
  const pendingRequests = getPendingRequests();
  const completedRequests = getCompletedRequests();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'signed':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Completed ✓</Badge>;
      case 'sent':
      case 'viewed':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Awaiting</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSignerStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'viewed':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSignerStatusText = (signer: any) => {
    switch (signer.status) {
      case 'signed':
        return `Signed ${signer.signed_at ? format(new Date(signer.signed_at), 'd MMM') : ''}`;
      case 'viewed':
        return `Viewed ${signer.viewed_at ? format(new Date(signer.viewed_at), 'd MMM') : ''}`;
      case 'sent':
        return 'Sent, not viewed';
      case 'declined':
        return 'Declined';
      default:
        return 'Pending';
    }
  };

  return (
    <AppLayout title="E-Signatures">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Awaiting</p>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
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
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedRequests.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{getCompletedThisMonth()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileSignature className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Request Button */}
        <div className="flex justify-end">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Signature Request
          </Button>
        </div>

        {/* Pending Signatures */}
        {pendingRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Signatures</CardTitle>
              <CardDescription>Documents awaiting signatures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileSignature className="h-4 w-4 text-muted-foreground" />
                          <p className="font-semibold">{request.document_name}</p>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Sent: {format(new Date(request.created_at), 'd MMM yyyy')}
                          {request.expires_at && (
                            <> • Expires: {format(new Date(request.expires_at), 'd MMM yyyy')}</>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Signers */}
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium">Signers:</p>
                      {request.signers?.map((signer) => (
                        <div key={signer.id} className="flex items-center gap-2 text-sm">
                          {getSignerStatusIcon(signer.status)}
                          <span>{signer.name}</span>
                          <span className="text-muted-foreground">({signer.role})</span>
                          <span className="text-muted-foreground">- {getSignerStatusText(signer)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Send Reminder
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Signatures */}
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Successfully signed documents</CardDescription>
          </CardHeader>
          <CardContent>
            {completedRequests.length > 0 ? (
              <div className="space-y-2">
                {completedRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{request.document_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Completed {format(new Date(request.created_at), 'd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileSignature className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed signatures yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ESignatures;
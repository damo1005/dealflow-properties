import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Plus,
  ArrowRight
} from "lucide-react";
import { useDepositsStore } from "@/stores/depositsStore";
import { DEPOSIT_SCHEMES } from "@/types/deposits";
import { format, differenceInDays } from "date-fns";

const DepositProtection = () => {
  const { deposits, getPendingDeposits, getProtectedDeposits, getUrgentDeposits, getTotalHeld } = useDepositsStore();
  const pendingDeposits = getPendingDeposits();
  const protectedDeposits = getProtectedDeposits();
  const urgentDeposits = getUrgentDeposits(14);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    return differenceInDays(new Date(deadline), new Date());
  };

  const getStatusBadge = (status: string, daysLeft?: number | null) => {
    switch (status) {
      case 'protected':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Protected ✓</Badge>;
      case 'pending':
        if (daysLeft !== null && daysLeft !== undefined && daysLeft <= 7) {
          return <Badge variant="destructive">Pending - {daysLeft} days left!</Badge>;
        }
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'returned':
        return <Badge variant="outline">Returned</Badge>;
      case 'disputed':
        return <Badge variant="destructive">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSchemeName = (schemeId: string) => {
    return DEPOSIT_SCHEMES.find(s => s.id === schemeId)?.name || schemeId.toUpperCase();
  };

  return (
    <AppLayout title="Deposit Protection">
      <div className="space-y-6">
        {/* Urgent Alerts */}
        {urgentDeposits.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>ACTION REQUIRED:</strong> You have {urgentDeposits.length} deposit(s) that need protection urgently.
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Protected</p>
                  <p className="text-2xl font-bold">{protectedDeposits.length}</p>
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
                  <p className="text-sm text-muted-foreground">Total Held</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalHeld())}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Action Needed</p>
                  <p className="text-2xl font-bold">{pendingDeposits.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Deposits */}
        {pendingDeposits.length > 0 && (
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Deposits Requiring Protection
              </CardTitle>
              <CardDescription>
                Deposits must be protected within 30 days of receipt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingDeposits.map((deposit) => {
                const daysLeft = getDaysUntilDeadline(deposit.protection_deadline);
                const isUrgent = daysLeft !== null && daysLeft <= 7;
                
                return (
                  <div 
                    key={deposit.id} 
                    className={`p-4 rounded-lg border ${isUrgent ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{deposit.property_address}</p>
                        <p className="text-sm text-muted-foreground">
                          Tenant: {deposit.tenant_name}
                        </p>
                        <p className="text-sm">
                          Amount: <span className="font-medium">{formatCurrency(deposit.amount)}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Received: {format(new Date(deposit.received_date), 'd MMM yyyy')}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={isUrgent ? 'destructive' : 'outline'}>
                          {daysLeft !== null ? `${daysLeft} days left` : 'Deadline unknown'}
                        </Badge>
                        <div>
                          <Button size="sm">
                            Protect Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* All Deposits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Deposits</CardTitle>
              <CardDescription>Track and manage tenant deposits</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Deposit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deposits.map((deposit) => {
                const daysLeft = deposit.status === 'pending' ? getDaysUntilDeadline(deposit.protection_deadline) : null;
                
                return (
                  <Card key={deposit.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{deposit.property_address}</p>
                            {getStatusBadge(deposit.status, daysLeft)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {deposit.tenant_name} • {formatCurrency(deposit.amount)}
                          </p>
                          {deposit.status === 'protected' && (
                            <p className="text-sm text-muted-foreground">
                              {getSchemeName(deposit.scheme)} • Ref: {deposit.scheme_reference}
                            </p>
                          )}
                          {deposit.status === 'protected' && (
                            <div className="flex items-center gap-4 text-sm pt-1">
                              <span className="flex items-center gap-1">
                                {deposit.certificate_url ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Clock className="h-3 w-3 text-yellow-500" />
                                )}
                                Certificate
                              </span>
                              <span className="flex items-center gap-1">
                                {deposit.prescribed_info_served ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Clock className="h-3 w-3 text-yellow-500" />
                                )}
                                Prescribed Info
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {deposit.status === 'protected' && deposit.certificate_url && (
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Certificate
                            </Button>
                          )}
                          {deposit.status === 'protected' && (
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Start Return
                            </Button>
                          )}
                          {deposit.status === 'pending' && (
                            <Button size="sm">
                              <Shield className="h-4 w-4 mr-2" />
                              Protect
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Scheme Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Approved Deposit Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEPOSIT_SCHEMES.map((scheme) => (
                <a
                  key={scheme.id}
                  href={scheme.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{scheme.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{scheme.type} scheme</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DepositProtection;
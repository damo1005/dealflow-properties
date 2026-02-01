import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Link2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Calculator,
  Eye,
  Send
} from "lucide-react";
import { useMTDStore } from "@/stores/mtdStore";
import { format } from "date-fns";

const MTDCompliance = () => {
  const { obligations, settings, getDaysUntilDue, calculateQuarterlyTotals, getUpcomingObligation } = useMTDStore();
  const upcomingObligation = getUpcomingObligation();
  const quarterlyTotals = upcomingObligation ? calculateQuarterlyTotals(upcomingObligation.id) : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: string, daysUntil?: number) => {
    switch (status) {
      case 'submitted':
      case 'accepted':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">✓ Submitted</Badge>;
      case 'pending':
        if (daysUntil !== undefined && daysUntil <= 7) {
          return <Badge variant="destructive">Due in {daysUntil} days</Badge>;
        }
        if (daysUntil !== undefined && daysUntil <= 30) {
          return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Due in {daysUntil} days</Badge>;
        }
        return <Badge variant="outline">Upcoming</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout title="Making Tax Digital">
      <div className="space-y-6">
        {/* Status Banner */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>MTD for Income Tax starts April 2026</strong> for landlords with £50k+ income.
            {settings?.hmrc_connected ? (
              <span className="ml-2 text-green-600">✓ Your records are digital and compliant</span>
            ) : (
              <span className="ml-2 text-yellow-600">Connect to HMRC to submit directly</span>
            )}
          </AlertDescription>
        </Alert>

        {/* HMRC Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              HMRC Connection
            </CardTitle>
            <CardDescription>
              Connect your HMRC account to submit quarterly updates directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            {settings?.hmrc_connected ? (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-green-700">Connected</p>
                  <p className="text-sm text-muted-foreground">Business: {settings.business_name}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <span>Not connected</span>
                </div>
                <Button>
                  Connect to HMRC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quarterly Obligations */}
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Obligations (2025-26)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quarter</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obligations.map((obligation) => {
                  const daysUntil = getDaysUntilDue(obligation);
                  return (
                    <TableRow key={obligation.id}>
                      <TableCell className="font-medium">Q{obligation.quarter}</TableCell>
                      <TableCell>
                        {format(new Date(obligation.period_start), 'd MMM')} - {format(new Date(obligation.period_end), 'd MMM yyyy')}
                      </TableCell>
                      <TableCell>{format(new Date(obligation.due_date), 'd MMM yyyy')}</TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(obligation.status, obligation.status === 'pending' ? daysUntil : undefined)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell className="font-medium">Final</TableCell>
                  <TableCell>Full Year Declaration</TableCell>
                  <TableCell>31 Jan 2027</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">Upcoming</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Q3 Submission Preview */}
        {upcomingObligation && quarterlyTotals && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Q{upcomingObligation.quarter} Summary</CardTitle>
                  <CardDescription>
                    {format(new Date(upcomingObligation.period_start), 'd MMM yyyy')} - {format(new Date(upcomingObligation.period_end), 'd MMM yyyy')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Review & Submit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">INCOME</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rental Income</span>
                      <span>{formatCurrency(10200)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Other Income</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-medium">
                      <span>Total Income</span>
                      <span className="text-green-600">{formatCurrency(quarterlyTotals.income)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700">EXPENSES</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mortgage Interest</span>
                      <span>{formatCurrency(1890)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insurance</span>
                      <span>{formatCurrency(285)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repairs & Maintenance</span>
                      <span>{formatCurrency(450)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent Fees</span>
                      <span>{formatCurrency(1020)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Other Expenses</span>
                      <span>{formatCurrency(125)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-medium">
                      <span>Total Expenses</span>
                      <span className="text-red-600">{formatCurrency(quarterlyTotals.expenses)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">NET PROFIT</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(quarterlyTotals.profit)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  View Detailed Breakdown
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Submit to HMRC
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audit Trail Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audit Trail & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Transactions timestamped</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Edit history maintained</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Digital links preserved</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Export for accountant</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MTDCompliance;
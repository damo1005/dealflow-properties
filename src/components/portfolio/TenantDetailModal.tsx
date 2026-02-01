import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Mail,
  Phone,
  Building2,
  Calendar,
  Shield,
  PoundSterling,
  MessageSquare,
  FileText,
  Clock,
  Edit,
  UserX,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { Tenancy, RentPayment, PortfolioProperty } from "@/types/portfolio";

interface TenantDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenancy: Tenancy | null;
  property?: PortfolioProperty;
  payments?: RentPayment[];
  onRecordPayment: () => void;
  onLogCommunication: () => void;
  onEndTenancy: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function TenantDetailModal({
  open,
  onOpenChange,
  tenancy,
  property,
  payments = [],
  onRecordPayment,
  onLogCommunication,
  onEndTenancy,
}: TenantDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!tenancy) return null;

  const daysUntilEnd = tenancy.end_date
    ? differenceInDays(new Date(tenancy.end_date), new Date())
    : null;

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.actual_amount || 0), 0);

  const outstanding = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((sum, p) => sum + p.expected_amount, 0);

  const avgDaysLate =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + p.days_late, 0) / payments.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">{tenancy.tenant_name}</DialogTitle>
                {property && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Building2 className="h-4 w-4" />
                    {property.address}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tenancy.status === "active" ? (
                <Badge className="bg-green-500/10 text-green-600">Active</Badge>
              ) : (
                <Badge variant="secondary">Ended</Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="comms">Comms</TabsTrigger>
            <TabsTrigger value="documents">Docs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Contact Details */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Contact Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${tenancy.tenant_email}`} className="text-primary hover:underline">
                        {tenancy.tenant_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${tenancy.tenant_phone}`} className="text-primary hover:underline">
                        {tenancy.tenant_phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tenancy Details */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Tenancy Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start</p>
                      <p className="font-medium">{format(new Date(tenancy.start_date), "dd MMM yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End</p>
                      <p className="font-medium">
                        {tenancy.end_date ? format(new Date(tenancy.end_date), "dd MMM yyyy") : "Rolling"}
                      </p>
                    </div>
                    {daysUntilEnd !== null && daysUntilEnd > 0 && (
                      <div className="col-span-2">
                        <Badge variant="outline">{daysUntilEnd} days remaining</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Rent Details */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <PoundSterling className="h-4 w-4 text-primary" />
                    Rent Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Monthly Rent</p>
                      <p className="font-medium text-lg">{formatCurrency(tenancy.monthly_rent)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deposit</p>
                      <p className="font-medium">{formatCurrency(tenancy.deposit_amount)}</p>
                    </div>
                    {tenancy.deposit_scheme && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Scheme</p>
                        <p className="font-medium">{tenancy.deposit_scheme}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Emergency Contact
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Contact information not yet added
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              <Button variant="destructive" className="flex-1" onClick={onEndTenancy}>
                <UserX className="h-4 w-4 mr-2" />
                End Tenancy
              </Button>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4 mt-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(outstanding)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Avg Days Late</p>
                  <p className="text-2xl font-bold">{avgDaysLate.toFixed(1)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Payment History</h4>
                  <Button size="sm" onClick={onRecordPayment}>
                    <PoundSterling className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </div>
                
                {payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No payments recorded yet
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Due Date</th>
                          <th className="text-right py-2">Amount</th>
                          <th className="text-center py-2">Status</th>
                          <th className="text-left py-2">Paid Date</th>
                          <th className="text-right py-2">Late Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="py-2">{format(new Date(payment.expected_date), "dd MMM yyyy")}</td>
                            <td className="py-2 text-right">{formatCurrency(payment.expected_amount)}</td>
                            <td className="py-2 text-center">
                              {payment.status === "paid" ? (
                                <Badge className="bg-green-500/10 text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Paid
                                </Badge>
                              ) : payment.status === "overdue" ? (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Overdue
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </td>
                            <td className="py-2">
                              {payment.actual_date
                                ? format(new Date(payment.actual_date), "dd MMM yyyy")
                                : "-"}
                            </td>
                            <td className="py-2 text-right">
                              {payment.days_late > 0 ? (
                                <span className="text-red-600">{payment.days_late}</span>
                              ) : (
                                "0"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="comms" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Communication Log</h4>
              <Button size="sm" onClick={onLogCommunication}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Log Communication
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No communications logged yet</p>
                <Button variant="link" onClick={onLogCommunication}>
                  Log your first communication
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Documents</h4>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
                <Button variant="link">Upload your first document</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Timeline</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Tenancy Started</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(tenancy.start_date), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Record Created</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(tenancy.created_at), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

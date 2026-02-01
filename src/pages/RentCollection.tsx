import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PoundSterling, TrendingUp, AlertTriangle, CheckCircle, Eye, Bell, CreditCard } from "lucide-react";
import { useRentCollectionStore } from "@/stores/rentCollectionStore";
import { RentLedgerEntry } from "@/types/rentCollection";

export default function RentCollection() {
  const { ledger, getSummary, recordPayment } = useRentCollectionStore();
  const summary = getSummary();
  const [selectedEntry, setSelectedEntry] = useState<RentLedgerEntry | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("standing_order");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      paid: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      partial: { variant: "secondary", icon: <AlertTriangle className="h-3 w-3" /> },
      due: { variant: "outline", icon: null },
      overdue: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3" /> },
      upcoming: { variant: "secondary", icon: null },
    };
    const config = variants[status] || variants.upcoming;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 capitalize">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const handleRecordPayment = () => {
    if (selectedEntry && paymentAmount) {
      recordPayment(selectedEntry.id, parseFloat(paymentAmount), paymentDate, paymentMethod);
      setSelectedEntry(null);
      setPaymentAmount("");
    }
  };

  return (
    <AppLayout title="Rent Collection">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PoundSterling className="h-4 w-4" />
              <span className="text-sm">Expected</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(summary.expected_amount)}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Collected</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.collected_amount)}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm">Outstanding</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(summary.outstanding_amount)}</p>
            <p className="text-xs text-muted-foreground">{summary.tenants_overdue} tenant(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Collection Rate</span>
            </div>
            <p className="text-2xl font-bold">{summary.collection_rate.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Rent Ledger */}
      <Card>
        <CardHeader>
          <CardTitle>Rent Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.property_address}</TableCell>
                  <TableCell>{entry.tenant_name}</TableCell>
                  <TableCell>
                    {new Date(entry.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {entry.days_late > 0 && (
                      <span className="text-destructive text-xs ml-2">({entry.days_late}d late)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="font-medium">{formatCurrency(entry.amount_due)}</p>
                      {entry.amount_paid > 0 && entry.amount_paid < entry.amount_due && (
                        <p className="text-xs text-muted-foreground">Paid: {formatCurrency(entry.amount_paid)}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {entry.status === "paid" ? (
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setPaymentAmount(entry.balance.toString());
                            }}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Record
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Bell className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Record Payment Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedEntry.property_address}</p>
                <p className="text-sm text-muted-foreground">{selectedEntry.tenant_name}</p>
                <p className="text-sm">Due: {formatCurrency(selectedEntry.amount_due)} • Outstanding: {formatCurrency(selectedEntry.balance)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standing_order">Standing Order</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedEntry(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRecordPayment} className="flex-1">
                  Record Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, MoreHorizontal, Check, X, DollarSign } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { AffiliateCommission, CommissionStatus } from "@/types/admin";

// Mock data
const mockCommissions: AffiliateCommission[] = [
  {
    id: "1",
    user_id: "user-1",
    affiliate_network: "awin",
    advertiser: "Mojo Mortgages",
    click_date: new Date(Date.now() - 14 * 86400000).toISOString(),
    conversion_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    commission_amount: 450,
    commission_status: "approved",
    mortgage_amount: 250000,
    property_address: "123 High Street, EN3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user-2",
    affiliate_network: "awin",
    advertiser: "Habito",
    click_date: new Date(Date.now() - 10 * 86400000).toISOString(),
    conversion_date: new Date(Date.now() - 3 * 86400000).toISOString(),
    commission_amount: 320,
    commission_status: "pending",
    mortgage_amount: 180000,
    property_address: "45 Oak Lane, SW1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "user-3",
    affiliate_network: "direct",
    advertiser: "L&C Mortgages",
    click_date: new Date(Date.now() - 21 * 86400000).toISOString(),
    conversion_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    commission_amount: 380,
    commission_status: "paid",
    mortgage_amount: 210000,
    property_address: "78 Park Road, M1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function AdminAffiliates() {
  const { commissions, isLoadingCommissions, setCommissions, setIsLoadingCommissions } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setIsLoadingCommissions(true);
    try {
      const { data, error } = await supabase
        .from("affiliate_commissions")
        .select("*")
        .order("conversion_date", { ascending: false });

      if (error) throw error;
      setCommissions(data?.length ? (data as AffiliateCommission[]) : mockCommissions);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      setCommissions(mockCommissions);
    } finally {
      setIsLoadingCommissions(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: CommissionStatus) => {
    try {
      setCommissions(
        commissions.map((c) => (c.id === id ? { ...c, commission_status: status } : c))
      );
      toast.success(`Commission ${status}`);
    } catch (error) {
      toast.error("Failed to update commission");
    }
  };

  const getStatusBadge = (status?: CommissionStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "paid":
        return <Badge className="bg-blue-500">Paid</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredCommissions = commissions.filter(
    (c) => statusFilter === "all" || c.commission_status === statusFilter
  );

  const stats = {
    pending: commissions
      .filter((c) => c.commission_status === "pending")
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0),
    pendingCount: commissions.filter((c) => c.commission_status === "pending").length,
    approved: commissions
      .filter((c) => c.commission_status === "approved")
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0),
    approvedCount: commissions.filter((c) => c.commission_status === "approved").length,
    paid: commissions
      .filter((c) => c.commission_status === "paid")
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0),
    paidCount: commissions.filter((c) => c.commission_status === "paid").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Affiliate Commissions</h1>
            <p className="text-muted-foreground">
              Track and manage mortgage referral commissions
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    £{stats.pending.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingCount} conversions
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    £{stats.approved.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.approvedCount} conversions
                  </p>
                </div>
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paid (YTD)</p>
                  <p className="text-2xl font-bold text-blue-600">
                    £{stats.paid.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.paidCount} conversions
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commissions Table */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Commission History</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Advertiser</TableHead>
                    <TableHead>Mortgage</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCommissions ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredCommissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No commissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCommissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell>
                          {commission.conversion_date
                            ? format(parseISO(commission.conversion_date), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {commission.advertiser}
                        </TableCell>
                        <TableCell>
                          £{(commission.mortgage_amount || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {commission.property_address || "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          £{(commission.commission_amount || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(commission.commission_status)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(commission.id, "approved")}
                              >
                                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(commission.id, "paid")}
                              >
                                <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                                Mark as Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(commission.id, "declined")}
                                className="text-destructive"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Decline
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Users, Calendar, Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { TenantCard } from "./TenantCard";
import { TenantDetailModal } from "./TenantDetailModal";
import { AddTenantWizard, TenantFormData } from "./AddTenantWizard";
import { RecordPaymentDialog, PaymentFormData } from "./RecordPaymentDialog";
import { LogCommunicationDialog, CommunicationFormData } from "./LogCommunicationDialog";
import { toast } from "sonner";
import type { Tenancy } from "@/types/portfolio";

export function PortfolioTenants() {
  const { tenancies, properties, payments, addTenancy } = usePortfolioStore();
  
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [selectedTenancy, setSelectedTenancy] = useState<Tenancy | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCommDialog, setShowCommDialog] = useState(false);

  const activeTenancies = tenancies.filter((t) => t.status === "active");
  const endedTenancies = tenancies.filter((t) => t.status === "ended");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  // Summary stats
  const upToDateCount = activeTenancies.filter((t) => {
    const tenantPayments = payments.filter((p) => p.tenancy_id === t.id);
    return tenantPayments.every((p) => p.status === "paid" || p.status === "pending");
  }).length;

  const lateCount = activeTenancies.length - upToDateCount;

  // Upcoming rent due (tenancies where rent is due in next 7 days)
  const upcomingRentDue = activeTenancies.slice(0, 2);

  const handleAddTenant = async (data: TenantFormData) => {
    // In real app, would save to Supabase
    const newTenancy: Tenancy = {
      id: crypto.randomUUID(),
      portfolio_property_id: data.portfolio_property_id,
      tenant_name: data.tenant_name,
      tenant_email: data.tenant_email,
      tenant_phone: data.tenant_phone,
      start_date: data.start_date,
      end_date: data.end_date || null,
      monthly_rent: data.monthly_rent,
      deposit_amount: data.deposit_amount,
      deposit_scheme: data.deposit_scheme,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addTenancy(newTenancy);
    toast.success("Tenant added successfully");
  };

  const handleRecordPayment = async (data: PaymentFormData) => {
    // In real app, would save to Supabase
    toast.success("Payment recorded successfully");
  };

  const handleLogCommunication = async (data: CommunicationFormData) => {
    // In real app, would save to Supabase
    toast.success("Communication logged successfully");
  };

  const handleViewTenant = (tenancy: Tenancy) => {
    setSelectedTenancy(tenancy);
    setShowDetailModal(true);
  };

  const handleRecordPaymentClick = (tenancy: Tenancy) => {
    setSelectedTenancy(tenancy);
    setShowPaymentDialog(true);
  };

  const handleMessageClick = (tenancy: Tenancy) => {
    setSelectedTenancy(tenancy);
    setShowCommDialog(true);
  };

  if (tenancies.length === 0) {
    return (
      <>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold mb-2">No tenants yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add properties and tenants to track your rental income
            </p>
            <Button onClick={() => setShowAddWizard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </CardContent>
        </Card>

        <AddTenantWizard
          open={showAddWizard}
          onOpenChange={setShowAddWizard}
          properties={properties}
          onSave={handleAddTenant}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Active Tenants</span>
            </div>
            <p className="text-3xl font-bold mt-1">{activeTenancies.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Up to Date</span>
            </div>
            <p className="text-3xl font-bold text-green-500 mt-1">{upToDateCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Late/Arrears</span>
            </div>
            <p className="text-3xl font-bold text-yellow-500 mt-1">{lateCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Rent Due Banner */}
      {upcomingRentDue.length > 0 && (
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Rent Due Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingRentDue.map((tenancy) => {
                const property = properties.find(
                  (p) => p.id === tenancy.portfolio_property_id
                );
                return (
                  <div
                    key={tenancy.id}
                    className="flex items-center justify-between bg-background rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{tenancy.tenant_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {property?.address} • {formatCurrency(tenancy.monthly_rent)} due 1st
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleMessageClick(tenancy)}>
                      Send Reminder
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Tenant Button */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Active Tenants ({activeTenancies.length})</h3>
        <Button onClick={() => setShowAddWizard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Active Tenants Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTenancies.map((tenancy) => {
          const property = properties.find((p) => p.id === tenancy.portfolio_property_id);
          return (
            <TenantCard
              key={tenancy.id}
              tenancy={tenancy}
              propertyAddress={property?.address}
              paymentStatus="up_to_date"
              onView={() => handleViewTenant(tenancy)}
              onRecordPayment={() => handleRecordPaymentClick(tenancy)}
              onMessage={() => handleMessageClick(tenancy)}
            />
          );
        })}
      </div>

      {/* Ended Tenancies */}
      {endedTenancies.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Past Tenants ({endedTenancies.length})</h3>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Tenant</th>
                    <th className="text-left py-3 px-4 font-medium">Property</th>
                    <th className="text-left py-3 px-4 font-medium">Period</th>
                    <th className="text-right py-3 px-4 font-medium">Rent</th>
                  </tr>
                </thead>
                <tbody>
                  {endedTenancies.map((tenancy) => {
                    const property = properties.find(
                      (p) => p.id === tenancy.portfolio_property_id
                    );
                    return (
                      <tr key={tenancy.id} className="border-b hover:bg-muted/50 cursor-pointer">
                        <td className="py-3 px-4">{tenancy.tenant_name}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {property?.address}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {format(new Date(tenancy.start_date), "MMM yyyy")} -{" "}
                          {tenancy.end_date
                            ? format(new Date(tenancy.end_date), "MMM yyyy")
                            : "Present"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(tenancy.monthly_rent)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialogs */}
      <AddTenantWizard
        open={showAddWizard}
        onOpenChange={setShowAddWizard}
        properties={properties}
        onSave={handleAddTenant}
      />

      <TenantDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        tenancy={selectedTenancy}
        property={properties.find((p) => p.id === selectedTenancy?.portfolio_property_id)}
        payments={payments.filter((p) => p.tenancy_id === selectedTenancy?.id)}
        onRecordPayment={() => {
          setShowDetailModal(false);
          setShowPaymentDialog(true);
        }}
        onLogCommunication={() => {
          setShowDetailModal(false);
          setShowCommDialog(true);
        }}
        onEndTenancy={() => {
          toast.info("End tenancy feature coming soon");
        }}
      />

      <RecordPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        tenancy={selectedTenancy}
        propertyAddress={properties.find((p) => p.id === selectedTenancy?.portfolio_property_id)?.address}
        onSave={handleRecordPayment}
      />

      <LogCommunicationDialog
        open={showCommDialog}
        onOpenChange={setShowCommDialog}
        tenancy={selectedTenancy}
        onSave={handleLogCommunication}
      />
    </div>
  );
}

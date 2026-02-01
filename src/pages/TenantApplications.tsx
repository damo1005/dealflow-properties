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
import { Switch } from "@/components/ui/switch";
import { Plus, Users, Clock, CheckCircle, Eye, Mail, CreditCard } from "lucide-react";
import { useTenantScreeningStore } from "@/stores/tenantScreeningStore";
import { TenantApplication } from "@/types/tenantScreening";

export default function TenantApplications() {
  const { applications, getSummary, addApplication, updateApplication } = useTenantScreeningStore();
  const summary = getSummary();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState<TenantApplication | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      received: { variant: "secondary", label: "Received" },
      screening: { variant: "default", label: "Screening" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
      withdrawn: { variant: "outline", label: "Withdrawn" },
    };
    const config = variants[status] || variants.received;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAffordabilityRatio = (app: TenantApplication) => {
    if (!app.annual_income || !app.proposed_rent) return null;
    return ((app.proposed_rent * 12) / app.annual_income * 100).toFixed(0);
  };

  return (
    <AppLayout
      title="Tenant Applications"
      actions={
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Active Applications</span>
            </div>
            <p className="text-2xl font-bold">{summary.active_applications}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Awaiting References</span>
            </div>
            <p className="text-2xl font-bold">{summary.awaiting_references}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Ready for Decision</span>
            </div>
            <p className="text-2xl font-bold">{summary.ready_for_decision}</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => {
          const ratio = getAffordabilityRatio(app);
          const refsReceived = app.references?.filter((r) => r.status === "received" || r.status === "verified").length || 0;
          const totalRefs = app.references?.length || 0;

          return (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold">{app.applicant_name}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For: {app.property_address} • Applied: {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Move Date</p>
                    <p className="font-medium">
                      {app.desired_move_date ? new Date(app.desired_move_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rent</p>
                    <p className="font-medium">{app.proposed_rent ? formatCurrency(app.proposed_rent) : '-'}/month</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tenancy</p>
                    <p className="font-medium">{app.tenancy_length_months || 12} months</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Income</p>
                    <p className="font-medium">{app.annual_income ? formatCurrency(app.annual_income) : '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-4 text-sm">
                  {ratio && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rent/Income:</span>
                      <Badge variant={parseInt(ratio) <= 30 ? "default" : "destructive"}>
                        {ratio}% {parseInt(ratio) <= 30 ? "✓" : "!"}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">References:</span>
                    <span className="font-medium">{refsReceived}/{totalRefs} received</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Credit:</span>
                    <span className="font-medium">{app.credit_check ? app.credit_check.recommendation : "Pending"}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {!app.credit_check && (
                    <Button size="sm" variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Request Credit Check
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reference Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {applications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-4">Add your first tenant application to start screening.</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Application
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Application Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Tenant Application</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addApplication({
                id: crypto.randomUUID(),
                user_id: "current-user",
                applicant_name: formData.get("name") as string,
                applicant_email: formData.get("email") as string,
                applicant_phone: formData.get("phone") as string,
                proposed_rent: parseFloat(formData.get("rent") as string),
                annual_income: parseFloat(formData.get("income") as string),
                employment_status: formData.get("employment") as TenantApplication["employment_status"],
                has_pets: false,
                status: "received",
                references: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
              setShowAddDialog(false);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rent">Proposed Rent</Label>
                <Input id="rent" name="rent" type="number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Input id="income" name="income" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Employment</Label>
                <Select name="employment" defaultValue="employed">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self_employed">Self-Employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Application</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

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
import { Plus, Users, Building2, PoundSterling, Eye, FileText, Settings, Mail } from "lucide-react";
import { useWhiteLabelStore } from "@/stores/whiteLabelStore";
import { AgentClient } from "@/types/whiteLabel";

export default function AgentClients() {
  const { clients, getSummary, addClient, config } = useWhiteLabelStore();
  const summary = getSummary();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      paused: "secondary",
      terminated: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"} className="capitalize">{status}</Badge>;
  };

  return (
    <AppLayout
      title={config?.company_name || "Agency Dashboard"}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/agent/settings">
              <Settings className="h-4 w-4 mr-2" />
              Agency Settings
            </a>
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Active Clients</span>
            </div>
            <p className="text-2xl font-bold">{summary.active_clients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Properties Managed</span>
            </div>
            <p className="text-2xl font-bold">{summary.properties_managed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PoundSterling className="h-4 w-4" />
              <span className="text-sm">Monthly Fees</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(summary.monthly_fees)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Landlord Clients</h2>
        {clients.map((client) => {
          const monthlyFee = client.management_fee_percent 
            ? (900 * client.property_count * client.management_fee_percent) / 100 
            : 0;

          return (
            <Card key={client.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold">{client.client_name}</h3>
                      {getStatusBadge(client.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {client.client_email} {client.client_phone && `• ${client.client_phone}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Properties</p>
                    <p className="font-medium">{client.property_count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fee</p>
                    <p className="font-medium">{client.management_fee_percent}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly</p>
                    <p className="font-medium">{formatCurrency(monthlyFee)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Since</p>
                    <p className="font-medium">
                      {client.contract_start_date 
                        ? new Date(client.contract_start_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                        : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Portfolio
                  </Button>
                  <Button size="sm" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Manage Properties
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Send Report
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {clients.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No clients yet</h3>
              <p className="text-muted-foreground mb-4">Add your first landlord client to get started.</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Landlord Client</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addClient({
                id: crypto.randomUUID(),
                agent_id: "current-user",
                client_name: formData.get("name") as string,
                client_email: formData.get("email") as string,
                client_phone: formData.get("phone") as string,
                management_fee_percent: parseFloat(formData.get("fee") as string),
                fee_type: "percentage",
                access_level: "view_only",
                property_count: 0,
                status: "active",
                contract_start_date: new Date().toISOString().split("T")[0],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
              setShowAddDialog(false);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Client Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee">Management Fee (%)</Label>
              <Input id="fee" name="fee" type="number" step="0.5" defaultValue="10" />
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                An email invite will be sent to the client to access their portal.
              </span>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Add Client</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

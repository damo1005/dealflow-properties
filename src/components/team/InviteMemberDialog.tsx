import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Loader2, Send } from "lucide-react";
import { TeamRole, ROLE_PERMISSIONS } from "@/types/team";
import { useToast } from "@/hooks/use-toast";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties?: { id: string; address: string }[];
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  properties = [],
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("viewer");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [permissions, setPermissions] = useState({
    viewFinancials: true,
    viewTenants: true,
    canEdit: false,
  });
  const [ownershipPercent, setOwnershipPercent] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const roles: TeamRole[] = ["admin", "editor", "viewer", "accountant", "partner"];

  const handleSubmit = async () => {
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail("");
    setRole("viewer");
    setSelectedProperties([]);
    setPermissions({ viewFinancials: true, viewTenants: true, canEdit: false });
    setOwnershipPercent("");
    setInvestmentAmount("");
  };

  const toggleProperty = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to collaborate on your portfolio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="partner@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Role</Label>
            <RadioGroup
              value={role}
              onValueChange={(v) => setRole(v as TeamRole)}
              className="space-y-2"
            >
              {roles.map((r) => (
                <div key={r} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={r} id={r} className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor={r} className="font-medium cursor-pointer">
                      {ROLE_PERMISSIONS[r].label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {ROLE_PERMISSIONS[r].description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {role === "partner" && properties.length > 0 && (
            <>
              <div className="space-y-3">
                <Label>Select Properties</Label>
                <div className="space-y-2">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border"
                    >
                      <Checkbox
                        id={property.id}
                        checked={selectedProperties.includes(property.id)}
                        onCheckedChange={() => toggleProperty(property.id)}
                      />
                      <Label htmlFor={property.id} className="flex-1 cursor-pointer">
                        {property.address}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ownership %</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={ownershipPercent}
                    onChange={(e) => setOwnershipPercent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Investment Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      £
                    </span>
                    <Input
                      className="pl-7"
                      type="number"
                      placeholder="75,000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="view-financials" className="font-normal">
                  View financials
                </Label>
                <Switch
                  id="view-financials"
                  checked={permissions.viewFinancials}
                  onCheckedChange={(checked) =>
                    setPermissions((p) => ({ ...p, viewFinancials: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="view-tenants" className="font-normal">
                  View tenants
                </Label>
                <Switch
                  id="view-tenants"
                  checked={permissions.viewTenants}
                  onCheckedChange={(checked) =>
                    setPermissions((p) => ({ ...p, viewTenants: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="can-edit" className="font-normal">
                  Can edit
                </Label>
                <Switch
                  id="can-edit"
                  checked={permissions.canEdit}
                  onCheckedChange={(checked) =>
                    setPermissions((p) => ({ ...p, canEdit: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!email || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

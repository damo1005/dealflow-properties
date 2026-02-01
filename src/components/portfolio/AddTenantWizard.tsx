import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Users, Home, Shield, UserCheck, Loader2 } from "lucide-react";
import type { PortfolioProperty } from "@/types/portfolio";

interface AddTenantWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: PortfolioProperty[];
  onSave: (data: TenantFormData) => Promise<void>;
}

export interface TenantFormData {
  // Step 1: Tenant Details
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  // Step 2: Tenancy Details
  portfolio_property_id: string;
  tenancy_type: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  rent_frequency: string;
  rent_due_day: number;
  // Step 3: Deposit
  deposit_amount: number;
  deposit_scheme: string;
  deposit_reference: string;
  // Step 4: Guarantor
  guarantor_name: string;
  guarantor_phone: string;
  guarantor_email: string;
}

const DEPOSIT_SCHEMES = [
  { value: "DPS", label: "Deposit Protection Service (DPS)" },
  { value: "MyDeposits", label: "MyDeposits" },
  { value: "TDS", label: "Tenancy Deposit Scheme (TDS)" },
  { value: "other", label: "Other" },
];

const STEPS = [
  { id: 1, title: "Tenant Details", icon: Users },
  { id: 2, title: "Tenancy Details", icon: Home },
  { id: 3, title: "Deposit", icon: Shield },
  { id: 4, title: "Guarantor", icon: UserCheck },
];

export function AddTenantWizard({ open, onOpenChange, properties, onSave }: AddTenantWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TenantFormData>({
    tenant_name: "",
    tenant_email: "",
    tenant_phone: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    portfolio_property_id: "",
    tenancy_type: "AST",
    start_date: "",
    end_date: "",
    monthly_rent: 0,
    rent_frequency: "monthly",
    rent_due_day: 1,
    deposit_amount: 0,
    deposit_scheme: "",
    deposit_reference: "",
    guarantor_name: "",
    guarantor_phone: "",
    guarantor_email: "",
  });

  const progressValue = (step / STEPS.length) * 100;

  const updateField = <K extends keyof TenantFormData>(field: K, value: TenantFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.tenant_name && formData.tenant_email && formData.tenant_phone;
      case 2:
        return formData.portfolio_property_id && formData.start_date && formData.monthly_rent > 0;
      case 3:
        return true; // Deposit is optional
      case 4:
        return true; // Guarantor is optional
      default:
        return true;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
      setStep(1);
      setFormData({
        tenant_name: "",
        tenant_email: "",
        tenant_phone: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        portfolio_property_id: "",
        tenancy_type: "AST",
        start_date: "",
        end_date: "",
        monthly_rent: 0,
        rent_frequency: "monthly",
        rent_due_day: 1,
        deposit_amount: 0,
        deposit_scheme: "",
        deposit_reference: "",
        guarantor_name: "",
        guarantor_phone: "",
        guarantor_email: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = STEPS[step - 1].icon;
              return <StepIcon className="h-5 w-5 text-primary" />;
            })()}
            {STEPS[step - 1].title}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of {STEPS.length}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="space-y-4 py-4">
          {/* Step 1: Tenant Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant_name">Full Name *</Label>
                <Input
                  id="tenant_name"
                  value={formData.tenant_name}
                  onChange={(e) => updateField("tenant_name", e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant_email">Email *</Label>
                <Input
                  id="tenant_email"
                  type="email"
                  value={formData.tenant_email}
                  onChange={(e) => updateField("tenant_email", e.target.value)}
                  placeholder="john.smith@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant_phone">Phone *</Label>
                <Input
                  id="tenant_phone"
                  value={formData.tenant_phone}
                  onChange={(e) => updateField("tenant_phone", e.target.value)}
                  placeholder="+44 7700 900123"
                />
              </div>
              <div className="pt-4 border-t space-y-4">
                <p className="text-sm font-medium">Emergency Contact</p>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Name</Label>
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => updateField("emergency_contact_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => updateField("emergency_contact_phone", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tenancy Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property">Property *</Label>
                <Select
                  value={formData.portfolio_property_id}
                  onValueChange={(v) => updateField("portfolio_property_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenancy_type">Tenancy Type</Label>
                <Select
                  value={formData.tenancy_type}
                  onValueChange={(v) => updateField("tenancy_type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AST">Assured Shorthold Tenancy</SelectItem>
                    <SelectItem value="Periodic">Periodic</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => updateField("start_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => updateField("end_date", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_rent">Rent Amount *</Label>
                  <Input
                    id="monthly_rent"
                    type="number"
                    value={formData.monthly_rent || ""}
                    onChange={(e) => updateField("monthly_rent", parseFloat(e.target.value) || 0)}
                    placeholder="1200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent_frequency">Frequency</Label>
                  <Select
                    value={formData.rent_frequency}
                    onValueChange={(v) => updateField("rent_frequency", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rent_due_day">Rent Due Day</Label>
                <Select
                  value={formData.rent_due_day.toString()}
                  onValueChange={(v) => updateField("rent_due_day", parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}{day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"} of month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Deposit */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit_amount">Deposit Amount</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  value={formData.deposit_amount || ""}
                  onChange={(e) => updateField("deposit_amount", parseFloat(e.target.value) || 0)}
                  placeholder="1200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit_scheme">Deposit Scheme</Label>
                <Select
                  value={formData.deposit_scheme}
                  onValueChange={(v) => updateField("deposit_scheme", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPOSIT_SCHEMES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit_reference">Reference Number</Label>
                <Input
                  id="deposit_reference"
                  value={formData.deposit_reference}
                  onChange={(e) => updateField("deposit_reference", e.target.value)}
                  placeholder="DEP-123456"
                />
              </div>
            </div>
          )}

          {/* Step 4: Guarantor */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add guarantor details if applicable (optional)
              </p>
              <div className="space-y-2">
                <Label htmlFor="guarantor_name">Guarantor Name</Label>
                <Input
                  id="guarantor_name"
                  value={formData.guarantor_name}
                  onChange={(e) => updateField("guarantor_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guarantor_phone">Guarantor Phone</Label>
                <Input
                  id="guarantor_phone"
                  value={formData.guarantor_phone}
                  onChange={(e) => updateField("guarantor_phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guarantor_email">Guarantor Email</Label>
                <Input
                  id="guarantor_email"
                  type="email"
                  value={formData.guarantor_email}
                  onChange={(e) => updateField("guarantor_email", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}

          {step < STEPS.length ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={loading || !canProceed()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Tenant"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

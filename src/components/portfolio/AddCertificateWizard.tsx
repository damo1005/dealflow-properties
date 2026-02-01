import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { PortfolioProperty } from "@/types/portfolio";

interface AddCertificateWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: PortfolioProperty[];
  onSave: (data: CertificateFormData) => Promise<void>;
}

export interface CertificateFormData {
  portfolio_property_id: string;
  compliance_type: string;
  certificate_number: string;
  issued_date: string;
  expiry_date: string;
  contractor_name: string;
  contractor_phone: string;
  cost: number;
  reminder_30_days: boolean;
  reminder_14_days: boolean;
  reminder_7_days: boolean;
}

interface ComplianceTemplate {
  id: string;
  compliance_type: string;
  display_name: string;
  description: string;
  validity_months: number;
  is_mandatory: boolean;
  legal_requirement: string;
  penalty_for_non_compliance: string;
}

export function AddCertificateWizard({ open, onOpenChange, properties, onSave }: AddCertificateWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<ComplianceTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ComplianceTemplate | null>(null);
  
  const [formData, setFormData] = useState<CertificateFormData>({
    portfolio_property_id: "",
    compliance_type: "",
    certificate_number: "",
    issued_date: "",
    expiry_date: "",
    contractor_name: "",
    contractor_phone: "",
    cost: 0,
    reminder_30_days: true,
    reminder_14_days: false,
    reminder_7_days: false,
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from("compliance_templates")
        .select("*")
        .order("display_name");
      if (data) {
        setTemplates(data as ComplianceTemplate[]);
      }
    };
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const progressValue = (step / 2) * 100;

  const updateField = <K extends keyof CertificateFormData>(field: K, value: CertificateFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectTemplate = (template: ComplianceTemplate) => {
    setSelectedTemplate(template);
    updateField("compliance_type", template.compliance_type);
    
    // Auto-calculate expiry date based on validity months
    if (formData.issued_date && template.validity_months) {
      const issued = new Date(formData.issued_date);
      issued.setMonth(issued.getMonth() + template.validity_months);
      updateField("expiry_date", issued.toISOString().split("T")[0]);
    }
    
    setStep(2);
  };

  const handleIssueDateChange = (date: string) => {
    updateField("issued_date", date);
    
    // Auto-calculate expiry date
    if (selectedTemplate?.validity_months) {
      const issued = new Date(date);
      issued.setMonth(issued.getMonth() + selectedTemplate.validity_months);
      updateField("expiry_date", issued.toISOString().split("T")[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
      setStep(1);
      setSelectedTemplate(null);
      setFormData({
        portfolio_property_id: "",
        compliance_type: "",
        certificate_number: "",
        issued_date: "",
        expiry_date: "",
        contractor_name: "",
        contractor_phone: "",
        cost: 0,
        reminder_30_days: true,
        reminder_14_days: false,
        reminder_7_days: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const canSave = formData.portfolio_property_id && formData.compliance_type && formData.issued_date && formData.expiry_date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {step === 1 ? "Select Certificate Type" : "Certificate Details"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of 2</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="space-y-4 py-4">
          {/* Step 1: Select Type */}
          {step === 1 && (
            <div className="grid gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleSelectTemplate(template)}
                  className="p-4 rounded-lg border text-left hover:border-primary/50 hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{template.display_name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Valid for {template.validity_months} months
                        {template.is_mandatory && (
                          <span className="ml-2 text-red-600">• Mandatory</span>
                        )}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && selectedTemplate && (
            <div className="space-y-4">
              {/* Template Info */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium">{selectedTemplate.display_name}</p>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issued_date">Issue Date *</Label>
                  <Input
                    id="issued_date"
                    type="date"
                    value={formData.issued_date}
                    onChange={(e) => handleIssueDateChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date *</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => updateField("expiry_date", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate_number">Certificate Number</Label>
                <Input
                  id="certificate_number"
                  value={formData.certificate_number}
                  onChange={(e) => updateField("certificate_number", e.target.value)}
                  placeholder="e.g., GS-2025-001234"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractor_name">Contractor Name</Label>
                  <Input
                    id="contractor_name"
                    value={formData.contractor_name}
                    onChange={(e) => updateField("contractor_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractor_phone">Contractor Phone</Label>
                  <Input
                    id="contractor_phone"
                    value={formData.contractor_phone}
                    onChange={(e) => updateField("contractor_phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost || ""}
                    onChange={(e) => updateField("cost", parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label>Reminders</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="reminder_30"
                      checked={formData.reminder_30_days}
                      onCheckedChange={(checked) => updateField("reminder_30_days", !!checked)}
                    />
                    <Label htmlFor="reminder_30" className="font-normal cursor-pointer">
                      Send reminder 30 days before expiry
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="reminder_14"
                      checked={formData.reminder_14_days}
                      onCheckedChange={(checked) => updateField("reminder_14_days", !!checked)}
                    />
                    <Label htmlFor="reminder_14" className="font-normal cursor-pointer">
                      Send reminder 14 days before expiry
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="reminder_7"
                      checked={formData.reminder_7_days}
                      onCheckedChange={(checked) => updateField("reminder_7_days", !!checked)}
                    />
                    <Label htmlFor="reminder_7" className="font-normal cursor-pointer">
                      Send reminder 7 days before expiry
                    </Label>
                  </div>
                </div>
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

          {step === 2 && (
            <Button onClick={handleSave} disabled={loading || !canSave}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Certificate"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

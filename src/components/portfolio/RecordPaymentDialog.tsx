import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, PoundSterling } from "lucide-react";
import type { Tenancy } from "@/types/portfolio";

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenancy: Tenancy | null;
  propertyAddress?: string;
  onSave: (data: PaymentFormData) => Promise<void>;
}

export interface PaymentFormData {
  tenancy_id: string;
  payment_date: string;
  due_date: string;
  amount: number;
  payment_method: string;
  payment_reference: string;
  notes: string;
  status: "paid" | "partial" | "late";
}

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "standing_order", label: "Standing Order" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export function RecordPaymentDialog({
  open,
  onOpenChange,
  tenancy,
  propertyAddress,
  onSave,
}: RecordPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  
  const [formData, setFormData] = useState<PaymentFormData>({
    tenancy_id: tenancy?.id || "",
    payment_date: today,
    due_date: today,
    amount: tenancy?.monthly_rent || 0,
    payment_method: "bank_transfer",
    payment_reference: "",
    notes: "",
    status: "paid",
  });

  const updateField = <K extends keyof PaymentFormData>(field: K, value: PaymentFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!tenancy) return;
    
    setLoading(true);
    try {
      await onSave({
        ...formData,
        tenancy_id: tenancy.id,
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  if (!tenancy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PoundSterling className="h-5 w-5 text-primary" />
            Record Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tenant & Property Info */}
          <div className="p-3 bg-muted/50 rounded-lg space-y-1">
            <p className="font-medium">{tenancy.tenant_name}</p>
            {propertyAddress && (
              <p className="text-sm text-muted-foreground">{propertyAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => updateField("payment_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => updateField("due_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <Input
                id="amount"
                type="number"
                value={formData.amount || ""}
                onChange={(e) => updateField("amount", parseFloat(e.target.value) || 0)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(v) => updateField("payment_method", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_reference">Reference (optional)</Label>
            <Input
              id="payment_reference"
              value={formData.payment_reference}
              onChange={(e) => updateField("payment_reference", e.target.value)}
              placeholder="Transaction reference"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(v) => updateField("status", v as "paid" | "partial" | "late")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="font-normal cursor-pointer">
                  Paid in full
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial" className="font-normal cursor-pointer">
                  Partial
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="late" id="late" />
                <Label htmlFor="late" className="font-normal cursor-pointer">
                  Late
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !formData.amount}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Record Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, MessageSquare, Mail, Phone, FileText, Users, Send, Inbox } from "lucide-react";
import type { Tenancy } from "@/types/portfolio";

interface LogCommunicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenancy: Tenancy | null;
  onSave: (data: CommunicationFormData) => Promise<void>;
}

export interface CommunicationFormData {
  tenancy_id: string;
  communication_type: "email" | "phone" | "letter" | "in_person" | "text";
  direction: "sent" | "received";
  subject: string;
  message: string;
}

const COMMUNICATION_TYPES = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone Call", icon: Phone },
  { value: "text", label: "Text Message", icon: MessageSquare },
  { value: "letter", label: "Letter", icon: FileText },
  { value: "in_person", label: "In Person", icon: Users },
];

export function LogCommunicationDialog({
  open,
  onOpenChange,
  tenancy,
  onSave,
}: LogCommunicationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CommunicationFormData>({
    tenancy_id: tenancy?.id || "",
    communication_type: "email",
    direction: "sent",
    subject: "",
    message: "",
  });

  const updateField = <K extends keyof CommunicationFormData>(field: K, value: CommunicationFormData[K]) => {
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
      // Reset form
      setFormData({
        tenancy_id: "",
        communication_type: "email",
        direction: "sent",
        subject: "",
        message: "",
      });
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
            <MessageSquare className="h-5 w-5 text-primary" />
            Log Communication
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tenant Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">{tenancy.tenant_name}</p>
          </div>

          {/* Communication Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-5 gap-2">
              {COMMUNICATION_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateField("communication_type", type.value as any)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.communication_type === type.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <Label>Direction</Label>
            <RadioGroup
              value={formData.direction}
              onValueChange={(v) => updateField("direction", v as "sent" | "received")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sent" id="sent" />
                <Label htmlFor="sent" className="font-normal cursor-pointer flex items-center gap-1">
                  <Send className="h-4 w-4" />
                  Sent to Tenant
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="received" id="received" />
                <Label htmlFor="received" className="font-normal cursor-pointer flex items-center gap-1">
                  <Inbox className="h-4 w-4" />
                  Received from Tenant
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              placeholder="e.g., Rent reminder, Maintenance request"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message / Notes</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              rows={5}
              placeholder="Enter communication details..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !formData.subject}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Communication"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

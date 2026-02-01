import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Building2, Check } from "lucide-react";
import type { PortfolioProperty } from "@/types/portfolio";

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = ["Property Details", "Purchase & Finance", "Review"];

export function AddPropertyDialog({ open, onOpenChange }: AddPropertyDialogProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    address: "",
    postcode: "",
    property_type: "",
    bedrooms: "",
    purchase_date: "",
    purchase_price: "",
    current_value: "",
    mortgage_lender: "",
    mortgage_amount: "",
    mortgage_rate: "",
    monthly_payment: "",
    tenure: "",
    investment_strategy: "BTL",
  });

  const { addProperty } = usePortfolioStore();
  const { toast } = useToast();

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newProperty: PortfolioProperty = {
      id: crypto.randomUUID(),
      user_id: "user1",
      address: formData.address,
      postcode: formData.postcode,
      property_type: formData.property_type || null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      purchase_date: formData.purchase_date,
      purchase_price: parseInt(formData.purchase_price) || 0,
      current_value: formData.current_value ? parseInt(formData.current_value) : null,
      mortgage_lender: formData.mortgage_lender || null,
      mortgage_amount: formData.mortgage_amount ? parseInt(formData.mortgage_amount) : null,
      mortgage_rate: formData.mortgage_rate ? parseFloat(formData.mortgage_rate) : null,
      monthly_payment: formData.monthly_payment ? parseInt(formData.monthly_payment) : null,
      tenure: formData.tenure || null,
      lease_years: null,
      investment_strategy: formData.investment_strategy,
      property_status: "let",
      total_income_ytd: 0,
      total_expenses_ytd: 0,
      current_yield: null,
      images: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addProperty(newProperty);
    toast({
      title: "Property Added",
      description: `${formData.address} has been added to your portfolio.`,
    });
    onOpenChange(false);
    setStep(0);
    setFormData({
      address: "",
      postcode: "",
      property_type: "",
      bedrooms: "",
      purchase_date: "",
      purchase_price: "",
      current_value: "",
      mortgage_lender: "",
      mortgage_amount: "",
      mortgage_rate: "",
      monthly_payment: "",
      tenure: "",
      investment_strategy: "BTL",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Add Property to Portfolio
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((stepName, index) => (
            <div key={stepName} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index < step ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${index < step ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="123 High Street, Enfield"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  placeholder="EN3 4AB"
                  value={formData.postcode}
                  onChange={(e) => updateField("postcode", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property_type">Property Type</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => updateField("property_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Terraced">Terraced</SelectItem>
                    <SelectItem value="Semi-detached">Semi-detached</SelectItem>
                    <SelectItem value="Detached">Detached</SelectItem>
                    <SelectItem value="Bungalow">Bungalow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bedrooms}
                  onChange={(e) => updateField("bedrooms", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure</Label>
                <Select
                  value={formData.tenure}
                  onValueChange={(value) => updateField("tenure", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freehold">Freehold</SelectItem>
                    <SelectItem value="Leasehold">Leasehold</SelectItem>
                    <SelectItem value="Share of Freehold">Share of Freehold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date *</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => updateField("purchase_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_price">Purchase Price *</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  placeholder="250000"
                  value={formData.purchase_price}
                  onChange={(e) => updateField("purchase_price", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_value">Current Value (estimate)</Label>
              <Input
                id="current_value"
                type="number"
                placeholder="275000"
                value={formData.current_value}
                onChange={(e) => updateField("current_value", e.target.value)}
              />
            </div>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-4">Mortgage Details (optional)</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mortgage_lender">Lender</Label>
                  <Input
                    id="mortgage_lender"
                    placeholder="e.g., Nationwide"
                    value={formData.mortgage_lender}
                    onChange={(e) => updateField("mortgage_lender", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mortgage_amount">Amount</Label>
                    <Input
                      id="mortgage_amount"
                      type="number"
                      placeholder="187500"
                      value={formData.mortgage_amount}
                      onChange={(e) => updateField("mortgage_amount", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mortgage_rate">Rate (%)</Label>
                    <Input
                      id="mortgage_rate"
                      type="number"
                      step="0.01"
                      placeholder="5.25"
                      value={formData.mortgage_rate}
                      onChange={(e) => updateField("mortgage_rate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly_payment">Payment/mo</Label>
                    <Input
                      id="monthly_payment"
                      type="number"
                      placeholder="1074"
                      value={formData.monthly_payment}
                      onChange={(e) => updateField("monthly_payment", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Property Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium">{formData.address}</span>
                <span className="text-muted-foreground">Postcode:</span>
                <span className="font-medium">{formData.postcode}</span>
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{formData.property_type || "-"}</span>
                <span className="text-muted-foreground">Bedrooms:</span>
                <span className="font-medium">{formData.bedrooms || "-"}</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Purchase & Finance</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Purchase Price:</span>
                <span className="font-medium">
                  {formData.purchase_price ? formatCurrency(parseInt(formData.purchase_price)) : "-"}
                </span>
                <span className="text-muted-foreground">Current Value:</span>
                <span className="font-medium">
                  {formData.current_value ? formatCurrency(parseInt(formData.current_value)) : "-"}
                </span>
                <span className="text-muted-foreground">Mortgage:</span>
                <span className="font-medium">
                  {formData.mortgage_amount ? formatCurrency(parseInt(formData.mortgage_amount)) : "-"}
                </span>
                <span className="text-muted-foreground">Rate:</span>
                <span className="font-medium">{formData.mortgage_rate ? `${formData.mortgage_rate}%` : "-"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Investment Strategy</Label>
              <Select
                value={formData.investment_strategy}
                onValueChange={(value) => updateField("investment_strategy", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTL">Buy-to-Let (BTL)</SelectItem>
                  <SelectItem value="BRR">Buy-Refurb-Refinance (BRR)</SelectItem>
                  <SelectItem value="HMO">HMO</SelectItem>
                  <SelectItem value="Flip">Property Flip</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && (!formData.address || !formData.postcode)}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Check className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

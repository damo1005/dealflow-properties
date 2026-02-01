import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PoundSterling, ArrowLeft, ArrowRight, ChevronDown, Plus } from "lucide-react";
import { useDealAnalysisStore } from "@/stores/dealAnalysisStore";
import { PurchaseType, FinanceType } from "@/types/dealAnalysis";

const purchaseTypes: { value: PurchaseType; label: string }[] = [
  { value: "standard", label: "Standard Purchase" },
  { value: "auction", label: "Auction" },
  { value: "bmv", label: "Below Market Value (BMV)" },
  { value: "off_market", label: "Off-Market" },
];

const financeTypes: { value: FinanceType; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "btl_mortgage", label: "BTL Mortgage" },
  { value: "bridging", label: "Bridging Finance" },
  { value: "commercial", label: "Commercial Mortgage" },
];

export function FinancialsStep() {
  const { financials, setFinancials, setStep } = useDealAnalysisStore();
  const [showRefurb, setShowRefurb] = useState(
    financials.refurbLight > 0 || financials.refurbMedium > 0 || financials.refurbHeavy > 0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB").format(value);
  };

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^0-9]/g, "")) || 0;
  };

  const canContinue = financials.askingPrice > 0;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <PoundSterling className="h-5 w-5 text-primary" />
          </div>
          Deal Financials
        </CardTitle>
        <p className="text-muted-foreground">
          Enter the purchase and financing details
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purchase Section */}
        <div className="space-y-4">
          <h3 className="font-semibold">Purchase</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asking Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  className="pl-7"
                  placeholder="150,000"
                  value={financials.askingPrice ? formatCurrency(financials.askingPrice) : ""}
                  onChange={(e) => setFinancials({ askingPrice: parseCurrency(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Offer</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  className="pl-7"
                  placeholder="Same as asking"
                  value={financials.offerPrice ? formatCurrency(financials.offerPrice) : ""}
                  onChange={(e) => setFinancials({ offerPrice: parseCurrency(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Purchase Type</Label>
            <Select
              value={financials.purchaseType}
              onValueChange={(v) => setFinancials({ purchaseType: v as PurchaseType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {purchaseTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Refurbishment Section */}
        <div className="space-y-4">
          <Collapsible open={showRefurb} onOpenChange={setShowRefurb}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Refurbishment Costs
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showRefurb ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Light Refurb</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                      className="pl-7"
                      placeholder="0"
                      value={financials.refurbLight ? formatCurrency(financials.refurbLight) : ""}
                      onChange={(e) => setFinancials({ refurbLight: parseCurrency(e.target.value) })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Paint, carpets, clean</p>
                </div>
                <div className="space-y-2">
                  <Label>Medium Refurb</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                      className="pl-7"
                      placeholder="0"
                      value={financials.refurbMedium ? formatCurrency(financials.refurbMedium) : ""}
                      onChange={(e) => setFinancials({ refurbMedium: parseCurrency(e.target.value) })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Kitchen, bathroom</p>
                </div>
                <div className="space-y-2">
                  <Label>Heavy Refurb</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                      className="pl-7"
                      placeholder="0"
                      value={financials.refurbHeavy ? formatCurrency(financials.refurbHeavy) : ""}
                      onChange={(e) => setFinancials({ refurbHeavy: parseCurrency(e.target.value) })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Structural, extension</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>After Repair Value (ARV)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    className="pl-7"
                    placeholder="Your estimate after works"
                    value={financials.arv ? formatCurrency(financials.arv) : ""}
                    onChange={(e) => setFinancials({ arv: parseCurrency(e.target.value) })}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Financing Section */}
        <div className="space-y-4">
          <h3 className="font-semibold">Financing</h3>

          <div className="space-y-2">
            <Label>Finance Type</Label>
            <Select
              value={financials.financeType}
              onValueChange={(v) => setFinancials({ financeType: v as FinanceType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {financeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {financials.financeType !== "cash" && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>LTV (%)</Label>
                  <Input
                    type="number"
                    value={financials.ltv}
                    onChange={(e) => setFinancials({ ltv: parseFloat(e.target.value) || 75 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={financials.interestRate}
                    onChange={(e) => setFinancials({ interestRate: parseFloat(e.target.value) || 5.5 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mortgage Term (years)</Label>
                  <Input
                    type="number"
                    value={financials.mortgageTerm}
                    onChange={(e) => setFinancials({ mortgageTerm: parseInt(e.target.value) || 25 })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <Label>Interest Only</Label>
                  <Switch
                    checked={financials.interestOnly}
                    onCheckedChange={(checked) => setFinancials({ interestOnly: checked })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setStep(1)} size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => setStep(3)} disabled={!canContinue} size="lg">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Home, Hammer, Building, Sofa, GraduationCap, TrendingUp, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useDealAnalysisStore } from "@/stores/dealAnalysisStore";
import { Strategy, BTLStrategyInputs, FlipStrategyInputs, HMOStrategyInputs, SAStrategyInputs } from "@/types/dealAnalysis";
import { calculateDealAnalysis } from "@/lib/dealCalculations";
import { cn } from "@/lib/utils";

const strategies: { value: Strategy; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "btl", label: "Buy-to-Let", description: "Standard rental", icon: <Home className="h-6 w-6" /> },
  { value: "flip", label: "Flip (BRR)", description: "Buy, Refurb, Refinance", icon: <Hammer className="h-6 w-6" /> },
  { value: "hmo", label: "HMO", description: "Multi-let rooms", icon: <Building className="h-6 w-6" /> },
  { value: "sa", label: "Serviced Accom", description: "Airbnb/SA", icon: <Sofa className="h-6 w-6" /> },
  { value: "student", label: "Student Let", description: "Term-time rental", icon: <GraduationCap className="h-6 w-6" /> },
  { value: "development", label: "Development", description: "Planning gain/build", icon: <TrendingUp className="h-6 w-6" /> },
];

export function StrategyStep() {
  const { property, financials, strategyInput, setStrategyInput, setStep, setAnalysis, setIsAnalyzing, isAnalyzing } = useDealAnalysisStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB").format(value);
  };

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^0-9]/g, "")) || 0;
  };

  const updateStrategyInputs = (updates: Partial<BTLStrategyInputs | FlipStrategyInputs | HMOStrategyInputs | SAStrategyInputs>) => {
    setStrategyInput({
      inputs: { ...strategyInput.inputs, ...updates },
    });
  };

  const handleAnalyse = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const analysis = calculateDealAnalysis(property, financials, strategyInput);
    setAnalysis({
      ...analysis,
      id: crypto.randomUUID(),
      userId: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any);
    
    setIsAnalyzing(false);
    setStep(4);
  };

  const canAnalyse = () => {
    const { strategy, inputs } = strategyInput;
    switch (strategy) {
      case "btl":
      case "student":
        return (inputs as BTLStrategyInputs).monthlyRent > 0;
      case "flip":
        return (inputs as FlipStrategyInputs).targetSalePrice > 0;
      case "hmo":
        return (inputs as HMOStrategyInputs).rentPerRoom > 0;
      case "sa":
        return (inputs as SAStrategyInputs).nightlyRate > 0;
      default:
        return true;
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          Investment Strategy
        </CardTitle>
        <p className="text-muted-foreground">
          What's your strategy for this property?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strategy Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {strategies.map((s) => (
            <button
              key={s.value}
              onClick={() => setStrategyInput({ strategy: s.value })}
              className={cn(
                "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                strategyInput.strategy === s.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <div className={cn(
                "mb-2",
                strategyInput.strategy === s.value ? "text-primary" : "text-muted-foreground"
              )}>
                {s.icon}
              </div>
              <p className="font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </button>
          ))}
        </div>

        {/* Strategy-specific inputs */}
        <div className="p-4 rounded-lg border bg-muted/30 space-y-4">
          {(strategyInput.strategy === "btl" || strategyInput.strategy === "student") && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Expected Monthly Rent *</Label>
                  <Button variant="ghost" size="sm" className="text-xs text-primary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Auto-fill from comparables
                  </Button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    className="pl-7"
                    placeholder="900"
                    value={(strategyInput.inputs as BTLStrategyInputs).monthlyRent || ""}
                    onChange={(e) => updateStrategyInputs({ monthlyRent: parseCurrency(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Management</Label>
                <RadioGroup
                  value={String((strategyInput.inputs as BTLStrategyInputs).managementPercent || 0)}
                  onValueChange={(v) => updateStrategyInputs({ managementPercent: parseInt(v) })}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="mgmt-0" />
                    <Label htmlFor="mgmt-0" className="font-normal">Self-managed (0%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10" id="mgmt-10" />
                    <Label htmlFor="mgmt-10" className="font-normal">Managed (10%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="mgmt-15" />
                    <Label htmlFor="mgmt-15" className="font-normal">Fully managed (15%)</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {strategyInput.strategy === "flip" && (
            <>
              <div className="space-y-2">
                <Label>Target Sale Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    className="pl-7"
                    placeholder="200,000"
                    value={(strategyInput.inputs as FlipStrategyInputs).targetSalePrice ? formatCurrency((strategyInput.inputs as FlipStrategyInputs).targetSalePrice) : ""}
                    onChange={(e) => updateStrategyInputs({ targetSalePrice: parseCurrency(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Refinance LTV (%)</Label>
                  <Input
                    type="number"
                    placeholder="75"
                    value={(strategyInput.inputs as FlipStrategyInputs).refinanceLtv || ""}
                    onChange={(e) => updateStrategyInputs({ refinanceLtv: parseInt(e.target.value) || 75 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hold Period (months)</Label>
                  <Input
                    type="number"
                    placeholder="6"
                    value={(strategyInput.inputs as FlipStrategyInputs).holdPeriodMonths || ""}
                    onChange={(e) => updateStrategyInputs({ holdPeriodMonths: parseInt(e.target.value) || 6 })}
                  />
                </div>
              </div>
            </>
          )}

          {strategyInput.strategy === "hmo" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Rooms *</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={(strategyInput.inputs as HMOStrategyInputs).numberOfRooms || ""}
                    onChange={(e) => updateStrategyInputs({ numberOfRooms: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rent per Room *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                      className="pl-7"
                      placeholder="550"
                      value={(strategyInput.inputs as HMOStrategyInputs).rentPerRoom || ""}
                      onChange={(e) => updateStrategyInputs({ rentPerRoom: parseCurrency(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <Label>Bills Included</Label>
                <Switch
                  checked={(strategyInput.inputs as HMOStrategyInputs).billsIncluded || false}
                  onCheckedChange={(checked) => updateStrategyInputs({ billsIncluded: checked })}
                />
              </div>
              {(strategyInput.inputs as HMOStrategyInputs).billsIncluded && (
                <div className="space-y-2">
                  <Label>Estimated Monthly Bills</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                      className="pl-7"
                      placeholder="400"
                      value={(strategyInput.inputs as HMOStrategyInputs).estimatedBills || ""}
                      onChange={(e) => updateStrategyInputs({ estimatedBills: parseCurrency(e.target.value) })}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {strategyInput.strategy === "sa" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nightly Rate *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                      className="pl-7"
                      placeholder="120"
                      value={(strategyInput.inputs as SAStrategyInputs).nightlyRate || ""}
                      onChange={(e) => updateStrategyInputs({ nightlyRate: parseCurrency(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Occupancy Rate (%)</Label>
                  <Input
                    type="number"
                    placeholder="70"
                    value={(strategyInput.inputs as SAStrategyInputs).occupancyPercent || 70}
                    onChange={(e) => updateStrategyInputs({ occupancyPercent: parseInt(e.target.value) || 70 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cleaning per Stay</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                      className="pl-7"
                      placeholder="40"
                      value={(strategyInput.inputs as SAStrategyInputs).cleaningPerStay || ""}
                      onChange={(e) => updateStrategyInputs({ cleaningPerStay: parseCurrency(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Platform Fees (%)</Label>
                  <Input
                    type="number"
                    placeholder="15"
                    value={(strategyInput.inputs as SAStrategyInputs).platformFeesPercent || 15}
                    onChange={(e) => updateStrategyInputs({ platformFeesPercent: parseInt(e.target.value) || 15 })}
                  />
                </div>
              </div>
            </>
          )}

          {strategyInput.strategy === "development" && (
            <p className="text-muted-foreground text-center py-4">
              Development analysis coming soon. Please select another strategy for now.
            </p>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setStep(2)} size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleAnalyse}
            disabled={!canAnalyse() || isAnalyzing}
            size="lg"
            className="min-w-[160px]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analysing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyse Deal
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

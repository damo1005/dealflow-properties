import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sparkles, Loader2, Building, Home } from "lucide-react";
import { useDealAnalysisStore } from "@/stores/dealAnalysisStore";
import { SAStrategyInputs, SAPropertyStrategy, SAGuestType, SAPlatform } from "@/types/dealAnalysis";
import { calculateDealAnalysis } from "@/lib/dealCalculations";
import { cn } from "@/lib/utils";

const PLATFORMS: { value: SAPlatform; label: string }[] = [
  { value: "airbnb", label: "Airbnb" },
  { value: "booking", label: "Booking.com" },
  { value: "direct", label: "Direct" },
  { value: "corporate", label: "Corporate" },
];

const GUEST_TYPES: { value: SAGuestType; label: string }[] = [
  { value: "contractors", label: "Contractors" },
  { value: "tourists", label: "Tourists" },
  { value: "corporate", label: "Corporate" },
  { value: "mixed", label: "Mixed" },
];

export function StrategyStep() {
  const { property, financials, strategyInput, setStrategyInput, setStep, setAnalysis, setIsAnalyzing, isAnalyzing } = useDealAnalysisStore();

  const inputs = strategyInput.inputs as SAStrategyInputs;

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^0-9]/g, "")) || 0;
  };

  const update = (updates: Partial<SAStrategyInputs>) => {
    setStrategyInput({
      inputs: { ...inputs, ...updates },
    });
  };

  const togglePlatform = (platform: SAPlatform) => {
    const current = inputs.platformMix || [];
    const next = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    update({ platformMix: next });
  };

  const handleAnalyse = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const analysis = calculateDealAnalysis(property, financials, strategyInput);
    setAnalysis({
      ...analysis,
      id: crypto.randomUUID(),
      userId: "current-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any);

    setIsAnalyzing(false);
    setStep(4);
  };

  const canAnalyse = () => {
    return inputs.nightlyRate > 0;
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          SA Strategy
        </CardTitle>
        <p className="text-muted-foreground">
          Configure your serviced accommodation strategy for this property.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property strategy */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Property strategy</Label>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: "r2sa" as SAPropertyStrategy, label: "R2SA (Rent to SA)", icon: Building, desc: "Rented from a landlord" },
              { value: "own" as SAPropertyStrategy, label: "Own property SA", icon: Home, desc: "Property you own" },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ propertyStrategy: opt.value })}
                className={cn(
                  "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                  inputs.propertyStrategy === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <opt.icon className={cn("h-5 w-5 mb-2", inputs.propertyStrategy === opt.value ? "text-primary" : "text-muted-foreground")} />
                <p className="font-medium text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Monthly lease cost — only for R2SA */}
        {inputs.propertyStrategy === "r2sa" && (
          <div className="space-y-2">
            <Label>What are you paying the landlord per month?</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <Input
                className="pl-7"
                placeholder="1,200"
                value={inputs.monthlyLeaseCost || ""}
                onChange={(e) => update({ monthlyLeaseCost: parseCurrency(e.target.value) })}
              />
            </div>
          </div>
        )}

        {/* ADR and Occupancy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Your target average nightly rate (£) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <Input
                className="pl-7"
                placeholder="120"
                value={inputs.nightlyRate || ""}
                onChange={(e) => update({ nightlyRate: parseCurrency(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target occupancy: {inputs.occupancyPercent}%</Label>
            <Slider
              min={50}
              max={100}
              step={1}
              value={[inputs.occupancyPercent]}
              onValueChange={([val]) => update({ occupancyPercent: val })}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Platform mix */}
        <div className="space-y-3">
          <Label>Platform mix</Label>
          <div className="flex flex-wrap gap-4">
            {PLATFORMS.map((p) => (
              <label key={p.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={(inputs.platformMix || []).includes(p.value)}
                  onCheckedChange={() => togglePlatform(p.value)}
                />
                <span className="text-sm">{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Guest type */}
        <div className="space-y-3">
          <Label>Guest type</Label>
          <RadioGroup
            value={inputs.guestType || "mixed"}
            onValueChange={(v) => update({ guestType: v as SAGuestType })}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {GUEST_TYPES.map((g) => (
              <label
                key={g.value}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                  inputs.guestType === g.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value={g.value} id={`guest-${g.value}`} />
                <span className="text-sm font-medium">{g.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Cleaning & platform fees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cleaning per stay</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <Input
                className="pl-7"
                placeholder="40"
                value={inputs.cleaningPerStay || ""}
                onChange={(e) => update({ cleaningPerStay: parseCurrency(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Platform fees (%)</Label>
            <Input
              type="number"
              placeholder="15"
              value={inputs.platformFeesPercent || 15}
              onChange={(e) => update({ platformFeesPercent: parseInt(e.target.value) || 15 })}
            />
          </div>
        </div>

        {/* Navigation */}
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

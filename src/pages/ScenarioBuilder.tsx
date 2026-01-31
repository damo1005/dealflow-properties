import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  RotateCcw, 
  Save, 
  Download, 
  ArrowLeft,
  Lock,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useScenarioStore, calculateMetrics } from "@/stores/scenarioStore";
import { useCalculatorStore, type BTLInputs } from "@/stores/calculatorStore";
import { ScenarioSlider } from "@/components/scenarios/ScenarioSlider";
import { MetricCard } from "@/components/scenarios/MetricCard";
import { PresetButtons } from "@/components/scenarios/PresetButtons";
import { SavedScenarioCard } from "@/components/scenarios/SavedScenarioCard";
import { SensitivityChart } from "@/components/scenarios/SensitivityChart";
import { WaterfallChart } from "@/components/scenarios/WaterfallChart";
import { ScenarioComparisonChart } from "@/components/scenarios/ScenarioComparisonChart";
import { RiskIndicator } from "@/components/scenarios/RiskIndicator";
import { SaveScenarioDialog } from "@/components/scenarios/SaveScenarioDialog";
import { sliderConfigs, applyPresetToInputs, formatCurrency } from "@/lib/scenarioConfig";
import type { PresetScenario } from "@/types/scenario";

export default function ScenarioBuilder() {
  const { id: propertyId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"purchase" | "financing" | "income" | "expenses">("purchase");
  
  const { btlInputs } = useCalculatorStore();
  const {
    baseInputs,
    currentInputs,
    variations,
    setBaseInputs,
    updateInput,
    resetToBase,
    saveVariation,
    loadVariation,
    deleteVariation,
    applyPreset,
  } = useScenarioStore();

  // Initialize with calculator inputs or URL params
  useEffect(() => {
    const fromCalculator = searchParams.get("from") === "calculator";
    if (fromCalculator) {
      setBaseInputs(btlInputs);
    }
  }, [searchParams, btlInputs, setBaseInputs]);

  // Calculate metrics
  const baseMetrics = useMemo(() => calculateMetrics(baseInputs), [baseInputs]);
  const currentMetrics = useMemo(() => calculateMetrics(currentInputs), [currentInputs]);

  // Check if current differs from base
  const hasChanges = useMemo(() => {
    return Object.keys(currentInputs).some(
      (key) => currentInputs[key as keyof BTLInputs] !== baseInputs[key as keyof BTLInputs]
    );
  }, [currentInputs, baseInputs]);

  // Handle slider change
  const handleSliderChange = useCallback((key: string, value: number) => {
    updateInput(key as keyof BTLInputs, value);
  }, [updateInput]);

  // Handle preset apply
  const handleApplyPreset = useCallback((preset: PresetScenario) => {
    const changes = applyPresetToInputs(baseInputs, preset);
    applyPreset(changes);
    toast({
      title: `Applied "${preset.name}"`,
      description: preset.description,
    });
  }, [baseInputs, applyPreset, toast]);

  // Handle save
  const handleSaveVariation = useCallback((name: string) => {
    saveVariation(name);
    toast({
      title: "Scenario saved",
      description: `"${name}" has been saved for comparison.`,
    });
  }, [saveVariation, toast]);

  // Apply to calculator
  const handleApplyToCalculator = useCallback(() => {
    const { setBTLInputs } = useCalculatorStore.getState();
    setBTLInputs(currentInputs);
    toast({
      title: "Applied to calculator",
      description: "Values have been updated in the BTL calculator.",
    });
    navigate("/calculators");
  }, [currentInputs, toast, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" && !e.metaKey && !e.ctrlKey) {
        resetToBase();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (hasChanges) {
          setShowSaveDialog(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasChanges, resetToBase]);

  const categorySliders = sliderConfigs.filter((s) => s.category === activeCategory);

  return (
    <AppLayout title="Scenario Builder">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {propertyId && (
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                What-If Scenario Builder
              </h1>
              <p className="text-muted-foreground">
                Test different assumptions and see real-time impact on your deal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetToBase} disabled={!hasChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={handleApplyToCalculator}>
              <Calculator className="h-4 w-4 mr-2" />
              Apply to Calculator
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Base Scenario Card */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Base Scenario (Current Deal)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium">{formatCurrency(baseInputs.purchasePrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rent</p>
                    <p className="font-medium">{formatCurrency(baseInputs.monthlyRent)}/mo</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate</p>
                    <p className="font-medium">{baseInputs.mortgageRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cash Flow</p>
                    <p className="font-medium">{formatCurrency(baseMetrics.monthlyCashFlow)}/mo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preset Buttons */}
            <PresetButtons onApply={handleApplyPreset} />

            {/* Variable Sliders */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Adjust Variables</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as typeof activeCategory)}>
                  <TabsList className="w-full grid grid-cols-4 m-4 mb-0" style={{ width: 'calc(100% - 2rem)' }}>
                    <TabsTrigger value="purchase" className="text-xs">Purchase</TabsTrigger>
                    <TabsTrigger value="financing" className="text-xs">Finance</TabsTrigger>
                    <TabsTrigger value="income" className="text-xs">Income</TabsTrigger>
                    <TabsTrigger value="expenses" className="text-xs">Costs</TabsTrigger>
                  </TabsList>

                  <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-3">
                      {categorySliders.map((config) => {
                        const baseValue = config.getBaseValue(baseInputs);
                        const currentValue = currentInputs[config.key as keyof BTLInputs] as number;
                        
                        // Determine actual min/max based on unit type
                        let min = config.min;
                        let max = config.max;
                        
                        if (config.key === "purchasePrice") {
                          min = baseInputs.purchasePrice * 0.8;
                          max = baseInputs.purchasePrice * 1.2;
                        } else if (config.key === "monthlyRent") {
                          min = baseInputs.monthlyRent * 0.7;
                          max = baseInputs.monthlyRent * 1.3;
                        } else if (config.key === "refurbCosts") {
                          min = 0;
                          max = Math.max(50000, baseInputs.refurbCosts * 2);
                        }

                        return (
                          <ScenarioSlider
                            key={config.key}
                            label={config.label}
                            description={config.description}
                            value={currentValue}
                            baseValue={baseValue}
                            min={min}
                            max={max}
                            step={config.key === "purchasePrice" ? 1000 : 
                                  config.key === "monthlyRent" ? 25 :
                                  config.step}
                            unit={config.unit}
                            onChange={(v) => handleSliderChange(config.key, v)}
                          />
                        );
                      })}
                    </div>
                  </ScrollArea>
                </Tabs>
              </CardContent>
            </Card>

            {/* Saved Scenarios */}
            {variations.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Saved Scenarios
                    <Badge variant="secondary">{variations.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {variations.map((variation) => (
                    <SavedScenarioCard
                      key={variation.id}
                      variation={variation}
                      baseMetrics={baseMetrics}
                      onLoad={() => loadVariation(variation.id)}
                      onDelete={() => deleteVariation(variation.id)}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Monthly Cash Flow"
                value={currentMetrics.monthlyCashFlow}
                baseValue={baseMetrics.monthlyCashFlow}
                unit="currency"
                higherIsBetter
              />
              <MetricCard
                label="Net Yield"
                value={currentMetrics.netYield}
                baseValue={baseMetrics.netYield}
                unit="percent"
                higherIsBetter
              />
              <MetricCard
                label="ROI"
                value={currentMetrics.roi}
                baseValue={baseMetrics.roi}
                unit="percent"
                higherIsBetter
              />
              <MetricCard
                label="Cash Required"
                value={currentMetrics.totalCashRequired}
                baseValue={baseMetrics.totalCashRequired}
                unit="currency"
                higherIsBetter={false}
              />
            </div>

            {/* Break-even info */}
            {currentMetrics.breakEvenRent && (
              <Card className="bg-muted/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Break-even rent</p>
                    <p className="text-lg font-bold">{formatCurrency(currentMetrics.breakEvenRent)}/mo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current buffer</p>
                    <p className="text-lg font-bold text-green-600">
                      +{formatCurrency(currentInputs.monthlyRent - currentMetrics.breakEvenRent)}/mo
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SensitivityChart baseInputs={baseInputs} currentInputs={currentInputs} />
              <WaterfallChart inputs={currentInputs} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ScenarioComparisonChart
                baseMetrics={baseMetrics}
                currentMetrics={currentMetrics}
                variations={variations}
              />
              <RiskIndicator metrics={currentMetrics} inputs={currentInputs} />
            </div>
          </div>
        </div>

        {/* Save Dialog */}
        <SaveScenarioDialog
          open={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSaveVariation}
        />
      </div>
    </AppLayout>
  );
}

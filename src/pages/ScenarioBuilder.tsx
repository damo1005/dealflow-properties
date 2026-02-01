import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  RotateCcw, 
  Save, 
  ArrowLeft,
  Lock,
  Calculator,
  TrendingUp,
  ChevronDown,
  Download,
  Dices,
  Target,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ViabilityMeter } from "@/components/scenarios/ViabilityMeter";
import { CashFlowProjectionChart } from "@/components/scenarios/CashFlowProjectionChart";
import { BreakEvenChart } from "@/components/scenarios/BreakEvenChart";
import { SaveScenarioDialog } from "@/components/scenarios/SaveScenarioDialog";
import { MonteCarloDialog } from "@/components/scenarios/MonteCarloDialog";
import { GoalSeekerDialog } from "@/components/scenarios/GoalSeekerDialog";
import { sliderConfigs, applyPresetToInputs, formatCurrency } from "@/lib/scenarioConfig";
import type { PresetScenario } from "@/types/scenario";
import { cn } from "@/lib/utils";

export default function ScenarioBuilder() {
  const { id: propertyId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showMonteCarloDialog, setShowMonteCarloDialog] = useState(false);
  const [showGoalSeekerDialog, setShowGoalSeekerDialog] = useState(false);
  const [activeChart, setActiveChart] = useState<"sensitivity" | "cashflow" | "breakeven" | "waterfall" | "comparison">("sensitivity");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    purchase: true,
    financing: false,
    income: false,
    expenses: false,
  });
  
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

  // Count changes per category
  const categoryChanges = useMemo(() => {
    const changes: Record<string, number> = { purchase: 0, financing: 0, income: 0, expenses: 0 };
    sliderConfigs.forEach((config) => {
      const baseVal = config.getBaseValue(baseInputs);
      const currentVal = currentInputs[config.key as keyof BTLInputs] as number;
      if (Math.abs(baseVal - currentVal) > 0.01) {
        changes[config.category]++;
      }
    });
    return changes;
  }, [baseInputs, currentInputs]);

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

  // Toggle category
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

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

  const categories = [
    { key: "purchase", label: "Purchase", icon: "🏠" },
    { key: "financing", label: "Financing", icon: "💰" },
    { key: "income", label: "Income", icon: "📈" },
    { key: "expenses", label: "Expenses", icon: "📉" },
  ] as const;

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
              <p className="text-muted-foreground text-sm">
                Test different assumptions and see real-time impact on your deal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tools Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Tools
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowMonteCarloDialog(true)}>
                  <Dices className="h-4 w-4 mr-2" />
                  Monte Carlo Simulation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowGoalSeekerDialog(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Goal Seeker
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
              Apply
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-2 space-y-4">
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
                    <p className={cn(
                      "font-medium",
                      baseMetrics.monthlyCashFlow >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(baseMetrics.monthlyCashFlow)}/mo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preset Buttons */}
            <PresetButtons onApply={handleApplyPreset} />

            {/* Variable Sliders - Accordion Style */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  Adjust Variables
                  {hasChanges && (
                    <Badge variant="secondary" className="text-xs">
                      {Object.values(categoryChanges).reduce((a, b) => a + b, 0)} changed
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-2">
                    {categories.map((category) => {
                      const categorySliders = sliderConfigs.filter((s) => s.category === category.key);
                      const changeCount = categoryChanges[category.key];
                      
                      return (
                        <Collapsible
                          key={category.key}
                          open={openCategories[category.key]}
                          onOpenChange={() => toggleCategory(category.key)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between p-3 h-auto"
                            >
                              <span className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                <span className="font-medium">{category.label}</span>
                                {changeCount > 0 && (
                                  <Badge variant="secondary" className="text-xs h-5">
                                    {changeCount}
                                  </Badge>
                                )}
                              </span>
                              <ChevronDown className={cn(
                                "h-4 w-4 transition-transform",
                                openCategories[category.key] && "rotate-180"
                              )} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 pt-2">
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
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                </ScrollArea>
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
                    <p className={cn(
                      "text-lg font-bold",
                      currentInputs.monthlyRent >= currentMetrics.breakEvenRent ? "text-green-600" : "text-red-600"
                    )}>
                      {currentInputs.monthlyRent >= currentMetrics.breakEvenRent ? "+" : ""}
                      {formatCurrency(currentInputs.monthlyRent - currentMetrics.breakEvenRent)}/mo
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Viability Meter and Risk Indicator */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ViabilityMeter
                metrics={currentMetrics}
                baseMetrics={baseMetrics}
                inputs={currentInputs}
              />
              <RiskIndicator metrics={currentMetrics} inputs={currentInputs} />
            </div>

            {/* Charts with Tabs */}
            <Tabs value={activeChart} onValueChange={(v) => setActiveChart(v as typeof activeChart)}>
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="sensitivity" className="text-xs">Sensitivity</TabsTrigger>
                <TabsTrigger value="cashflow" className="text-xs">Projection</TabsTrigger>
                <TabsTrigger value="breakeven" className="text-xs">Break-even</TabsTrigger>
                <TabsTrigger value="waterfall" className="text-xs">Waterfall</TabsTrigger>
                <TabsTrigger value="comparison" className="text-xs">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="sensitivity">
                <SensitivityChart baseInputs={baseInputs} currentInputs={currentInputs} />
              </TabsContent>
              <TabsContent value="cashflow">
                <CashFlowProjectionChart inputs={currentInputs} />
              </TabsContent>
              <TabsContent value="breakeven">
                <BreakEvenChart inputs={currentInputs} />
              </TabsContent>
              <TabsContent value="waterfall">
                <WaterfallChart inputs={currentInputs} />
              </TabsContent>
              <TabsContent value="comparison">
                <ScenarioComparisonChart
                  baseMetrics={baseMetrics}
                  currentMetrics={currentMetrics}
                  variations={variations}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Save Dialog */}
        <SaveScenarioDialog
          open={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSaveVariation}
        />

        {/* Monte Carlo Dialog */}
        <MonteCarloDialog
          open={showMonteCarloDialog}
          onClose={() => setShowMonteCarloDialog(false)}
          baseInputs={currentInputs}
        />

        {/* Goal Seeker Dialog */}
        <GoalSeekerDialog
          open={showGoalSeekerDialog}
          onClose={() => setShowGoalSeekerDialog(false)}
          baseInputs={currentInputs}
          onApplyResult={(changes) => {
            Object.entries(changes).forEach(([key, value]) => {
              updateInput(key as keyof BTLInputs, value as number);
            });
            toast({
              title: "Goal values applied",
              description: "Sliders have been updated to meet your target.",
            });
          }}
        />
      </div>
    </AppLayout>
  );
}

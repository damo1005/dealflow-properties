import { useMemo } from "react";
import { Hammer, RefreshCw, Home, TrendingUp, Wallet, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { CurrencyInput } from "./CurrencyInput";
import { ResultCard } from "./ResultComponents";
import { useCalculatorStore, calculateBRRResults } from "@/stores/calculatorStore";

export function BRRCalculator() {
  const { brrInputs, setBRRInputs } = useCalculatorStore();

  const results = useMemo(() => calculateBRRResults(brrInputs), [brrInputs]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Timeline steps
  const timelineSteps = [
    { label: "Purchase", completed: true },
    { label: "Refurbishment", completed: true },
    { label: "Refinance", completed: results.cashOutAtRefinance > 0 },
    { label: "Rent", completed: results.monthlyCashFlow > 0 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inputs Panel */}
      <div className="space-y-6">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6 pr-4">
            <Accordion type="multiple" defaultValue={["stage1", "stage2", "rental"]} className="space-y-4">
              {/* Stage 1: Purchase & Refurb */}
              <AccordionItem value="stage1" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Hammer className="h-4 w-4 text-primary" />
                    <span className="font-medium">Stage 1: Purchase & Refurb</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="purchasePrice"
                    label="Purchase Price"
                    value={brrInputs.purchasePrice}
                    onChange={(v) => setBRRInputs({ purchasePrice: v })}
                  />

                  <CurrencyInput
                    id="refurbBudget"
                    label="Refurb Budget"
                    value={brrInputs.refurbBudget}
                    onChange={(v) => setBRRInputs({ refurbBudget: v })}
                  />

                  <CurrencyInput
                    id="refurbTimeline"
                    label="Refurb Timeline"
                    value={brrInputs.refurbTimeline}
                    onChange={(v) => setBRRInputs({ refurbTimeline: v })}
                    prefix=""
                    suffix="months"
                    showSlider
                    sliderMin={1}
                    sliderMax={12}
                    step={1}
                  />

                  <CurrencyInput
                    id="bridgingRate"
                    label="Bridging Rate (monthly)"
                    value={brrInputs.bridgingRate}
                    onChange={(v) => setBRRInputs({ bridgingRate: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={0.5}
                    sliderMax={1.5}
                    step={0.05}
                  />

                  <CurrencyInput
                    id="bridgingFee"
                    label="Bridging Arrangement Fee"
                    value={brrInputs.bridgingFee}
                    onChange={(v) => setBRRInputs({ bridgingFee: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={1}
                    sliderMax={3}
                    step={0.5}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Stage 2: Refinance */}
              <AccordionItem value="stage2" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    <span className="font-medium">Stage 2: Refinance</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="estimatedARV"
                    label="After Refurb Value (ARV)"
                    value={brrInputs.estimatedARV}
                    onChange={(v) => setBRRInputs({ estimatedARV: v })}
                  />

                  <CurrencyInput
                    id="newMortgageLTV"
                    label="New Mortgage LTV"
                    value={brrInputs.newMortgageLTV}
                    onChange={(v) => setBRRInputs({ newMortgageLTV: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={50}
                    sliderMax={80}
                    step={5}
                    description={`Mortgage: ${formatCurrency(brrInputs.estimatedARV * brrInputs.newMortgageLTV / 100)}`}
                  />

                  <CurrencyInput
                    id="newMortgageRate"
                    label="New Mortgage Rate"
                    value={brrInputs.newMortgageRate}
                    onChange={(v) => setBRRInputs({ newMortgageRate: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={3}
                    sliderMax={10}
                    step={0.25}
                  />

                  <CurrencyInput
                    id="newMortgageTerm"
                    label="Mortgage Term"
                    value={brrInputs.newMortgageTerm}
                    onChange={(v) => setBRRInputs({ newMortgageTerm: v })}
                    prefix=""
                    suffix="years"
                    showSlider
                    sliderMin={5}
                    sliderMax={35}
                    step={5}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Rental Income */}
              <AccordionItem value="rental" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="font-medium">After Refinance Rental</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="monthlyRent"
                    label="Monthly Rent"
                    value={brrInputs.monthlyRent}
                    onChange={(v) => setBRRInputs({ monthlyRent: v })}
                  />

                  <CurrencyInput
                    id="voidPercent"
                    label="Void Period"
                    value={brrInputs.voidPercent}
                    onChange={(v) => setBRRInputs({ voidPercent: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={0}
                    sliderMax={20}
                    step={1}
                  />

                  <CurrencyInput
                    id="managementFee"
                    label="Management Fee"
                    value={brrInputs.managementFee}
                    onChange={(v) => setBRRInputs({ managementFee: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={0}
                    sliderMax={15}
                    step={0.5}
                  />

                  <CurrencyInput
                    id="insurance"
                    label="Insurance (annual)"
                    value={brrInputs.insurance}
                    onChange={(v) => setBRRInputs({ insurance: v })}
                  />

                  <CurrencyInput
                    id="maintenancePercent"
                    label="Maintenance Reserve"
                    value={brrInputs.maintenancePercent}
                    onChange={(v) => setBRRInputs({ maintenancePercent: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={5}
                    sliderMax={20}
                    step={1}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </div>

      {/* Results Panel */}
      <div className="space-y-6">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6 pr-4">
            {/* Timeline */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  BRR Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  {timelineSteps.map((step, index) => (
                    <div key={step.label} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step.completed
                            ? "bg-success text-success-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs mt-1 text-muted-foreground">{step.label}</span>
                    </div>
                  ))}
                </div>
                <Progress value={(brrInputs.refurbTimeline / 12) * 100} className="h-2" />
                <p className="text-sm text-center mt-2 text-muted-foreground">
                  {brrInputs.refurbTimeline} month project timeline
                </p>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Cash Out at Refinance"
                    value={formatCurrency(results.cashOutAtRefinance)}
                    icon={<Wallet className="h-5 w-5" />}
                    trend={results.cashOutAtRefinance > 0 ? "positive" : "negative"}
                    size="large"
                  />
                  <ResultCard
                    title="Equity Gained"
                    value={formatCurrency(results.equityGained)}
                    icon={<TrendingUp className="h-5 w-5" />}
                    trend={results.equityGained > 0 ? "positive" : "negative"}
                    size="large"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Cash Left in Deal"
                    value={formatCurrency(Math.max(0, results.cashLeftInDeal))}
                    subtitle={results.cashLeftInDeal <= 0 ? "None left in!" : undefined}
                    trend={results.cashLeftInDeal <= 0 ? "positive" : "neutral"}
                  />
                  <ResultCard
                    title="Cash-on-Cash Return"
                    value={results.cashOnCashReturn === Infinity ? "∞" : `${results.cashOnCashReturn.toFixed(1)}%`}
                    subtitle="Annual return on cash invested"
                    trend={results.cashOnCashReturn > 15 ? "positive" : "neutral"}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Monthly Cash Flow"
                    value={formatCurrency(results.monthlyCashFlow)}
                    subtitle="After refinance"
                    trend={results.monthlyCashFlow > 0 ? "positive" : "negative"}
                  />
                  <ResultCard
                    title="Annual Cash Flow"
                    value={formatCurrency(results.annualCashFlow)}
                    trend={results.annualCashFlow > 0 ? "positive" : "negative"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cost Summary */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Project Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-medium">{formatCurrency(brrInputs.purchasePrice)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Refurb Budget</span>
                  <span className="font-medium">{formatCurrency(brrInputs.refurbBudget)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Bridging Costs</span>
                  <span className="font-medium">{formatCurrency(results.totalBridgingCosts)}</span>
                </div>
                <Separator />
                <div className="flex justify-between p-2 rounded bg-primary/10">
                  <span className="font-medium">Total Investment</span>
                  <span className="font-bold text-primary">{formatCurrency(results.totalInitialCost + results.totalBridgingCosts)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-success/10">
                  <span className="font-medium">After Refurb Value</span>
                  <span className="font-bold text-success">{formatCurrency(brrInputs.estimatedARV)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

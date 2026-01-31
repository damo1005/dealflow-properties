import { useMemo } from "react";
import { Hammer, DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { CurrencyInput } from "./CurrencyInput";
import { ResultCard } from "./ResultComponents";
import { useCalculatorStore, calculateFlipResults } from "@/stores/calculatorStore";

export function FlipCalculator() {
  const { flipInputs, setFlipInputs } = useCalculatorStore();

  const results = useMemo(() => calculateFlipResults(flipInputs), [flipInputs]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inputs Panel */}
      <div className="space-y-6">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6 pr-4">
            <Accordion type="multiple" defaultValue={["purchase", "finance", "sale"]} className="space-y-4">
              {/* Purchase & Refurb */}
              <AccordionItem value="purchase" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Hammer className="h-4 w-4 text-primary" />
                    <span className="font-medium">Purchase & Refurb</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="purchasePrice"
                    label="Purchase Price"
                    value={flipInputs.purchasePrice}
                    onChange={(v) => setFlipInputs({ purchasePrice: v })}
                  />

                  <CurrencyInput
                    id="refurbBudget"
                    label="Refurb Budget"
                    value={flipInputs.refurbBudget}
                    onChange={(v) => setFlipInputs({ refurbBudget: v })}
                  />

                  <CurrencyInput
                    id="refurbTimeline"
                    label="Project Timeline"
                    value={flipInputs.refurbTimeline}
                    onChange={(v) => setFlipInputs({ refurbTimeline: v })}
                    prefix=""
                    suffix="months"
                    showSlider
                    sliderMin={1}
                    sliderMax={12}
                    step={1}
                  />

                  <CurrencyInput
                    id="legalFees"
                    label="Legal Fees (buy + sell)"
                    value={flipInputs.legalFees}
                    onChange={(v) => setFlipInputs({ legalFees: v })}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Finance */}
              <AccordionItem value="finance" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="font-medium">Bridging Finance</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="bridgingRate"
                    label="Bridging Rate (monthly)"
                    value={flipInputs.bridgingRate}
                    onChange={(v) => setFlipInputs({ bridgingRate: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={0.5}
                    sliderMax={1.5}
                    step={0.05}
                  />

                  <CurrencyInput
                    id="bridgingFee"
                    label="Arrangement Fee"
                    value={flipInputs.bridgingFee}
                    onChange={(v) => setFlipInputs({ bridgingFee: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={1}
                    sliderMax={3}
                    step={0.5}
                  />

                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bridging Loan (70% LTV)</span>
                      <span className="font-medium">{formatCurrency(results.bridgingAmount)}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Sale */}
              <AccordionItem value="sale" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-medium">Sale</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="targetSalePrice"
                    label="Target Sale Price"
                    value={flipInputs.targetSalePrice}
                    onChange={(v) => setFlipInputs({ targetSalePrice: v })}
                  />

                  <CurrencyInput
                    id="estateAgentFee"
                    label="Estate Agent Fee"
                    value={flipInputs.estateAgentFee}
                    onChange={(v) => setFlipInputs({ estateAgentFee: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={0.5}
                    sliderMax={3}
                    step={0.25}
                    description={`£${Math.round(flipInputs.targetSalePrice * flipInputs.estateAgentFee / 100).toLocaleString()}`}
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
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Duration</span>
                    <span className="font-medium">{flipInputs.refurbTimeline} months</span>
                  </div>
                  <Progress value={(flipInputs.refurbTimeline / 12) * 100} className="h-3" />
                  <p className="text-sm text-muted-foreground text-center">
                    Monthly ROI: <span className="font-medium text-primary">{results.monthlyROI.toFixed(1)}%</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Profit Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Gross Profit"
                    value={formatCurrency(results.grossProfit)}
                    icon={<DollarSign className="h-5 w-5" />}
                    trend={results.grossProfit > 0 ? "positive" : "negative"}
                    size="large"
                  />
                  <ResultCard
                    title="ROI on Cash"
                    value={`${results.roiOnCash.toFixed(1)}%`}
                    icon={<TrendingUp className="h-5 w-5" />}
                    trend={results.roiOnCash >= 20 ? "positive" : results.roiOnCash >= 10 ? "neutral" : "negative"}
                    size="large"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Profit Margin"
                    value={`${results.profitMargin.toFixed(1)}%`}
                    subtitle="Of sale price"
                  />
                  <ResultCard
                    title="Cash Required"
                    value={formatCurrency(results.cashRequired)}
                    subtitle="Upfront investment"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Full Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-medium">{formatCurrency(flipInputs.purchasePrice)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Stamp Duty</span>
                  <span className="font-medium">{formatCurrency(results.stampDuty)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Refurb Budget</span>
                  <span className="font-medium">{formatCurrency(flipInputs.refurbBudget)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Bridging Interest</span>
                  <span className="font-medium">{formatCurrency(results.bridgingInterest)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Bridging Fee</span>
                  <span className="font-medium">{formatCurrency(results.bridgingFeeAmount)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Legal Fees</span>
                  <span className="font-medium">{formatCurrency(flipInputs.legalFees)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Estate Agent Fee</span>
                  <span className="font-medium">{formatCurrency(results.agentFee)}</span>
                </div>

                <Separator />

                <div className="flex justify-between p-2 rounded bg-destructive/10">
                  <span className="font-medium">Total Costs</span>
                  <span className="font-bold text-destructive">{formatCurrency(results.totalProjectCosts)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-primary/10">
                  <span className="font-medium">Sale Price</span>
                  <span className="font-bold text-primary">{formatCurrency(flipInputs.targetSalePrice)}</span>
                </div>
                <div className="flex justify-between p-3 rounded bg-success/10">
                  <span className="font-semibold">Net Profit</span>
                  <span className="font-bold text-success text-xl">{formatCurrency(results.grossProfit)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

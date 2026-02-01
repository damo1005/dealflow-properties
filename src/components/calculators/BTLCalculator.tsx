import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Home, PoundSterling, Wallet, TrendingUp, Percent, PiggyBank, BarChart3, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CurrencyInput } from "./CurrencyInput";
import { ResultCard, CostBreakdownChart, SensitivityTable } from "./ResultComponents";
import { useCalculatorStore, calculateBTLResults, calculateStampDuty, calculateMortgagePayment } from "@/stores/calculatorStore";
import { useMortgageStore } from "@/stores/mortgageStore";

export function BTLCalculator() {
  const navigate = useNavigate();
  const { btlInputs, setBTLInputs } = useCalculatorStore();
  const { setPropertyValue, setLoanAmount, setTermYears } = useMortgageStore();

  const results = useMemo(() => calculateBTLResults(btlInputs), [btlInputs]);

  const handleFindMortgages = () => {
    // Pre-fill mortgage comparison with calculator values
    setPropertyValue(btlInputs.purchasePrice);
    const loanAmount = btlInputs.purchasePrice * (1 - btlInputs.depositPercent / 100);
    setLoanAmount(loanAmount);
    setTermYears(btlInputs.mortgageTerm);
    navigate("/mortgages");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const costBreakdownData = [
    { name: "Mortgage", value: results.costBreakdown.mortgage, color: "hsl(var(--primary))" },
    { name: "Insurance", value: results.costBreakdown.insurance, color: "hsl(var(--secondary))" },
    { name: "Letting Agent", value: results.costBreakdown.lettingAgent, color: "hsl(var(--chart-3))" },
    { name: "Management", value: results.costBreakdown.management, color: "hsl(var(--chart-4))" },
    { name: "Maintenance", value: results.costBreakdown.maintenance, color: "hsl(var(--chart-5))" },
  ].filter(item => item.value > 0);

  const calculateCashFlowForSensitivity = (rent: number, rate: number) => {
    const newInputs = { ...btlInputs, monthlyRent: rent, mortgageRate: rate };
    const newResults = calculateBTLResults(newInputs);
    return newResults.monthlyCashFlow;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inputs Panel */}
      <div className="space-y-6">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6 pr-4">
            <Accordion type="multiple" defaultValue={["purchase", "rental", "costs"]} className="space-y-4">
              {/* Purchase Inputs */}
              <AccordionItem value="purchase" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="font-medium">Purchase Details</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="purchasePrice"
                    label="Property Price"
                    value={btlInputs.purchasePrice}
                    onChange={(v) => setBTLInputs({ purchasePrice: v })}
                  />
                  
                  <CurrencyInput
                    id="depositPercent"
                    label="Deposit"
                    value={btlInputs.depositPercent}
                    onChange={(v) => setBTLInputs({ depositPercent: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={15}
                    sliderMax={50}
                    step={5}
                    description={`£${(btlInputs.purchasePrice * btlInputs.depositPercent / 100).toLocaleString()}`}
                  />

                  <CurrencyInput
                    id="mortgageRate"
                    label="Mortgage Rate"
                    value={btlInputs.mortgageRate}
                    onChange={(v) => setBTLInputs({ mortgageRate: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={2}
                    sliderMax={10}
                    step={0.25}
                  />

                  <CurrencyInput
                    id="mortgageTerm"
                    label="Mortgage Term (years)"
                    value={btlInputs.mortgageTerm}
                    onChange={(v) => setBTLInputs({ mortgageTerm: v })}
                    prefix=""
                    suffix="yrs"
                    showSlider
                    sliderMin={5}
                    sliderMax={35}
                    step={5}
                  />

                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stamp Duty (auto)</span>
                      <span className="font-medium">{formatCurrency(results.stampDuty)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <CurrencyInput
                      id="legalFees"
                      label="Legal Fees"
                      value={btlInputs.legalFees}
                      onChange={(v) => setBTLInputs({ legalFees: v })}
                    />
                    <CurrencyInput
                      id="surveyFees"
                      label="Survey"
                      value={btlInputs.surveyFees}
                      onChange={(v) => setBTLInputs({ surveyFees: v })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <CurrencyInput
                      id="brokerFees"
                      label="Broker Fees"
                      value={btlInputs.brokerFees}
                      onChange={(v) => setBTLInputs({ brokerFees: v })}
                    />
                    <CurrencyInput
                      id="refurbCosts"
                      label="Refurb"
                      value={btlInputs.refurbCosts}
                      onChange={(v) => setBTLInputs({ refurbCosts: v })}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Rental Income */}
              <AccordionItem value="rental" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <PoundSterling className="h-4 w-4 text-primary" />
                    <span className="font-medium">Rental Income</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="monthlyRent"
                    label="Monthly Rent"
                    value={btlInputs.monthlyRent}
                    onChange={(v) => setBTLInputs({ monthlyRent: v })}
                  />

                  <CurrencyInput
                    id="voidPercent"
                    label="Void Period"
                    value={btlInputs.voidPercent}
                    onChange={(v) => setBTLInputs({ voidPercent: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={0}
                    sliderMax={20}
                    step={1}
                    description="Expected vacancy rate per year"
                  />

                  <CurrencyInput
                    id="lettingAgentFee"
                    label="Letting Agent Fee"
                    value={btlInputs.lettingAgentFee}
                    onChange={(v) => setBTLInputs({ lettingAgentFee: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={0}
                    sliderMax={15}
                    step={0.5}
                  />

                  <CurrencyInput
                    id="managementFee"
                    label="Management Fee"
                    value={btlInputs.managementFee}
                    onChange={(v) => setBTLInputs({ managementFee: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={0}
                    sliderMax={15}
                    step={0.5}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Ongoing Costs */}
              <AccordionItem value="costs" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="font-medium">Ongoing Costs</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Mortgage (auto)</span>
                      <span className="font-medium">{formatCurrency(results.monthlyMortgage)}</span>
                    </div>
                  </div>

                  <CurrencyInput
                    id="insurance"
                    label="Insurance (annual)"
                    value={btlInputs.insurance}
                    onChange={(v) => setBTLInputs({ insurance: v })}
                  />

                  <CurrencyInput
                    id="maintenancePercent"
                    label="Maintenance Reserve"
                    value={btlInputs.maintenancePercent}
                    onChange={(v) => setBTLInputs({ maintenancePercent: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={5}
                    sliderMax={20}
                    step={1}
                    description="% of rental income for repairs"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <CurrencyInput
                      id="serviceCharge"
                      label="Service Charge"
                      value={btlInputs.serviceCharge}
                      onChange={(v) => setBTLInputs({ serviceCharge: v })}
                      description="Annual (if leasehold)"
                    />
                    <CurrencyInput
                      id="groundRent"
                      label="Ground Rent"
                      value={btlInputs.groundRent}
                      onChange={(v) => setBTLInputs({ groundRent: v })}
                      description="Annual (if leasehold)"
                    />
                  </div>
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
            {/* Key Metrics */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Net Rental Yield"
                    value={`${results.netYield.toFixed(2)}%`}
                    icon={<Percent className="h-5 w-5" />}
                    trend={results.netYield >= 5 ? "positive" : results.netYield >= 3 ? "neutral" : "negative"}
                    size="large"
                  />
                  <ResultCard
                    title="ROI"
                    value={`${results.roi.toFixed(2)}%`}
                    icon={<TrendingUp className="h-5 w-5" />}
                    trend={results.roi >= 8 ? "positive" : results.roi >= 5 ? "neutral" : "negative"}
                    size="large"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Monthly Cash Flow"
                    value={formatCurrency(results.monthlyCashFlow)}
                    trend={results.monthlyCashFlow > 0 ? "positive" : "negative"}
                  />
                  <ResultCard
                    title="Annual Cash Flow"
                    value={formatCurrency(results.annualCashFlow)}
                    trend={results.annualCashFlow > 0 ? "positive" : "negative"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Gross Yield"
                    value={`${results.grossYield.toFixed(2)}%`}
                    icon={<BarChart3 className="h-5 w-5" />}
                  />
                  <ResultCard
                    title="Break-even Occupancy"
                    value={`${Math.min(results.breakEvenOccupancy, 100).toFixed(1)}%`}
                    icon={<PiggyBank className="h-5 w-5" />}
                  />
                </div>

                <Separator />

                <ResultCard
                  title="Total Cash Required"
                  value={formatCurrency(results.totalCashRequired)}
                  subtitle={`Deposit: ${formatCurrency(results.depositAmount)} + Stamp Duty: ${formatCurrency(results.stampDuty)} + Fees`}
                  size="large"
                />

                {/* Find Mortgages Button */}
                <Button 
                  onClick={handleFindMortgages} 
                  variant="outline" 
                  className="w-full gap-2"
                >
                  <Search className="h-4 w-4" />
                  Find Mortgages at {btlInputs.mortgageRate}% or better
                </Button>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Annual Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <CostBreakdownChart data={costBreakdownData} total={results.totalAnnualCosts} />
              </CardContent>
            </Card>

            {/* Sensitivity Analysis */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Sensitivity Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">Monthly cash flow at different rent/rate scenarios</p>
              </CardHeader>
              <CardContent>
                <SensitivityTable
                  baseRent={btlInputs.monthlyRent}
                  baseRate={btlInputs.mortgageRate}
                  calculateCashFlow={calculateCashFlowForSensitivity}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

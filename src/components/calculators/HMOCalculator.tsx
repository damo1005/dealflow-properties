import { useMemo, useState } from "react";
import { Users, Home, Wallet, TrendingUp, Plus, Minus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CurrencyInput } from "./CurrencyInput";
import { ResultCard } from "./ResultComponents";
import { useCalculatorStore, calculateHMOResults } from "@/stores/calculatorStore";
import { cn } from "@/lib/utils";

export function HMOCalculator() {
  const { hmoInputs, setHMOInputs } = useCalculatorStore();

  const results = useMemo(() => calculateHMOResults(hmoInputs), [hmoInputs]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleRoomCountChange = (count: number) => {
    const newCount = Math.max(1, Math.min(10, count));
    const newRoomRents = [...hmoInputs.roomRents];
    
    while (newRoomRents.length < newCount) {
      newRoomRents.push(550);
    }
    while (newRoomRents.length > newCount) {
      newRoomRents.pop();
    }
    
    setHMOInputs({ numberOfRooms: newCount, roomRents: newRoomRents });
  };

  const handleRoomRentChange = (index: number, rent: number) => {
    const newRoomRents = [...hmoInputs.roomRents];
    newRoomRents[index] = rent;
    setHMOInputs({ roomRents: newRoomRents });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inputs Panel */}
      <div className="space-y-6">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6 pr-4">
            <Accordion type="multiple" defaultValue={["property", "rooms", "costs"]} className="space-y-4">
              {/* Property Inputs */}
              <AccordionItem value="property" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="font-medium">Property Details</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="purchasePrice"
                    label="Purchase Price"
                    value={hmoInputs.purchasePrice}
                    onChange={(v) => setHMOInputs({ purchasePrice: v })}
                  />

                  <CurrencyInput
                    id="refurbCosts"
                    label="Refurb Costs"
                    value={hmoInputs.refurbCosts}
                    onChange={(v) => setHMOInputs({ refurbCosts: v })}
                  />

                  <CurrencyInput
                    id="conversionCosts"
                    label="HMO Conversion Costs"
                    value={hmoInputs.conversionCosts}
                    onChange={(v) => setHMOInputs({ conversionCosts: v })}
                    description="Fire doors, en-suites, additional kitchens, etc."
                  />

                  <CurrencyInput
                    id="licensingFees"
                    label="Licensing Fees"
                    value={hmoInputs.licensingFees}
                    onChange={(v) => setHMOInputs({ licensingFees: v })}
                    description="HMO license application fee"
                  />

                  <CurrencyInput
                    id="depositPercent"
                    label="Deposit"
                    value={hmoInputs.depositPercent}
                    onChange={(v) => setHMOInputs({ depositPercent: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={20}
                    sliderMax={50}
                    step={5}
                    description={`£${(hmoInputs.purchasePrice * hmoInputs.depositPercent / 100).toLocaleString()}`}
                  />

                  <CurrencyInput
                    id="mortgageRate"
                    label="Mortgage Rate"
                    value={hmoInputs.mortgageRate}
                    onChange={(v) => setHMOInputs({ mortgageRate: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={3}
                    sliderMax={10}
                    step={0.25}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Room Income */}
              <AccordionItem value="rooms" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">Room Income</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <div className="flex items-center justify-between">
                    <Label>Number of Rooms</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRoomCountChange(hmoInputs.numberOfRooms - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{hmoInputs.numberOfRooms}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRoomCountChange(hmoInputs.numberOfRooms + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {hmoInputs.roomRents.map((rent, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Label className="w-20 shrink-0">Room {index + 1}</Label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                          <Input
                            type="number"
                            value={rent}
                            onChange={(e) => handleRoomRentChange(index, parseInt(e.target.value) || 0)}
                            className="pl-7"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-primary/10">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Monthly Rent</span>
                      <span className="font-bold text-primary">{formatCurrency(results.totalMonthlyRent)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="billsIncluded">Bills Included</Label>
                      <p className="text-xs text-muted-foreground">Include utilities in rent?</p>
                    </div>
                    <Switch
                      id="billsIncluded"
                      checked={hmoInputs.billsIncluded}
                      onCheckedChange={(checked) => setHMOInputs({ billsIncluded: checked })}
                    />
                  </div>

                  {hmoInputs.billsIncluded && (
                    <CurrencyInput
                      id="utilityCosts"
                      label="Monthly Utility Costs"
                      value={hmoInputs.utilityCosts}
                      onChange={(v) => setHMOInputs({ utilityCosts: v })}
                      description="Gas, electric, water, internet"
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* HMO-Specific Costs */}
              <AccordionItem value="costs" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="font-medium">HMO Costs</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <CurrencyInput
                    id="managementFee"
                    label="Management Fee"
                    value={hmoInputs.managementFee}
                    onChange={(v) => setHMOInputs({ managementFee: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={10}
                    sliderMax={25}
                    step={1}
                    description="HMO management is typically higher than BTL"
                  />

                  <CurrencyInput
                    id="insurance"
                    label="Landlord Insurance (annual)"
                    value={hmoInputs.insurance}
                    onChange={(v) => setHMOInputs({ insurance: v })}
                    description="HMO-specific policy"
                  />

                  <CurrencyInput
                    id="safetyCertificates"
                    label="Safety Certificates (annual)"
                    value={hmoInputs.safetyCertificates}
                    onChange={(v) => setHMOInputs({ safetyCertificates: v })}
                    description="Gas, electrical, fire safety"
                  />

                  <CurrencyInput
                    id="maintenanceReserve"
                    label="Maintenance Reserve"
                    value={hmoInputs.maintenanceReserve}
                    onChange={(v) => setHMOInputs({ maintenanceReserve: v })}
                    prefix=""
                    suffix="%"
                    showSlider
                    sliderMin={8}
                    sliderMax={20}
                    step={1}
                    description="% of rent for repairs (higher wear in HMOs)"
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
            {/* Key Metrics */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Net Yield"
                    value={`${results.netYield.toFixed(2)}%`}
                    icon={<TrendingUp className="h-5 w-5" />}
                    trend={results.netYield >= 8 ? "positive" : results.netYield >= 5 ? "neutral" : "negative"}
                    size="large"
                  />
                  <ResultCard
                    title="ROI"
                    value={`${results.roi.toFixed(2)}%`}
                    icon={<TrendingUp className="h-5 w-5" />}
                    trend={results.roi >= 12 ? "positive" : results.roi >= 8 ? "neutral" : "negative"}
                    size="large"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title="Monthly Profit"
                    value={formatCurrency(results.monthlyProfit)}
                    trend={results.monthlyProfit > 0 ? "positive" : "negative"}
                  />
                  <ResultCard
                    title="Annual Cash Flow"
                    value={formatCurrency(results.annualCashFlow)}
                    trend={results.annualCashFlow > 0 ? "positive" : "negative"}
                  />
                </div>

                <ResultCard
                  title="Total Cash Required"
                  value={formatCurrency(results.totalCashRequired)}
                  subtitle={`Deposit + Stamp Duty + Refurb + Conversion + Licensing`}
                  size="large"
                />
              </CardContent>
            </Card>

            {/* HMO vs BTL Comparison */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  HMO vs BTL Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <p className="text-sm text-muted-foreground mb-1">HMO Monthly</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(results.btlComparison.hmoMonthlyProfit)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">BTL Monthly</p>
                    <p className="text-xl font-bold text-muted-foreground">
                      {formatCurrency(results.btlComparison.btlMonthlyProfit)}
                    </p>
                  </div>
                  <div className={cn(
                    "p-4 rounded-lg",
                    results.btlComparison.difference > 0 ? "bg-success/10" : "bg-destructive/10"
                  )}>
                    <p className="text-sm text-muted-foreground mb-1">Difference</p>
                    <p className={cn(
                      "text-xl font-bold",
                      results.btlComparison.difference > 0 ? "text-success" : "text-destructive"
                    )}>
                      {results.btlComparison.difference > 0 ? "+" : ""}
                      {formatCurrency(results.btlComparison.difference)}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Converting to HMO generates{" "}
                    <span className={cn(
                      "font-medium",
                      results.btlComparison.difference > 0 ? "text-success" : "text-destructive"
                    )}>
                      {formatCurrency(Math.abs(results.btlComparison.difference * 12))}
                    </span>{" "}
                    {results.btlComparison.difference > 0 ? "more" : "less"} per year than a single let.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Room Breakdown */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Room Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {hmoInputs.roomRents.map((rent, index) => (
                  <div key={index} className="flex justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Room {index + 1}</span>
                    <span className="font-medium">{formatCurrency(rent)}/month</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between p-2 rounded bg-primary/10">
                  <span className="font-medium">Total Monthly Rent</span>
                  <span className="font-bold text-primary">{formatCurrency(results.totalMonthlyRent)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-success/10">
                  <span className="font-medium">Annual Gross Rent</span>
                  <span className="font-bold text-success">{formatCurrency(results.annualGrossRent)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

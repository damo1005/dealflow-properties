import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import {
  Calculator,
  Home,
  Wallet,
  ChevronDown,
  Save,
  FileText,
  Lightbulb,
  AlertTriangle,
  Building2,
  Info,
  Minus,
} from "lucide-react";
import { calculateRentalIncomeTax, RentalIncomeTaxInput } from "@/lib/taxCalculations";
import { CurrencyInput } from "./CurrencyInput";
import { toast } from "sonner";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function IncomeTaxCalculator() {
  // Rental income
  const [annualRent, setAnnualRent] = useState<number>(24000);
  const [otherRentalIncome, setOtherRentalIncome] = useState<number>(0);
  const [voidMonths, setVoidMonths] = useState<number>(0);

  // Expenses
  const [lettingAgentFees, setLettingAgentFees] = useState<number>(2400);
  const [repairsMaintenance, setRepairsMaintenance] = useState<number>(1000);
  const [insurance, setInsurance] = useState<number>(300);
  const [groundRent, setGroundRent] = useState<number>(300);
  const [utilities, setUtilities] = useState<number>(0);
  const [councilTax, setCouncilTax] = useState<number>(0);
  const [legalFees, setLegalFees] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);

  // Mortgage
  const [mortgageInterest, setMortgageInterest] = useState<number>(10000);

  // Other income
  const [employmentIncome, setEmploymentIncome] = useState<number>(45000);
  const [selfEmploymentIncome, setSelfEmploymentIncome] = useState<number>(0);
  const [dividends, setDividends] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);

  // Personal
  const [personalAllowanceUsed, setPersonalAllowanceUsed] = useState<number>(12570);
  const [isScottish, setIsScottish] = useState(false);

  const [showExpenses, setShowExpenses] = useState(true);

  const totalExpenses = lettingAgentFees + repairsMaintenance + insurance + groundRent + utilities + councilTax + legalFees + otherCosts;
  const totalOtherIncome = employmentIncome + selfEmploymentIncome + dividends + otherIncome;

  const input: RentalIncomeTaxInput = {
    annualRent,
    otherRentalIncome,
    voidMonths,
    lettingAgentFees,
    repairsMaintenance,
    insurance,
    groundRent,
    utilities,
    councilTax,
    legalFees,
    otherCosts,
    mortgageInterest,
    employmentIncome,
    selfEmploymentIncome,
    dividends,
    otherIncome,
    personalAllowanceUsed,
    isScottish,
  };

  const result = useMemo(() => calculateRentalIncomeTax(input), [input]);

  const handleSave = () => {
    toast.success("Income tax calculation saved successfully");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Side - Inputs */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Income Tax on Rental Income
            </CardTitle>
            <CardDescription>
              Calculate tax on your buy-to-let rental profits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rental Income */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Home className="h-4 w-4" />
                Rental Income
              </h4>

              <div className="space-y-2">
                <Label>Annual Rent Received</Label>
                <CurrencyInput
                  value={annualRent}
                  onChange={setAnnualRent}
                  placeholder="Annual rent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Other Rental Income</Label>
                  <CurrencyInput
                    value={otherRentalIncome}
                    onChange={setOtherRentalIncome}
                    placeholder="Parking, storage"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Void Months/Year</Label>
                  <Input
                    type="number"
                    value={voidMonths}
                    onChange={(e) => setVoidMonths(parseInt(e.target.value) || 0)}
                    min={0}
                    max={12}
                  />
                </div>
              </div>

              {voidMonths > 0 && (
                <div className="p-2 bg-muted/50 rounded text-sm">
                  Adjusted Income: {formatCurrency(annualRent + otherRentalIncome - (annualRent * voidMonths) / 12)}
                </div>
              )}
            </div>

            {/* Allowable Expenses */}
            <Collapsible open={showExpenses} onOpenChange={setShowExpenses}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between py-6 border-t">
                  <span className="flex items-center gap-2 font-medium">
                    <Minus className="h-4 w-4" />
                    Allowable Expenses
                    <Badge variant="secondary">{formatCurrency(totalExpenses)}</Badge>
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showExpenses ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Letting Agent Fees</Label>
                    <CurrencyInput value={lettingAgentFees} onChange={setLettingAgentFees} />
                  </div>
                  <div className="space-y-2">
                    <Label>Repairs & Maintenance</Label>
                    <CurrencyInput value={repairsMaintenance} onChange={setRepairsMaintenance} />
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance</Label>
                    <CurrencyInput value={insurance} onChange={setInsurance} />
                  </div>
                  <div className="space-y-2">
                    <Label>Ground Rent/Service</Label>
                    <CurrencyInput value={groundRent} onChange={setGroundRent} />
                  </div>
                  <div className="space-y-2">
                    <Label>Utilities (if you pay)</Label>
                    <CurrencyInput value={utilities} onChange={setUtilities} />
                  </div>
                  <div className="space-y-2">
                    <Label>Council Tax (if you pay)</Label>
                    <CurrencyInput value={councilTax} onChange={setCouncilTax} />
                  </div>
                  <div className="space-y-2">
                    <Label>Legal & Professional</Label>
                    <CurrencyInput value={legalFees} onChange={setLegalFees} />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Allowable Costs</Label>
                    <CurrencyInput value={otherCosts} onChange={setOtherCosts} />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Only repairs & maintenance count - not improvements. Mortgage interest is handled separately under Section 24.</span>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Mortgage Interest */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Building2 className="h-4 w-4" />
                Mortgage Interest
              </h4>

              <div className="space-y-2">
                <Label>Annual Mortgage Interest</Label>
                <CurrencyInput
                  value={mortgageInterest}
                  onChange={setMortgageInterest}
                  placeholder="Annual interest only"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Section 24 Restriction:</strong> Mortgage interest is no longer deductible. 
                    You only receive a 20% tax credit.
                  </div>
                </div>
              </div>
            </div>

            {/* Other Income */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Wallet className="h-4 w-4" />
                Your Other Income
                <Badge variant="secondary">{formatCurrency(totalOtherIncome)}</Badge>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employment/Pension</Label>
                  <CurrencyInput value={employmentIncome} onChange={setEmploymentIncome} />
                </div>
                <div className="space-y-2">
                  <Label>Self-Employment</Label>
                  <CurrencyInput value={selfEmploymentIncome} onChange={setSelfEmploymentIncome} />
                </div>
                <div className="space-y-2">
                  <Label>Dividends</Label>
                  <CurrencyInput value={dividends} onChange={setDividends} />
                </div>
                <div className="space-y-2">
                  <Label>Other Income</Label>
                  <CurrencyInput value={otherIncome} onChange={setOtherIncome} />
                </div>
              </div>
            </div>

            {/* Personal Circumstances */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Personal Circumstances
              </h4>

              <div className="space-y-2">
                <Label>Personal Allowance Used</Label>
                <CurrencyInput
                  value={personalAllowanceUsed}
                  onChange={setPersonalAllowanceUsed}
                  placeholder="Usually £12,570"
                />
                <p className="text-xs text-muted-foreground">From employment/pension income</p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="scottish" className="cursor-pointer">Scottish taxpayer?</Label>
                <Switch
                  id="scottish"
                  checked={isScottish}
                  onCheckedChange={setIsScottish}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Results */}
      <div className="space-y-6">
        {/* Main Result Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Your Income Tax</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total */}
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(result.taxOnRentalPortion)}
              </p>
              <p className="text-muted-foreground mt-1">
                Tax on rental income portion
              </p>
              <p className="text-sm text-muted-foreground">
                Effective Rate: {result.effectiveRate.toFixed(1)}%
              </p>
            </div>

            {/* Rental Calculation */}
            <div className="space-y-3">
              <h4 className="font-medium">Rental Calculation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Rental Income</span>
                  <span className="font-medium">{formatCurrency(result.grossRentalIncome)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Less: Allowable Expenses</span>
                  <span>-{formatCurrency(result.totalExpenses)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Rental Profit (excl. mortgage)</span>
                  <span>{formatCurrency(result.rentalProfitBeforeMortgage)}</span>
                </div>
              </div>
            </div>

            {/* Section 24 */}
            {mortgageInterest > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Section 24 Restriction</h4>
                <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <div className="flex justify-between">
                    <span>Mortgage Interest</span>
                    <span>{formatCurrency(result.mortgageInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Relief @ 20%</span>
                    <span className="text-green-600">-{formatCurrency(result.financeCostRelief)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium">Tax Calculation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Income</span>
                  <span>{formatCurrency(result.totalIncome)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Personal Allowance</span>
                  <span>-{formatCurrency(result.personalAllowance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Income</span>
                  <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
                </div>
              </div>

              {/* Tax Bands */}
              <div className="space-y-1 text-sm bg-muted/50 rounded p-2">
                {result.taxBands.map((band, i) => (
                  <div key={i} className="flex justify-between text-muted-foreground">
                    <span>{band.name} ({formatCurrency(band.amount)} @ {band.rate}%)</span>
                    <span>{formatCurrency(band.tax)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t pt-2">
                <div className="flex justify-between">
                  <span>Total Income Tax</span>
                  <span>{formatCurrency(result.totalIncomeTax)}</span>
                </div>
                {result.financeCostRelief > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Less: Finance Cost Relief</span>
                    <span>-{formatCurrency(result.financeCostRelief)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Tax After Relief</span>
                  <span>{formatCurrency(result.taxAfterRelief)}</span>
                </div>
                <div className="flex justify-between font-semibold text-primary">
                  <span>Tax on Rental Portion</span>
                  <span>{formatCurrency(result.taxOnRentalPortion)}</span>
                </div>
              </div>
            </div>

            {/* Section 24 Impact */}
            {result.section24Impact > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Section 24 Impact
                </h4>
                <div className="space-y-1 text-sm text-red-700 dark:text-red-300">
                  <div className="flex justify-between">
                    <span>Pre-2017 tax (mortgage deductible)</span>
                    <span>{formatCurrency(result.preSection24Tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current tax</span>
                    <span>{formatCurrency(result.taxOnRentalPortion)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-red-200 dark:border-red-800 pt-1">
                    <span>Extra Tax Per Year</span>
                    <span>{formatCurrency(result.section24Impact)}</span>
                  </div>
                  <p className="text-xs mt-2">
                    Over 10 years: {formatCurrency(result.section24Impact * 10)} extra! 😱
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Tax Planning Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.taxBands.some(b => b.rate >= 40) && (
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                  <span className="font-medium text-sm">💡 You're in Higher Rate Band</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                  Consider: Transfer property to spouse in basic rate, incorporate into Ltd company, 
                  or make pension contributions to reduce taxable income.
                </CollapsibleContent>
              </Collapsible>
            )}

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                <span className="font-medium text-sm">💡 Commonly Missed Expenses</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Accountancy fees</li>
                  <li>Landlord association fees</li>
                  <li>Mileage to property (45p/mile)</li>
                  <li>Phone & broadband (business portion)</li>
                  <li>Home office costs</li>
                  <li>Bank charges on business accounts</li>
                </ul>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                <span className="font-medium text-sm">⚠️ Section 24 Mitigation</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                Section 24 hits higher rate taxpayers hardest. Options include:
                incorporating your portfolio, transferring to a spouse in lower band,
                or paying down mortgage to reduce interest costs.
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

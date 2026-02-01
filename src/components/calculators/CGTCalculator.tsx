import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Calculator,
  Home,
  Calendar,
  Wallet,
  ChevronDown,
  Save,
  FileText,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  Info,
} from "lucide-react";
import { calculateCGT, CGTInput } from "@/lib/taxCalculations";
import { CurrencyInput } from "./CurrencyInput";
import { toast } from "sonner";
import { format, differenceInMonths } from "date-fns";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function CGTCalculator() {
  // Purchase details
  const [purchasePrice, setPurchasePrice] = useState<number>(250000);
  const [purchaseCosts, setPurchaseCosts] = useState<number>(7500);
  const [purchaseDate, setPurchaseDate] = useState<string>("2018-06-15");
  
  // Sale details
  const [salePrice, setSalePrice] = useState<number>(450000);
  const [saleCosts, setSaleCosts] = useState<number>(7500);
  const [saleDate, setSaleDate] = useState<string>("2026-03-15");
  
  // Improvements
  const [improvementCosts, setImprovementCosts] = useState<number>(25000);
  
  // Ownership
  const [yearsLivedIn, setYearsLivedIn] = useState<number>(0);
  const [monthsLivedIn, setMonthsLivedIn] = useState<number>(0);
  const [wasMainResidence, setWasMainResidence] = useState<"never" | "entire" | "partial">("never");
  
  // Tax situation
  const [annualIncome, setAnnualIncome] = useState<number>(60000);
  const [taxBand, setTaxBand] = useState<"basic" | "higher" | "additional">("higher");
  const [allowanceUsed, setAllowanceUsed] = useState<number>(0);
  const [ownershipSplit, setOwnershipSplit] = useState<number>(100);
  const [ownershipType, setOwnershipType] = useState<"sole" | "joint" | "custom">("sole");

  // Calculate total ownership months
  const totalOwnershipMonths = useMemo(() => {
    const purchase = new Date(purchaseDate);
    const sale = new Date(saleDate);
    return differenceInMonths(sale, purchase);
  }, [purchaseDate, saleDate]);

  const totalMonthsLivedIn = yearsLivedIn * 12 + monthsLivedIn;

  const input: CGTInput = {
    purchasePrice,
    purchaseCosts,
    purchaseDate: new Date(purchaseDate),
    salePrice,
    saleCosts,
    saleDate: new Date(saleDate),
    improvementCosts,
    monthsLivedIn: totalMonthsLivedIn,
    totalOwnershipMonths,
    wasMainResidence,
    annualIncome,
    taxBand,
    allowanceUsed,
    ownershipSplit: ownershipType === "sole" ? 100 : ownershipType === "joint" ? 50 : ownershipSplit,
  };

  const result = useMemo(() => calculateCGT(input), [input]);

  const handleSave = () => {
    toast.success("CGT calculation saved successfully");
  };

  const ownershipYears = Math.floor(totalOwnershipMonths / 12);
  const ownershipRemainingMonths = totalOwnershipMonths % 12;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Side - Inputs */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Capital Gains Tax Calculator
            </CardTitle>
            <CardDescription>
              Calculate CGT when selling your investment property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purchase Details */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Home className="h-4 w-4" />
                Purchase Details
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Original Purchase Price</Label>
                  <CurrencyInput
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                    placeholder="Purchase price"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Costs</Label>
                  <CurrencyInput
                    value={purchaseCosts}
                    onChange={setPurchaseCosts}
                    placeholder="SDLT, legal fees, etc."
                  />
                  <p className="text-xs text-muted-foreground">SDLT, legal fees, surveys</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Purchase Date
                </Label>
                <Input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
            </div>

            {/* Improvements */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <TrendingUp className="h-4 w-4" />
                Improvements
              </h4>
              
              <div className="space-y-2">
                <Label>Enhancement Costs</Label>
                <CurrencyInput
                  value={improvementCosts}
                  onChange={setImprovementCosts}
                  placeholder="Extensions, loft conversions"
                />
                <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5" />
                  <span>Only improvements that add value count (extensions, loft conversions). Repairs and maintenance don't qualify.</span>
                </div>
              </div>
            </div>

            {/* Sale Details */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Wallet className="h-4 w-4" />
                Sale Details
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sale Price</Label>
                  <CurrencyInput
                    value={salePrice}
                    onChange={setSalePrice}
                    placeholder="Sale price"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sale Costs</Label>
                  <CurrencyInput
                    value={saleCosts}
                    onChange={setSaleCosts}
                    placeholder="Agent fees, legal, etc."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Sale Date
                </Label>
                <Input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
              </div>
            </div>

            {/* Ownership Details */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Users className="h-4 w-4" />
                Ownership Details
              </h4>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Ownership Period</span>
                  <span className="font-medium">
                    {ownershipYears} years {ownershipRemainingMonths} months
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Was this ever your main residence?</Label>
                <RadioGroup
                  value={wasMainResidence}
                  onValueChange={(v) => setWasMainResidence(v as typeof wasMainResidence)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="entire" id="res-entire" />
                    <Label htmlFor="res-entire" className="cursor-pointer">Yes (entire period)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partial" id="res-partial" />
                    <Label htmlFor="res-partial" className="cursor-pointer">Yes (part of the time)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="res-never" />
                    <Label htmlFor="res-never" className="cursor-pointer">No (always rented out)</Label>
                  </div>
                </RadioGroup>
              </div>

              {wasMainResidence === "partial" && (
                <div className="space-y-2">
                  <Label>How long did you live there?</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={yearsLivedIn}
                        onChange={(e) => setYearsLivedIn(parseInt(e.target.value) || 0)}
                        min={0}
                        placeholder="Years"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Years</p>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={monthsLivedIn}
                        onChange={(e) => setMonthsLivedIn(parseInt(e.target.value) || 0)}
                        min={0}
                        max={11}
                        placeholder="Months"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Months</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Ownership Type</Label>
                <RadioGroup
                  value={ownershipType}
                  onValueChange={(v) => setOwnershipType(v as typeof ownershipType)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sole" id="own-sole" />
                    <Label htmlFor="own-sole" className="cursor-pointer">Sole ownership (100%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="joint" id="own-joint" />
                    <Label htmlFor="own-joint" className="cursor-pointer">Joint ownership (50/50)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="own-custom" />
                    <Label htmlFor="own-custom" className="cursor-pointer">Custom split</Label>
                  </div>
                </RadioGroup>
                {ownershipType === "custom" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Your share:</span>
                    <Input
                      type="number"
                      value={ownershipSplit}
                      onChange={(e) => setOwnershipSplit(parseInt(e.target.value) || 0)}
                      min={1}
                      max={99}
                      className="w-20"
                    />
                    <span className="text-sm">%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tax Situation */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Wallet className="h-4 w-4" />
                Your Tax Situation
              </h4>
              
              <div className="space-y-2">
                <Label>Your Annual Income</Label>
                <CurrencyInput
                  value={annualIncome}
                  onChange={setAnnualIncome}
                  placeholder="Annual income"
                />
              </div>

              <div className="space-y-2">
                <Label>Tax Band</Label>
                <RadioGroup
                  value={taxBand}
                  onValueChange={(v) => setTaxBand(v as typeof taxBand)}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="basic" id="band-basic" />
                    <Label htmlFor="band-basic" className="cursor-pointer">Basic (18%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="higher" id="band-higher" />
                    <Label htmlFor="band-higher" className="cursor-pointer">Higher (24%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="additional" id="band-additional" />
                    <Label htmlFor="band-additional" className="cursor-pointer">Additional (24%)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>CGT Annual Allowance Already Used</Label>
                <CurrencyInput
                  value={allowanceUsed}
                  onChange={setAllowanceUsed}
                  placeholder="From other gains this year"
                />
                <p className="text-xs text-muted-foreground">From other capital gains this tax year</p>
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
            <CardTitle>Your Capital Gains Tax</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total */}
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(result.yourShare)}
              </p>
              <p className="text-muted-foreground mt-1">
                {ownershipType !== "sole" && (
                  <span className="block">Your share ({ownershipType === "joint" ? "50" : ownershipSplit}%)</span>
                )}
                Effective Rate: {result.effectiveRate.toFixed(2)}%
              </p>
            </div>

            {/* Deadlines */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium">Report by</span>
                </div>
                <p className="font-semibold text-amber-800 dark:text-amber-200 mt-1">
                  {format(result.reportingDeadline, "d MMM yyyy")}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">60 days from sale</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-medium">Pay by</span>
                </div>
                <p className="font-semibold text-red-800 dark:text-red-200 mt-1">
                  {format(result.paymentDeadline, "d MMM yyyy")}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">Deadline</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium">Calculation Breakdown</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sale Price</span>
                  <span className="font-medium">{formatCurrency(salePrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Less: Purchase Price</span>
                  <span>-{formatCurrency(purchasePrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Less: Purchase Costs</span>
                  <span>-{formatCurrency(purchaseCosts)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Less: Improvements</span>
                  <span>-{formatCurrency(improvementCosts)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Less: Sale Costs</span>
                  <span>-{formatCurrency(saleCosts)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Gross Gain</span>
                  <span>{formatCurrency(result.grossGain)}</span>
                </div>
              </div>

              {result.privateResidenceRelief > 0 && (
                <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded text-sm">
                  <div className="flex justify-between text-green-700 dark:text-green-300">
                    <span>Private Residence Relief</span>
                    <span>-{formatCurrency(result.privateResidenceRelief)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm border-t pt-2">
                <div className="flex justify-between">
                  <span>Chargeable Gain</span>
                  <span className="font-medium">{formatCurrency(result.chargeableGain)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Less: Annual Allowance</span>
                  <span>-{formatCurrency(result.annualAllowance)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Taxable Gain</span>
                  <span>{formatCurrency(result.taxableGain)}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t pt-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Basic Rate ({formatCurrency(result.breakdown.basicRatePortion)} @ 18%)</span>
                  <span>{formatCurrency(result.breakdown.basicRateTax)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Higher Rate ({formatCurrency(result.breakdown.higherRatePortion)} @ 24%)</span>
                  <span>{formatCurrency(result.breakdown.higherRateTax)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total CGT Due</span>
                  <span className="text-primary">{formatCurrency(result.cgtDue)}</span>
                </div>
                {ownershipType !== "sole" && (
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Your Share</span>
                    <span>{formatCurrency(result.yourShare)}</span>
                  </div>
                )}
              </div>
            </div>

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

        {/* Planning Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Tax Planning Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                <span className="font-medium text-sm">💡 Split Year Sale</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                Consider exchanging contracts before the tax year end but completing after. 
                This allows you to use two annual allowances (£6,000 total) and could save up to £1,440 in CGT.
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                <span className="font-medium text-sm">💡 Transfer to Spouse</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                If your spouse is in a lower tax band, transferring ownership before sale 
                means they pay 18% instead of 24%. On a £100K gain, this saves £6,000!
                <br /><br />
                ⚠️ Must be a genuine transfer, not tax avoidance.
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                <span className="font-medium text-sm">💡 Private Residence Relief</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                If you ever lived in the property as your main home, you may qualify for 
                Private Residence Relief. You always get the last 9 months of ownership 
                exempt, even if you weren't living there.
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/50">
                <span className="font-medium text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  60-Day Reporting Rule
                </span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                You must report the sale to HMRC within 60 days of completion, 
                even if no tax is due. Use the Capital Gains Tax on UK property service.
                <br /><br />
                <strong>Penalties for late reporting:</strong> £100 initially, 
                rising to £300 after 6 months.
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

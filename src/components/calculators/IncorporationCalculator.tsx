import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  User,
  TrendingUp,
  Scale,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  FileText,
  Lightbulb,
  ArrowRight,
  Info,
  Calculator,
} from "lucide-react";
import { calculateIncorporation, IncorporationInput } from "@/lib/taxCalculations";
import { CurrencyInput } from "./CurrencyInput";
import { toast } from "sonner";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function IncorporationCalculator() {
  // Property
  const [purchasePrice, setPurchasePrice] = useState<number>(350000);
  const [depositPercent, setDepositPercent] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [annualRent, setAnnualRent] = useState<number>(24000);
  const [annualExpenses, setAnnualExpenses] = useState<number>(4000);

  // Situation
  const [isExistingProperty, setIsExistingProperty] = useState(false);
  const [originalPurchasePrice, setOriginalPurchasePrice] = useState<number>(250000);
  const [currentMarketValue, setCurrentMarketValue] = useState<number>(350000);
  const [numberOfExistingProperties, setNumberOfExistingProperties] = useState<number>(1);

  // Tax
  const [currentIncome, setCurrentIncome] = useState<number>(55000);
  const [marginalRate, setMarginalRate] = useState<"basic" | "higher" | "additional">("higher");

  // Strategy
  const [willExtractProfits, setWillExtractProfits] = useState(false);
  const [annualExtraction, setAnnualExtraction] = useState<number>(0);

  // Horizon
  const [investmentYears, setInvestmentYears] = useState<number>(10);
  const [rentGrowth, setRentGrowth] = useState<number>(3);
  const [propertyGrowth, setPropertyGrowth] = useState<number>(4);

  const depositAmount = purchasePrice * (depositPercent / 100);
  const mortgageAmount = purchasePrice - depositAmount;

  const input: IncorporationInput = {
    purchasePrice,
    depositPercent,
    interestRate,
    annualRent,
    annualExpenses,
    isExistingProperty,
    originalPurchasePrice,
    currentMarketValue,
    numberOfExistingProperties,
    currentIncome,
    marginalRate,
    willExtractProfits,
    annualExtraction,
    investmentYears,
    rentGrowth,
    propertyGrowth,
  };

  const result = useMemo(() => calculateIncorporation(input), [input]);

  const handleSave = () => {
    toast.success("Incorporation analysis saved successfully");
  };

  const getRecommendationColor = () => {
    if (result.recommendation === "ltd") return "text-green-600 bg-green-50 dark:bg-green-950/30";
    if (result.recommendation === "hybrid") return "text-blue-600 bg-blue-50 dark:bg-blue-950/30";
    return "text-amber-600 bg-amber-50 dark:bg-amber-950/30";
  };

  const getRecommendationLabel = () => {
    if (result.recommendation === "ltd") return "Limited Company Recommended";
    if (result.recommendation === "hybrid") return "Hybrid Strategy Recommended";
    return "Personal Ownership Recommended";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4">
        <h2 className="text-2xl font-bold">Should You Buy Through a Limited Company?</h2>
        <p className="text-muted-foreground">
          Compare personal ownership vs Ltd company for property investment
        </p>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparison">Personal vs Ltd</TabsTrigger>
          <TabsTrigger value="costs">Incorporation Costs</TabsTrigger>
          <TabsTrigger value="projection">10-Year Projection</TabsTrigger>
          <TabsTrigger value="decision">Decision Guide</TabsTrigger>
        </TabsList>

        {/* TAB 1: Personal vs Ltd Comparison */}
        <TabsContent value="comparison">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Panel - Inputs */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Property & Situation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Property Details
                  </h4>

                  <div className="space-y-2">
                    <Label>Purchase Price</Label>
                    <CurrencyInput value={purchasePrice} onChange={setPurchasePrice} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Deposit (%)</Label>
                      <Input
                        type="number"
                        value={depositPercent}
                        onChange={(e) => setDepositPercent(parseFloat(e.target.value) || 25)}
                        min={15}
                        max={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Interest Rate (%)</Label>
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 5)}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className="p-2 bg-muted/50 rounded text-sm">
                    <div className="flex justify-between">
                      <span>Deposit:</span>
                      <span className="font-medium">{formatCurrency(depositAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mortgage:</span>
                      <span className="font-medium">{formatCurrency(mortgageAmount)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Annual Rent</Label>
                      <CurrencyInput value={annualRent} onChange={setAnnualRent} />
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Expenses</Label>
                      <CurrencyInput value={annualExpenses} onChange={setAnnualExpenses} />
                    </div>
                  </div>
                </div>

                {/* Current Situation */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Your Situation
                  </h4>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="existing">Transferring existing property?</Label>
                    <Switch
                      id="existing"
                      checked={isExistingProperty}
                      onCheckedChange={setIsExistingProperty}
                    />
                  </div>

                  {isExistingProperty && (
                    <div className="space-y-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <div className="space-y-2">
                        <Label>Original Purchase Price</Label>
                        <CurrencyInput value={originalPurchasePrice} onChange={setOriginalPurchasePrice} />
                      </div>
                      <div className="space-y-2">
                        <Label>Current Market Value</Label>
                        <CurrencyInput value={currentMarketValue} onChange={setCurrentMarketValue} />
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1">
                        <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        Transfer triggers CGT on gain of {formatCurrency(currentMarketValue - originalPurchasePrice)}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Number of Existing Properties</Label>
                    <Input
                      type="number"
                      value={numberOfExistingProperties}
                      onChange={(e) => setNumberOfExistingProperties(parseInt(e.target.value) || 0)}
                      min={0}
                    />
                  </div>
                </div>

                {/* Tax Position */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Tax Position
                  </h4>

                  <div className="space-y-2">
                    <Label>Your Marginal Tax Rate</Label>
                    <RadioGroup
                      value={marginalRate}
                      onValueChange={(v) => setMarginalRate(v as typeof marginalRate)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="rate-basic" />
                        <Label htmlFor="rate-basic" className="cursor-pointer">Basic (20%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="higher" id="rate-higher" />
                        <Label htmlFor="rate-higher" className="cursor-pointer">Higher (40%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="additional" id="rate-additional" />
                        <Label htmlFor="rate-additional" className="cursor-pointer">Additional (45%)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="extract">Will extract profits?</Label>
                    <Switch
                      id="extract"
                      checked={willExtractProfits}
                      onCheckedChange={setWillExtractProfits}
                    />
                  </div>

                  {willExtractProfits && (
                    <div className="space-y-2">
                      <Label>Annual Extraction Amount</Label>
                      <CurrencyInput value={annualExtraction} onChange={setAnnualExtraction} />
                    </div>
                  )}
                </div>

                {/* Investment Horizon */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Investment Horizon
                  </h4>

                  <div className="space-y-2">
                    <Label>Hold Period (Years)</Label>
                    <Select value={String(investmentYears)} onValueChange={(v) => setInvestmentYears(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20, 25].map((y) => (
                          <SelectItem key={y} value={String(y)}>{y} years</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rent Growth (%/yr)</Label>
                      <Input
                        type="number"
                        value={rentGrowth}
                        onChange={(e) => setRentGrowth(parseFloat(e.target.value) || 3)}
                        step={0.5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Property Growth (%/yr)</Label>
                      <Input
                        type="number"
                        value={propertyGrowth}
                        onChange={(e) => setPropertyGrowth(parseFloat(e.target.value) || 4)}
                        step={0.5}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Panel - Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Recommendation Banner */}
              <Card className={getRecommendationColor()}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.recommendation === "ltd" ? (
                        <Building2 className="h-8 w-8" />
                      ) : result.recommendation === "hybrid" ? (
                        <Scale className="h-8 w-8" />
                      ) : (
                        <User className="h-8 w-8" />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{getRecommendationLabel()}</h3>
                        <p className="text-sm opacity-80">{result.reasons[0]}</p>
                      </div>
                    </div>
                    {result.ltdAdvantage > 0 && (
                      <Badge variant="outline" className="text-lg py-1 px-3">
                        Save {formatCurrency(result.ltdAdvantage)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Side by Side Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Personal */}
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <User className="h-5 w-5" />
                      Personal Ownership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Upfront Costs</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">SDLT</span>
                          <span>{formatCurrency(result.personalSDLT)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Total</span>
                          <span>{formatCurrency(result.totalPersonalUpfront)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Annual Tax (Section 24)</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rental Profit</span>
                          <span>{formatCurrency(result.personal.rentalProfit)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Taxable (no mortgage deduction)</span>
                          <span>{formatCurrency(result.personal.taxableProfit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Income Tax</span>
                          <span>{formatCurrency(result.personal.incomeTax)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Finance Relief (20%)</span>
                          <span>-{formatCurrency(result.personal.financeCostRelief)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Net Tax</span>
                          <span className="text-red-600">{formatCurrency(result.personal.netTax)}/yr</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-100 dark:bg-amber-950/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">{investmentYears}-Year Total Tax</p>
                      <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                        {formatCurrency(result.personalTotalTax)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Ltd */}
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <Building2 className="h-5 w-5" />
                      Limited Company
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Upfront Costs</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">SDLT</span>
                          <span>{formatCurrency(result.ltdSDLT)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Setup Costs</span>
                          <span>{formatCurrency(result.incorporationCosts)}</span>
                        </div>
                        {isExistingProperty && (
                          <>
                            <div className="flex justify-between text-red-600">
                              <span>Transfer CGT</span>
                              <span>{formatCurrency(result.transferCGT)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                              <span>Transfer Costs</span>
                              <span>{formatCurrency(result.transferCosts)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Total</span>
                          <span>{formatCurrency(result.totalLtdUpfront)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Annual Tax</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rental Profit</span>
                          <span>{formatCurrency(result.ltd.rentalProfit)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Mortgage Deductible</span>
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Corporation Tax (19%)</span>
                          <span>{formatCurrency(result.ltd.corporationTax)}</span>
                        </div>
                        {willExtractProfits && result.ltd.dividendTax > 0 && (
                          <div className="flex justify-between text-amber-600">
                            <span>Dividend Tax</span>
                            <span>{formatCurrency(result.ltd.dividendTax)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Net Tax</span>
                          <span className="text-green-600">{formatCurrency(result.ltd.corporationTax)}/yr</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-green-100 dark:bg-green-950/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">{investmentYears}-Year Total Tax</p>
                      <p className="text-xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(result.ltdTotalTax)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Savings Summary */}
              <Card>
                <CardContent className="py-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Tax Saving</p>
                      <p className={`text-xl font-bold ${result.annualTaxSaving > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.annualTaxSaving > 0 ? '+' : ''}{formatCurrency(result.annualTaxSaving)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Breakeven</p>
                      <p className="text-xl font-bold">
                        {result.breakevenYears < 50 ? `${result.breakevenYears} years` : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{investmentYears}-Year Advantage</p>
                      <p className={`text-xl font-bold ${result.ltdAdvantage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.ltdAdvantage > 0 ? '+' : ''}{formatCurrency(result.ltdAdvantage)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Analysis
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Incorporation Costs */}
        <TabsContent value="costs">
          <div className="grid md:grid-cols-2 gap-6">
            {/* New Property Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Buying NEW Property Through Ltd
                </CardTitle>
                <CardDescription>
                  Setup costs for a fresh Ltd company purchase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h5 className="font-medium">One-Time Setup</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Company Formation (Companies House)</span>
                      <span>£50 - £100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accountant Setup</span>
                      <span>£500 - £1,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legal Documents (Articles, etc.)</span>
                      <span>£300 - £800</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Setup</span>
                      <span>£850 - £1,900</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Annual Ongoing</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Accountancy (Accounts + Tax)</span>
                      <span>£1,000 - £2,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confirmation Statement</span>
                      <span>£50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Business Bank Account</span>
                      <span>£120 - £360</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Annual</span>
                      <span>£1,200 - £2,400</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <Lightbulb className="h-4 w-4 inline mr-1" />
                    These costs are tax-deductible through your Ltd company!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Costs */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-5 w-5" />
                  Transferring EXISTING to Ltd
                </CardTitle>
                <CardDescription>
                  Warning: Transfer costs can be prohibitive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isExistingProperty ? (
                  <>
                    <div className="space-y-3">
                      <h5 className="font-medium">Your Transfer Costs</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Capital Gains Tax (on {formatCurrency(currentMarketValue - originalPurchasePrice)} gain)</span>
                          <span className="text-red-600">{formatCurrency(result.transferCGT)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SDLT (pay again!)</span>
                          <span className="text-red-600">{formatCurrency(result.ltdSDLT)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mortgage Early Repayment</span>
                          <span>~£5,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>New Mortgage Fees</span>
                          <span>~£2,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Legal & Accountancy</span>
                          <span>~£2,500</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 text-red-600">
                          <span>Total Transfer Cost</span>
                          <span>{formatCurrency(result.transferCGT + result.ltdSDLT + 9500)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-red-100 dark:bg-red-950/50 rounded-lg">
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        Breakeven: {Math.round((result.transferCGT + result.ltdSDLT + 9500) / Math.max(1, result.annualTaxSaving))} years
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        That's a LONG time to recover transfer costs!
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Enable "Transferring existing property" in the inputs to see transfer costs</p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Better Strategy</h5>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Keep existing properties in personal name</li>
                    <li>• Buy NEW properties through Ltd</li>
                    <li>• Only transfer if portfolio value &gt;£1M</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: 10-Year Projection */}
        <TabsContent value="projection">
          <Card>
            <CardHeader>
              <CardTitle>{investmentYears}-Year Projection</CardTitle>
              <CardDescription>
                Year-by-year comparison including rent growth and property appreciation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Rent</TableHead>
                      <TableHead className="text-right text-amber-600">Personal Tax</TableHead>
                      <TableHead className="text-right text-amber-600">Personal Cumulative</TableHead>
                      <TableHead className="text-right text-green-600">Ltd Tax</TableHead>
                      <TableHead className="text-right text-green-600">Ltd Cumulative</TableHead>
                      <TableHead className="text-right">Annual Saving</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.projections.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">{row.year}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.rent)}</TableCell>
                        <TableCell className="text-right text-amber-600">{formatCurrency(row.personalTax)}</TableCell>
                        <TableCell className="text-right text-amber-600">{formatCurrency(row.personalCumulative)}</TableCell>
                        <TableCell className="text-right text-green-600">{formatCurrency(row.ltdTax)}</TableCell>
                        <TableCell className="text-right text-green-600">{formatCurrency(row.ltdCumulative)}</TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={row.savingThisYear > 0 ? "text-green-600" : "text-red-600"}>
                            {row.savingThisYear > 0 ? "+" : ""}{formatCurrency(row.savingThisYear)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Sale Scenario */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sale in Year {investmentYears}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Property Value (@ {propertyGrowth}%/yr)</span>
                        <span className="font-medium">{formatCurrency(result.saleAnalysis.propertyValue)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Capital Gain</span>
                        <span>{formatCurrency(result.saleAnalysis.capitalGain)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Personal CGT (24%)</p>
                        <p className="font-semibold text-amber-700">{formatCurrency(result.saleAnalysis.personalCGT)}</p>
                        <p className="text-xs text-muted-foreground mt-2">Net Proceeds</p>
                        <p className="font-semibold">{formatCurrency(result.saleAnalysis.personalNetProceeds)}</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Ltd Corp Tax (19%)</p>
                        <p className="font-semibold text-green-700">{formatCurrency(result.saleAnalysis.ltdCorpTax)}</p>
                        <p className="text-xs text-muted-foreground mt-2">In Company</p>
                        <p className="font-semibold">{formatCurrency(result.saleAnalysis.ltdNetProceeds)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={result.ltdAdvantage > 0 ? "border-green-200 dark:border-green-800" : "border-amber-200 dark:border-amber-800"}>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Wealth After {investmentYears} Years</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <User className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                        <p className="text-sm text-muted-foreground">Personal</p>
                        <p className="text-2xl font-bold text-amber-700">{formatCurrency(result.personalTotalWealth)}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <Building2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <p className="text-sm text-muted-foreground">Ltd (retained)</p>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(result.ltdTotalWealth)}</p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg text-center ${result.ltdAdvantage > 0 ? 'bg-green-100 dark:bg-green-950/50' : 'bg-amber-100 dark:bg-amber-950/50'}`}>
                      <p className="text-sm text-muted-foreground">
                        {result.ltdAdvantage > 0 ? 'Ltd Advantage' : 'Personal Advantage'}
                      </p>
                      <p className={`text-3xl font-bold ${result.ltdAdvantage > 0 ? 'text-green-700' : 'text-amber-700'}`}>
                        {formatCurrency(Math.abs(result.ltdAdvantage))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ({Math.abs(Math.round((result.ltdAdvantage / result.personalTotalWealth) * 100))}% more wealth)
                      </p>
                    </div>

                    {willExtractProfits && (
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <p className="text-muted-foreground">
                          If you extract Ltd profits: {formatCurrency(result.saleAnalysis.ltdNetIfExtracted)} after dividend tax
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: Decision Guide */}
        <TabsContent value="decision">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ltd Advantages */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  Ltd Company Advantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Lower Tax Rate</p>
                      <p className="text-sm text-muted-foreground">19% Corp Tax vs {marginalRate === 'basic' ? '20%' : marginalRate === 'higher' ? '40%' : '45%'} Income Tax</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Mortgage Fully Deductible</p>
                      <p className="text-sm text-muted-foreground">Section 24 doesn't apply to companies</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Profit Retention</p>
                      <p className="text-sm text-muted-foreground">Keep profits in company for next deposit</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Flexibility</p>
                      <p className="text-sm text-muted-foreground">Choose when to extract dividends for tax efficiency</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Asset Protection</p>
                      <p className="text-sm text-muted-foreground">Limited liability, separate from personal assets</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Scalability</p>
                      <p className="text-sm text-muted-foreground">Better for portfolio growth, easier to bring in partners</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ltd Disadvantages */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <XCircle className="h-5 w-5" />
                  Ltd Company Disadvantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Higher Upfront Costs</p>
                      <p className="text-sm text-muted-foreground">Extra SDLT, incorporation costs, legal fees</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Dividend Tax If You Extract</p>
                      <p className="text-sm text-muted-foreground">Double taxation: Corp Tax + Dividend Tax</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Restricted Mortgages</p>
                      <p className="text-sm text-muted-foreground">Fewer lenders, higher rates (+0.5-1%)</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Ongoing Costs</p>
                      <p className="text-sm text-muted-foreground">Accountancy £1,000-2,000/year, filing requirements</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Transfer Costs</p>
                      <p className="text-sm text-muted-foreground">CGT + SDLT if transferring existing properties</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">No IHT Relief</p>
                      <p className="text-sm text-muted-foreground">Properties not eligible for Business Property Relief</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendation */}
          <Card className={`mt-6 ${getRecommendationColor()}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.recommendation === "ltd" ? (
                  <Building2 className="h-6 w-6" />
                ) : result.recommendation === "hybrid" ? (
                  <Scale className="h-6 w-6" />
                ) : (
                  <User className="h-6 w-6" />
                )}
                Your Recommendation: {getRecommendationLabel()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                    <p>{reason}</p>
                  </div>
                ))}
              </div>

              {result.recommendation === "hybrid" && (
                <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  <h4 className="font-medium mb-2">Hybrid Strategy</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Keep existing properties in personal name</li>
                    <li>• Buy all NEW properties through Ltd</li>
                    <li>• Get Ltd tax benefits without transfer costs</li>
                    <li>• This is what most sophisticated landlords do!</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="mt-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
            <CardContent className="py-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-medium mb-1">Important Disclaimer</p>
                  <p>
                    This calculator provides general guidance only. Incorporation is a complex decision 
                    with many factors. Always consult with a qualified accountant and tax advisor 
                    before making any decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

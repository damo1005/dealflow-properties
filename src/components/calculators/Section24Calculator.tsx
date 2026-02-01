import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calculator,
  TrendingDown,
  AlertTriangle,
  Save,
  FileText,
  Building2,
  Users,
  Wallet,
  PiggyBank,
  Receipt,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { calculateSection24Impact, Section24Input } from "@/lib/taxCalculations";
import { CurrencyInput } from "./CurrencyInput";
import { toast } from "sonner";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function Section24Calculator() {
  const [annualRent, setAnnualRent] = useState<number>(30000);
  const [allowableExpenses, setAllowableExpenses] = useState<number>(5000);
  const [mortgageInterest, setMortgageInterest] = useState<number>(15000);
  const [otherIncome, setOtherIncome] = useState<number>(35000);
  const [taxBand, setTaxBand] = useState<"basic" | "higher" | "additional">("higher");
  const [numberOfProperties, setNumberOfProperties] = useState<number>(1);

  const input: Section24Input = {
    annualRent,
    allowableExpenses,
    mortgageInterest,
    otherIncome,
    taxBand,
    numberOfProperties,
  };

  const result = useMemo(() => calculateSection24Impact(input), [input]);

  const handleSave = () => {
    toast.success("Section 24 analysis saved successfully");
  };

  // Calculate strategy savings
  const incorporationSaving = taxBand === "higher" ? result.extraTaxPerYear * 0.6 : result.extraTaxPerYear * 0.3;
  const spouseTransferSaving = taxBand === "higher" ? result.extraTaxPerYear * 0.5 : 0;
  const paydownSaving = mortgageInterest * 0.1 * (taxBand === "higher" ? 0.2 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4">
        <h2 className="text-2xl font-bold">Section 24 Tax Calculator</h2>
        <p className="text-muted-foreground">
          Calculate the impact of mortgage interest restriction on your rental income
        </p>
      </div>

      <Tabs defaultValue="impact" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="impact">Impact Calculator</TabsTrigger>
          <TabsTrigger value="transition">Year-by-Year</TabsTrigger>
          <TabsTrigger value="strategies">Mitigation Strategies</TabsTrigger>
        </TabsList>

        {/* TAB 1: Impact Calculator */}
        <TabsContent value="impact">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Panel - Inputs */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Your Rental Business
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Total Annual Rent</Label>
                  <CurrencyInput value={annualRent} onChange={setAnnualRent} />
                </div>

                <div className="space-y-2">
                  <Label>Total Allowable Expenses</Label>
                  <CurrencyInput value={allowableExpenses} onChange={setAllowableExpenses} />
                  <p className="text-xs text-muted-foreground">(Not including mortgage)</p>
                </div>

                <div className="space-y-2">
                  <Label>Total Mortgage Interest</Label>
                  <CurrencyInput value={mortgageInterest} onChange={setMortgageInterest} />
                </div>

                <div className="space-y-2">
                  <Label>Other Income (salary, pension)</Label>
                  <CurrencyInput value={otherIncome} onChange={setOtherIncome} />
                </div>

                <div className="space-y-2">
                  <Label>Your Tax Band</Label>
                  <RadioGroup
                    value={taxBand}
                    onValueChange={(v) => setTaxBand(v as typeof taxBand)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="basic" id="band-basic" />
                      <Label htmlFor="band-basic" className="cursor-pointer">Basic Rate (20%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="higher" id="band-higher" />
                      <Label htmlFor="band-higher" className="cursor-pointer">Higher Rate (40%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="additional" id="band-additional" />
                      <Label htmlFor="band-additional" className="cursor-pointer">Additional Rate (45%)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Number of Properties</Label>
                  <Input
                    type="number"
                    value={numberOfProperties}
                    onChange={(e) => setNumberOfProperties(parseInt(e.target.value) || 1)}
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Right Panel - Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Main Impact Card */}
              <Card className="border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 dark:from-red-950/30 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <TrendingDown className="h-5 w-5" />
                    Section 24 Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Extra Tax */}
                  <div className="text-center py-4 bg-red-100 dark:bg-red-950/50 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 mb-1">Extra Tax Per Year</p>
                    <p className="text-4xl font-bold text-red-700 dark:text-red-300">
                      {formatCurrency(result.extraTaxPerYear)}
                    </p>
                    <div className="flex justify-center gap-4 mt-2 text-sm text-red-600 dark:text-red-400">
                      <span>10 years: {formatCurrency(result.extraTax10Years)}</span>
                      <span>25 years: {formatCurrency(result.extraTax25Years)}</span>
                    </div>
                  </div>

                  {/* Warning */}
                  {result.warningMessage && (
                    <div className="p-3 bg-red-100 dark:bg-red-950/50 rounded-lg border border-red-300 dark:border-red-700">
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        {result.warningMessage}
                      </p>
                    </div>
                  )}

                  {/* Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">PRE-2017</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700 dark:text-green-300">Rent</span>
                          <span>{formatCurrency(annualRent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700 dark:text-green-300">Expenses</span>
                          <span>-{formatCurrency(allowableExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700 dark:text-green-300">Mortgage</span>
                          <span className="flex items-center gap-1">
                            -{formatCurrency(mortgageInterest)}
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Profit</span>
                          <span>{formatCurrency(result.preSection24Profit)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-green-800 dark:text-green-200">
                          <span>Tax</span>
                          <span>{formatCurrency(result.preSection24Tax)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">POST-2020</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-red-700 dark:text-red-300">Rent</span>
                          <span>{formatCurrency(annualRent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700 dark:text-red-300">Expenses</span>
                          <span>-{formatCurrency(allowableExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700 dark:text-red-300">Mortgage</span>
                          <span className="flex items-center gap-1 text-red-600">
                            £0
                            <XCircle className="h-3 w-3" />
                          </span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Profit</span>
                          <span>{formatCurrency(result.postSection24Profit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax before credit</span>
                          <span>{formatCurrency(result.postSection24TaxBeforeCredit)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>20% credit</span>
                          <span>-{formatCurrency(result.financeCostCredit)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-red-800 dark:text-red-200">
                          <span>Tax</span>
                          <span>{formatCurrency(result.postSection24Tax)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash Position */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Your Actual Cash Position</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Cash Profit (after mortgage)</span>
                        <span className="font-medium">{formatCurrency(result.actualCashProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax Due</span>
                        <span className="text-red-600">-{formatCurrency(result.postSection24Tax)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Net Cash After Tax</span>
                        <span className={result.actualCashProfit - result.postSection24Tax < 0 ? "text-red-600" : ""}>
                          {formatCurrency(result.actualCashProfit - result.postSection24Tax)}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(result.taxAsPercentOfCash, 100)} 
                        className="h-2 mt-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tax takes {result.taxAsPercentOfCash}% of your cash profit
                      </p>
                    </div>
                  </div>

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
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Year-by-Year Transition */}
        <TabsContent value="transition">
          <Card>
            <CardHeader>
              <CardTitle>Section 24 Phase-In (2017-2020)</CardTitle>
              <CardDescription>
                Section 24 was phased in over 4 years, progressively restricting mortgage interest deductions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Year</TableHead>
                    <TableHead className="text-center">Deductible</TableHead>
                    <TableHead className="text-center">Tax Credit</TableHead>
                    <TableHead className="text-right">Your Tax</TableHead>
                    <TableHead className="text-right">vs 2016/17</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.transitionYears.map((year, i) => (
                    <TableRow key={i} className={i === 4 ? "bg-red-50 dark:bg-red-950/30" : ""}>
                      <TableCell className="font-medium">{year.year}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={year.deductiblePercent > 0 ? "default" : "secondary"}>
                          {year.deductiblePercent}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={year.creditPercent > 0 ? "outline" : "secondary"}>
                          {year.creditPercent}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(year.tax)}
                      </TableCell>
                      <TableCell className="text-right">
                        {i === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="text-red-600">
                            +{formatCurrency(year.tax - result.transitionYears[0].tax)}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Total Extra Tax (2017-2020)</h4>
                </div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {formatCurrency(
                    result.transitionYears.slice(1).reduce((sum, y) => sum + (y.tax - result.transitionYears[0].tax), 0)
                  )}
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Extra tax paid during the transition period alone
                </p>
              </div>

              {/* Future Projection */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Future Years Projection</h4>
                <div className="grid grid-cols-5 gap-2">
                  {[2026, 2027, 2028, 2029, 2030].map((year) => (
                    <div key={year} className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">{year}/{(year + 1).toString().slice(-2)}</p>
                      <p className="font-semibold">{formatCurrency(result.postSection24Tax)}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  10-year cost at current levels: {formatCurrency(result.postSection24Tax * 10)} 
                  ({formatCurrency(result.extraTax10Years)} extra vs pre-2017)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Mitigation Strategies */}
        <TabsContent value="strategies">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strategy 1: Incorporate */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Incorporate
                  </CardTitle>
                  <Badge variant="secondary" className="text-green-600">
                    Save ~{formatCurrency(incorporationSaving)}/yr
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Transfer properties to a Limited Company
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Ltd pays 19-25% Corporation Tax</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Mortgage fully deductible</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Can offset losses</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>SDLT on transfer (can be high)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>CGT on transfer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>More complex accounting</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Best for:</strong> High earners, large portfolios, long-term investors
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Calculate Ltd Savings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Strategy 2: Spouse Transfer */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Transfer to Spouse
                  </CardTitle>
                  <Badge variant="secondary" className="text-green-600">
                    Save ~{formatCurrency(spouseTransferSaving)}/yr
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Transfer to spouse in lower tax band
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>No CGT or SDLT between spouses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Lower tax rate on income</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Simple process</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>May need to remortgage</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>Only works if spouse lower rate</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    <strong>Best for:</strong> Married couples with income disparity
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Calculate Spouse Transfer
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Strategy 3: Pay Down Mortgage */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-green-600" />
                    Pay Down Mortgage
                  </CardTitle>
                  <Badge variant="secondary" className="text-green-600">
                    Save ~{formatCurrency(paydownSaving)}/yr
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Reduce mortgage to reduce finance costs
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Lower tax on reduced interest</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Lower risk</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Better cashflow</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>Capital tied up in property</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>Lost leverage benefits</span>
                  </div>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>Best for:</strong> Risk-averse investors, those near retirement
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Calculate Paydown Impact
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Strategy 4: Claim All Expenses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-orange-600" />
                    Claim All Expenses
                  </CardTitle>
                  <Badge variant="secondary" className="text-green-600">
                    Save ~{formatCurrency(600)}/yr
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Maximize allowable expense claims
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Easy to implement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>No structural changes</span>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-2">Common missed expenses:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Mileage (45p/mile)</li>
                    <li>• Home office costs</li>
                    <li>• Phone/broadband (proportion)</li>
                    <li>• Professional fees</li>
                    <li>• Landlord association</li>
                    <li>• Training courses</li>
                  </ul>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    <strong>Extra £3K expenses @ 40% = £1,200 saved</strong>
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  View Expenses Checklist
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Strategy 5: Pension Contributions */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-teal-600" />
                    Pension Contributions
                  </CardTitle>
                  <Badge variant="secondary" className="text-green-600">
                    Save ~{formatCurrency(800)}/yr
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Reduce taxable income via pension contributions
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Tax relief at 40%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Reduce adjusted income</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>May restore personal allowance if over £100K</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>Money locked until 55/57</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>Annual/lifetime allowances apply</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                    <h4 className="font-medium text-teal-800 dark:text-teal-200 mb-2">Example Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Contribute</span>
                        <span className="font-medium">£10,000</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Tax relief @ 40%</span>
                        <span>-£4,000</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Net cost to you</span>
                        <span>£6,000</span>
                      </div>
                    </div>
                    <p className="text-xs text-teal-600 dark:text-teal-400 mt-3">
                      Plus potential to restore personal allowance if income &gt; £100K
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategy Comparison */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strategy</TableHead>
                    <TableHead>Potential Saving</TableHead>
                    <TableHead>Complexity</TableHead>
                    <TableHead>Upfront Cost</TableHead>
                    <TableHead>Best For</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Incorporate</TableCell>
                    <TableCell className="text-green-600">High</TableCell>
                    <TableCell>
                      <Badge variant="destructive">High</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">High</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Large portfolios</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Spouse Transfer</TableCell>
                    <TableCell className="text-green-600">Medium</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Low</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Low</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Mixed income couples</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pay Down Mortgage</TableCell>
                    <TableCell className="text-amber-600">Low</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Low</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">None</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Risk-averse</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Claim Expenses</TableCell>
                    <TableCell className="text-amber-600">Low</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Low</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">None</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Everyone</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pension</TableCell>
                    <TableCell className="text-green-600">Medium</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Low</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">None</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Under 55</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

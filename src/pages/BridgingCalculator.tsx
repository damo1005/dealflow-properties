import { useState, useMemo } from 'react';
import { Calculator, PiggyBank, Phone } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { LOAN_PURPOSES, BRIDGING_LENDERS } from '@/types/bridging';

export default function BridgingCalculator() {
  const [formData, setFormData] = useState({
    purpose: 'auction',
    propertyValue: 180000,
    purchasePrice: 150000,
    loanAmount: 120000,
    termMonths: 6,
    exitStrategy: 'refinance',
    valuationFee: 450,
    legalFee: 1500,
  });

  const ltv = formData.propertyValue > 0 ? (formData.loanAmount / formData.propertyValue) * 100 : 0;
  const ltvPurchase = formData.purchasePrice > 0 ? (formData.loanAmount / formData.purchasePrice) * 100 : 0;

  const lenderResults = useMemo(() => {
    return BRIDGING_LENDERS.map((lender) => {
      const monthlyInterest = formData.loanAmount * (lender.rateMonthly / 100);
      const grossInterest = monthlyInterest * formData.termMonths;
      const arrangementFee = formData.loanAmount * (lender.arrangementFee / 100);
      const exitFee = formData.loanAmount * (lender.exitFee / 100);
      const totalCost = grossInterest + arrangementFee + exitFee + formData.valuationFee + formData.legalFee;
      const totalRepayable = formData.loanAmount + grossInterest + exitFee;

      return {
        ...lender,
        monthlyInterest,
        grossInterest,
        arrangementFee,
        exitFee,
        totalCost,
        totalRepayable,
      };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }, [formData]);

  const bestLender = lenderResults[0];

  // Full deal analysis
  const sdlt = 5000; // Simplified
  const auctionFees = 3500;
  const totalInvestment = formData.purchasePrice + sdlt + auctionFees + bestLender.totalCost;
  const deposit = formData.purchasePrice - formData.loanAmount;
  const day1Cash = deposit + sdlt + auctionFees + bestLender.arrangementFee + formData.valuationFee + formData.legalFee;
  const refinanceAmount = formData.propertyValue * 0.75;
  const cashReturned = refinanceAmount - bestLender.totalRepayable;
  const finalCashIn = day1Cash - Math.max(0, cashReturned);

  return (
    <AppLayout title="Bridging Finance Calculator">
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <PiggyBank className="h-6 w-6 text-primary" />
              Bridging Finance Calculator
            </h1>
            <p className="text-muted-foreground">Calculate costs and compare lenders for bridging loans</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select value={formData.purpose} onValueChange={(v) => setFormData({ ...formData, purpose: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_PURPOSES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input type="number" className="pl-7" value={formData.propertyValue} onChange={(e) => setFormData({ ...formData, propertyValue: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Purchase Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input type="number" className="pl-7" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Loan Required</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input type="number" className="pl-7" value={formData.loanAmount} onChange={(e) => setFormData({ ...formData, loanAmount: Number(e.target.value) })} />
                </div>
                <p className="text-sm text-muted-foreground">
                  LTV: {ltv.toFixed(1)}% (of value) / {ltvPurchase.toFixed(1)}% (of purchase)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Term (months)</Label>
                <Input type="number" value={formData.termMonths} onChange={(e) => setFormData({ ...formData, termMonths: Number(e.target.value) })} />
              </div>

              <div className="space-y-2">
                <Label>Exit Strategy</Label>
                <RadioGroup value={formData.exitStrategy} onValueChange={(v) => setFormData({ ...formData, exitStrategy: v })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="refinance" id="exit-refinance" />
                    <Label htmlFor="exit-refinance">Refinance to BTL mortgage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="exit-sell" />
                    <Label htmlFor="exit-sell">Sell property</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Bridging Loan Costs
              </CardTitle>
              <CardDescription>Based on {bestLender.name} (best rate)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Amount:</span>
                  <span className="font-medium">£{formData.loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest ({bestLender.rateMonthly}% pm × {formData.termMonths} months):</span>
                  <span>£{bestLender.grossInterest.toLocaleString()}</span>
                </div>
                <div className="text-sm text-muted-foreground ml-4">
                  Monthly: £{bestLender.monthlyInterest.toLocaleString()}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="font-medium">Fees:</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Arrangement ({bestLender.arrangementFee}%):</span>
                  <span>£{bestLender.arrangementFee.toLocaleString()}</span>
                </div>
                {bestLender.exitFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exit Fee ({bestLender.exitFee}%):</span>
                    <span>£{bestLender.exitFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valuation:</span>
                  <span>£{formData.valuationFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Legal:</span>
                  <span>£{formData.legalFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL COST OF FINANCE:</span>
                  <span className="text-primary">£{bestLender.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>TOTAL TO REPAY:</span>
                  <span>£{bestLender.totalRepayable.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lender Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Compare Lenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Lender</th>
                    <th className="text-right py-2">Rate/m</th>
                    <th className="text-right py-2">Arr Fee</th>
                    <th className="text-right py-2">Total Cost</th>
                    <th className="text-right py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lenderResults.map((lender, i) => (
                    <tr key={lender.name} className="border-b">
                      <td className="py-2 font-medium">{lender.name}</td>
                      <td className="text-right">{lender.rateMonthly}%</td>
                      <td className="text-right">{lender.arrangementFee}%</td>
                      <td className="text-right font-medium">£{lender.totalCost.toLocaleString()}</td>
                      <td className="text-right">
                        {i === 0 && <Badge className="bg-green-600">Best Rate ⭐</Badge>}
                        {lender.arrangementFee <= 1.5 && i !== 0 && <Badge variant="secondary">Low Fees</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 mt-4">
              <Button>Get Indicative Quotes</Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Speak to Broker
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Full Deal Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Full Deal Analysis ({formData.purpose === 'auction' ? 'Auction' : 'Purchase'})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Total Investment</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Price:</span>
                    <span>£{formData.purchasePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">+ SDLT:</span>
                    <span>£{sdlt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">+ Fees:</span>
                    <span>£{auctionFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">+ Bridging Costs:</span>
                    <span>£{bestLender.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Total Investment:</span>
                    <span>£{totalInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Cash Required</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit ({100 - ltvPurchase.toFixed(0)}%):</span>
                    <span>£{deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fees upfront:</span>
                    <span>£{(sdlt + auctionFees + bestLender.arrangementFee + formData.valuationFee + formData.legalFee).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Day 1 Cash:</span>
                    <span>£{day1Cash.toLocaleString()}</span>
                  </div>
                </div>

                {formData.exitStrategy === 'refinance' && (
                  <div className="pt-4 space-y-1 text-sm">
                    <h4 className="font-medium">On Refinance (75% LTV):</h4>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Mortgage:</span>
                      <span>£{refinanceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repay Bridging:</span>
                      <span>£{bestLender.totalRepayable.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Cash Returned:</span>
                      <span>£{cashReturned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>Final Cash Left In:</span>
                      <span>£{finalCashIn.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

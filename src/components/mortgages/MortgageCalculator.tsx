import { useState } from "react";
import { Home, Building2, RefreshCw, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMortgageStore } from "@/stores/mortgageStore";

interface MortgageCalculatorProps {
  onCompare: () => void;
}

export function MortgageCalculator({ onCompare }: MortgageCalculatorProps) {
  const {
    propertyValue,
    loanAmount,
    ltv,
    mortgageType,
    termYears,
    setPropertyValue,
    setLoanAmount,
    setMortgageType,
    setTermYears,
  } = useMortgageStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
    setPropertyValue(value);
  };

  const handleLoanAmountChange = (value: number[]) => {
    setLoanAmount(value[0]);
  };

  const maxLoan = propertyValue * 0.85; // Max 85% LTV

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Quick Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Value */}
        <div className="space-y-2">
          <Label htmlFor="propertyValue">Property Value</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <Input
              id="propertyValue"
              type="text"
              value={propertyValue.toLocaleString()}
              onChange={handlePropertyValueChange}
              className="pl-7"
            />
          </div>
        </div>

        {/* Loan Amount Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Loan Amount</Label>
            <span className="text-lg font-semibold">{formatCurrency(loanAmount)}</span>
          </div>
          <Slider
            value={[loanAmount]}
            onValueChange={handleLoanAmountChange}
            min={25000}
            max={maxLoan}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>£25,000</span>
            <span>{formatCurrency(maxLoan)}</span>
          </div>
        </div>

        {/* LTV Display */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Loan to Value (LTV)</span>
            <span className={`text-lg font-bold ${ltv > 75 ? 'text-amber-500' : 'text-green-500'}`}>
              {ltv.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${ltv > 75 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(ltv, 100)}%` }}
            />
          </div>
        </div>

        {/* Mortgage Type */}
        <div className="space-y-3">
          <Label>Mortgage Type</Label>
          <RadioGroup 
            value={mortgageType} 
            onValueChange={(v) => setMortgageType(v as 'btl' | 'residential' | 'remortgage')}
            className="grid grid-cols-3 gap-2"
          >
            <Label
              htmlFor="btl"
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                mortgageType === 'btl' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
              }`}
            >
              <RadioGroupItem value="btl" id="btl" className="sr-only" />
              <Building2 className="h-5 w-5" />
              <span className="text-xs font-medium">Buy-to-Let</span>
            </Label>
            <Label
              htmlFor="residential"
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                mortgageType === 'residential' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
              }`}
            >
              <RadioGroupItem value="residential" id="residential" className="sr-only" />
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Residential</span>
            </Label>
            <Label
              htmlFor="remortgage"
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                mortgageType === 'remortgage' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
              }`}
            >
              <RadioGroupItem value="remortgage" id="remortgage" className="sr-only" />
              <RefreshCw className="h-5 w-5" />
              <span className="text-xs font-medium">Remortgage</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Term */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Term</Label>
            <span className="font-semibold">{termYears} years</span>
          </div>
          <Slider
            value={[termYears]}
            onValueChange={(v) => setTermYears(v[0])}
            min={5}
            max={40}
            step={1}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>5 years</span>
            <span>40 years</span>
          </div>
        </div>

        {/* Compare Button */}
        <Button className="w-full" size="lg" onClick={onCompare}>
          Compare Rates
        </Button>
      </CardContent>
    </Card>
  );
}

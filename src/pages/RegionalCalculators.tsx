import { useState } from 'react';
import { Calculator, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// LBTT Rates for Scotland
const LBTT_RESIDENTIAL_BANDS = [
  { min: 0, max: 145000, rate: 0 },
  { min: 145001, max: 250000, rate: 0.02 },
  { min: 250001, max: 325000, rate: 0.05 },
  { min: 325001, max: 750000, rate: 0.10 },
  { min: 750001, max: Infinity, rate: 0.12 },
];

const LBTT_ADS_RATE = 0.06; // Additional Dwelling Supplement

// LTT Rates for Wales (Main Residence)
const LTT_MAIN_RESIDENCE_BANDS = [
  { min: 0, max: 225000, rate: 0 },
  { min: 225001, max: 400000, rate: 0.06 },
  { min: 400001, max: 750000, rate: 0.075 },
  { min: 750001, max: 1500000, rate: 0.10 },
  { min: 1500001, max: Infinity, rate: 0.12 },
];

// LTT Higher Rates (Additional Property)
const LTT_HIGHER_RATES_BANDS = [
  { min: 0, max: 180000, rate: 0.04 },
  { min: 180001, max: 250000, rate: 0.075 },
  { min: 250001, max: 400000, rate: 0.09 },
  { min: 400001, max: 750000, rate: 0.115 },
  { min: 750001, max: 1500000, rate: 0.14 },
  { min: 1500001, max: Infinity, rate: 0.16 },
];

function calculateBandedTax(price: number, bands: typeof LBTT_RESIDENTIAL_BANDS): number {
  let tax = 0;
  for (const band of bands) {
    if (price > band.min) {
      const taxableInBand = Math.min(price, band.max) - band.min;
      tax += taxableInBand * band.rate;
    }
  }
  return tax;
}

export default function RegionalCalculators() {
  const [lbttPrice, setLbttPrice] = useState<number>(175000);
  const [lbttBuyerType, setLbttBuyerType] = useState<'additional' | 'main' | 'ftb'>('additional');
  
  const [lttPrice, setLttPrice] = useState<number>(175000);
  const [lttBuyerType, setLttBuyerType] = useState<'additional' | 'main'>('additional');

  // LBTT Calculation
  const lbttBasic = calculateBandedTax(lbttPrice, LBTT_RESIDENTIAL_BANDS);
  const lbttADS = lbttBuyerType === 'additional' ? lbttPrice * LBTT_ADS_RATE : 0;
  const lbttTotal = lbttBasic + lbttADS;
  const lbttEffectiveRate = (lbttTotal / lbttPrice) * 100;

  // LTT Calculation
  const lttBands = lttBuyerType === 'additional' ? LTT_HIGHER_RATES_BANDS : LTT_MAIN_RESIDENCE_BANDS;
  const lttTotal = calculateBandedTax(lttPrice, lttBands);
  const lttEffectiveRate = (lttTotal / lttPrice) * 100;

  return (
    <AppLayout title="Regional Tax Calculators">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Regional Stamp Duty Calculators
          </h1>
          <p className="text-muted-foreground">Calculate property taxes for Scotland (LBTT) and Wales (LTT)</p>
        </div>

        <Tabs defaultValue="lbtt" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lbtt" className="gap-2">
              🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland (LBTT)
            </TabsTrigger>
            <TabsTrigger value="ltt" className="gap-2">
              🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales (LTT)
            </TabsTrigger>
          </TabsList>

          {/* Scotland LBTT */}
          <TabsContent value="lbtt" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>LBTT Calculator</CardTitle>
                  <CardDescription>Land and Buildings Transaction Tax for Scottish property purchases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Property Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input 
                        type="number"
                        value={lbttPrice}
                        onChange={(e) => setLbttPrice(Number(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Buyer Type</Label>
                    <RadioGroup value={lbttBuyerType} onValueChange={(v) => setLbttBuyerType(v as typeof lbttBuyerType)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="additional" id="lbtt-additional" />
                        <Label htmlFor="lbtt-additional">Additional property (6% ADS applies)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="main" id="lbtt-main" />
                        <Label htmlFor="lbtt-main">Main residence / Only property</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ftb" id="lbtt-ftb" />
                        <Label htmlFor="lbtt-ftb">First-time buyer</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
                <CardHeader>
                  <CardTitle>LBTT Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Property Price:</span>
                      <span>£{lbttPrice.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 space-y-1">
                      <div className="font-medium text-sm">LBTT Bands:</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">£0 - £145,000 @ 0%</span>
                        <span>£0</span>
                      </div>
                      {lbttPrice > 145000 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">£145,001 - £{Math.min(lbttPrice, 250000).toLocaleString()} @ 2%</span>
                          <span>£{((Math.min(lbttPrice, 250000) - 145000) * 0.02).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Basic LBTT:</span>
                      <span>£{lbttBasic.toLocaleString()}</span>
                    </div>
                    {lbttBuyerType === 'additional' && (
                      <div className="flex justify-between text-orange-600">
                        <span>Additional Dwelling Supplement (6%):</span>
                        <span>£{lbttADS.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>TOTAL LBTT:</span>
                      <span className="text-primary">£{lbttTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Effective Rate:</span>
                      <span>{lbttEffectiveRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LBTT Rates Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">LBTT Rates (Residential)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Band</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Additional Property</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-2">£0 - £145,000</td><td className="text-right">0%</td><td className="text-right">+6%</td></tr>
                      <tr className="border-b"><td className="py-2">£145,001 - £250,000</td><td className="text-right">2%</td><td className="text-right">+6%</td></tr>
                      <tr className="border-b"><td className="py-2">£250,001 - £325,000</td><td className="text-right">5%</td><td className="text-right">+6%</td></tr>
                      <tr className="border-b"><td className="py-2">£325,001 - £750,000</td><td className="text-right">10%</td><td className="text-right">+6%</td></tr>
                      <tr><td className="py-2">£750,001+</td><td className="text-right">12%</td><td className="text-right">+6%</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wales LTT */}
          <TabsContent value="ltt" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>LTT Calculator</CardTitle>
                  <CardDescription>Land Transaction Tax for Welsh property purchases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Property Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input 
                        type="number"
                        value={lttPrice}
                        onChange={(e) => setLttPrice(Number(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Buyer Type</Label>
                    <RadioGroup value={lttBuyerType} onValueChange={(v) => setLttBuyerType(v as typeof lttBuyerType)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="additional" id="ltt-additional" />
                        <Label htmlFor="ltt-additional">Additional property (higher rates apply)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="main" id="ltt-main" />
                        <Label htmlFor="ltt-main">Main residence</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background">
                <CardHeader>
                  <CardTitle>LTT Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Property Price:</span>
                      <span>£{lttPrice.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 space-y-1">
                      <div className="font-medium text-sm">
                        {lttBuyerType === 'additional' ? 'Higher Rates' : 'Main Residence Rates'}:
                      </div>
                      {lttBuyerType === 'additional' ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">£0 - £180,000 @ 4%</span>
                          <span>£{(Math.min(lttPrice, 180000) * 0.04).toLocaleString()}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">£0 - £225,000 @ 0%</span>
                          <span>£0</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>TOTAL LTT:</span>
                      <span className="text-primary">£{lttTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Effective Rate:</span>
                      <span>{lttEffectiveRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LTT Rates Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">LTT Rates (Main Residence)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Band</th>
                          <th className="text-right py-2">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b"><td className="py-2">£0 - £225,000</td><td className="text-right">0%</td></tr>
                        <tr className="border-b"><td className="py-2">£225,001 - £400,000</td><td className="text-right">6%</td></tr>
                        <tr className="border-b"><td className="py-2">£400,001 - £750,000</td><td className="text-right">7.5%</td></tr>
                        <tr className="border-b"><td className="py-2">£750,001 - £1,500,000</td><td className="text-right">10%</td></tr>
                        <tr><td className="py-2">£1,500,001+</td><td className="text-right">12%</td></tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">LTT Higher Rates (Additional Property)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Band</th>
                          <th className="text-right py-2">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b"><td className="py-2">£0 - £180,000</td><td className="text-right">4%</td></tr>
                        <tr className="border-b"><td className="py-2">£180,001 - £250,000</td><td className="text-right">7.5%</td></tr>
                        <tr className="border-b"><td className="py-2">£250,001 - £400,000</td><td className="text-right">9%</td></tr>
                        <tr className="border-b"><td className="py-2">£400,001 - £750,000</td><td className="text-right">11.5%</td></tr>
                        <tr className="border-b"><td className="py-2">£750,001 - £1,500,000</td><td className="text-right">14%</td></tr>
                        <tr><td className="py-2">£1,500,001+</td><td className="text-right">16%</td></tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Leaf, Calculator, TreeDeciduous, Wind, Lightbulb, TrendingDown, AlertCircle } from "lucide-react";
import { CARBON_FACTORS, CARBON_RATINGS, UK_AVERAGE_CARBON_PER_SQM, OFFSET_PROJECTS } from "@/types/carbon";

// Mock data
const mockPortfolioCarbon = {
  totalEmissions: 8.2,
  ukAverage: 12.6,
  saving: 4.4,
  percentBelow: 35,
};

const mockPropertyCarbon = [
  { id: "1", address: "14 Oak Street", co2_tonnes: 2.4, rating: "C", vs_avg: -28, epc: "D" },
  { id: "2", address: "28 Victoria Road", co2_tonnes: 1.8, rating: "B", vs_avg: -43, epc: "C" },
  { id: "3", address: "7 Park Avenue", co2_tonnes: 2.1, rating: "C", vs_avg: -33, epc: "D" },
  { id: "4", address: "52 High Street", co2_tonnes: 1.9, rating: "B", vs_avg: -40, epc: "C" },
];

export default function CarbonFootprint() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [electricityKwh, setElectricityKwh] = useState("3200");
  const [gasKwh, setGasKwh] = useState("12000");
  const [floorArea, setFloorArea] = useState("85");
  const [calculatedResult, setCalculatedResult] = useState<{
    electricityCarbon: number;
    gasCarbon: number;
    totalCarbon: number;
    carbonPerSqm: number;
    rating: string;
    vsAverage: number;
  } | null>(null);

  const calculateCarbon = () => {
    const elecCarbon = (parseFloat(electricityKwh) || 0) * CARBON_FACTORS.electricity / 1000;
    const gasCarbon = (parseFloat(gasKwh) || 0) * CARBON_FACTORS.gas / 1000;
    const total = elecCarbon + gasCarbon;
    const area = parseFloat(floorArea) || 1;
    const perSqm = (total * 1000) / area;
    
    const rating = CARBON_RATINGS.find(r => perSqm <= r.maxCarbon)?.rating || "G";
    const vsAverage = ((perSqm - UK_AVERAGE_CARBON_PER_SQM) / UK_AVERAGE_CARBON_PER_SQM) * 100;

    setCalculatedResult({
      electricityCarbon: elecCarbon,
      gasCarbon: gasCarbon,
      totalCarbon: total,
      carbonPerSqm: perSqm,
      rating,
      vsAverage,
    });
  };

  const getRatingColor = (rating: string) => {
    const ratingData = CARBON_RATINGS.find(r => r.rating === rating);
    return ratingData?.color || "#666";
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Carbon Footprint</h1>
            <p className="text-muted-foreground">Track and reduce your portfolio's environmental impact</p>
          </div>
          <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
            <DialogTrigger asChild>
              <Button><Calculator className="h-4 w-4 mr-2" />Calculate for Property</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Calculate Carbon Footprint</DialogTitle>
                <DialogDescription>Enter energy consumption to calculate emissions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Property</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">14 Oak Street</SelectItem>
                      <SelectItem value="2">28 Victoria Road</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Floor Area (sqm)</Label>
                  <Input 
                    type="number" 
                    value={floorArea}
                    onChange={(e) => setFloorArea(e.target.value)}
                    placeholder="85" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Electricity (kWh)</Label>
                  <Input 
                    type="number" 
                    value={electricityKwh}
                    onChange={(e) => setElectricityKwh(e.target.value)}
                    placeholder="3200" 
                  />
                  <p className="text-xs text-muted-foreground">UK average home: ~2,700 kWh</p>
                </div>
                <div className="space-y-2">
                  <Label>Annual Gas (kWh)</Label>
                  <Input 
                    type="number" 
                    value={gasKwh}
                    onChange={(e) => setGasKwh(e.target.value)}
                    placeholder="12000" 
                  />
                  <p className="text-xs text-muted-foreground">UK average home: ~12,000 kWh</p>
                </div>
                <Button className="w-full" onClick={calculateCarbon}>Calculate</Button>

                {calculatedResult && (
                  <Card className="mt-4">
                    <CardContent className="pt-6 space-y-4">
                      <h4 className="font-semibold">Emissions Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Electricity ({electricityKwh} kWh × {CARBON_FACTORS.electricity}):</span>
                          <span>{calculatedResult.electricityCarbon.toFixed(2)} tonnes CO2e</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gas ({gasKwh} kWh × {CARBON_FACTORS.gas}):</span>
                          <span>{calculatedResult.gasCarbon.toFixed(2)} tonnes CO2e</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Total Annual Emissions:</span>
                          <span>{calculatedResult.totalCarbon.toFixed(2)} tonnes CO2e</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per Square Metre:</span>
                          <span>{calculatedResult.carbonPerSqm.toFixed(1)} kg CO2e/sqm</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">Carbon Rating:</span>
                        <Badge style={{ backgroundColor: getRatingColor(calculatedResult.rating) }}>
                          {calculatedResult.rating}
                        </Badge>
                        <span className={calculatedResult.vsAverage < 0 ? "text-green-600" : "text-red-600"}>
                          {calculatedResult.vsAverage > 0 ? "+" : ""}{calculatedResult.vsAverage.toFixed(0)}% vs UK average
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio Overview */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Your Portfolio Carbon Footprint</h2>
                <p className="text-3xl font-bold text-green-600">{mockPortfolioCarbon.totalEmissions} tonnes CO2e/year</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Your Portfolio</span>
                <span>UK Average ({mockPropertyCarbon.length} properties)</span>
              </div>
              <Progress value={100 - mockPortfolioCarbon.percentBelow} className="h-3" />
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{mockPortfolioCarbon.totalEmissions}t</span>
                <span className="text-muted-foreground">{mockPortfolioCarbon.ukAverage}t</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingDown className="h-4 w-4" />
                <span className="font-medium">
                  {mockPortfolioCarbon.percentBelow}% below UK average | Saving {mockPortfolioCarbon.saving} tonnes CO2e/year 🌱
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>By Property</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>CO2/year</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>vs Average</TableHead>
                  <TableHead>EPC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPropertyCarbon.map(property => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.address}</TableCell>
                    <TableCell>{property.co2_tonnes}t</TableCell>
                    <TableCell>
                      <Badge style={{ backgroundColor: getRatingColor(property.rating) }}>
                        {property.rating}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-600">{property.vs_avg}%</TableCell>
                    <TableCell>{property.epc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Switch to 100% renewable electricity</h4>
                  <p className="text-sm text-muted-foreground">Reduce emissions by up to 0.75t (-25%)</p>
                </div>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Install smart thermostats</h4>
                  <p className="text-sm text-muted-foreground">Reduce emissions by up to 0.3t (-10%)</p>
                </div>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Add loft insulation</h4>
                  <p className="text-sm text-muted-foreground">Reduce emissions by up to 0.5t (-17%)</p>
                </div>
                <Button variant="outline" size="sm">Get Quotes</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offset Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreeDeciduous className="h-5 w-5" />
              Offset Your Emissions
            </CardTitle>
            <CardDescription>
              Your portfolio: {mockPortfolioCarbon.totalEmissions} tonnes CO2e/year | 
              Offset cost: ~£{(mockPortfolioCarbon.totalEmissions * 12).toFixed(0)}/year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {OFFSET_PROJECTS.map(project => (
                <Card key={project.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      {project.id === 'uk-woodland' ? (
                        <TreeDeciduous className="h-5 w-5 text-green-600" />
                      ) : (
                        <Wind className="h-5 w-5 text-blue-600" />
                      )}
                      <h4 className="font-medium">{project.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    <p className="text-sm">£{project.pricePerTonne}/tonne | {project.standard}</p>
                    <Button className="w-full mt-4" variant="outline">
                      Offset {mockPortfolioCarbon.totalEmissions}t = £{(mockPortfolioCarbon.totalEmissions * project.pricePerTonne).toFixed(0)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, TrendingUp, MapPin, Download, Save, RefreshCw } from "lucide-react";
import { useValuationStore } from "@/stores/valuationStore";
import { PROPERTY_FEATURES, ValuationInput } from "@/types/valuation";

export default function PropertyValuation() {
  const { currentValuation, generateValuation, isLoading } = useValuationStore();
  const [formData, setFormData] = useState<ValuationInput>({
    address: "",
    postcode: "",
    property_type: "terraced",
    bedrooms: 3,
    bathrooms: 1,
    square_footage: undefined,
    condition: "good",
    features: [],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateValuation(formData);
  };

  return (
    <AppLayout title="AI Property Valuation">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Example Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    placeholder="M14 5TH"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terraced">Terraced</SelectItem>
                      <SelectItem value="semi">Semi-Detached</SelectItem>
                      <SelectItem value="detached">Detached</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="bungalow">Bungalow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min={1}
                    max={10}
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min={1}
                    max={5}
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Sq Ft</Label>
                  <Input
                    id="sqft"
                    type="number"
                    value={formData.square_footage || ""}
                    onChange={(e) => setFormData({ ...formData, square_footage: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>
                <div className="flex gap-2">
                  {(["excellent", "good", "fair", "poor"] as const).map((c) => (
                    <Button
                      key={c}
                      type="button"
                      variant={formData.condition === c ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, condition: c })}
                      className="capitalize"
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Get Valuation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {currentValuation ? (
          <div className="space-y-4">
            {/* Main Valuation */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(currentValuation.estimated_value || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Range: {formatCurrency(currentValuation.value_range_low || 0)} - {formatCurrency(currentValuation.value_range_high || 0)}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Confidence</span>
                    <span className="font-medium">{currentValuation.confidence_score}%</span>
                  </div>
                  <Progress value={currentValuation.confidence_score} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(currentValuation.estimated_rent_pcm || 0)}</p>
                    <p className="text-xs text-muted-foreground">Monthly Rent</p>
                    <p className="text-xs text-muted-foreground">
                      ({formatCurrency(currentValuation.rent_range_low || 0)} - {formatCurrency(currentValuation.rent_range_high || 0)})
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{currentValuation.estimated_yield}%</p>
                    <p className="text-xs text-muted-foreground">Gross Yield</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comparables */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Recent Comparables
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                      <TableHead className="text-right">Dist</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentValuation.comparables?.map((comp, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{comp.address}</TableCell>
                        <TableCell className="text-right">{formatCurrency(comp.price)}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {new Date(comp.date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">{comp.distance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Valuation Factors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Valuation Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentValuation.valuation_factors?.map((factor, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{factor.name}</p>
                      <p className="text-xs text-muted-foreground">{factor.description}</p>
                    </div>
                    <Badge variant={factor.impact >= 0 ? "default" : "secondary"}>
                      {factor.impact > 0 ? '+' : ''}{formatCurrency(factor.impact)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="flex items-center justify-center min-h-[400px]">
            <CardContent className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Enter Property Details</h3>
              <p className="text-muted-foreground text-sm">
                Fill in the property information to get an AI-powered valuation estimate.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

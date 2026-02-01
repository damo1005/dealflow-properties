import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  Home,
  Building2,
  User,
  Globe,
  Info,
  ChevronDown,
  Save,
  FileText,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
} from "lucide-react";
import { calculateSDLT, SDLTInput } from "@/lib/taxCalculations";
import { CurrencyInput } from "./CurrencyInput";
import { toast } from "sonner";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function SDLTCalculator() {
  const [location, setLocation] = useState<"england" | "scotland" | "wales">("england");
  const [purchasePrice, setPurchasePrice] = useState<number>(350000);
  const [propertyType, setPropertyType] = useState<"residential" | "non_residential" | "mixed">("residential");
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [isAdditionalProperty, setIsAdditionalProperty] = useState(true);
  const [isNonUKResident, setIsNonUKResident] = useState(false);
  const [isCompanyPurchase, setIsCompanyPurchase] = useState(false);
  const [isHighValueCompanyPurchase, setIsHighValueCompanyPurchase] = useState(false);

  const input: SDLTInput = {
    purchasePrice,
    propertyType,
    location,
    isFirstTimeBuyer: isFirstTimeBuyer && !isAdditionalProperty,
    isAdditionalProperty,
    isNonUKResident,
    isCompanyPurchase,
    isHighValueCompanyPurchase,
  };

  const result = useMemo(() => calculateSDLT(input), [input]);

  // Calculate comparison scenarios
  const scenarios = useMemo(() => {
    const ftbResult = calculateSDLT({ ...input, isFirstTimeBuyer: true, isAdditionalProperty: false });
    const standardResult = calculateSDLT({ ...input, isFirstTimeBuyer: false, isAdditionalProperty: false });
    const additionalResult = calculateSDLT({ ...input, isAdditionalProperty: true });
    const nonUKResult = calculateSDLT({ ...input, isNonUKResident: true });

    return [
      { label: "First-time buyer", sdlt: ftbResult.totalSDLT, rate: ftbResult.effectiveRate, eligible: purchasePrice <= 625000 },
      { label: "Standard purchase", sdlt: standardResult.totalSDLT, rate: standardResult.effectiveRate, eligible: true },
      { label: "Additional property", sdlt: additionalResult.totalSDLT, rate: additionalResult.effectiveRate, eligible: true },
      { label: "Non-UK resident", sdlt: nonUKResult.totalSDLT, rate: nonUKResult.effectiveRate, eligible: true },
    ];
  }, [input, purchasePrice]);

  const handleSave = () => {
    toast.success("Calculation saved successfully");
  };

  const getLocationLabel = () => {
    switch (location) {
      case "scotland": return "LBTT";
      case "wales": return "LTT";
      default: return "SDLT";
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Side - Inputs */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Stamp Duty Calculator
            </CardTitle>
            <CardDescription>
              Calculate SDLT, LBTT, or LTT for your UK property purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location Tabs */}
            <Tabs value={location} onValueChange={(v) => setLocation(v as typeof location)}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="england">England & NI</TabsTrigger>
                <TabsTrigger value="scotland">Scotland</TabsTrigger>
                <TabsTrigger value="wales">Wales</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Purchase Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Purchase Price
              </Label>
              <CurrencyInput
                value={purchasePrice}
                onChange={setPurchasePrice}
                placeholder="Enter purchase price"
              />
            </div>

            {/* Property Type */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Property Type
              </Label>
              <RadioGroup
                value={propertyType}
                onValueChange={(v) => setPropertyType(v as typeof propertyType)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="residential" id="residential" />
                  <Label htmlFor="residential" className="cursor-pointer">Residential</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non_residential" id="non_residential" />
                  <Label htmlFor="non_residential" className="cursor-pointer">Non-Residential (Commercial)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="cursor-pointer">Mixed Use</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Buyer Information */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Buyer Information
              </h4>

              {/* First-time buyer */}
              <div className="space-y-2">
                <Label>Are you a first-time buyer?</Label>
                <RadioGroup
                  value={isFirstTimeBuyer ? "yes" : "no"}
                  onValueChange={(v) => setIsFirstTimeBuyer(v === "yes")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="ftb-yes" />
                    <Label htmlFor="ftb-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="ftb-no" />
                    <Label htmlFor="ftb-no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
                {isFirstTimeBuyer && purchasePrice > 625000 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    First-time buyer relief only applies to properties up to £625,000
                  </p>
                )}
              </div>

              {/* Additional property */}
              <div className="space-y-2">
                <Label>Is this an additional property?</Label>
                <RadioGroup
                  value={isAdditionalProperty ? "yes" : "no"}
                  onValueChange={(v) => setIsAdditionalProperty(v === "yes")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="add-yes" />
                    <Label htmlFor="add-yes" className="cursor-pointer">Yes (BTL, second home)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="add-no" />
                    <Label htmlFor="add-no" className="cursor-pointer">No (main residence)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Non-UK resident */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Are you a non-UK resident?
                </Label>
                <RadioGroup
                  value={isNonUKResident ? "yes" : "no"}
                  onValueChange={(v) => setIsNonUKResident(v === "yes")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="nonuk-yes" />
                    <Label htmlFor="nonuk-yes" className="cursor-pointer">Yes (+2% surcharge)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="nonuk-no" />
                    <Label htmlFor="nonuk-no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Company Purchase */}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Purchase (Optional)
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Buying through a company?</Label>
                  <RadioGroup
                    value={isCompanyPurchase ? "yes" : "no"}
                    onValueChange={(v) => setIsCompanyPurchase(v === "yes")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="company-yes" />
                      <Label htmlFor="company-yes" className="cursor-pointer">Yes (Ltd Company)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="company-no" />
                      <Label htmlFor="company-no" className="cursor-pointer">No (Personal)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {isCompanyPurchase && (
                  <div className="space-y-2">
                    <Label>Property value over £500k?</Label>
                    <RadioGroup
                      value={isHighValueCompanyPurchase ? "yes" : "no"}
                      onValueChange={(v) => setIsHighValueCompanyPurchase(v === "yes")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="highvalue-yes" />
                        <Label htmlFor="highvalue-yes" className="cursor-pointer">Yes (15% ATED rate)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="highvalue-no" />
                        <Label htmlFor="highvalue-no" className="cursor-pointer">No (Standard rates)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Results */}
      <div className="space-y-6">
        {/* Main Result Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Your {getLocationLabel()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total */}
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(result.totalSDLT)}
              </p>
              <p className="text-muted-foreground mt-1">
                Effective Rate: {result.effectiveRate.toFixed(2)}%
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tax as % of purchase price</span>
                <span className="font-medium">{result.effectiveRate.toFixed(2)}%</span>
              </div>
              <Progress value={Math.min(result.effectiveRate * 5, 100)} className="h-2" />
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium">Breakdown by Band</h4>
              <div className="space-y-2">
                {result.breakdown.map((band, i) => (
                  <div key={i} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                    <div>
                      <span className="font-medium">{band.band}</span>
                      <span className="text-muted-foreground ml-2">@ {band.rate}%</span>
                    </div>
                    <span className="font-medium">{formatCurrency(band.tax)}</span>
                  </div>
                ))}
              </div>

              {/* Surcharges */}
              {(result.additionalPropertySurcharge > 0 || result.nonUKResidentSurcharge > 0) && (
                <div className="border-t pt-3 space-y-2">
                  {result.additionalPropertySurcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600">Additional Property Surcharge</span>
                      <span className="text-amber-600">+{formatCurrency(result.additionalPropertySurcharge)}</span>
                    </div>
                  )}
                  {result.nonUKResidentSurcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600">Non-UK Resident Surcharge</span>
                      <span className="text-amber-600">+{formatCurrency(result.nonUKResidentSurcharge)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total {getLocationLabel()}</span>
                <span>{formatCurrency(result.totalSDLT)}</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">{result.explanation}</p>
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

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Scenario Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scenarios.map((scenario, i) => {
                const isCurrent = 
                  (scenario.label === "First-time buyer" && isFirstTimeBuyer && !isAdditionalProperty) ||
                  (scenario.label === "Standard purchase" && !isFirstTimeBuyer && !isAdditionalProperty && !isNonUKResident) ||
                  (scenario.label === "Additional property" && isAdditionalProperty && !isNonUKResident) ||
                  (scenario.label === "Non-UK resident" && isNonUKResident);

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isCurrent 
                        ? "bg-primary/10 border border-primary/20" 
                        : "bg-muted/50"
                    } ${!scenario.eligible ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      {isCurrent && <CheckCircle className="h-4 w-4 text-primary" />}
                      <span className={isCurrent ? "font-medium" : ""}>{scenario.label}</span>
                      {isCurrent && <Badge variant="secondary" className="text-xs">You</Badge>}
                      {!scenario.eligible && <Badge variant="outline" className="text-xs">N/A</Badge>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(scenario.sdlt)}</p>
                      <p className="text-xs text-muted-foreground">{scenario.rate.toFixed(2)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Helpful Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                <span className="font-medium text-sm">💡 First-Time Buyer Relief</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                You're a first-time buyer if you've never owned a property anywhere in the world. 
                The property must cost £625,000 or less, and you'll live in it as your main residence. 
                Pay no SDLT on properties up to £425,000!
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                <span className="font-medium text-sm">💡 Additional Property Surcharge</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                You pay the 3% surcharge if you already own a property worth over £40,000, 
                you're buying a second home or BTL, or you don't sell your main home before completion. 
                You can claim a refund if you sell your previous main residence within 3 years.
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted">
                <span className="font-medium text-sm">⚠️ Non-UK Residents</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 text-sm text-muted-foreground">
                From April 2021, non-UK residents pay an extra 2% surcharge on residential 
                property purchases in England and Northern Ireland.
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

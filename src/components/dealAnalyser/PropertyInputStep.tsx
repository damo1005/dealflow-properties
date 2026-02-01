import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, MapPin, Edit, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useDealAnalysisStore } from "@/stores/dealAnalysisStore";
import { PropertyType } from "@/types/dealAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "terraced", label: "Terraced" },
  { value: "semi-detached", label: "Semi-Detached" },
  { value: "detached", label: "Detached" },
  { value: "flat", label: "Flat / Apartment" },
  { value: "bungalow", label: "Bungalow" },
  { value: "hmo", label: "HMO" },
  { value: "commercial", label: "Commercial" },
];

interface FetchedPropertyData {
  address: string;
  postcode: string;
  price: number;
  priceText: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  tenure: string;
  description: string;
  features: string[];
  images: string[];
  floorArea: number | null;
  epcRating: string | null;
  agent: string;
  listingUrl: string;
  source: string;
}

function mapPropertyType(type: string): PropertyType {
  const lower = type.toLowerCase();
  if (lower.includes("terrace")) return "terraced";
  if (lower.includes("semi")) return "semi-detached";
  if (lower.includes("detached")) return "detached";
  if (lower.includes("flat") || lower.includes("apartment")) return "flat";
  if (lower.includes("bungalow")) return "bungalow";
  if (lower.includes("hmo")) return "hmo";
  if (lower.includes("commercial")) return "commercial";
  return "terraced";
}

export function PropertyInputStep() {
  const { property, setProperty, setStep, setFinancials } = useDealAnalysisStore();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<FetchedPropertyData | null>(null);

  const handleFetchUrl = async () => {
    if (!url) {
      toast.error("Please enter a property URL");
      return;
    }

    // Validate URL format
    if (!url.includes("rightmove.co.uk") && !url.includes("zoopla.co.uk") && !url.includes("onthemarket.com")) {
      toast.error("Please enter a valid Rightmove, Zoopla, or OnTheMarket URL");
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    setFetchedData(null);

    try {
      const { data, error } = await supabase.functions.invoke("fetch-property-listing", {
        body: { url },
      });

      if (error) {
        throw new Error(error.message || "Failed to fetch property");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch property data");
      }

      const propertyData = data.data as FetchedPropertyData;
      setFetchedData(propertyData);

      // Auto-populate form fields
      setProperty({
        inputMethod: "url",
        sourceUrl: url,
        sourcePlatform: propertyData.source.charAt(0).toUpperCase() + propertyData.source.slice(1),
        address: propertyData.address,
        postcode: propertyData.postcode,
        propertyType: mapPropertyType(propertyData.propertyType),
        bedrooms: propertyData.bedrooms || 1,
        bathrooms: propertyData.bathrooms || 1,
        squareFootage: propertyData.floorArea || undefined,
      });

      // Also set asking price in financials
      if (propertyData.price > 0) {
        setFinancials({
          askingPrice: propertyData.price,
          offerPrice: Math.round(propertyData.price * 0.95), // Default 5% below asking
        });
      }

      toast.success("Property data fetched successfully!");
    } catch (error: any) {
      console.error("Fetch error:", error);
      setFetchError(error.message || "Failed to fetch property");
      toast.error(`Failed to fetch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const canContinue = property.postcode && property.propertyType && property.bedrooms;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          Property Information
        </CardTitle>
        <p className="text-muted-foreground">
          How would you like to input the property?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          defaultValue={property.inputMethod}
          onValueChange={(v) => setProperty({ inputMethod: v as "url" | "address" | "manual" })}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url" className="gap-2">
              <Link className="h-4 w-4" />
              Paste URL
            </TabsTrigger>
            <TabsTrigger value="address" className="gap-2">
              <MapPin className="h-4 w-4" />
              Enter Address
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <Edit className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Property URL</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste Rightmove, Zoopla or OnTheMarket URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={handleFetchUrl} disabled={isLoading || !url}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Fetch"
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported: Rightmove, Zoopla, OnTheMarket, Auction House sites
              </p>
            </div>

            {fetchedData && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 space-y-2">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  Property data fetched from {fetchedData.source}
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">{fetchedData.address}</p>
                  <p className="text-muted-foreground">
                    {fetchedData.bedrooms} bed {fetchedData.propertyType.toLowerCase()} • 
                    {fetchedData.tenure} • 
                    {fetchedData.priceText}
                  </p>
                  {fetchedData.floorArea && (
                    <p className="text-muted-foreground">{fetchedData.floorArea} sq ft</p>
                  )}
                  {fetchedData.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {fetchedData.features.slice(0, 5).map((f, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                      {fetchedData.features.length > 5 && (
                        <Badge variant="outline" className="text-xs">+{fetchedData.features.length - 5} more</Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {fetchError && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-1">
                  <AlertCircle className="h-5 w-5" />
                  Failed to fetch property
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm">{fetchError}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Try using "Enter Address" or "Manual Entry" instead. Some property pages may block automated access.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="address" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Search Address</Label>
              <Input
                placeholder="Start typing address..."
                value={property.address || ""}
                onChange={(e) => setProperty({ address: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Address autocomplete powered by PropertyData API
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Postcode</Label>
                <Input
                  placeholder="e.g. M14 5AB"
                  value={property.postcode}
                  onChange={(e) => setProperty({ postcode: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={property.propertyType}
                  onValueChange={(v) => setProperty({ propertyType: v as PropertyType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type *</Label>
                <Select
                  value={property.propertyType}
                  onValueChange={(v) => setProperty({ propertyType: v as PropertyType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Postcode *</Label>
                <Input
                  placeholder="e.g. M14 5AB"
                  value={property.postcode}
                  onChange={(e) => setProperty({ postcode: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bedrooms *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    variant={property.bedrooms === num ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setProperty({ bedrooms: num })}
                  >
                    {num}{num === 5 ? "+" : ""}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <Button
                    key={num}
                    variant={property.bathrooms === num ? "default" : "outline"}
                    className="w-20"
                    onClick={() => setProperty({ bathrooms: num })}
                  >
                    {num}{num === 3 ? "+" : ""}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Square Footage (optional)</Label>
              <Input
                type="number"
                placeholder="e.g. 1200"
                value={property.squareFootage || ""}
                onChange={(e) => setProperty({ squareFootage: parseInt(e.target.value) || undefined })}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setStep(2)} disabled={!canContinue} size="lg">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

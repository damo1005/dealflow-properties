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
import { Link, MapPin, Edit, ArrowRight, Loader2 } from "lucide-react";
import { useDealAnalysisStore } from "@/stores/dealAnalysisStore";
import { PropertyType } from "@/types/dealAnalysis";

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "terraced", label: "Terraced" },
  { value: "semi-detached", label: "Semi-Detached" },
  { value: "detached", label: "Detached" },
  { value: "flat", label: "Flat / Apartment" },
  { value: "bungalow", label: "Bungalow" },
  { value: "hmo", label: "HMO" },
  { value: "commercial", label: "Commercial" },
];

export function PropertyInputStep() {
  const { property, setProperty, setStep } = useDealAnalysisStore();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

  const handleFetchUrl = async () => {
    if (!url) return;
    setIsLoading(true);
    // In production, this would call an API to scrape property data
    setTimeout(() => {
      setProperty({
        inputMethod: "url",
        sourceUrl: url,
        sourcePlatform: url.includes("rightmove") ? "Rightmove" : url.includes("zoopla") ? "Zoopla" : "Other",
        address: "123 Example Street",
        postcode: "M14 5AB",
        propertyType: "terraced",
        bedrooms: 3,
        bathrooms: 1,
      });
      setIsLoading(false);
    }, 1500);
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

            {property.sourceUrl && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="font-medium">✓ Property data fetched</p>
                <p className="text-sm text-muted-foreground">
                  {property.address}, {property.postcode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {property.bedrooms} bed {property.propertyType}
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

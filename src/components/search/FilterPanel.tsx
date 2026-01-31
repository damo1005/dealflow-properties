import { MapPin, Home, DollarSign, BedDouble, Sparkles, TrendingUp, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "@/stores/searchStore";
import { cn } from "@/lib/utils";

const propertyTypes = [
  "Terraced",
  "Semi-detached",
  "Detached",
  "Flat/Apartment",
  "Bungalow",
];

const regions = ["England", "Wales", "Scotland", "Northern Ireland"];

const features = ["Garden", "Parking", "New build", "Auction"];

const bedroomOptions = ["Any", "1", "2", "3", "4", "5+"];
const bathroomOptions = ["Any", "1", "2", "3", "4+"];

interface FilterPanelProps {
  className?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterPanel({ className, onClose, isMobile }: FilterPanelProps) {
  const { filters, setFilters, resetFilters } = useSearchStore();

  const handlePropertyTypeToggle = (type: string) => {
    const current = filters.propertyTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setFilters({ propertyTypes: updated });
  };

  const handleFeatureToggle = (feature: string) => {
    const current = filters.features;
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    setFilters({ features: updated });
  };

  return (
    <div className={cn("bg-card border-r border-border flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Filters</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear all
          </Button>
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={["location", "property-type", "price"]} className="space-y-2">
            {/* Location Filters */}
            <AccordionItem value="location" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Location</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Postcode or Town</Label>
                  <Input
                    id="location"
                    placeholder="e.g. SW1A 1AA or London"
                    value={filters.location}
                    onChange={(e) => setFilters({ location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select
                    value={filters.region}
                    onValueChange={(value) => setFilters({ region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region.toLowerCase()}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Radius</Label>
                    <span className="text-sm text-muted-foreground">{filters.radius} miles</span>
                  </div>
                  <Slider
                    value={[filters.radius]}
                    onValueChange={([value]) => setFilters({ radius: value })}
                    min={1}
                    max={50}
                    step={1}
                    className="py-2"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Property Type */}
            <AccordionItem value="property-type" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-medium">Property Type</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {propertyTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.propertyTypes.includes(type)}
                      onCheckedChange={() => handlePropertyTypeToggle(type)}
                    />
                    <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Label htmlFor="commercial" className="text-sm">Include commercial</Label>
                  <Switch
                    id="commercial"
                    checked={filters.includeCommercial}
                    onCheckedChange={(checked) => setFilters({ includeCommercial: checked })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price & Financials */}
            <AccordionItem value="price" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-medium">Price & Financials</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="minPrice">Min Price</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="£0"
                      value={filters.minPrice || ""}
                      onChange={(e) => setFilters({ minPrice: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Max Price</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="£1,000,000"
                      value={filters.maxPrice || ""}
                      onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="priceReduced" className="text-sm">Price reduced only</Label>
                  <Switch
                    id="priceReduced"
                    checked={filters.priceReduced}
                    onCheckedChange={(checked) => setFilters({ priceReduced: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Below Market Value</Label>
                    <span className="text-sm text-muted-foreground">{filters.belowMarketValue}%</span>
                  </div>
                  <Slider
                    value={[filters.belowMarketValue]}
                    onValueChange={([value]) => setFilters({ belowMarketValue: value })}
                    min={0}
                    max={50}
                    step={5}
                    className="py-2"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Bedrooms & Bathrooms */}
            <AccordionItem value="bedrooms" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-primary" />
                  <span className="font-medium">Bedrooms & Bathrooms</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Min Bedrooms</Label>
                    <Select
                      value={filters.minBedrooms.toString()}
                      onValueChange={(value) => setFilters({ minBedrooms: value === "Any" ? 0 : Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        {bedroomOptions.map((opt) => (
                          <SelectItem key={opt} value={opt === "Any" ? "0" : opt.replace("+", "")}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Bedrooms</Label>
                    <Select
                      value={filters.maxBedrooms.toString()}
                      onValueChange={(value) => setFilters({ maxBedrooms: value === "Any" ? 10 : Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        {bedroomOptions.map((opt) => (
                          <SelectItem key={opt} value={opt === "Any" ? "10" : opt.replace("+", "")}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Min Bathrooms</Label>
                    <Select
                      value={filters.minBathrooms.toString()}
                      onValueChange={(value) => setFilters({ minBathrooms: value === "Any" ? 0 : Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        {bathroomOptions.map((opt) => (
                          <SelectItem key={opt} value={opt === "Any" ? "0" : opt.replace("+", "")}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Bathrooms</Label>
                    <Select
                      value={filters.maxBathrooms.toString()}
                      onValueChange={(value) => setFilters({ maxBathrooms: value === "Any" ? 5 : Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        {bathroomOptions.map((opt) => (
                          <SelectItem key={opt} value={opt === "Any" ? "5" : opt.replace("+", "")}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Property Features */}
            <AccordionItem value="features" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">Features</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                      {feature}
                    </Label>
                  </div>
                ))}

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="modernisation" className="text-sm">Needs modernisation</Label>
                    <Switch
                      id="modernisation"
                      checked={filters.needsModernisation}
                      onCheckedChange={(checked) => setFilters({ needsModernisation: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="backOnMarket" className="text-sm">Back on market</Label>
                    <Switch
                      id="backOnMarket"
                      checked={filters.backOnMarket}
                      onCheckedChange={(checked) => setFilters({ backOnMarket: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="repossessed" className="text-sm">Repossessed</Label>
                    <Switch
                      id="repossessed"
                      checked={filters.repossessed}
                      onCheckedChange={(checked) => setFilters({ repossessed: checked })}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Investment Metrics */}
            <AccordionItem value="investment" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">Investment Metrics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Minimum Yield</Label>
                    <span className="text-sm text-muted-foreground">{filters.minYield}%</span>
                  </div>
                  <Slider
                    value={[filters.minYield]}
                    onValueChange={([value]) => setFilters({ minYield: value })}
                    min={0}
                    max={15}
                    step={0.5}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPurchase">Max Purchase Price</Label>
                  <Input
                    id="maxPurchase"
                    type="number"
                    placeholder="£0"
                    value={filters.maxPurchasePrice || ""}
                    onChange={(e) => setFilters({ maxPurchasePrice: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetROI">Target ROI (%)</Label>
                  <Input
                    id="targetROI"
                    type="number"
                    placeholder="0"
                    value={filters.targetROI || ""}
                    onChange={(e) => setFilters({ targetROI: Number(e.target.value) })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>

      {/* Apply Button (Mobile) */}
      {isMobile && (
        <div className="p-4 border-t border-border">
          <Button className="w-full" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}

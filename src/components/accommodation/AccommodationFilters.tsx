import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AccommodationFilters as FiltersType } from "@/types/accommodation";
import { cn } from "@/lib/utils";

interface AccommodationFiltersProps {
  filters: FiltersType;
  onUpdateFilters: (filters: Partial<FiltersType>) => void;
  onReset: () => void;
}

const propertyTypeOptions = [
  { id: "studio", label: "Studio" },
  { id: "1-bed", label: "1 Bed" },
  { id: "2-bed", label: "2 Bed" },
  { id: "3-bed", label: "3+ Bed" },
  { id: "house", label: "House" },
  { id: "flat", label: "Flat" },
];

export function AccommodationFilters({ filters, onUpdateFilters, onReset }: AccommodationFiltersProps) {
  const formatBudget = (amount: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(amount);

  const togglePropertyType = (type: string) => {
    const current = filters.propertyTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onUpdateFilters({ propertyTypes: updated });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Request Type */}
        <div className="space-y-3">
          <Label className="font-medium">Request Type</Label>
          <RadioGroup
            value={filters.requestType}
            onValueChange={(v) => onUpdateFilters({ requestType: v as FiltersType["requestType"] })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal">All Requests</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seeking" id="seeking" />
              <Label htmlFor="seeking" className="font-normal">Seeking Accommodation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offering" id="offering" />
              <Label htmlFor="offering" className="font-normal">Offering Accommodation</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-3">
          <Label className="font-medium">Location / Postcode</Label>
          <Input
            placeholder="e.g. EN3, SW11"
            value={filters.location}
            onChange={(e) => onUpdateFilters({ location: e.target.value })}
          />
        </div>

        <Separator />

        {/* Budget Range */}
        <div className="space-y-3">
          <Label className="font-medium">Budget Range</Label>
          <div className="pt-2">
            <Slider
              value={[filters.budgetMin, filters.budgetMax]}
              min={0}
              max={5000}
              step={100}
              onValueChange={([min, max]) => onUpdateFilters({ budgetMin: min, budgetMax: max })}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {formatBudget(filters.budgetMin)} - {formatBudget(filters.budgetMax)}
          </p>
        </div>

        <Separator />

        {/* Property Type */}
        <div className="space-y-3">
          <Label className="font-medium">Property Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={filters.propertyTypes.includes(option.id)}
                  onCheckedChange={() => togglePropertyType(option.id)}
                />
                <Label htmlFor={option.id} className="font-normal text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Duration */}
        <div className="space-y-3">
          <Label className="font-medium">Duration</Label>
          <RadioGroup
            value={filters.duration}
            onValueChange={(v) => onUpdateFilters({ duration: v as FiltersType["duration"] })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="any-duration" />
              <Label htmlFor="any-duration" className="font-normal">Any</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="short" id="short-term" />
              <Label htmlFor="short-term" className="font-normal">Short-term (&lt;6 months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="long" id="long-term" />
              <Label htmlFor="long-term" className="font-normal">Long-term (6+ months)</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Special Requirements */}
        <div className="space-y-3">
          <Label className="font-medium">Requirements</Label>
          <div className="space-y-2">
            {[
              { key: "selfContained", label: "Self-contained only" },
              { key: "noSharing", label: "No sharing" },
              { key: "parking", label: "Parking required" },
              { key: "petFriendly", label: "Pet-friendly" },
              { key: "familyFriendly", label: "Family-friendly" },
            ].map((item) => (
              <div key={item.key} className="flex items-center space-x-2">
                <Checkbox
                  id={item.key}
                  checked={filters[item.key as keyof FiltersType] as boolean}
                  onCheckedChange={(checked) =>
                    onUpdateFilters({ [item.key]: checked })
                  }
                />
                <Label htmlFor={item.key} className="font-normal text-sm">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useContractorStore } from "@/stores/contractorStore";
import type { ContractorCategory } from "@/types/contractor";
import { MapPin, Filter } from "lucide-react";

interface ContractorFiltersProps {
  categories: ContractorCategory[];
}

export function ContractorFilters({ categories }: ContractorFiltersProps) {
  const { filters, updateFilters, resetFilters } = useContractorStore();

  return (
    <div className="space-y-4">
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilters({ 
                categorySlug: filters.categorySlug === cat.slug ? null : cat.slug 
              })}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                filters.categorySlug === cat.slug 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.category_name}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="postcode" className="text-xs">Postcode/Area</Label>
            <Input
              id="postcode"
              placeholder="e.g. EN3"
              value={filters.postcode}
              onChange={(e) => updateFilters({ postcode: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Within</Label>
            <select
              value={filters.radius}
              onChange={(e) => updateFilters({ radius: parseInt(e.target.value) })}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value={5}>5 miles</option>
              <option value={10}>10 miles</option>
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Qualifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'gassSafeOnly', label: 'Gas Safe registered' },
            { key: 'niceicOnly', label: 'NICEIC approved' },
            { key: 'dbsCheckedOnly', label: 'DBS checked' },
            { key: 'publicLiabilityOnly', label: 'Public liability insurance' },
          ].map((filter) => (
            <div key={filter.key} className="flex items-center space-x-2">
              <Checkbox
                id={filter.key}
                checked={filters[filter.key as keyof typeof filters] as boolean}
                onCheckedChange={(checked) => 
                  updateFilters({ [filter.key]: checked })
                }
              />
              <Label htmlFor={filter.key} className="text-sm cursor-pointer">
                {filter.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rating"
              checked={filters.minRating >= 4.5}
              onCheckedChange={(checked) => 
                updateFilters({ minRating: checked ? 4.5 : 0 })
              }
            />
            <Label htmlFor="rating" className="text-sm cursor-pointer">
              4.5+ stars only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );
}

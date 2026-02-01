import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMortgageStore } from "@/stores/mortgageStore";

export function MortgageFilters() {
  const {
    rateType,
    fixedPeriod,
    maxFee,
    sortBy,
    setRateType,
    setFixedPeriod,
    setMaxFee,
    setSortBy,
  } = useMortgageStore();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rate Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Rate Type</Label>
          <RadioGroup value={rateType} onValueChange={(v) => setRateType(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal">All Types</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed" className="font-normal">Fixed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="variable" id="variable" />
              <Label htmlFor="variable" className="font-normal">Variable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tracker" id="tracker" />
              <Label htmlFor="tracker" className="font-normal">Tracker</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Fixed Period */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Fixed Period</Label>
          <Select value={fixedPeriod} onValueChange={(v) => setFixedPeriod(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="2">2 Year Fixed</SelectItem>
              <SelectItem value="3">3 Year Fixed</SelectItem>
              <SelectItem value="5">5 Year Fixed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Max Fee */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Maximum Fee</Label>
          <Select 
            value={maxFee === null ? 'any' : maxFee.toString()} 
            onValueChange={(v) => setMaxFee(v === 'any' ? null : parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any fee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Fee</SelectItem>
              <SelectItem value="0">£0 (Fee-Free)</SelectItem>
              <SelectItem value="100000">Up to £1,000</SelectItem>
              <SelectItem value="150000">Up to £1,500</SelectItem>
              <SelectItem value="200000">Up to £2,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sort By</Label>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rate">Best Rate</SelectItem>
              <SelectItem value="fee">Lowest Fee</SelectItem>
              <SelectItem value="monthly">Monthly Payment</SelectItem>
              <SelectItem value="total">Total Cost (5yr)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

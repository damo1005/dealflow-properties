import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuctionStore } from "@/stores/auctionStore";
import {
  Building2,
  MapPin,
  Calendar,
  Star,
  Eye,
  Calculator,
  Flame,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { LotDetailDialog } from "./LotDetailDialog";

export function AuctionBrowse() {
  const { lots, auctions, auctionHouses, watches, addWatch, removeWatch, filters, setFilters } = useAuctionStore();
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([50000, 500000]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const isWatched = (lotId: string) => watches.some((w) => w.lot_id === lotId);

  const toggleWatch = (lotId: string) => {
    if (isWatched(lotId)) {
      removeWatch(lotId);
    } else {
      addWatch({
        id: crypto.randomUUID(),
        user_id: "user1",
        lot_id: lotId,
        max_bid: null,
        bid_rationale: null,
        notes: null,
        reminded: false,
        remind_before_hours: 24,
        created_at: new Date().toISOString(),
      });
    }
  };

  const getAuction = (auctionId: string) => auctions.find((a) => a.id === auctionId);
  const getAuctionHouse = (auctionId: string) => {
    const auction = getAuction(auctionId);
    return auction ? auctionHouses.find((ah) => ah.id === auction.auction_house_id) : null;
  };

  // Filter lots
  const filteredLots = lots.filter((lot) => {
    if (priceRange[0] && lot.guide_price && lot.guide_price < priceRange[0]) return false;
    if (priceRange[1] && lot.guide_price && lot.guide_price > priceRange[1]) return false;
    if (filters.hideIssues && lot.has_issues) return false;
    if (filters.showBMV) {
      const bmv = lot.estimated_value && lot.guide_price 
        ? ((lot.estimated_value - lot.guide_price) / lot.estimated_value) * 100
        : 0;
      if (bmv < 10) return false;
    }
    return true;
  });

  const selectedLot = selectedLotId ? lots.find((l) => l.id === selectedLotId) : null;

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <Card className="w-64 shrink-0 hidden lg:block h-fit sticky top-20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label>Guide Price</Label>
            <Slider
              value={priceRange}
              min={0}
              max={1000000}
              step={10000}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>
          </div>

          {/* Postcode */}
          <div className="space-y-2">
            <Label>Postcode Area</Label>
            <Input
              placeholder="e.g., EN3"
              value={filters.postcode}
              onChange={(e) => setFilters({ postcode: e.target.value })}
            />
          </div>

          {/* Opportunity Filters */}
          <div className="space-y-3">
            <Label>Opportunities</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="bmv"
                  checked={filters.showBMV}
                  onCheckedChange={(checked) => setFilters({ showBMV: !!checked })}
                />
                <label htmlFor="bmv" className="text-sm">
                  Below market value (10%+)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="yield"
                  checked={filters.showHighYield}
                  onCheckedChange={(checked) => setFilters({ showHighYield: !!checked })}
                />
                <label htmlFor="yield" className="text-sm">
                  High yield potential (8%+)
                </label>
              </div>
            </div>
          </div>

          {/* Risk Filters */}
          <div className="space-y-3">
            <Label>Risk Filters</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="issues"
                checked={filters.hideIssues}
                onCheckedChange={(checked) => setFilters({ hideIssues: !!checked })}
              />
              <label htmlFor="issues" className="text-sm">
                Hide properties with issues
              </label>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setFilters({ 
              showBMV: false, 
              showHighYield: false, 
              hideIssues: false,
              postcode: '' 
            })}
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      {/* Lots Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground">
            Showing {filteredLots.length} lots
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLots.map((lot) => {
            const auction = getAuction(lot.auction_id);
            const auctionHouse = getAuctionHouse(lot.auction_id);
            const daysUntil = auction
              ? differenceInDays(new Date(auction.auction_date), new Date())
              : 0;
            const bmvPercent = lot.estimated_value && lot.guide_price
              ? Math.round(((lot.estimated_value - lot.guide_price) / lot.estimated_value) * 100)
              : 0;

            return (
              <Card key={lot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                  <Building2 className="h-16 w-16 text-primary/30" />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {lot.ai_score && lot.ai_score >= 80 && (
                      <Badge className="bg-green-500 text-white text-xs">
                        {lot.ai_score}/100
                      </Badge>
                    )}
                    {bmvPercent >= 10 && (
                      <Badge className="bg-orange-500 text-white text-xs">
                        <Flame className="h-3 w-3 mr-1" />
                        BMV {bmvPercent}%
                      </Badge>
                    )}
                  </div>

                  {/* Watch button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => toggleWatch(lot.id)}
                  >
                    <Star
                      className={`h-4 w-4 ${isWatched(lot.id) ? "fill-yellow-500 text-yellow-500" : ""}`}
                    />
                  </Button>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Lot {lot.lot_number}
                    </p>
                    <h3 className="font-semibold line-clamp-1">{lot.address}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{lot.postcode}</span>
                    </div>
                  </div>

                  {/* Property type */}
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {lot.bedrooms}-bed {lot.property_type?.toLowerCase()}
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span>{lot.tenure}</span>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Guide:</span>
                      <span className="font-bold">
                        {lot.guide_price ? formatCurrency(lot.guide_price) : "POA"}
                      </span>
                    </div>
                    {lot.estimated_value && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Value:</span>
                        <span>{formatCurrency(lot.estimated_value)}</span>
                      </div>
                    )}
                    {bmvPercent > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Below Market:</span>
                        <span className="text-green-500 font-medium">{bmvPercent}% 💎</span>
                      </div>
                    )}
                  </div>

                  {/* Auction info */}
                  <div className="pt-2 border-t space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {auction ? format(new Date(auction.auction_date), "MMM d, yyyy") : "TBC"}
                      </span>
                      {daysUntil > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {daysUntil} days
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {auctionHouse?.name}
                    </p>
                  </div>

                  {/* Quick flags */}
                  <div className="flex flex-wrap gap-1">
                    {lot.opportunity_flags.slice(0, 2).map((flag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        ✓ {flag}
                      </Badge>
                    ))}
                    {lot.risk_flags.length > 0 && (
                      <Badge variant="outline" className="text-xs text-yellow-600">
                        ⚠️ {lot.risk_flags.length} risk{lot.risk_flags.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedLotId(lot.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lot Detail Dialog */}
      {selectedLot && (
        <LotDetailDialog
          lot={selectedLot}
          open={!!selectedLotId}
          onOpenChange={(open) => !open && setSelectedLotId(null)}
        />
      )}
    </div>
  );
}

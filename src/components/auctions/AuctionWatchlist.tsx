import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuctionStore } from "@/stores/auctionStore";
import {
  Star,
  Calendar,
  Building2,
  Trash2,
  Edit,
  Bell,
  MapPin,
} from "lucide-react";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { LotDetailDialog } from "./LotDetailDialog";

export function AuctionWatchlist() {
  const { watches, lots, auctions, auctionHouses, removeWatch } = useAuctionStore();
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const getLot = (lotId: string) => lots.find((l) => l.id === lotId);
  const getAuction = (auctionId: string) => auctions.find((a) => a.id === auctionId);
  const getAuctionHouse = (auctionHouseId: string) =>
    auctionHouses.find((ah) => ah.id === auctionHouseId);

  // Separate today's auctions
  const today = new Date();
  const todayWatches = watches.filter((w) => {
    const lot = getLot(w.lot_id);
    if (!lot) return false;
    const auction = getAuction(lot.auction_id);
    if (!auction) return false;
    const auctionDate = new Date(auction.auction_date);
    return (
      auctionDate.toDateString() === today.toDateString() &&
      auctionDate > today
    );
  });

  const upcomingWatches = watches.filter((w) => {
    const lot = getLot(w.lot_id);
    if (!lot) return false;
    const auction = getAuction(lot.auction_id);
    if (!auction) return false;
    const auctionDate = new Date(auction.auction_date);
    return auctionDate > today && auctionDate.toDateString() !== today.toDateString();
  });

  const selectedLot = selectedLotId ? lots.find((l) => l.id === selectedLotId) : null;

  if (watches.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Star className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold mb-2">No watched lots</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add lots to your watchlist to track them and get reminders
          </p>
          <Button variant="outline">Browse Auction Lots</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Auctions Banner */}
      {todayWatches.length > 0 && (
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
              <Bell className="h-5 w-5" />
              {todayWatches.length} watched lot{todayWatches.length > 1 ? "s" : ""} auctioning TODAY!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayWatches.map((watch) => {
              const lot = getLot(watch.lot_id);
              const auction = lot ? getAuction(lot.auction_id) : null;
              const auctionHouse = auction ? getAuctionHouse(auction.auction_house_id) : null;
              const hoursUntil = auction
                ? differenceInHours(new Date(auction.auction_date), today)
                : 0;

              if (!lot || !auction) return null;

              return (
                <div
                  key={watch.id}
                  className="flex items-center justify-between bg-background rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Lot {lot.lot_number}: {lot.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {auctionHouse?.name} • Starts in {hoursUntil}h
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Join Auction</Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Watchlist */}
      <div>
        <h3 className="font-semibold mb-4">My Watched Lots ({watches.length})</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingWatches.map((watch) => {
            const lot = getLot(watch.lot_id);
            const auction = lot ? getAuction(lot.auction_id) : null;
            const auctionHouse = auction ? getAuctionHouse(auction.auction_house_id) : null;
            const daysUntil = auction
              ? differenceInDays(new Date(auction.auction_date), today)
              : 0;

            if (!lot) return null;

            return (
              <Card key={watch.id}>
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Lot {lot.lot_number}</p>
                      <h4 className="font-semibold">{lot.address}</h4>
                    </div>
                    {lot.ai_score && (
                      <Badge variant="secondary">{lot.ai_score}/100</Badge>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{lot.postcode}</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Guide Price</span>
                    <span className="font-bold">
                      {lot.guide_price ? formatCurrency(lot.guide_price) : "POA"}
                    </span>
                  </div>

                  {/* Max Bid */}
                  {watch.max_bid && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">My Max Bid</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(watch.max_bid)}
                      </span>
                    </div>
                  )}

                  {/* Auction Info */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {auction ? format(new Date(auction.auction_date), "MMM d, yyyy") : "TBC"}
                      </span>
                      <Badge variant="outline" className="ml-auto">
                        {daysUntil} days
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {auctionHouse?.name}
                    </p>
                  </div>

                  {/* Notes */}
                  {watch.notes && (
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
                      {watch.notes}
                    </div>
                  )}

                  {/* Reminder Status */}
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Bell className="h-3 w-3" />
                    <span>Reminder set for 24hrs before</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedLotId(lot.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeWatch(lot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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

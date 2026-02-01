import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuctionStore } from "@/stores/auctionStore";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

export function AuctionCalendar() {
  const { auctions, auctionHouses } = useAuctionStore();
  
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAuctionsForDay = (day: Date) => {
    return auctions.filter((auction) => 
      isSameDay(new Date(auction.auction_date), day)
    );
  };

  const getAuctionHouse = (auctionHouseId: string) => 
    auctionHouses.find((ah) => ah.id === auctionHouseId);

  const upcomingAuctions = auctions
    .filter((a) => new Date(a.auction_date) >= today)
    .sort((a, b) => new Date(a.auction_date).getTime() - new Date(b.auction_date).getTime());

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar Grid */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{format(today, "MMMM yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            
            {/* Pad start of month */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            
            {daysInMonth.map((day) => {
              const dayAuctions = getAuctionsForDay(day);
              const isToday = isSameDay(day, today);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square p-1 border rounded-lg ${
                    isToday ? "border-primary bg-primary/5" : "border-transparent"
                  } ${dayAuctions.length > 0 ? "bg-muted/50" : ""}`}
                >
                  <div className={`text-sm ${isToday ? "font-bold text-primary" : ""}`}>
                    {format(day, "d")}
                  </div>
                  {dayAuctions.length > 0 && (
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs px-1">
                        {dayAuctions.length} auction{dayAuctions.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Auctions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingAuctions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No upcoming auctions
            </p>
          ) : (
            upcomingAuctions.map((auction) => {
              const auctionHouse = getAuctionHouse(auction.auction_house_id);
              
              return (
                <div
                  key={auction.id}
                  className="p-3 bg-muted/50 rounded-lg space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(auction.auction_date), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                  <p className="font-medium">{auctionHouse?.name}</p>
                  <p className="text-sm">{auction.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{auction.total_lots} lots</Badge>
                    <Badge variant="secondary" className="capitalize">
                      {auction.auction_type}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Lots
                    </Button>
                    {auction.catalogue_url && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={auction.catalogue_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

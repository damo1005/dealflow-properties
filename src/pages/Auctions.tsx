import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Calendar, Star, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AuctionBrowse } from "@/components/auctions/AuctionBrowse";
import { AuctionCalendar } from "@/components/auctions/AuctionCalendar";
import { AuctionWatchlist } from "@/components/auctions/AuctionWatchlist";
import { AuctionResults } from "@/components/auctions/AuctionResults";
import {
  useAuctionStore,
  mockAuctionHouses,
  mockAuctions,
  mockAuctionLots,
} from "@/stores/auctionStore";

const Auctions = () => {
  const {
    setAuctionHouses,
    setAuctions,
    setLots,
    auctions,
    lots,
    watches,
  } = useAuctionStore();

  useEffect(() => {
    setAuctionHouses(mockAuctionHouses);
    setAuctions(mockAuctions);
    setLots(mockAuctionLots);
  }, [setAuctionHouses, setAuctions, setLots]);

  const upcomingAuctions = auctions.filter((a) => a.status === "upcoming");
  const thisWeekAuctions = auctions.filter((a) => {
    const auctionDate = new Date(a.auction_date);
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return auctionDate <= weekFromNow;
  });
  const totalLots = lots.length;

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Property Auctions</h1>
          <p className="text-muted-foreground">
            Find below-market deals at auction
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gavel className="h-4 w-4" />
                <span className="text-sm">Upcoming Auctions</span>
              </div>
              <p className="text-2xl font-bold mt-1">{upcomingAuctions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">Total Lots</span>
              </div>
              <p className="text-2xl font-bold mt-1">{totalLots}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">This Week</span>
              </div>
              <p className="text-2xl font-bold mt-1">{thisWeekAuctions.length} auctions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4" />
                <span className="text-sm">My Watched</span>
              </div>
              <p className="text-2xl font-bold mt-1">{watches.length} lots</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="browse" className="gap-2">
              <Gavel className="h-4 w-4 hidden sm:block" />
              Browse Lots
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4 hidden sm:block" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-2">
              <Star className="h-4 w-4 hidden sm:block" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <BarChart3 className="h-4 w-4 hidden sm:block" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <AuctionBrowse />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <AuctionCalendar />
          </TabsContent>

          <TabsContent value="watchlist" className="mt-6">
            <AuctionWatchlist />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <AuctionResults />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Auctions;

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Calendar, Star, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AuctionBrowse } from "@/components/auctions/AuctionBrowse";
import { AuctionCalendar } from "@/components/auctions/AuctionCalendar";
import { AuctionWatchlist } from "@/components/auctions/AuctionWatchlist";
import { AuctionResults } from "@/components/auctions/AuctionResults";
import { supabase } from "@/integrations/supabase/client";
import {
  useAuctionStore,
  mockAuctionHouses,
  mockAuctions,
  mockAuctionLots,
} from "@/stores/auctionStore";
import type { Auction, AuctionLot } from "@/types/auction";

const Auctions = () => {
  const {
    setAuctionHouses,
    setAuctions,
    setLots,
    auctions,
    lots,
    watches,
  } = useAuctionStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctionData() {
      setIsLoading(true);
      try {
        // Fetch auction houses from database
        const { data: housesData } = await supabase
          .from('auction_houses')
          .select('*')
          .eq('is_active', true)
          .order('name');

        // Fetch auctions
        const { data: auctionsData } = await supabase
          .from('auctions')
          .select('*')
          .order('auction_date', { ascending: true });

        // Fetch lots
        const { data: lotsData } = await supabase
          .from('auction_lots')
          .select('*')
          .order('lot_number');

        // Use database data if available, otherwise fall back to mock data
        if (housesData && housesData.length > 0) {
          setAuctionHouses(housesData.map(h => ({
            id: h.id,
            name: h.name,
            logo_url: h.logo_url,
            website: h.website,
            regions: h.regions || [],
            buyer_premium_pct: h.buyer_premium_pct || 2,
            is_active: h.is_active ?? true,
            created_at: h.created_at || new Date().toISOString(),
            last_sync_at: h.last_sync_at
          })));
        } else {
          setAuctionHouses(mockAuctionHouses);
        }

        if (auctionsData && auctionsData.length > 0) {
          const mappedAuctions: Auction[] = auctionsData.map(a => ({
            id: a.id,
            auction_house_id: a.auction_house_id || '',
            name: a.name,
            auction_date: a.auction_date,
            auction_type: (a.auction_type === 'online' || a.auction_type === 'room' || a.auction_type === 'hybrid') 
              ? a.auction_type 
              : 'room',
            catalogue_url: a.catalogue_url || undefined,
            status: (a.status === 'upcoming' || a.status === 'live' || a.status === 'completed') 
              ? a.status 
              : 'upcoming',
            total_lots: a.total_lots || 0,
            lots_sold: a.lots_sold || 0,
            avg_sale_vs_guide: a.avg_sale_vs_guide || undefined,
            created_at: a.created_at || new Date().toISOString()
          }));
          setAuctions(mappedAuctions);
        } else {
          setAuctions(mockAuctions);
        }

        if (lotsData && lotsData.length > 0) {
          const mappedLots: AuctionLot[] = lotsData.map(l => ({
            id: l.id,
            auction_id: l.auction_id || '',
            lot_number: l.lot_number,
            address: l.address,
            postcode: l.postcode || undefined,
            property_type: l.property_type || undefined,
            bedrooms: l.bedrooms || undefined,
            tenure: l.tenure || undefined,
            guide_price: l.guide_price || undefined,
            reserve_price: l.reserve_price || undefined,
            buyer_premium: l.buyer_premium || undefined,
            total_price: l.total_price || undefined,
            estimated_value: l.estimated_value || undefined,
            description: l.description || undefined,
            images: Array.isArray(l.images) ? l.images : [],
            legal_pack_url: l.legal_pack_url || undefined,
            has_tenants: l.has_tenants ?? false,
            has_issues: l.has_issues ?? false,
            issues_summary: l.issues_summary || undefined,
            ai_score: l.ai_score || undefined,
            risk_flags: Array.isArray(l.risk_flags) ? l.risk_flags as string[] : [],
            opportunity_flags: Array.isArray(l.opportunity_flags) ? l.opportunity_flags as string[] : [],
            status: (l.status === 'upcoming' || l.status === 'sold' || l.status === 'unsold' || l.status === 'withdrawn') 
              ? l.status 
              : 'upcoming',
            sold: l.sold ?? false,
            sale_price: l.sale_price || undefined,
            created_at: l.created_at || new Date().toISOString()
          }));
          setLots(mappedLots);
        } else {
          setLots(mockAuctionLots);
        }
      } catch (error) {
        console.error('Failed to fetch auction data:', error);
        // Fall back to mock data on error
        setAuctionHouses(mockAuctionHouses);
        setAuctions(mockAuctions);
        setLots(mockAuctionLots);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuctionData();
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
            Find below-market deals at UK property auctions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </>
          ) : (
            <>
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
            </>
          )}
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

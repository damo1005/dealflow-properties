import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuctionStore } from "@/stores/auctionStore";
import type { AuctionLot } from "@/types/auction";
import {
  Building2,
  MapPin,
  Calendar,
  Star,
  Gavel,
  FileText,
  Calculator,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Download,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface LotDetailDialogProps {
  lot: AuctionLot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LotDetailDialog({ lot, open, onOpenChange }: LotDetailDialogProps) {
  const { auctions, auctionHouses, watches, addWatch, removeWatch } = useAuctionStore();
  const [targetYield, setTargetYield] = useState(8);
  const [refurbCosts, setRefurbCosts] = useState(8000);
  const [expectedRent, setExpectedRent] = useState(1200);

  const auction = auctions.find((a) => a.id === lot.auction_id);
  const auctionHouse = auction
    ? auctionHouses.find((ah) => ah.id === auction.auction_house_id)
    : null;

  const isWatched = watches.some((w) => w.lot_id === lot.id);
  const daysUntil = auction
    ? differenceInDays(new Date(auction.auction_date), new Date())
    : 0;
  const bmvPercent = lot.estimated_value && lot.guide_price
    ? Math.round(((lot.estimated_value - lot.guide_price) / lot.estimated_value) * 100)
    : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const toggleWatch = () => {
    if (isWatched) {
      removeWatch(lot.id);
    } else {
      addWatch({
        id: crypto.randomUUID(),
        user_id: "user1",
        lot_id: lot.id,
        max_bid: null,
        bid_rationale: null,
        notes: null,
        reminded: false,
        remind_before_hours: 24,
        created_at: new Date().toISOString(),
      });
    }
  };

  // Calculate max bid based on target yield
  const calculateMaxBid = () => {
    const annualRent = expectedRent * 12;
    const maxBidForYield = (annualRent / (targetYield / 100)) - refurbCosts;
    return Math.round(maxBidForYield / 1000) * 1000;
  };

  const maxBid = calculateMaxBid();
  const recommendedBid = Math.round(maxBid * 0.95 / 1000) * 1000;
  const walkAwayPrice = maxBid;

  // Calculate stamp duty
  const calculateStampDuty = (price: number) => {
    let duty = 0;
    if (price > 250000) duty += (Math.min(price, 925000) - 250000) * 0.05;
    if (price > 925000) duty += (Math.min(price, 1500000) - 925000) * 0.10;
    if (price > 1500000) duty += (price - 1500000) * 0.12;
    duty += price * 0.03; // Additional property surcharge
    return Math.round(duty);
  };

  const stampDuty = calculateStampDuty(recommendedBid);
  const buyerPremium = Math.round(recommendedBid * 0.012);
  const totalInvestment = recommendedBid + stampDuty + buyerPremium + 1500 + 500 + refurbCosts;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Lot {lot.lot_number}: {lot.address}
          </DialogTitle>
        </DialogHeader>

        {/* Auction Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {auction ? format(new Date(auction.auction_date), "MMM d, yyyy 'at' h:mm a") : "TBC"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {auctionHouse?.name} • {auction?.auction_type} auction
                  </p>
                </div>
                {daysUntil > 0 && (
                  <Badge variant="secondary">{daysUntil} days away</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={toggleWatch}>
                  <Star className={`h-4 w-4 mr-1 ${isWatched ? "fill-yellow-500 text-yellow-500" : ""}`} />
                  {isWatched ? "Watching" : "Watch"}
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Property Image */}
            <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <Building2 className="h-20 w-20 text-primary/30" />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="legal">Legal Pack</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Property Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{lot.address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Postcode</p>
                      <p className="font-medium">{lot.postcode}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{lot.property_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bedrooms</p>
                      <p className="font-medium">{lot.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tenure</p>
                      <p className="font-medium">{lot.tenure}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tenanted</p>
                      <p className="font-medium">{lot.has_tenants ? "Yes" : "No - Vacant"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Pricing Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guide Price</span>
                      <span className="font-bold text-lg">
                        {lot.guide_price ? formatCurrency(lot.guide_price) : "POA"}
                      </span>
                    </div>
                    {lot.estimated_value && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Value</span>
                          <span>{formatCurrency(lot.estimated_value)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Below Market Value</span>
                          <span className="text-green-500 font-bold">{bmvPercent}% 💎</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Intelligence */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Auction Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-green-600 mb-2">Opportunity Signals</p>
                      <div className="flex flex-wrap gap-2">
                        {lot.opportunity_flags.map((flag, i) => (
                          <Badge key={i} className="bg-green-500/10 text-green-600 border-green-500/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {lot.risk_flags.length > 0 && (
                      <div>
                        <p className="font-medium text-yellow-600 mb-2">Risk Factors</p>
                        <div className="flex flex-wrap gap-2">
                          {lot.risk_flags.map((flag, i) => (
                            <Badge key={i} variant="outline" className="text-yellow-600 border-yellow-500/50">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Investment Potential</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm">Estimated Rent</p>
                        <p className="font-bold">{formatCurrency(expectedRent)}/mo</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Gross Yield</p>
                        <p className="font-bold">
                          {lot.guide_price
                            ? ((expectedRent * 12) / lot.guide_price * 100).toFixed(1)
                            : "-"}%
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="font-medium mb-2">Strategy Fit</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-green-600">✓ Excellent for BTL</p>
                        <p className="text-green-600">✓ Suitable for BRR</p>
                        {refurbCosts > 20000 && (
                          <p className="text-yellow-600">⚠️ High refurb may impact flip margins</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Legal Pack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lot.legal_pack_url ? (
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full" asChild>
                          <a href={lot.legal_pack_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download Legal Pack
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                        <div className="bg-muted/50 rounded-lg p-4 text-sm">
                          <p className="font-medium mb-2">AI Summary</p>
                          <p className="text-muted-foreground">
                            Legal pack reviewed. No major red flags identified. 
                            Title clear, no unusual covenants. Standard purchase.
                          </p>
                          <div className="mt-3 space-y-1">
                            <p className="text-green-600">✓ Clear title</p>
                            <p className="text-green-600">✓ No planning issues</p>
                            <p className="text-green-600">✓ No unusual restrictions</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Legal pack not yet available</p>
                        <p className="text-sm">Check back closer to auction date</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Bid Calculator */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Bid Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Yield: {targetYield}%</Label>
                  <Slider
                    value={[targetYield]}
                    min={4}
                    max={12}
                    step={0.5}
                    onValueChange={([v]) => setTargetYield(v)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Refurb Budget</Label>
                  <Input
                    type="number"
                    value={refurbCosts}
                    onChange={(e) => setRefurbCosts(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expected Monthly Rent</Label>
                  <Input
                    type="number"
                    value={expectedRent}
                    onChange={(e) => setExpectedRent(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-primary/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Your Maximum Bid</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(maxBid)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Achieves {targetYield}% yield
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recommended bid</span>
                    <span className="font-medium">{formatCurrency(recommendedBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Walk-away price</span>
                    <span className="font-medium">{formatCurrency(walkAwayPrice)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2 text-sm">
                  <p className="font-medium">Total Investment</p>
                  <div className="space-y-1 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Hammer price</span>
                      <span>{formatCurrency(recommendedBid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Buyer's premium</span>
                      <span>{formatCurrency(buyerPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stamp duty</span>
                      <span>{formatCurrency(stampDuty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legal + Survey</span>
                      <span>{formatCurrency(2000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refurb</span>
                      <span>{formatCurrency(refurbCosts)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(totalInvestment)}</span>
                  </div>
                </div>

                <Button className="w-full">Save Calculation</Button>
              </CardContent>
            </Card>

            {/* Auction House Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{auctionHouse?.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Format</p>
                  <p className="capitalize">{auction?.auction_type} Auction</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Buyer's Premium</p>
                  <p>{auctionHouse?.buyer_premium_pct}% (+ VAT)</p>
                </div>
                {auctionHouse?.website && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={auctionHouse.website} target="_blank" rel="noopener noreferrer">
                      Register to Bid
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

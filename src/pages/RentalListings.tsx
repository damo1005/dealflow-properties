import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Plus, Eye, MessageSquare, PoundSterling, Star, Check, X, Users } from "lucide-react";

// Mock data
const mockListings = [
  {
    id: "1",
    property_address: "14 Oak Street, M14 2AB",
    asking_rent: 875,
    min_tenancy_months: 12,
    available_from: "2026-03-01",
    status: "active",
    view_count: 156,
    enquiry_count: 12,
    offers: 8,
    highest_offer: 900,
  },
];

const mockOffers = [
  {
    id: "1",
    applicant_name: "Sarah Johnson",
    applicant_email: "sarah@email.com",
    offered_rent: 900,
    tenancy_length_months: 18,
    move_in_date: "2026-03-01",
    num_occupants: 2,
    has_pets: false,
    employment_status: "employed",
    annual_income: 52000,
    cover_message: "I'm a quiet professional looking for a long-term home. Currently working as a teacher at a local school.",
    status: "pending",
  },
  {
    id: "2",
    applicant_name: "Mike Thompson",
    applicant_email: "mike@email.com",
    offered_rent: 885,
    tenancy_length_months: 12,
    move_in_date: "2026-03-15",
    num_occupants: 1,
    has_pets: true,
    pet_details: "One cat",
    employment_status: "employed",
    annual_income: 48000,
    status: "pending",
  },
  {
    id: "3",
    applicant_name: "David Wilson",
    applicant_email: "david@email.com",
    offered_rent: 875,
    tenancy_length_months: 24,
    move_in_date: "2026-03-01",
    num_occupants: 2,
    has_pets: false,
    employment_status: "employed",
    annual_income: 65000,
    status: "shortlisted",
  },
];

export default function RentalListings() {
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedListing, setSelectedListing] = useState(mockListings[0]);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<typeof mockOffers[0] | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "under_offer":
        return <Badge className="bg-yellow-500">Under Offer</Badge>;
      case "let":
        return <Badge variant="secondary">Let</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOfferStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "shortlisted":
        return <Badge className="bg-blue-500">Shortlisted</Badge>;
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAcceptOffer = (offer: typeof mockOffers[0]) => {
    setSelectedOffer(offer);
    setShowAcceptDialog(true);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Rental Listings</h1>
            <p className="text-muted-foreground">Manage listings and review tenant offers</p>
          </div>
          <Dialog open={showCreateListing} onOpenChange={setShowCreateListing}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Create Listing</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Rental Listing</DialogTitle>
                <DialogDescription>List your property for rent</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Property</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">14 Oak Street, M14 2AB</SelectItem>
                      <SelectItem value="2">28 Victoria Road</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asking Rent (£/month)</Label>
                    <Input type="number" placeholder="875" />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Acceptable (£)</Label>
                    <Input type="number" placeholder="850" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Available From</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Tenancy (months)</Label>
                    <Input type="number" placeholder="12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tenant Preferences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pets" />
                      <label htmlFor="pets" className="text-sm">Pets considered</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dss" />
                      <label htmlFor="dss" className="text-sm">DSS/Housing benefit considered</label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bidding Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="bidding" />
                      <label htmlFor="bidding" className="text-sm">Enable offers/bidding</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="showHighest" />
                      <label htmlFor="showHighest" className="text-sm">Show highest offer to applicants</label>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Publish Listing</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {mockListings.map(listing => (
            <Card key={listing.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{listing.property_address}</h3>
                        {getStatusBadge(listing.status)}
                      </div>
                      <p className="text-muted-foreground">
                        Asking: £{listing.asking_rent}/month | Min term: {listing.min_tenancy_months} months
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Available: {new Date(listing.available_from).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.view_count} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.enquiry_count} enquiries</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PoundSterling className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.offers} offers</span>
                    </div>
                  </div>
                </div>
                {listing.highest_offer > 0 && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Highest Offer: £{listing.highest_offer}/month
                    </p>
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">Edit Listing</Button>
                  <Button variant="outline" size="sm">Mark as Let</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Offers Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Offers - {selectedListing.property_address}</CardTitle>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{mockOffers.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Highest:</span>
                  <span className="font-medium">£{Math.max(...mockOffers.map(o => o.offered_rent))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Average:</span>
                  <span className="font-medium">
                    £{Math.round(mockOffers.reduce((sum, o) => sum + o.offered_rent, 0) / mockOffers.length)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Offers</TabsTrigger>
                <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {mockOffers.map(offer => (
                  <Card key={offer.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {offer.offered_rent === Math.max(...mockOffers.map(o => o.offered_rent)) && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                            <h4 className="font-semibold">{offer.applicant_name}</h4>
                            <span className="text-xl font-bold text-primary">£{offer.offered_rent}/month</span>
                            {getOfferStatusBadge(offer.status)}
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Move: {new Date(offer.move_in_date).toLocaleDateString()}</span>
                            <span>Term: {offer.tenancy_length_months} months</span>
                            <span>{offer.num_occupants} occupant{offer.num_occupants !== 1 ? 's' : ''}</span>
                            {offer.has_pets ? <span>🐱 Has pets</span> : <span>No pets</span>}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Income: </span>
                            <span>£{offer.annual_income?.toLocaleString()} | </span>
                            <span className="text-muted-foreground">Rent/Income: </span>
                            <span>{((offer.offered_rent * 12 / (offer.annual_income || 1)) * 100).toFixed(1)}%</span>
                          </div>
                          {offer.cover_message && (
                            <p className="text-sm text-muted-foreground italic">"{offer.cover_message}"</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAcceptOffer(offer)}>
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-1" />
                            Shortlist
                          </Button>
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="shortlisted" className="mt-4">
                {mockOffers.filter(o => o.status === "shortlisted").length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No shortlisted offers yet</p>
                ) : (
                  mockOffers.filter(o => o.status === "shortlisted").map(offer => (
                    <Card key={offer.id} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{offer.applicant_name}</h4>
                            <p className="text-primary font-bold">£{offer.offered_rent}/month</p>
                          </div>
                          <Button size="sm" onClick={() => handleAcceptOffer(offer)}>Accept</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="compare" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Offer</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Move Date</TableHead>
                      <TableHead>Income</TableHead>
                      <TableHead>Rent/Income</TableHead>
                      <TableHead>Pets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOffers.map(offer => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.applicant_name}</TableCell>
                        <TableCell>£{offer.offered_rent}</TableCell>
                        <TableCell>{offer.tenancy_length_months} months</TableCell>
                        <TableCell>{new Date(offer.move_in_date).toLocaleDateString()}</TableCell>
                        <TableCell>£{offer.annual_income?.toLocaleString()}</TableCell>
                        <TableCell>{((offer.offered_rent * 12 / (offer.annual_income || 1)) * 100).toFixed(1)}%</TableCell>
                        <TableCell>{offer.has_pets ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Accept Offer Dialog */}
        <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accept Offer</DialogTitle>
              <DialogDescription>
                Are you sure you want to accept {selectedOffer?.applicant_name}'s offer?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Rent:</span>
                  <span className="font-medium">£{selectedOffer?.offered_rent}/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Move in:</span>
                  <span className="font-medium">
                    {selectedOffer?.move_in_date && new Date(selectedOffer.move_in_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Term:</span>
                  <span className="font-medium">{selectedOffer?.tenancy_length_months} months</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sendAccept" defaultChecked />
                  <label htmlFor="sendAccept" className="text-sm">Send acceptance email to {selectedOffer?.applicant_name}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sendReject" defaultChecked />
                  <label htmlFor="sendReject" className="text-sm">Send rejection emails to other applicants</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="createTenant" defaultChecked />
                  <label htmlFor="createTenant" className="text-sm">Create tenant application record</label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAcceptDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1">Accept Offer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

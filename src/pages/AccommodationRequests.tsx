import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Home, Bookmark, User, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccommodationRequestCard } from "@/components/accommodation/AccommodationRequestCard";
import { AccommodationFilters } from "@/components/accommodation/AccommodationFilters";
import { PostRequestDialog } from "@/components/accommodation/PostRequestDialog";
import { SendEnquiryDialog } from "@/components/accommodation/SendEnquiryDialog";
import { useAccommodationStore, mockAccommodationRequests } from "@/stores/accommodationStore";
import type { AccommodationRequest, AccommodationFilters as FiltersType } from "@/types/accommodation";

export default function AccommodationRequests() {
  const navigate = useNavigate();
  const { filters, updateFilters, resetFilters } = useAccommodationStore();
  const [activeTab, setActiveTab] = useState("browse");
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [showEnquiryDialog, setShowEnquiryDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccommodationRequest | null>(null);
  const [savedRequestIds, setSavedRequestIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    let results = [...mockAccommodationRequests];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query)
      );
    }

    // Request type filter
    if (filters.requestType !== "all") {
      results = results.filter((r) => r.request_type === filters.requestType);
    }

    // Location filter
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter(
        (r) => r.location.toLowerCase().includes(loc) || r.postcode_area?.toLowerCase().includes(loc)
      );
    }

    // Budget filter
    results = results.filter(
      (r) => r.budget_max >= filters.budgetMin && r.budget_max <= filters.budgetMax
    );

    // Property type filter
    if (filters.propertyTypes.length > 0) {
      results = results.filter((r) =>
        r.property_type.some((t) => filters.propertyTypes.includes(t))
      );
    }

    // Requirements filters
    if (filters.selfContained) {
      results = results.filter((r) => r.self_contained);
    }
    if (filters.noSharing) {
      results = results.filter((r) => r.no_sharing);
    }
    if (filters.parking) {
      results = results.filter((r) => r.parking_required);
    }
    if (filters.petFriendly) {
      results = results.filter((r) => r.has_pets);
    }
    if (filters.familyFriendly) {
      results = results.filter((r) => r.has_children);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "expiring":
        results.sort((a, b) => {
          if (!a.expires_at) return 1;
          if (!b.expires_at) return -1;
          return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
        });
        break;
      case "budget-high":
        results.sort((a, b) => b.budget_max - a.budget_max);
        break;
      case "budget-low":
        results.sort((a, b) => a.budget_max - b.budget_max);
        break;
    }

    return results;
  }, [filters, sortBy, searchQuery]);

  const handleViewRequest = (id: string) => {
    // TODO: Navigate to request detail page
    console.log("View request", id);
  };

  const handleEnquire = (request: AccommodationRequest) => {
    setSelectedRequest(request);
    setShowEnquiryDialog(true);
  };

  const handleToggleSave = (id: string) => {
    setSavedRequestIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const myRequests = mockAccommodationRequests.filter((r) => r.user_id === "user1"); // Mock current user
  const savedRequests = mockAccommodationRequests.filter((r) => savedRequestIds.includes(r.id));

  return (
    <AppLayout title="Accommodation Requests">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Accommodation Requests
            </h1>
            <p className="text-muted-foreground">Connect landlords with tenants</p>
          </div>
          <Button onClick={() => setShowPostDialog(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Post Request
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse" className="gap-2">
              <Search className="h-4 w-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="my-requests" className="gap-2">
              <User className="h-4 w-4" />
              My Requests
              {myRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">{myRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Saved
              {savedRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">{savedRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-4">
              {/* Filters - Desktop Sidebar */}
              <div className="hidden lg:block">
                <AccommodationFilters
                  filters={filters}
                  onUpdateFilters={updateFilters}
                  onReset={resetFilters}
                />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-4">
                {/* Search and Sort Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <ScrollArea className="h-full p-4">
                        <AccommodationFilters
                          filters={filters}
                          onUpdateFilters={updateFilters}
                          onReset={resetFilters}
                        />
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="expiring">Expiring Soon</SelectItem>
                      <SelectItem value="budget-high">Highest Budget</SelectItem>
                      <SelectItem value="budget-low">Lowest Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results count */}
                <p className="text-sm text-muted-foreground">
                  {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""} found
                </p>

                {/* Request Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredRequests.map((request) => (
                    <AccommodationRequestCard
                      key={request.id}
                      request={request}
                      isSaved={savedRequestIds.includes(request.id)}
                      onView={handleViewRequest}
                      onEnquire={handleEnquire}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>

                {/* Empty state */}
                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No requests found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or post your own request
                    </p>
                    <Button onClick={() => setShowPostDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Request
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="my-requests" className="mt-6">
            {myRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myRequests.map((request) => (
                  <AccommodationRequestCard
                    key={request.id}
                    request={request}
                    isSaved={savedRequestIds.includes(request.id)}
                    onView={handleViewRequest}
                    onEnquire={handleEnquire}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No requests yet</h3>
                <p className="text-muted-foreground mb-4">
                  Post your first accommodation request to get started
                </p>
                <Button onClick={() => setShowPostDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Request
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved" className="mt-6">
            {savedRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedRequests.map((request) => (
                  <AccommodationRequestCard
                    key={request.id}
                    request={request}
                    isSaved={true}
                    onView={handleViewRequest}
                    onEnquire={handleEnquire}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No saved requests</h3>
                <p className="text-muted-foreground mb-4">
                  Save requests you're interested in to find them later
                </p>
                <Button variant="outline" onClick={() => setActiveTab("browse")}>
                  Browse Requests
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Post Request Dialog */}
        <PostRequestDialog open={showPostDialog} onClose={() => setShowPostDialog(false)} />

        {/* Send Enquiry Dialog */}
        {selectedRequest && (
          <SendEnquiryDialog
            open={showEnquiryDialog}
            onClose={() => {
              setShowEnquiryDialog(false);
              setSelectedRequest(null);
            }}
            request={selectedRequest}
          />
        )}
      </div>
    </AppLayout>
  );
}

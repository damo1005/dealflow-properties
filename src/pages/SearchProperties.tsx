import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { FilterPanel } from "@/components/search/FilterPanel";
import { RealPropertyCard } from "@/components/search/RealPropertyCard";
import { SearchHeader } from "@/components/search/SearchHeader";
import { EmptyState } from "@/components/search/EmptyState";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSearchStore } from "@/stores/searchStore";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { usePropertySearchMutation, usePropertyListings, useSaveProperty, useSavedProperties } from "@/hooks/usePropertySearch";

export default function SearchProperties() {
  const navigate = useNavigate();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { toast } = useToast();

  const {
    viewMode,
    filters,
    sortBy,
    isLoading,
    totalResults,
    setTotalResults,
    currentPage,
    setCurrentPage,
    filtersOpen,
    toggleFilters,
  } = useSearchStore();

  // Real data hooks
  const searchMutation = usePropertySearchMutation();
  const { data: listings, isLoading: isQueryLoading } = usePropertyListings(filters, sortBy);
  const savePropertyMutation = useSaveProperty();
  const { data: savedPropertyIds } = useSavedProperties();

  // Update total results when listings change
  useEffect(() => {
    if (listings) {
      setTotalResults(listings.length);
    }
  }, [listings, setTotalResults]);

  // Trigger search when Enter pressed in location field
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && filters.location?.trim()) {
        searchMutation.mutate(filters);
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [filters, searchMutation]);

  const handleSave = (id: string) => {
    savePropertyMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Property saved",
          description: "Added to your saved properties",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Failed to save",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleViewDetails = (id: string) => {
    const property = listings?.find(p => p.id === id);
    if (property?.listing_url) {
      navigate(`/analyse/deal-analyser?url=${encodeURIComponent(property.listing_url)}`);
    }
  };

  const handleAnalyze = (listingUrl: string) => {
    navigate(`/analyse/deal-analyser?url=${encodeURIComponent(listingUrl)}`);
  };

  const handleAddToPipeline = (_id: string) => {
    toast({
      title: "Added to pipeline",
      description: "Property added to your pipeline",
    });
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearch = () => {
    if (!filters.location?.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a postcode or town to search",
        variant: "destructive",
      });
      return;
    }
    
    searchMutation.mutate(filters, {
      onSuccess: (data) => {
        toast({
          title: `Found ${data.total} properties`,
          description: data.fromCache ? "Showing cached results" : "Fresh results from property portals",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Search failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const combinedLoading = isLoading || isQueryLoading || searchMutation.isPending;
  const showEmptyState = !combinedLoading && (!listings || listings.length === 0);
  const isFirstTime = !filters.location;

  return (
    <AppLayout title="Search Properties">
      <div className="flex h-[calc(100vh-7rem)] -m-6">
        {/* Desktop Filter Panel */}
        <div
          className={cn(
            "hidden md:block transition-all duration-300 shrink-0",
            filtersOpen ? "w-80" : "w-0"
          )}
        >
          {filtersOpen && <FilterPanel className="h-full" onSearch={handleSearch} />}
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetContent side="left" className="p-0 w-[320px]">
            <FilterPanel
              isMobile
              onClose={() => setMobileFiltersOpen(false)}
              onSearch={handleSearch}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-border bg-background shrink-0">
            <SearchHeader
              onToggleFilters={() => {
                if (window.innerWidth < 768) {
                  setMobileFiltersOpen(true);
                } else {
                  toggleFilters();
                }
              }}
              filtersVisible={filtersOpen}
              onSearch={handleSearch}
              isSearching={searchMutation.isPending}
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {combinedLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {searchMutation.isPending ? "Searching property portals..." : "Loading..."}
                </p>
              </div>
            ) : showEmptyState ? (
              <EmptyState type={isFirstTime ? "first-time" : "no-results"} />
            ) : viewMode === "grid" ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {listings?.map((property) => (
                    <RealPropertyCard
                      key={property.id}
                      property={property}
                      isSaved={savedPropertyIds?.includes(property.id)}
                      onSave={handleSave}
                      onViewDetails={handleViewDetails}
                      onAddToPipeline={handleAddToPipeline}
                      onAnalyze={handleAnalyze}
                    />
                  ))}
                </div>
                {listings && listings.length < totalResults && (
                  <div className="flex justify-center mt-8">
                    <Button onClick={handleLoadMore}>Load More</Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <p className="p-4 text-center text-muted-foreground">
                    List view coming soon. Use grid view for now.
                  </p>
                </div>
              </>
            )}

            {/* Results Footer */}
            {!showEmptyState && !combinedLoading && listings && listings.length > 0 && (
              <div className="flex items-center justify-center mt-6 text-sm text-muted-foreground">
                Showing {listings.length} of {totalResults} properties
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
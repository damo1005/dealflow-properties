import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FilterPanel } from "@/components/search/FilterPanel";
import { PropertyCard } from "@/components/search/PropertyCard";
import { PropertyListRow } from "@/components/search/PropertyListRow";
import { SearchHeader } from "@/components/search/SearchHeader";
import { EmptyState } from "@/components/search/EmptyState";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSearchStore } from "@/stores/searchStore";
import { mockProperties } from "@/data/mockProperties";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SearchProperties() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    viewMode,
    results,
    setResults,
    isLoading,
    setLoading,
    totalResults,
    setTotalResults,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filtersOpen,
    toggleFilters,
    selectedProperties,
    togglePropertySelection,
    filters,
  } = useSearchStore();

  // Simulate loading properties
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Filter mock properties based on current filters
      let filtered = [...mockProperties];
      
      if (filters.location) {
        filtered = filtered.filter(
          (p) =>
            p.address.toLowerCase().includes(filters.location.toLowerCase()) ||
            p.postcode.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      if (filters.propertyTypes.length > 0) {
        filtered = filtered.filter((p) =>
          filters.propertyTypes.includes(p.propertyType)
        );
      }
      
      if (filters.minPrice > 0) {
        filtered = filtered.filter((p) => p.price >= filters.minPrice);
      }
      
      if (filters.maxPrice < 1000000) {
        filtered = filtered.filter((p) => p.price <= filters.maxPrice);
      }
      
      if (filters.minBedrooms > 0) {
        filtered = filtered.filter((p) => p.bedrooms >= filters.minBedrooms);
      }
      
      if (filters.priceReduced) {
        filtered = filtered.filter((p) => p.priceReduced);
      }
      
      if (filters.minYield > 0) {
        filtered = filtered.filter((p) => p.estimatedYield >= filters.minYield);
      }

      setResults(filtered);
      setTotalResults(filtered.length);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, setResults, setTotalResults, setLoading]);

  const handleSave = (id: string) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
    toast({
      title: savedProperties.includes(id) ? "Removed from saved" : "Property saved",
      description: savedProperties.includes(id)
        ? "Property removed from your saved list"
        : "Property added to your saved list",
    });
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "View details",
      description: `Viewing property ${id}`,
    });
  };

  const handleAddToPipeline = (id: string) => {
    toast({
      title: "Added to pipeline",
      description: "Property added to your pipeline",
    });
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
    // In a real app, this would fetch more results
  };

  const showEmptyState = !isLoading && results.length === 0;
  const isFirstTime = !filters.location && filters.propertyTypes.length === 0;

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
          {filtersOpen && <FilterPanel className="h-full" />}
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetContent side="left" className="p-0 w-[320px]">
            <FilterPanel
              isMobile
              onClose={() => setMobileFiltersOpen(false)}
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
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : showEmptyState ? (
              <EmptyState type={isFirstTime ? "first-time" : "no-results"} />
            ) : viewMode === "grid" ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isSaved={savedProperties.includes(property.id)}
                      onSave={handleSave}
                      onViewDetails={handleViewDetails}
                      onAddToPipeline={handleAddToPipeline}
                    />
                  ))}
                </div>
                {results.length < totalResults && (
                  <div className="flex justify-center mt-8">
                    <Button onClick={handleLoadMore}>Load More</Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  {results.map((property) => (
                    <PropertyListRow
                      key={property.id}
                      property={property}
                      isSelected={selectedProperties.includes(property.id)}
                      isSaved={savedProperties.includes(property.id)}
                      onSelect={togglePropertySelection}
                      onSave={handleSave}
                      onViewDetails={handleViewDetails}
                      onAddToPipeline={handleAddToPipeline}
                    />
                  ))}
                </div>
                {results.length < totalResults && (
                  <div className="flex justify-center mt-8">
                    <Button onClick={handleLoadMore}>Load More</Button>
                  </div>
                )}
              </>
            )}

            {/* Results Footer */}
            {!showEmptyState && !isLoading && (
              <div className="flex items-center justify-center mt-6 text-sm text-muted-foreground">
                Showing {results.length} of {totalResults} properties
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

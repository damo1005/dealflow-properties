import { Search, SlidersHorizontal, LayoutGrid, List, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/searchStore";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "recent", label: "Recently Added" },
  { value: "reduced", label: "Recently Reduced" },
  { value: "days", label: "Days on Market" },
  { value: "yield", label: "Estimated Yield" },
];

interface SearchHeaderProps {
  onToggleFilters?: () => void;
  filtersVisible?: boolean;
  onSearch?: () => void;
  isSearching?: boolean;
}

export function SearchHeader({ onToggleFilters, filtersVisible, onSearch, isSearching }: SearchHeaderProps) {
  const {
    filters,
    setFilters,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    totalResults,
    itemsPerPage,
    setItemsPerPage,
  } = useSearchStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.();
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter postcode or town (e.g. M14, Manchester)"
            className="pl-10"
            value={filters.location}
            onChange={(e) => setFilters({ location: e.target.value })}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button 
          onClick={onSearch} 
          disabled={isSearching || !filters.location?.trim()}
          className="gap-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="gap-2 sm:hidden"
          onClick={onToggleFilters}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Results count & filters toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className={cn("gap-2 hidden sm:flex", filtersVisible && "bg-muted")}
            onClick={onToggleFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{(totalResults ?? 0).toLocaleString()}</span> properties found
          </span>
        </div>

        {/* Right: Sort, View Mode, Items per page */}
        <div className="flex items-center gap-2">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Items per page */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden lg:flex gap-1">
                {itemsPerPage} per page
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[12, 24, 48, 96].map((count) => (
                <DropdownMenuItem
                  key={count}
                  onClick={() => setItemsPerPage(count)}
                >
                  {count} per page
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-r-none",
                viewMode === "grid" && "bg-muted"
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-l-none",
                viewMode === "list" && "bg-muted"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchStore } from "@/stores/searchStore";

interface EmptyStateProps {
  type: "no-results" | "first-time" | "too-restrictive";
}

export function EmptyState({ type }: EmptyStateProps) {
  const { resetFilters } = useSearchStore();

  const content = {
    "no-results": {
      icon: Search,
      title: "No Properties Found",
      description: "We couldn't find any properties matching your search criteria. Try adjusting your filters or searching in a different area.",
      actions: (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={resetFilters}>
            Clear All Filters
          </Button>
          <Button>Expand Search Area</Button>
        </div>
      ),
      suggestions: [
        "Try searching with fewer filters",
        "Increase your price range",
        "Expand the search radius",
        "Check spelling of location names",
      ],
    },
    "first-time": {
      icon: MapPin,
      title: "Start Your Property Search",
      description: "Enter a location above or use the filters to find investment properties that match your criteria.",
      actions: (
        <Button className="gap-2">
          <Search className="h-4 w-4" />
          Browse All Properties
        </Button>
      ),
      suggestions: [
        "Search by postcode for precise results",
        "Use filters to narrow down property types",
        "Set investment metrics for yield-focused searches",
        "Save searches to get alerts on new listings",
      ],
    },
    "too-restrictive": {
      icon: SlidersHorizontal,
      title: "Filters Too Restrictive",
      description: "Your current filter combination is too narrow. Try relaxing some criteria to see more results.",
      actions: (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={resetFilters}>
            Reset All Filters
          </Button>
          <Button>Show Similar Properties</Button>
        </div>
      ),
      suggestions: [
        "Remove some property type filters",
        "Increase your maximum price",
        "Lower minimum yield requirements",
        "Expand the search radius",
      ],
    },
  };

  const { icon: Icon, title, description, actions, suggestions } = content[type];

  return (
    <Card className="shadow-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
        
        {actions}

        <div className="mt-8 text-left w-full max-w-md">
          <h4 className="text-sm font-medium text-foreground mb-3">Suggestions:</h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

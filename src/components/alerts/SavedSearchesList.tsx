import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, MapPin, Bell, BellOff, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSavedSearches, useToggleSearchAlert, useDeleteSavedSearch, useCheckAlerts, SavedSearch } from "@/hooks/useSavedSearches";

interface SavedSearchesListProps {
  onCreateNew: () => void;
}

export function SavedSearchesList({ onCreateNew }: SavedSearchesListProps) {
  const { data: savedSearches, isLoading } = useSavedSearches();
  const toggleAlert = useToggleSearchAlert();
  const deleteSearch = useDeleteSavedSearch();
  const checkAlerts = useCheckAlerts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!savedSearches || savedSearches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No saved searches</h3>
          <p className="text-muted-foreground text-sm text-center mt-1">
            Save a search to get alerts when new properties match your criteria
          </p>
          <Button className="mt-4" onClick={onCreateNew}>
            Create Saved Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {savedSearches.map((search) => (
        <SavedSearchCard
          key={search.id}
          search={search}
          onToggleAlert={(enabled) => toggleAlert.mutate({ id: search.id, enabled })}
          onDelete={() => {
            if (confirm("Delete this saved search?")) {
              deleteSearch.mutate(search.id);
            }
          }}
          onRefresh={() => checkAlerts.mutate(search.id)}
          isRefreshing={checkAlerts.isPending}
        />
      ))}
    </div>
  );
}

interface SavedSearchCardProps {
  search: SavedSearch;
  onToggleAlert: (enabled: boolean) => void;
  onDelete: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

function SavedSearchCard({ search, onToggleAlert, onDelete, onRefresh, isRefreshing }: SavedSearchCardProps) {
  const formatPrice = (price: number) => `£${price.toLocaleString()}`;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{search.name}</h3>
              {search.alert_enabled ? (
                <Badge variant="default" className="bg-green-500">
                  <Bell className="h-3 w-3 mr-1" />
                  Alerts On
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <BellOff className="h-3 w-3 mr-1" />
                  Alerts Off
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {search.location && (
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  {search.location}
                </Badge>
              )}
              {search.min_beds && (
                <Badge variant="outline">{search.min_beds}+ beds</Badge>
              )}
              {search.min_price && (
                <Badge variant="outline">{formatPrice(search.min_price)}+</Badge>
              )}
              {search.max_price && (
                <Badge variant="outline">Up to {formatPrice(search.max_price)}</Badge>
              )}
              <Badge variant="outline">{search.radius} mile radius</Badge>
            </div>

            {search.last_checked && (
              <p className="text-xs text-muted-foreground mt-2">
                Last checked: {formatDistanceToNow(new Date(search.last_checked), { addSuffix: true })}
                {search.new_listings_count > 0 && (
                  <span className="text-green-600 ml-2">
                    • {search.new_listings_count} new listings
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Alerts</span>
              <Switch
                checked={search.alert_enabled}
                onCheckedChange={onToggleAlert}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={`/search?location=${encodeURIComponent(search.location || '')}&radius=${search.radius}&minPrice=${search.min_price || ''}&maxPrice=${search.max_price || ''}&minBeds=${search.min_beds || ''}`}>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

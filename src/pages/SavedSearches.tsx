import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Plus,
  Search,
  Bell,
  BellOff,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit,
  MoreHorizontal,
  RefreshCw,
  Calendar,
  Mail,
  Filter,
  TrendingUp,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSavedSearchesStore, SavedSearch } from "@/stores/savedSearchesStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const frequencyLabels = {
  instant: "Instant",
  daily: "Daily Digest",
  weekly: "Weekly Digest",
  manual: "Manual Only",
};

const frequencyColors = {
  instant: "bg-success/10 text-success",
  daily: "bg-primary/10 text-primary",
  weekly: "bg-chart-4/10 text-chart-4",
  manual: "bg-muted text-muted-foreground",
};

export default function SavedSearches() {
  const {
    searches,
    showCreateModal,
    setShowCreateModal,
    addSearch,
    updateSearch,
    deleteSearch,
    duplicateSearch,
    togglePause,
  } = useSavedSearchesStore();
  const { toast } = useToast();

  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    notification_frequency: "daily" as SavedSearch["notification_frequency"],
    alerts_enabled: true,
    max_properties_per_email: 10,
    digest_time: "09:00",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      notification_frequency: "daily",
      alerts_enabled: true,
      max_properties_per_email: 10,
      digest_time: "09:00",
    });
    setEditingSearch(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEdit = (search: SavedSearch) => {
    setEditingSearch(search);
    setFormData({
      name: search.name,
      description: search.description || "",
      notification_frequency: search.notification_frequency,
      alerts_enabled: search.alerts_enabled,
      max_properties_per_email: search.max_properties_per_email,
      digest_time: search.digest_time,
    });
    setShowCreateModal(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }

    if (editingSearch) {
      updateSearch(editingSearch.id, formData);
      toast({ title: "Search updated", description: "Your saved search has been updated." });
    } else {
      const newSearch: SavedSearch = {
        id: `search-${Date.now()}`,
        user_id: "user-1",
        ...formData,
        filters: {},
        paused: false,
        new_matches_count: 0,
        total_matches_count: 0,
        last_alert_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      addSearch(newSearch);
      toast({ title: "Search saved", description: "Your search has been saved with alerts." });
    }

    setShowCreateModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteSearch(id);
    toast({ title: "Search deleted" });
  };

  const handleDuplicate = (id: string) => {
    duplicateSearch(id);
    toast({ title: "Search duplicated" });
  };

  const handleRunNow = (search: SavedSearch) => {
    toast({
      title: "Running search...",
      description: `Checking for new matches for "${search.name}"`,
    });
    // In production, this would call the edge function
  };

  const handleToggleAlerts = (search: SavedSearch) => {
    updateSearch(search.id, { alerts_enabled: !search.alerts_enabled });
    toast({
      title: search.alerts_enabled ? "Alerts disabled" : "Alerts enabled",
      description: search.alerts_enabled
        ? "You won't receive notifications for this search"
        : "You'll receive notifications for new matches",
    });
  };

  const formatFilters = (filters: Record<string, unknown>): string => {
    const parts: string[] = [];
    if (filters.location) parts.push(`📍 ${filters.location}`);
    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? `£${(filters.minPrice as number / 1000).toFixed(0)}k` : "Any";
      const max = filters.maxPrice ? `£${(filters.maxPrice as number / 1000).toFixed(0)}k` : "Any";
      parts.push(`💰 ${min} - ${max}`);
    }
    if (filters.minYield) parts.push(`📈 ${filters.minYield}%+ yield`);
    if (filters.minBedrooms) parts.push(`🛏 ${filters.minBedrooms}+ beds`);
    if (filters.propertyTypes) parts.push(`🏠 ${(filters.propertyTypes as string[]).join(", ")}`);
    if (filters.priceReduced) parts.push("🔻 Price reduced");
    return parts.length > 0 ? parts.join(" • ") : "All properties";
  };

  return (
    <AppLayout title="Saved Searches">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Save your search criteria and get notified when new properties match
          </p>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Search
          </Button>
        </div>

        {/* Searches Grid */}
        {searches.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved searches yet</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Save your search criteria to get instant notifications when new properties match
                your requirements.
              </p>
              <Button onClick={handleOpenCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searches.map((search) => (
              <Card
                key={search.id}
                className={cn(
                  "relative overflow-hidden transition-all hover:shadow-md",
                  search.paused && "opacity-60"
                )}
              >
                {search.new_matches_count > 0 && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-success text-success-foreground">
                      {search.new_matches_count} new
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {search.name}
                        {search.paused && (
                          <Badge variant="secondary" className="text-xs">
                            Paused
                          </Badge>
                        )}
                      </CardTitle>
                      {search.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {search.description}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(search)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRunNow(search)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Run Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(search.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => togglePause(search.id)}>
                          {search.paused ? (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Resume
                            </>
                          ) : (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleAlerts(search)}>
                          {search.alerts_enabled ? (
                            <>
                              <BellOff className="mr-2 h-4 w-4" />
                              Disable Alerts
                            </>
                          ) : (
                            <>
                              <Bell className="mr-2 h-4 w-4" />
                              Enable Alerts
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(search.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Filters Summary */}
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        SEARCH CRITERIA
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{formatFilters(search.filters)}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-muted/30 text-center">
                      <p className="text-2xl font-bold">{search.total_matches_count}</p>
                      <p className="text-xs text-muted-foreground">Total Matches</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30 text-center">
                      <p className="text-2xl font-bold text-primary">{search.new_matches_count}</p>
                      <p className="text-xs text-muted-foreground">New Matches</p>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      {search.alerts_enabled ? (
                        <Bell className="h-4 w-4 text-primary" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", frequencyColors[search.notification_frequency])}
                      >
                        {frequencyLabels[search.notification_frequency]}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {search.last_alert_at
                        ? formatDistanceToNow(new Date(search.last_alert_at), { addSuffix: true })
                        : "Never"}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRunNow(search)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Run Now
                    </Button>
                    <Button variant="default" size="sm" className="flex-1" asChild>
                      <a href="/search">
                        <Search className="mr-2 h-4 w-4" />
                        View Results
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingSearch ? "Edit Saved Search" : "Create Saved Search"}
              </DialogTitle>
              <DialogDescription>
                {editingSearch
                  ? "Update your search settings and notification preferences."
                  : "Save your current search criteria and set up alerts."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Search Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., High Yield Manchester"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this search..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications for new matches
                    </p>
                  </div>
                  <Switch
                    checked={formData.alerts_enabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, alerts_enabled: checked })
                    }
                  />
                </div>

                {formData.alerts_enabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Notification Frequency</Label>
                      <Select
                        value={formData.notification_frequency}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            notification_frequency: value as SavedSearch["notification_frequency"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Instant (as properties match)
                            </div>
                          </SelectItem>
                          <SelectItem value="daily">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Daily Digest
                            </div>
                          </SelectItem>
                          <SelectItem value="weekly">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Weekly Digest
                            </div>
                          </SelectItem>
                          <SelectItem value="manual">Manual Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(formData.notification_frequency === "daily" ||
                      formData.notification_frequency === "weekly") && (
                      <div className="space-y-2">
                        <Label htmlFor="digest_time">Digest Time</Label>
                        <Input
                          id="digest_time"
                          type="time"
                          value={formData.digest_time}
                          onChange={(e) =>
                            setFormData({ ...formData, digest_time: e.target.value })
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="max_properties">Max Properties per Email</Label>
                      <Select
                        value={formData.max_properties_per_email.toString()}
                        onValueChange={(value) =>
                          setFormData({ ...formData, max_properties_per_email: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 properties</SelectItem>
                          <SelectItem value="10">10 properties</SelectItem>
                          <SelectItem value="20">20 properties</SelectItem>
                          <SelectItem value="50">50 properties</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingSearch ? "Save Changes" : "Create Search"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreateSavedSearch } from "@/hooks/useSavedSearches";

interface CreateSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSearchDialog({ open, onOpenChange }: CreateSearchDialogProps) {
  const createSearch = useCreateSavedSearch();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    radius: 10,
    min_price: "",
    max_price: "",
    min_beds: "",
    max_beds: "",
    alert_enabled: true,
    alert_frequency: "instant",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location.trim()) {
      return;
    }

    createSearch.mutate({
      name: formData.name || formData.location,
      location: formData.location,
      radius: formData.radius,
      min_price: formData.min_price ? parseInt(formData.min_price) : undefined,
      max_price: formData.max_price ? parseInt(formData.max_price) : undefined,
      min_beds: formData.min_beds ? parseInt(formData.min_beds) : undefined,
      max_beds: formData.max_beds ? parseInt(formData.max_beds) : undefined,
      alert_enabled: formData.alert_enabled,
      alert_frequency: formData.alert_frequency,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          name: "",
          location: "",
          radius: 10,
          min_price: "",
          max_price: "",
          min_beds: "",
          max_beds: "",
          alert_enabled: true,
          alert_frequency: "instant",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Saved Search</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Search Name</Label>
            <Input
              id="name"
              placeholder="e.g., North London Flats"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Manchester, M14, or London"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_price">Min Price</Label>
              <Input
                id="min_price"
                type="number"
                placeholder="e.g., 150000"
                value={formData.min_price}
                onChange={(e) => setFormData({ ...formData, min_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_price">Max Price</Label>
              <Input
                id="max_price"
                type="number"
                placeholder="e.g., 500000"
                value={formData.max_price}
                onChange={(e) => setFormData({ ...formData, max_price: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_beds">Min Beds</Label>
              <Input
                id="min_beds"
                type="number"
                placeholder="e.g., 2"
                value={formData.min_beds}
                onChange={(e) => setFormData({ ...formData, min_beds: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">Radius (miles)</Label>
              <Input
                id="radius"
                type="number"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) || 10 })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified of new listings</p>
            </div>
            <Switch
              checked={formData.alert_enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, alert_enabled: checked })}
            />
          </div>

          {formData.alert_enabled && (
            <div className="space-y-2">
              <Label>Alert Frequency</Label>
              <Select
                value={formData.alert_frequency}
                onValueChange={(v) => setFormData({ ...formData, alert_frequency: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={createSearch.isPending || !formData.location.trim()}>
            {createSearch.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Create Saved Search
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

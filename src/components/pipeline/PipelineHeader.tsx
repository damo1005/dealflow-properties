import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Activity,
  Download,
  SortAsc,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { usePipelineStore, PipelineProperty } from "@/stores/pipelineStore";
import { useToast } from "@/hooks/use-toast";

export function PipelineHeader() {
  const {
    filters,
    setFilters,
    clearFilters,
    availableLabels,
    toggleActivitySidebar,
    showActivitySidebar,
    addProperty,
    stages,
  } = usePipelineStore();
  const { toast } = useToast();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const handleAddProperty = () => {
    if (!newAddress) return;

    const newProperty: PipelineProperty = {
      id: `prop-${Date.now()}`,
      user_id: "user-1",
      address: newAddress,
      price: newPrice ? parseInt(newPrice) : undefined,
      stage: stages[0]?.id || "sourced",
      position: 0,
      labels: [],
      priority: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      activities: [
        {
          id: `act-${Date.now()}`,
          type: "created",
          description: "Added to pipeline",
          timestamp: new Date().toISOString(),
        },
      ],
      comments: [],
      documents: [],
      reminders: [],
    };

    addProperty(newProperty);
    setNewAddress("");
    setNewPrice("");
    setAddDialogOpen(false);

    toast({
      title: "Property added",
      description: "Property has been added to your pipeline.",
    });
  };

  const hasActiveFilters = filters.labels.length > 0 || filters.search || filters.assignedTo;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        {/* Search */}
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Label Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Tag className="h-4 w-4" />
              Labels
              {filters.labels.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.labels.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Label</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableLabels.map((label) => (
              <DropdownMenuCheckboxItem
                key={label.id}
                checked={filters.labels.includes(label.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ labels: [...filters.labels, label.id] });
                  } else {
                    setFilters({ labels: filters.labels.filter((l) => l !== label.id) });
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name}
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SortAsc className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilters({ sortBy: 'activity' })}>
              Latest Activity
              {filters.sortBy === 'activity' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ sortBy: 'price' })}>
              Price (High to Low)
              {filters.sortBy === 'price' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ sortBy: 'days' })}>
              Days in Pipeline
              {filters.sortBy === 'days' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Activity Toggle */}
        <Button
          variant={showActivitySidebar ? "secondary" : "outline"}
          size="sm"
          className="gap-2"
          onClick={toggleActivitySidebar}
        >
          <Activity className="h-4 w-4" />
          Activity
        </Button>

        {/* Export */}
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>

        {/* Add Property */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Property to Pipeline</DialogTitle>
              <DialogDescription>
                Add a new property to track in your deal pipeline.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  placeholder="Enter property address..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Asking Price (optional)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="250000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProperty} disabled={!newAddress}>
                Add Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

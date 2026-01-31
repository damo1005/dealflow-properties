import { useState } from "react";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { mockProperties } from "@/data/mockProperties";
import { formatCurrency } from "@/services/propertyDataApi";
import type { ComparisonProperty } from "@/types/comparison";

interface PropertySearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (properties: ComparisonProperty[]) => void;
  excludeIds: string[];
  maxSelect: number;
}

export function PropertySearchModal({
  open,
  onClose,
  onSelect,
  excludeIds,
  maxSelect,
}: PropertySearchModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  // Use mock properties - in production would fetch from API
  const availableProperties = mockProperties.filter(
    (p) => !excludeIds.includes(p.id)
  );

  const filteredProperties = availableProperties.filter((p) =>
    p.address.toLowerCase().includes(search.toLowerCase()) ||
    p.postcode?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < maxSelect) {
      setSelected([...selected, id]);
    }
  };

  const handleAdd = () => {
    const selectedProperties: ComparisonProperty[] = selected
      .map((id) => {
        const prop = mockProperties.find((p) => p.id === id);
        if (!prop) return null;
        return {
          id: prop.id,
          address: prop.address,
          price: prop.price,
          originalPrice: prop.originalPrice,
          priceReduced: prop.priceReduced,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          propertyType: prop.propertyType,
          images: prop.images,
          postcode: prop.postcode,
          daysOnMarket: prop.daysOnMarket,
          estimatedRent: Math.round(prop.price * 0.004), // Estimate 0.4% of price
          estimatedValue: Math.round(prop.price * 1.05),
        } as ComparisonProperty;
      })
      .filter((p): p is ComparisonProperty => p !== null);

    onSelect(selectedProperties);
    setSelected([]);
    setSearch("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Properties to Compare</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address or postcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Selected:</span>
              {selected.map((id) => {
                const prop = mockProperties.find((p) => p.id === id);
                return (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {prop?.address.slice(0, 30)}...
                    <button onClick={() => handleToggle(id)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          <ScrollArea className="h-[400px] border rounded-lg">
            <div className="p-2 space-y-2">
              {filteredProperties.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No properties found
                </p>
              ) : (
                filteredProperties.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => handleToggle(property.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                      selected.includes(property.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    disabled={
                      !selected.includes(property.id) && selected.length >= maxSelect
                    }
                  >
                    <Checkbox
                      checked={selected.includes(property.id)}
                      className="pointer-events-none"
                    />
                    <img
                      src={property.images?.[0] || "/placeholder.svg"}
                      alt={property.address}
                      className="h-16 w-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{property.address}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{property.bedrooms} bed</span>
                        <span>•</span>
                        <span>{property.propertyType}</span>
                        <span>•</span>
                        <span>{property.postcode}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-lg">
                      {formatCurrency(property.price)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selected.length} of {maxSelect} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={selected.length === 0}>
                Add {selected.length} {selected.length === 1 ? "Property" : "Properties"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

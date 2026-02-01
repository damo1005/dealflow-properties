import { useState } from "react";
import { Search, X, Link, Loader2, Home, ExternalLink } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/services/propertyDataApi";
import { useAnalyzedProperties, useSavePropertyFromUrl, type AnalyzedProperty } from "@/hooks/useAnalyzedProperties";
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
  const [propertyUrl, setPropertyUrl] = useState("");
  const [addMode, setAddMode] = useState<"saved" | "url">("saved");
  
  const { data: analyzedProperties, isLoading } = useAnalyzedProperties();
  const saveFromUrl = useSavePropertyFromUrl();

  // Filter out already-added properties
  const availableProperties = (analyzedProperties || []).filter(
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

  const convertToComparisonProperty = (prop: AnalyzedProperty): ComparisonProperty => ({
    id: prop.id,
    address: prop.address,
    price: prop.asking_price || prop.purchase_price || 0,
    bedrooms: prop.bedrooms || undefined,
    bathrooms: prop.bathrooms || undefined,
    propertyType: prop.property_type || undefined,
    tenure: prop.tenure || undefined,
    sqft: prop.floor_area_sqft || undefined,
    epcRating: prop.epc_rating || undefined,
    postcode: prop.postcode || undefined,
    estimatedRent: prop.monthly_rent || undefined,
    images: prop.images || undefined,
    calculatedYield: prop.gross_yield || undefined,
    calculatedCashFlow: prop.monthly_cashflow || undefined,
    calculatedROI: prop.roi || prop.cash_on_cash || undefined,
    totalCashRequired: prop.total_investment || undefined,
  });

  const handleAdd = () => {
    const selectedProperties: ComparisonProperty[] = selected
      .map((id) => {
        const prop = analyzedProperties?.find((p) => p.id === id);
        if (!prop) return null;
        return convertToComparisonProperty(prop);
      })
      .filter((p): p is ComparisonProperty => p !== null);

    onSelect(selectedProperties);
    setSelected([]);
    setSearch("");
    onClose();
  };

  const handleFetchFromUrl = async () => {
    if (!propertyUrl) return;
    
    try {
      const saved = await saveFromUrl.mutateAsync(propertyUrl);
      // Add to selection and close
      const compProp = convertToComparisonProperty(saved);
      onSelect([compProp]);
      setPropertyUrl("");
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    setSelected([]);
    setSearch("");
    setPropertyUrl("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Properties to Compare</DialogTitle>
        </DialogHeader>

        <Tabs value={addMode} onValueChange={(v) => setAddMode(v as "saved" | "url")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved">
              <Home className="h-4 w-4 mr-2" />
              My Saved Properties
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link className="h-4 w-4 mr-2" />
              Add from URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-4 mt-4">
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
                  const prop = analyzedProperties?.find((p) => p.id === id);
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

            <ScrollArea className="h-[350px] border rounded-lg">
              <div className="p-2 space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading properties...</span>
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground font-medium">No saved properties found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Analyze properties in Deal Analyser first, or add via URL
                    </p>
                  </div>
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
                      {property.thumbnail_url || property.images?.[0] ? (
                        <img
                          src={property.thumbnail_url || property.images?.[0]}
                          alt={property.address}
                          className="h-16 w-20 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <Home className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{property.address}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {property.bedrooms && <span>{property.bedrooms} bed</span>}
                          {property.property_type && (
                            <>
                              <span>•</span>
                              <span>{property.property_type}</span>
                            </>
                          )}
                          {property.postcode && (
                            <>
                              <span>•</span>
                              <span>{property.postcode}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {property.gross_yield && (
                            <Badge variant="outline" className="text-xs">
                              {property.gross_yield.toFixed(1)}% yield
                            </Badge>
                          )}
                          {property.strategy && (
                            <Badge variant="secondary" className="text-xs uppercase">
                              {property.strategy}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatCurrency(property.asking_price || property.purchase_price || 0)}
                        </p>
                        {property.monthly_cashflow !== null && property.monthly_cashflow !== undefined && (
                          <p className={`text-sm ${property.monthly_cashflow >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(property.monthly_cashflow)}/mo
                          </p>
                        )}
                      </div>
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
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={selected.length === 0}>
                  Add {selected.length} {selected.length === 1 ? "Property" : "Properties"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Property URL</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.rightmove.co.uk/properties/..."
                  value={propertyUrl}
                  onChange={(e) => setPropertyUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleFetchFromUrl} 
                  disabled={!propertyUrl || saveFromUrl.isPending}
                >
                  {saveFromUrl.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Fetch
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported: Rightmove, Zoopla, OnTheMarket, Auction sites
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Link className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Paste a property listing URL to automatically fetch details and add to comparison
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

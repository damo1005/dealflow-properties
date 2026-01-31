import { Heart, BedDouble, Bath, Home, Clock, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Property } from "@/stores/searchStore";

interface PropertyListRowProps {
  property: Property;
  isSelected?: boolean;
  isSaved?: boolean;
  onSelect?: (id: string) => void;
  onSave?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onAddToPipeline?: (id: string) => void;
}

export function PropertyListRow({
  property,
  isSelected = false,
  isSaved = false,
  onSelect,
  onSave,
  onViewDetails,
  onAddToPipeline,
}: PropertyListRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer",
        isSelected && "bg-primary/5"
      )}
      onClick={() => onViewDetails?.(property.id)}
    >
      {/* Checkbox */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect?.(property.id)}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Image */}
      <div className="relative w-24 h-16 rounded-md overflow-hidden bg-muted shrink-0">
        <img
          src={property.images[0] || "/placeholder.svg"}
          alt={property.address}
          className="w-full h-full object-cover"
        />
        {property.priceReduced && (
          <Badge className="absolute top-1 left-1 text-xs bg-destructive text-destructive-foreground px-1 py-0">
            Reduced
          </Badge>
        )}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">
            {formatPrice(property.price)}
          </span>
          {property.originalPrice && property.originalPrice > property.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(property.originalPrice)}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{property.address}</p>
      </div>

      {/* Property Details */}
      <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground shrink-0">
        <div className="flex items-center gap-1">
          <BedDouble className="h-4 w-4" />
          <span>{property.bedrooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath className="h-4 w-4" />
          <span>{property.bathrooms}</span>
        </div>
        <div className="flex items-center gap-1 max-w-[100px]">
          <Home className="h-4 w-4 shrink-0" />
          <span className="truncate">{property.propertyType}</span>
        </div>
      </div>

      {/* Days on Market */}
      <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground shrink-0">
        <Clock className="h-4 w-4" />
        <span>{property.daysOnMarket}d</span>
      </div>

      {/* Investment Metrics */}
      <div className="hidden xl:flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="font-medium text-success">{property.estimatedYield}%</span>
        </div>
        <span className="text-sm text-muted-foreground">{property.roiPotential}% ROI</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isSaved && "text-destructive")}
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(property.id);
          }}
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onAddToPipeline?.(property.id);
          }}
        >
          <Plus className="h-3 w-3" />
          Pipeline
        </Button>
      </div>
    </div>
  );
}

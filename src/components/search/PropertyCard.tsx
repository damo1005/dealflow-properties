import { useState } from "react";
import { Heart, BedDouble, Bath, Home, Clock, TrendingUp, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Property } from "@/stores/searchStore";

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onAddToPipeline?: (id: string) => void;
}

export function PropertyCard({
  property,
  isSaved = false,
  onSave,
  onViewDetails,
  onAddToPipeline,
}: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      className="overflow-hidden shadow-card card-hover cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(property.id)}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={property.images[currentImage] || "/placeholder.svg"}
          alt={property.address}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Image Navigation */}
        {property.images.length > 1 && isHovered && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-90"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-90"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {property.images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  idx === currentImage ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Save Button */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8",
            isSaved && "text-destructive"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(property.id);
          }}
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
        </Button>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {property.priceReduced && (
            <Badge className="bg-destructive text-destructive-foreground">
              Reduced
            </Badge>
          )}
          <Badge variant="secondary" className="bg-background/90">
            <Clock className="h-3 w-3 mr-1" />
            {property.daysOnMarket}d
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            {formatPrice(property.price)}
          </span>
          {property.originalPrice && property.originalPrice > property.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(property.originalPrice)}
            </span>
          )}
        </div>

        {/* Address */}
        <p className="text-sm text-muted-foreground line-clamp-1">
          {property.address}
        </p>

        {/* Property Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span className="truncate max-w-[80px]">{property.propertyType}</span>
          </div>
        </div>

        {/* Investment Metrics */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="font-medium text-success">{property.estimatedYield}% yield</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {property.roiPotential}% ROI
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(property.id);
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onAddToPipeline?.(property.id);
            }}
          >
            <Plus className="h-3 w-3" />
            Pipeline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

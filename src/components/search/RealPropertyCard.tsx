import { useState } from "react";
import { Heart, BedDouble, Bath, Home, Clock, TrendingUp, Plus, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PropertyListing } from "@/hooks/usePropertySearch";

interface RealPropertyCardProps {
  property: PropertyListing;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onAddToPipeline?: (id: string) => void;
  onAnalyze?: (listingUrl: string) => void;
}

export function RealPropertyCard({
  property,
  isSaved = false,
  onSave,
  onViewDetails,
  onAddToPipeline,
  onAnalyze,
}: RealPropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = property.images?.length ? property.images : 
                 property.thumbnail_url ? [property.thumbnail_url] : 
                 ["/placeholder.svg"];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on application";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate days on market
  const daysOnMarket = property.first_listed 
    ? Math.floor((Date.now() - new Date(property.first_listed).getTime()) / (1000 * 60 * 60 * 24))
    : null;

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
          src={images[currentImage]}
          alt={property.address}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />

        {/* Image Navigation */}
        {images.length > 1 && isHovered && (
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
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 5).map((_, idx) => (
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
          {property.is_reduced && (
            <Badge className="bg-destructive text-destructive-foreground">
              Reduced {property.reduction_percent ? `${property.reduction_percent}%` : ''}
            </Badge>
          )}
          {daysOnMarket !== null && (
            <Badge variant="secondary" className="bg-background/90">
              <Clock className="h-3 w-3 mr-1" />
              {daysOnMarket}d
            </Badge>
          )}
          <Badge variant="outline" className="bg-background/90 text-xs capitalize">
            {property.source}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            {formatPrice(property.price)}
          </span>
          {property.original_price && property.original_price > (property.price || 0) && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(property.original_price)}
            </span>
          )}
        </div>

        {/* Address */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.address}
        </p>

        {/* Property Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.property_type && (
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="truncate max-w-[80px]">{property.property_type}</span>
            </div>
          )}
        </div>

        {/* Investment Metrics */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          {property.gross_yield && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="font-medium text-success">{property.gross_yield}% yield</span>
            </div>
          )}
          {property.estimated_rent && (
            <div className="text-sm text-muted-foreground">
              ~£{property.estimated_rent.toLocaleString()}/mo
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onAnalyze?.(property.listing_url);
            }}
          >
            Analyze
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              window.open(property.listing_url, "_blank");
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onAddToPipeline?.(property.id);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

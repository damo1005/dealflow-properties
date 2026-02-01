import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Bed, 
  Bath, 
  Users, 
  Star, 
  Calendar, 
  DollarSign, 
  Settings,
  ExternalLink
} from "lucide-react";
import type { STRProperty } from "@/types/str";

interface STRPropertyCardProps {
  property: STRProperty;
  onView: (id: string) => void;
  onOptimize: (id: string) => void;
}

export function STRPropertyCard({ property, onView, onOptimize }: STRPropertyCardProps) {
  const getScoreColor = (score?: number) => {
    if (!score) return "bg-muted text-muted-foreground";
    if (score >= 80) return "bg-emerald-500/10 text-emerald-600";
    if (score >= 60) return "bg-amber-500/10 text-amber-600";
    return "bg-destructive/10 text-destructive";
  };

  const getScoreStars = (score?: number) => {
    if (!score) return 0;
    return Math.round(score / 20);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onView(property.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{property.property_name}</CardTitle>
            <p className="text-sm text-muted-foreground">{property.address || property.postcode}</p>
          </div>
          <Badge 
            variant="secondary" 
            className={getScoreColor(property.listing_score)}
          >
            {property.listing_score || 0}/100
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Property Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.bedrooms || 0} bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms || 0} bath
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Sleeps {property.sleeps || 0}
          </span>
        </div>

        {/* Score Stars */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Listing Score:</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-4 w-4 ${
                  star <= getScoreStars(property.listing_score) 
                    ? "fill-amber-400 text-amber-400" 
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Base Rate</p>
            <p className="text-lg font-semibold">
              £{property.base_price_per_night || 0}/night
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Photos</p>
            <p className="text-lg font-semibold">
              {property.photo_count || 0}/25
            </p>
          </div>
        </div>

        {/* Platform Links */}
        <div className="flex items-center gap-2 flex-wrap">
          {property.airbnb_url && (
            <Badge variant="outline" className="text-xs">
              <Home className="h-3 w-3 mr-1" />
              Airbnb
            </Badge>
          )}
          {property.vrbo_url && (
            <Badge variant="outline" className="text-xs">
              <Home className="h-3 w-3 mr-1" />
              VRBO
            </Badge>
          )}
          {property.booking_com_url && (
            <Badge variant="outline" className="text-xs">
              <Home className="h-3 w-3 mr-1" />
              Booking.com
            </Badge>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {property.is_active && (
            <Badge variant="default" className="bg-emerald-500">Active</Badge>
          )}
          {property.is_listed && (
            <Badge variant="secondary">Listed</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView(property.id)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Calendar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onOptimize(property.id)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Optimize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

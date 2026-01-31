import { useEffect, useRef } from "react";
import { MapPin, Train, School, ShoppingCart, Heart, AlertTriangle, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PropertyDetail } from "@/data/mockPropertyDetail";
import { cn } from "@/lib/utils";

interface PropertyMapProps {
  property: PropertyDetail;
}

const amenityIcons: Record<string, React.ElementType> = {
  school: School,
  transport: Train,
  shopping: ShoppingCart,
  health: Heart,
};

export function PropertyMap({ property }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showCrime, setShowCrime] = useState(false);
  const [showFlood, setShowFlood] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadMap = async () => {
      if (!mapRef.current) return;

      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current).setView(
        [property.latitude, property.longitude],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add property marker
      const propertyIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background: hsl(221, 83%, 40%); width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([property.latitude, property.longitude], { icon: propertyIcon })
        .addTo(map)
        .bindPopup(`<strong>${property.address}</strong>`);

      setMapLoaded(true);

      return () => {
        map.remove();
      };
    };

    loadMap();
  }, [property.latitude, property.longitude, property.address]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="crime"
                checked={showCrime}
                onCheckedChange={setShowCrime}
              />
              <Label htmlFor="crime" className="text-sm flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Crime
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="flood"
                checked={showFlood}
                onCheckedChange={setShowFlood}
              />
              <Label htmlFor="flood" className="text-sm flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                Flood
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-[300px] rounded-lg bg-muted overflow-hidden"
          style={{ zIndex: 0 }}
        />

        {/* Risk Indicators */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Crime: {property.crimeRate}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="gap-1">
              <Droplets className="h-3 w-3" />
              Flood Risk: {property.floodRisk}
            </Badge>
          </div>
        </div>

        {/* Nearby Amenities */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground text-sm">Nearby Amenities</h4>
          <div className="grid gap-2">
            {property.nearbyAmenities.map((amenity, index) => {
              const Icon = amenityIcons[amenity.type] || MapPin;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg bg-muted/50 animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {amenity.distance}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transport Links */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground text-sm">Transport Links</h4>
          <div className="grid gap-2">
            {property.transportLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Train className="h-4 w-4 text-primary" />
                  <span className="text-sm">{link.name}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {link.type}
                  </Badge>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {link.distance}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

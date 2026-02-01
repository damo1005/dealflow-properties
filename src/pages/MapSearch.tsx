import { useState, useEffect, useRef, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  Layers,
  MapPin,
  Save,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Flame,
  TrendingUp,
  Building2,
  Star,
  Home,
  Bed,
  PoundSterling,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface Property {
  id: string;
  lat: number;
  lng: number;
  price: number;
  beds: number;
  type: string;
  address: string;
  image: string;
  yield_pct: number;
}

const mockProperties: Property[] = [
  { id: "1", lat: 51.652, lng: -0.0777, price: 295000, beds: 3, type: "house", address: "123 High Street, EN3", image: "/placeholder.svg", yield_pct: 6.2 },
  { id: "2", lat: 51.655, lng: -0.0680, price: 225000, beds: 2, type: "flat", address: "45 Oak Road, EN3", image: "/placeholder.svg", yield_pct: 7.1 },
  { id: "3", lat: 51.648, lng: -0.0820, price: 350000, beds: 4, type: "house", address: "78 Maple Lane, EN3", image: "/placeholder.svg", yield_pct: 5.8 },
  { id: "4", lat: 51.660, lng: -0.0750, price: 185000, beds: 1, type: "flat", address: "12 Birch Court, EN3", image: "/placeholder.svg", yield_pct: 8.2 },
  { id: "5", lat: 51.645, lng: -0.0900, price: 425000, beds: 5, type: "house", address: "99 Cedar Drive, EN3", image: "/placeholder.svg", yield_pct: 5.4 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export default function MapSearch() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [heatMapType, setHeatMapType] = useState<string | null>(null);

  // Filters
  const [priceRange, setPriceRange] = useState([100000, 500000]);
  const [minBeds, setMinBeds] = useState(0);
  const [propertyTypes, setPropertyTypes] = useState({
    house: true,
    flat: true,
    bungalow: false,
    land: false,
  });
  const [minYield, setMinYield] = useState(0);

  useEffect(() => {
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

      const map = L.map(mapRef.current).setView([51.652, -0.0777], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add property markers
      mockProperties.forEach((property) => {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background: ${property.type === "house" ? "hsl(221, 83%, 40%)" : "hsl(142, 76%, 36%)"};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">£${Math.round(property.price / 1000)}K</div>`,
          iconSize: [60, 24],
          iconAnchor: [30, 24],
        });

        const marker = L.marker([property.lat, property.lng], { icon }).addTo(map);

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <img src="${property.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
            <strong>${formatCurrency(property.price)}</strong><br/>
            <span>${property.beds} bed ${property.type}</span><br/>
            <span style="color: #666;">${property.address}</span><br/>
            <span style="color: #22c55e;">Yield: ${property.yield_pct}%</span>
          </div>
        `);
      });

      setMapLoaded(true);

      return () => {
        map.remove();
      };
    };

    loadMap();
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      toast.info(`Searching for "${searchQuery}"...`);
    }
  };

  const handleSaveSearch = () => {
    toast.success("Map search saved successfully");
  };

  const filteredProperties = mockProperties.filter((p) => {
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (minBeds > 0 && p.beds < minBeds) return false;
    if (!propertyTypes[p.type as keyof typeof propertyTypes]) return false;
    if (minYield > 0 && p.yield_pct < minYield) return false;
    return true;
  });

  return (
    <AppLayout title="Map Search">
      <div className="flex h-[calc(100vh-8rem)] -m-6 relative">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } transition-all duration-300 overflow-hidden flex-shrink-0 bg-background border-r z-10`}
        >
          <div className="w-80 h-full flex flex-col">
            {/* Filters Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h3>
                <Button variant="ghost" size="sm">
                  Reset
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Price Range</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={50000}
                  max={1000000}
                  step={10000}
                  className="my-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(priceRange[0])}</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Property Type</Label>
                <div className="space-y-2">
                  {Object.entries(propertyTypes).map(([type, checked]) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        id={type}
                        checked={checked}
                        onCheckedChange={(c) =>
                          setPropertyTypes((prev) => ({ ...prev, [type]: !!c }))
                        }
                      />
                      <Label htmlFor={type} className="text-sm capitalize cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Bedrooms</Label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((beds) => (
                    <Button
                      key={beds}
                      variant={minBeds === beds ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMinBeds(beds)}
                      className="flex-1"
                    >
                      {beds === 0 ? "Any" : `${beds}+`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Minimum Yield */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Minimum Yield</Label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 5, 6, 7, 8, 10].map((yld) => (
                    <Button
                      key={yld}
                      variant={minYield === yld ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMinYield(yld)}
                    >
                      {yld === 0 ? "Any" : `${yld}%+`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <Button className="w-full">Apply Filters</Button>
            </div>

            {/* Results Summary */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Properties Found</span>
                <Badge>{filteredProperties.length}</Badge>
              </div>
              <Button variant="outline" className="w-full" onClick={handleSaveSearch}>
                <Save className="h-4 w-4 mr-2" />
                Save Search
              </Button>
            </div>
          </div>
        </div>

        {/* Toggle Sidebar Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-4 z-20 bg-background shadow-md"
          style={{ left: sidebarOpen ? "calc(20rem + 1rem)" : "1rem" }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {/* Heat Map Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-background shadow-md">
                  <Flame className="h-4 w-4 mr-2" />
                  Heat Map
                  {heatMapType && <Badge variant="secondary" className="ml-2">{heatMapType}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Heat Map Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setHeatMapType(heatMapType === "yield" ? null : "yield")}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Rental Yield
                  {heatMapType === "yield" && <Badge className="ml-auto">Active</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeatMapType(heatMapType === "growth" ? null : "growth")}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Price Growth
                  {heatMapType === "growth" && <Badge className="ml-auto">Active</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeatMapType(heatMapType === "demand" ? null : "demand")}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Demand
                  {heatMapType === "demand" && <Badge className="ml-auto">Active</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeatMapType(heatMapType === "score" ? null : "score")}>
                  <Star className="h-4 w-4 mr-2" />
                  Investment Score
                  {heatMapType === "score" && <Badge className="ml-auto">Active</Badge>}
                </DropdownMenuItem>
                {heatMapType && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setHeatMapType(null)}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Heat Map
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Layers Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-background shadow-md">
                  <Layers className="h-4 w-4 mr-2" />
                  Layers
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Map Layers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Checkbox className="mr-2" defaultChecked />
                  Properties
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox className="mr-2" defaultChecked />
                  Saved Properties
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox className="mr-2" />
                  Schools
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox className="mr-2" />
                  Transport
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox className="mr-2" />
                  Crime Rate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox className="mr-2" />
                  Flood Zones
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Map Container */}
          <div ref={mapRef} className="w-full h-full" />

          {/* Property List (Bottom) */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <Card className="bg-background/95 backdrop-blur">
              <CardContent className="p-3">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {filteredProperties.slice(0, 5).map((property) => (
                    <div
                      key={property.id}
                      className="flex-shrink-0 w-48 p-2 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <div className="flex gap-2">
                        <img
                          src={property.image}
                          alt=""
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{formatCurrency(property.price)}</p>
                          <p className="text-xs text-muted-foreground">
                            {property.beds} bed {property.type}
                          </p>
                          <p className="text-xs text-green-600">{property.yield_pct}% yield</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

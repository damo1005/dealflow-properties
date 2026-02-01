import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  AlertTriangle,
  Check,
  Home,
  Building2,
  Palmtree,
  Plane,
  Globe,
  Hotel
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { PlatformConnection, PlatformName } from "@/types/str";

interface PlatformConnectionsProps {
  connections: PlatformConnection[];
  propertyId: string;
  onAddConnection: (connection: Partial<PlatformConnection>) => void;
  onUpdateConnection: (id: string, data: Partial<PlatformConnection>) => void;
  onRemoveConnection: (id: string) => void;
  onSyncConnection: (id: string) => void;
  isLoading: boolean;
}

const PLATFORMS: { name: PlatformName; label: string; icon: React.ReactNode; color: string }[] = [
  { name: "airbnb", label: "Airbnb", icon: <Home className="h-5 w-5" />, color: "bg-red-500" },
  { name: "booking_com", label: "Booking.com", icon: <Building2 className="h-5 w-5" />, color: "bg-blue-600" },
  { name: "vrbo", label: "VRBO", icon: <Palmtree className="h-5 w-5" />, color: "bg-emerald-500" },
  { name: "expedia", label: "Expedia", icon: <Plane className="h-5 w-5" />, color: "bg-yellow-500" },
  { name: "tripadvisor", label: "TripAdvisor", icon: <Globe className="h-5 w-5" />, color: "bg-green-500" },
  { name: "google", label: "Google Vacation", icon: <Globe className="h-5 w-5" />, color: "bg-blue-500" },
  { name: "hotels_com", label: "Hotels.com", icon: <Hotel className="h-5 w-5" />, color: "bg-red-600" },
  { name: "agoda", label: "Agoda", icon: <Building2 className="h-5 w-5" />, color: "bg-purple-500" },
  { name: "direct", label: "Direct Booking", icon: <Home className="h-5 w-5" />, color: "bg-gray-600" },
];

export function PlatformConnections({
  connections,
  propertyId,
  onAddConnection,
  onUpdateConnection,
  onRemoveConnection,
  onSyncConnection,
  isLoading,
}: PlatformConnectionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlatform, setNewPlatform] = useState<PlatformName>("airbnb");
  const [listingUrl, setListingUrl] = useState("");
  const [icalUrl, setIcalUrl] = useState("");
  const [syncFrequency, setSyncFrequency] = useState("hourly");
  const [autoBlock, setAutoBlock] = useState(true);

  const getPlatformInfo = (name: PlatformName) => {
    return PLATFORMS.find((p) => p.name === name) || PLATFORMS[0];
  };

  const handleAddConnection = () => {
    if (!icalUrl) {
      toast.error("iCal URL is required");
      return;
    }

    onAddConnection({
      str_property_id: propertyId,
      platform_name: newPlatform,
      listing_url: listingUrl,
      ical_url: icalUrl,
      sync_frequency: syncFrequency,
      is_active: true,
      sync_errors: 0,
      total_bookings: 0,
      total_revenue: 0,
    });

    setIsDialogOpen(false);
    setListingUrl("");
    setIcalUrl("");
    toast.success(`${getPlatformInfo(newPlatform).label} connected successfully!`);
  };

  const getIcalInstructions = (platform: PlatformName) => {
    switch (platform) {
      case "airbnb":
        return [
          "Go to your Calendar",
          'Click "Availability Settings"',
          'Click "Export Calendar"',
          "Copy the iCal link",
        ];
      case "booking_com":
        return [
          "Go to Calendar",
          'Click "Sync calendars"',
          'Copy "Calendar export link"',
        ];
      case "vrbo":
        return [
          "Go to Calendar",
          'Click "Import/Export"',
          "Copy the Export URL",
        ];
      default:
        return ["Find calendar settings", "Look for export/iCal option", "Copy the calendar URL"];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Connected Platforms</h2>
          <p className="text-sm text-muted-foreground">
            Sync calendars from multiple booking platforms
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Connect New Platform</DialogTitle>
              <DialogDescription>
                Add a booking platform to sync calendars
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Select Platform</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.slice(0, 8).map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => setNewPlatform(platform.name)}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                        newPlatform === platform.name
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`p-2 rounded-full ${platform.color} text-white`}>
                        {platform.icon}
                      </div>
                      <span className="text-xs font-medium truncate w-full text-center">
                        {platform.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Listing URL */}
              <div className="space-y-2">
                <Label>Listing URL (optional)</Label>
                <Input
                  placeholder="https://airbnb.com/rooms/..."
                  value={listingUrl}
                  onChange={(e) => setListingUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Your public listing page</p>
              </div>

              {/* iCal URL */}
              <div className="space-y-2">
                <Label>iCal Calendar URL *</Label>
                <Input
                  placeholder="https://airbnb.com/calendar/ical/..."
                  value={icalUrl}
                  onChange={(e) => setIcalUrl(e.target.value)}
                />
              </div>

              {/* iCal Instructions */}
              <Accordion type="single" collapsible>
                <AccordionItem value="instructions">
                  <AccordionTrigger className="text-sm">
                    How to find your iCal URL
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {getIcalInstructions(newPlatform).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Sync Frequency */}
              <div className="space-y-2">
                <Label>Sync Frequency</Label>
                <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every hour (recommended)</SelectItem>
                    <SelectItem value="4hours">Every 4 hours</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Auto-block dates</Label>
                  <p className="text-xs text-muted-foreground">
                    Block dates when new booking detected
                  </p>
                </div>
                <Switch checked={autoBlock} onCheckedChange={setAutoBlock} />
              </div>

              <Button onClick={handleAddConnection} className="w-full">
                Connect Platform
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connected Platforms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : connections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-1">No platforms connected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect Airbnb, Booking.com, VRBO and more
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Connect First Platform
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((connection) => {
            const platform = getPlatformInfo(connection.platform_name);
            const hasError = connection.sync_errors > 0;

            return (
              <Card key={connection.id} className={hasError ? "border-destructive" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${platform.color} text-white`}>
                        {platform.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{platform.label}</CardTitle>
                        {hasError ? (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Sync Error
                          </Badge>
                        ) : connection.is_active ? (
                          <Badge className="bg-emerald-500 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasError ? (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      <p className="font-medium">Error: {connection.last_error}</p>
                      <p className="text-xs mt-1">
                        Failed {connection.sync_errors} time(s)
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-muted-foreground">
                        Last sync:{" "}
                        {connection.last_synced_at
                          ? formatDistanceToNow(new Date(connection.last_synced_at), {
                              addSuffix: true,
                            })
                          : "Never"}
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bookings:</span>
                          <span className="font-medium">{connection.total_bookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium">
                            £{(connection.total_revenue || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    {connection.listing_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(connection.listing_url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSyncConnection(connection.id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Sync
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onRemoveConnection(connection.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

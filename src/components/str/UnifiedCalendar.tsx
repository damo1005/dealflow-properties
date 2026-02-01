import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  X
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, parseISO } from "date-fns";
import type { STRBooking, PlatformConnection, PlatformName } from "@/types/str";

interface UnifiedCalendarProps {
  bookings: STRBooking[];
  connections: PlatformConnection[];
  onSyncAll: () => void;
  isSyncing: boolean;
}

const PLATFORM_COLORS: Record<PlatformName, string> = {
  airbnb: "bg-blue-500",
  booking_com: "bg-yellow-500",
  vrbo: "bg-emerald-500",
  expedia: "bg-orange-500",
  tripadvisor: "bg-green-600",
  google: "bg-blue-600",
  hotels_com: "bg-red-500",
  agoda: "bg-purple-500",
  plum_guide: "bg-pink-500",
  marriott: "bg-indigo-500",
  direct: "bg-gray-500",
};

const PLATFORM_LABELS: Record<PlatformName, string> = {
  airbnb: "Airbnb",
  booking_com: "Booking.com",
  vrbo: "VRBO",
  expedia: "Expedia",
  tripadvisor: "TripAdvisor",
  google: "Google",
  hotels_com: "Hotels.com",
  agoda: "Agoda",
  plum_guide: "Plum Guide",
  marriott: "Marriott",
  direct: "Direct",
};

export function UnifiedCalendar({
  bookings,
  connections,
  onSyncAll,
  isSyncing,
}: UnifiedCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<STRBooking | null>(null);
  const [visiblePlatforms, setVisiblePlatforms] = useState<Set<PlatformName>>(
    new Set(connections.map((c) => c.platform_name))
  );

  // Get days for the calendar grid
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, STRBooking[]>();
    
    bookings.forEach((booking) => {
      if (!visiblePlatforms.has(booking.platform as PlatformName)) return;
      
      const checkin = parseISO(booking.checkin_date);
      const checkout = parseISO(booking.checkout_date);
      
      calendarDays.forEach((day) => {
        if (isWithinInterval(day, { start: checkin, end: checkout }) && !isSameDay(day, checkout)) {
          const key = format(day, "yyyy-MM-dd");
          const existing = map.get(key) || [];
          if (!existing.find((b) => b.id === booking.id)) {
            map.set(key, [...existing, booking]);
          }
        }
      });
    });
    
    return map;
  }, [bookings, calendarDays, visiblePlatforms]);

  // Detect conflicts (same date with multiple platforms)
  const conflicts = useMemo(() => {
    const conflictDates: string[] = [];
    
    bookingsByDate.forEach((dayBookings, date) => {
      const platforms = new Set(dayBookings.map((b) => b.platform));
      if (platforms.size > 1) {
        conflictDates.push(date);
      }
    });
    
    return conflictDates;
  }, [bookingsByDate]);

  const togglePlatform = (platform: PlatformName) => {
    const newSet = new Set(visiblePlatforms);
    if (newSet.has(platform)) {
      newSet.delete(platform);
    } else {
      newSet.add(platform);
    }
    setVisiblePlatforms(newSet);
  };

  const getPlatformBookingsCount = (platform: PlatformName) => {
    return bookings.filter((b) => b.platform === platform).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Unified Calendar</h2>
          <p className="text-sm text-muted-foreground">
            All platforms in one view
          </p>
        </div>
        <Button onClick={onSyncAll} disabled={isSyncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync All"}
        </Button>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
              <h3 className="font-medium text-destructive">
                {conflicts.length} Conflict(s) Detected!
              </h3>
              <p className="text-sm text-destructive/80">
                You have overlapping bookings on different platforms. Action required!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {connections.map((connection) => {
              const count = getPlatformBookingsCount(connection.platform_name);
              return (
                <div key={connection.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`platform-${connection.id}`}
                    checked={visiblePlatforms.has(connection.platform_name)}
                    onCheckedChange={() => togglePlatform(connection.platform_name)}
                  />
                  <Label
                    htmlFor={`platform-${connection.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        PLATFORM_COLORS[connection.platform_name]
                      }`}
                    />
                    <span>{PLATFORM_LABELS[connection.platform_name]}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: calendarDays[0].getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24" />
            ))}

            {calendarDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayBookings = bookingsByDate.get(dateKey) || [];
              const isConflict = conflicts.includes(dateKey);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dateKey}
                  className={`h-24 border rounded-lg p-1 ${
                    isConflict
                      ? "border-destructive bg-destructive/10"
                      : "border-border"
                  } ${isToday ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium ${
                        !isSameMonth(day, currentMonth)
                          ? "text-muted-foreground"
                          : ""
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {isConflict && (
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    )}
                  </div>

                  {/* Booking Indicators */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayBookings.slice(0, 3).map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className={`w-full text-left text-xs text-white px-1 py-0.5 rounded truncate ${
                          PLATFORM_COLORS[booking.platform as PlatformName] || "bg-gray-500"
                        }`}
                      >
                        {booking.guest_name || "Guest"}
                      </button>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="font-medium">Legend:</span>
        {Object.entries(PLATFORM_COLORS)
          .filter(([name]) =>
            connections.some((c) => c.platform_name === name)
          )
          .map(([name, color]) => (
            <div key={name} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span>{PLATFORM_LABELS[name as PlatformName]}</span>
            </div>
          ))}
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3 text-destructive" />
          <span className="text-destructive">Conflict</span>
        </div>
      </div>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full text-white ${
                    PLATFORM_COLORS[selectedBooking.platform as PlatformName] || "bg-gray-500"
                  }`}
                >
                  🏠
                </div>
                <div>
                  <p className="font-medium">
                    {PLATFORM_LABELS[selectedBooking.platform as PlatformName] || selectedBooking.platform}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(selectedBooking.checkin_date), "MMM d")} -{" "}
                    {format(parseISO(selectedBooking.checkout_date), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guest:</span>
                  <span className="font-medium">{selectedBooking.guest_name || "Guest"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nights:</span>
                  <span className="font-medium">{selectedBooking.nights || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline">{selectedBooking.status}</Badge>
                </div>
              </div>

              {selectedBooking.total_payout && (
                <div className="p-3 rounded-lg bg-muted space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Nightly Rate:</span>
                    <span>£{selectedBooking.nightly_rate || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning Fee:</span>
                    <span>£{selectedBooking.cleaning_fee || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span className="text-destructive">-£{selectedBooking.platform_fee || 0}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Net Revenue:</span>
                    <span>£{selectedBooking.total_payout}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Platform
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Guest
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

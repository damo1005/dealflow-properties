import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Calendar as CalendarIcon,
  Ban,
  User
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { STRBooking, CalendarBlock, BlockReason } from "@/types/str";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, parseISO, addMonths, subMonths } from "date-fns";

interface STRCalendarProps {
  bookings: STRBooking[];
  blocks: CalendarBlock[];
  onSync: () => void;
  onBlockDates: (block: Omit<CalendarBlock, 'id' | 'created_at'>) => void;
  isSyncing?: boolean;
  lastSyncedAt?: string;
}

export function STRCalendar({ 
  bookings, 
  blocks, 
  onSync, 
  onBlockDates,
  isSyncing,
  lastSyncedAt 
}: STRCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockData, setBlockData] = useState({
    start_date: "",
    end_date: "",
    reason: "personal_use" as BlockReason,
    notes: "",
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad to start on Sunday
  const startPadding = monthStart.getDay();
  const paddedDays = [...Array(startPadding).fill(null), ...days];

  const getDateStatus = (date: Date) => {
    // Check bookings
    const booking = bookings.find((b) => {
      const checkin = parseISO(b.checkin_date);
      const checkout = parseISO(b.checkout_date);
      return isWithinInterval(date, { start: checkin, end: checkout }) || isSameDay(date, checkin);
    });

    if (booking) {
      return { type: "booked" as const, data: booking };
    }

    // Check blocks
    const block = blocks.find((b) => {
      const start = parseISO(b.start_date);
      const end = parseISO(b.end_date);
      return isWithinInterval(date, { start, end }) || isSameDay(date, start);
    });

    if (block) {
      return { type: "blocked" as const, data: block };
    }

    return { type: "available" as const, data: null };
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setBlockData({
      ...blockData,
      start_date: format(date, "yyyy-MM-dd"),
      end_date: format(date, "yyyy-MM-dd"),
    });
    setShowBlockDialog(true);
  };

  const handleBlockSubmit = () => {
    onBlockDates({
      str_property_id: "", // Will be set by parent
      start_date: blockData.start_date,
      end_date: blockData.end_date,
      reason: blockData.reason,
      notes: blockData.notes,
    });
    setShowBlockDialog(false);
    setBlockData({
      start_date: "",
      end_date: "",
      reason: "personal_use",
      notes: "",
    });
  };

  // Calculate stats
  const stats = useMemo(() => {
    const daysInMonth = days.length;
    const bookedDays = days.filter((d) => getDateStatus(d).type === "booked").length;
    const blockedDays = days.filter((d) => getDateStatus(d).type === "blocked").length;
    const availableDays = daysInMonth - bookedDays - blockedDays;

    return {
      booked: bookedDays,
      blocked: blockedDays,
      available: availableDays,
      occupancy: Math.round((bookedDays / daysInMonth) * 100),
    };
  }, [days, bookings, blocks]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate((d) => subMonths(d, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold w-48 text-center">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate((d) => addMonths(d, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {lastSyncedAt ? `Last synced: ${format(parseISO(lastSyncedAt), "MMM d, h:mm a")}` : "Never synced"}
          </span>
          <Button variant="outline" size="sm" onClick={onSync} disabled={isSyncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Booked</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.booked} nights</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-2xl font-bold">{stats.available} nights</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Blocked</p>
          <p className="text-2xl font-bold text-muted-foreground">{stats.blocked} nights</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Occupancy</p>
          <p className="text-2xl font-bold">{stats.occupancy}%</p>
        </Card>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, index) => {
              if (!day) {
                return <div key={`pad-${index}`} className="h-20" />;
              }

              const status = getDateStatus(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => status.type === "available" && handleDateClick(day)}
                  className={`
                    h-20 p-2 rounded-lg border transition-colors cursor-pointer
                    ${isToday ? "ring-2 ring-primary" : ""}
                    ${status.type === "booked" ? "bg-emerald-500/10 border-emerald-500/30" : ""}
                    ${status.type === "blocked" ? "bg-muted border-muted-foreground/20" : ""}
                    ${status.type === "available" ? "hover:bg-muted/50" : ""}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>
                      {format(day, "d")}
                    </span>
                    {status.type === "booked" && status.data && (
                      <div className="flex-1 flex items-end">
                        <Badge variant="secondary" className="text-xs truncate w-full justify-start">
                          <User className="h-3 w-3 mr-1" />
                          {(status.data as STRBooking).guest_name || "Guest"}
                        </Badge>
                      </div>
                    )}
                    {status.type === "blocked" && status.data && (
                      <div className="flex-1 flex items-end">
                        <Badge variant="outline" className="text-xs">
                          <Ban className="h-3 w-3 mr-1" />
                          {(status.data as CalendarBlock).reason || "Blocked"}
                        </Badge>
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
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-muted-foreground/20" />
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border" />
          <span>Available</span>
        </div>
      </div>

      {/* Block Dates Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Dates</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={blockData.start_date}
                  onChange={(e) => setBlockData({ ...blockData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={blockData.end_date}
                  onChange={(e) => setBlockData({ ...blockData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <RadioGroup
                value={blockData.reason}
                onValueChange={(v) => setBlockData({ ...blockData, reason: v as BlockReason })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="personal_use" id="personal_use" />
                  <Label htmlFor="personal_use">Personal Use</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintenance" id="maintenance" />
                  <Label htmlFor="maintenance">Maintenance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blocked" id="blocked" />
                  <Label htmlFor="blocked">Blocked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Optional notes..."
                value={blockData.notes}
                onChange={(e) => setBlockData({ ...blockData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBlockSubmit}>Block Dates</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

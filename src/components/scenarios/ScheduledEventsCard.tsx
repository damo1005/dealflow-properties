import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, Plus } from "lucide-react";
import { format } from "date-fns";
import type { ScheduledEvent } from "@/types/scenario";
import { EVENT_CONFIG } from "@/types/scenario";

interface ScheduledEventsCardProps {
  events: ScheduledEvent[];
  onMarkComplete?: (eventId: string) => void;
  onAddEvent?: () => void;
}

export function ScheduledEventsCard({ events, onMarkComplete, onAddEvent }: ScheduledEventsCardProps) {
  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const monthKey = format(new Date(event.event_date), "MMMM yyyy");
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, ScheduledEvent[]>);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Events
          </CardTitle>
          {onAddEvent && (
            <Button size="sm" variant="outline" onClick={onAddEvent}>
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedEvents).map(([month, monthEvents]) => (
          <div key={month}>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">{month}</h4>
            <div className="space-y-2">
              {monthEvents.map((event) => {
                const config = EVENT_CONFIG[event.event_type];
                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <div>
                          <p className={`font-medium ${config.color}`}>{config.label}</p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(event.event_date), "d MMM yyyy")}
                            </span>
                            {event.estimated_cost && (
                              <Badge variant="outline" className="text-xs">
                                Est. £{event.estimated_cost.toLocaleString()}
                              </Badge>
                            )}
                            {event.income_impact && event.income_impact > 0 && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                +£{event.income_impact.toLocaleString()}/mo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {!event.is_completed && onMarkComplete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onMarkComplete(event.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No scheduled events</p>
            <Button variant="link" size="sm" onClick={onAddEvent}>
              Add your first event
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

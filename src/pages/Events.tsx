import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Video, Clock, Search, Plus, Ticket, CalendarPlus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useEventsStore } from '@/stores/eventsStore';
import { toast } from 'sonner';

export default function Events() {
  const { events, registrations, registerForEvent, cancelRegistration, getMyEvents } = useEventsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [freeOnly, setFreeOnly] = useState(false);

  const myEvents = getMyEvents();
  const isRegistered = (eventId: string) => registrations.some(r => r.event_id === eventId);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.event_type === filterType;
    const matchesFree = !freeOnly || event.is_free;
    return matchesSearch && matchesType && matchesFree;
  });

  const handleRegister = (eventId: string, eventTitle: string) => {
    registerForEvent(eventId);
    toast.success(`Registered for ${eventTitle}`);
  };

  const handleCancel = (eventId: string) => {
    cancelRegistration(eventId);
    toast.info('Registration cancelled');
  };

  const getEventTypeBadge = (type: string | null) => {
    const variants: Record<string, string> = {
      meetup: 'bg-blue-100 text-blue-800',
      webinar: 'bg-purple-100 text-purple-800',
      workshop: 'bg-green-100 text-green-800',
      networking: 'bg-orange-100 text-orange-800',
      conference: 'bg-red-100 text-red-800',
    };
    return variants[type || ''] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AppLayout title="Events">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Property Events
            </h1>
            <p className="text-muted-foreground">Discover networking events, webinars, and workshops</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-events">
              My Events {myEvents.length > 0 && `(${myEvents.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="meetup">Meetups</SelectItem>
                      <SelectItem value="webinar">Webinars</SelectItem>
                      <SelectItem value="workshop">Workshops</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="free-only" 
                      checked={freeOnly}
                      onCheckedChange={(checked) => setFreeOnly(checked as boolean)}
                    />
                    <label htmlFor="free-only" className="text-sm">Free only</label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-2 bg-primary" />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getEventTypeBadge(event.event_type)} variant="secondary">
                            {event.event_type}
                          </Badge>
                          {event.is_virtual && (
                            <Badge variant="outline" className="gap-1">
                              <Video className="h-3 w-3" />
                              Virtual
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(event.start_datetime), 'EEE d MMM yyyy')}</span>
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        <span>{format(new Date(event.start_datetime), 'h:mm a')}</span>
                      </div>
                      
                      {!event.is_virtual && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.venue_name}, {event.city}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.current_attendees}
                          {event.max_attendees && `/${event.max_attendees}`} attending
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="font-semibold">
                        {event.is_free ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          <span>£{event.ticket_price}</span>
                        )}
                      </div>
                      {isRegistered(event.id) ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Registered
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleCancel(event.id)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => handleRegister(event.id, event.title)}>
                          <Ticket className="h-4 w-4 mr-2" />
                          {event.is_free ? 'Register Free' : 'Get Tickets'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            {myEvents.length > 0 ? (
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className={getEventTypeBadge(event.event_type)} variant="secondary">
                              {event.event_type}
                            </Badge>
                            <h3 className="font-semibold">{event.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(event.start_datetime), 'EEE d MMM yyyy, h:mm a')}
                            </span>
                            {!event.is_virtual && event.venue_name && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.venue_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            Add to Calendar
                          </Button>
                          {event.is_virtual && event.virtual_link && (
                            <Button size="sm">Join Link</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No upcoming events</h3>
                <p className="text-muted-foreground mb-4">You haven't registered for any events yet</p>
                <Button>
                  Discover Events
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

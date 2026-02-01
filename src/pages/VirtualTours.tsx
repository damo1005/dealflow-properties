import { useState } from 'react';
import { format } from 'date-fns';
import { Video, Plus, Link2, Calendar, Eye, Check, X, Mail, Phone } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TOUR_TYPE_LABELS, TourType } from '@/types/virtualTours';
import { toast } from 'sonner';

const mockTour = {
  id: '1',
  type: 'video_walkthrough' as TourType,
  provider: 'YouTube',
  url: 'https://youtube.com/watch?v=example',
  views: 234,
  isPublic: true,
};

const mockViewings = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '07xxx xxx xxx', preferredDates: ['Mon 3 Feb 10am', 'Tue 4 Feb 2pm'], type: 'in_person', status: 'pending' },
  { id: '2', name: 'Mike Thompson', email: 'mike@email.com', phone: null, confirmedDate: '2026-02-08T11:00:00', type: 'in_person', status: 'confirmed' },
  { id: '3', name: 'Lisa Chen', email: 'lisa@email.com', phone: '07xxx xxx xxx', confirmedDate: '2026-02-01T14:00:00', type: 'in_person', status: 'completed', feedback: 'Very interested' },
];

export default function VirtualTours() {
  const [addTourOpen, setAddTourOpen] = useState(false);
  const [tourType, setTourType] = useState<TourType>('video_walkthrough');

  const handleAddTour = () => {
    toast.success('Tour added successfully');
    setAddTourOpen(false);
  };

  const handleConfirmViewing = (id: string, slot: string) => {
    toast.success(`Viewing confirmed for ${slot}`);
  };

  return (
    <AppLayout title="Virtual Tours & Viewings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Video className="h-6 w-6 text-primary" />
              Virtual Tours & Viewings
            </h1>
            <p className="text-muted-foreground">Manage virtual tours and viewing requests for 14 Oak Street</p>
          </div>
        </div>

        <Tabs defaultValue="tours" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tours">Virtual Tours</TabsTrigger>
            <TabsTrigger value="viewings">Viewing Requests</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="tours" className="space-y-4">
            {/* Existing Tour */}
            {mockTour && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-32 w-48 bg-muted rounded-lg flex items-center justify-center">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{TOUR_TYPE_LABELS[mockTour.type]}</h3>
                        <p className="text-sm text-muted-foreground">Provider: {mockTour.provider}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{mockTour.views} views</span>
                          {mockTour.isPublic && <Badge variant="secondary">Public</Badge>}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Input value="https://tour.proptracker.com/abc123" readOnly className="w-64 text-xs" />
                          <Button variant="outline" size="sm" onClick={() => {
                            navigator.clipboard.writeText('https://tour.proptracker.com/abc123');
                            toast.success('Link copied');
                          }}>
                            <Link2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Analytics</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Dialog open={addTourOpen} onOpenChange={setAddTourOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tour
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Virtual Tour</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tour Type</Label>
                    <RadioGroup value={tourType} onValueChange={(v) => setTourType(v as TourType)}>
                      {Object.entries(TOUR_TYPE_LABELS).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2">
                          <RadioGroupItem value={value} id={`tour-${value}`} />
                          <Label htmlFor={`tour-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {tourType === 'video_walkthrough' && (
                    <div className="space-y-2">
                      <Label>Video URL (YouTube/Vimeo)</Label>
                      <Input placeholder="https://youtube.com/watch?v=..." />
                    </div>
                  )}

                  {tourType === 'matterport' && (
                    <div className="space-y-2">
                      <Label>Matterport ID</Label>
                      <Input placeholder="SxQL3iGyoDo" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="public" className="rounded" defaultChecked />
                    <Label htmlFor="public">Make publicly accessible</Label>
                  </div>

                  <Button className="w-full" onClick={handleAddTour}>Save Tour</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="viewings" className="space-y-4">
            <div className="flex justify-end">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Request
              </Button>
            </div>

            <div className="space-y-4">
              {mockViewings.map((viewing) => (
                <Card key={viewing.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{viewing.name}</span>
                          <Badge variant={
                            viewing.status === 'pending' ? 'secondary' :
                            viewing.status === 'confirmed' ? 'default' :
                            'outline'
                          } className={
                            viewing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            viewing.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            ''
                          }>
                            {viewing.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {viewing.email}
                          </span>
                          {viewing.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {viewing.phone}
                            </span>
                          )}
                        </div>
                        {viewing.status === 'pending' && viewing.preferredDates && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Requested: </span>
                            {viewing.preferredDates.join(', ')}
                          </div>
                        )}
                        {viewing.confirmedDate && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Confirmed: </span>
                            {format(new Date(viewing.confirmedDate), 'EEEE d MMM yyyy \'at\' HH:mm')}
                          </div>
                        )}
                        {viewing.feedback && (
                          <div className="text-sm text-green-600">{viewing.feedback}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {viewing.status === 'pending' && viewing.preferredDates && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleConfirmViewing(viewing.id, viewing.preferredDates![0])}>
                              <Check className="h-4 w-4 mr-1" />
                              Confirm {viewing.preferredDates[0].split(' ')[0]}
                            </Button>
                            <Button size="sm" variant="ghost">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {viewing.status === 'confirmed' && (
                          <>
                            <Button size="sm" variant="outline">Send Reminder</Button>
                            <Button size="sm" variant="outline">Mark Complete</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Viewing Availability</CardTitle>
                <CardDescription>Set your available times for property viewings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="font-medium w-24">{day}</span>
                    {i === 2 || i === 6 ? (
                      <span className="text-muted-foreground">Not available</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input className="w-20 text-center" defaultValue={i === 5 ? '10:00' : '10:00'} />
                        <span>-</span>
                        <Input className="w-20 text-center" defaultValue={i === 5 ? '14:00' : '17:00'} />
                        {i !== 5 && i !== 4 && (
                          <>
                            <span className="text-muted-foreground mx-2">,</span>
                            <Input className="w-20 text-center" defaultValue="14:00" />
                            <span>-</span>
                            <Input className="w-20 text-center" defaultValue="17:00" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Label>Booking Link</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input value="https://book.proptracker.com/view/14oak" readOnly />
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText('https://book.proptracker.com/view/14oak');
                      toast.success('Link copied');
                    }}>
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button>Save Availability</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

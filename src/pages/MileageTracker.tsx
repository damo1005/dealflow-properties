import { useState } from 'react';
import { format } from 'date-fns';
import { Car, Plus, MapPin, Calendar, Trash2, Download, Building2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMileageStore } from '@/stores/mileageStore';
import { JourneyPurpose, JOURNEY_PURPOSE_LABELS } from '@/types/mileage';
import { toast } from 'sonner';

export default function MileageTracker() {
  const { logs, addLog, deleteLog, getTaxYearSummary } = useMileageStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    journey_date: new Date().toISOString().split('T')[0],
    from_location: 'Home',
    to_location: '',
    purpose: 'inspection' as JourneyPurpose,
    miles: '',
    vehicle: 'Car',
    notes: '',
    portfolio_property_id: null as string | null,
  });

  const summary = getTaxYearSummary();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.to_location || !formData.miles) {
      toast.error('Please fill in required fields');
      return;
    }
    
    addLog({
      journey_date: formData.journey_date,
      from_location: formData.from_location,
      to_location: formData.to_location,
      purpose: formData.purpose,
      miles: parseFloat(formData.miles),
      vehicle: formData.vehicle,
      notes: formData.notes || null,
      portfolio_property_id: formData.portfolio_property_id,
    });
    
    toast.success('Journey logged');
    setDialogOpen(false);
    setFormData({
      journey_date: new Date().toISOString().split('T')[0],
      from_location: 'Home',
      to_location: '',
      purpose: 'inspection',
      miles: '',
      vehicle: 'Car',
      notes: '',
      portfolio_property_id: null,
    });
  };

  const handleDelete = (id: string) => {
    deleteLog(id);
    toast.success('Journey deleted');
  };

  return (
    <AppLayout title="Mileage Tracker">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              Mileage Tracker
            </h1>
            <p className="text-muted-foreground">Track journeys for tax-deductible mileage claims</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Journey
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Journey</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        type="date" 
                        value={formData.journey_date}
                        onChange={(e) => setFormData({ ...formData, journey_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Purpose</Label>
                      <Select 
                        value={formData.purpose}
                        onValueChange={(v) => setFormData({ ...formData, purpose: v as JourneyPurpose })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(JOURNEY_PURPOSE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Input 
                      value={formData.from_location}
                      onChange={(e) => setFormData({ ...formData, from_location: e.target.value })}
                      placeholder="Home address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Input 
                      value={formData.to_location}
                      onChange={(e) => setFormData({ ...formData, to_location: e.target.value })}
                      placeholder="Destination address or property"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Miles</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={formData.miles}
                        onChange={(e) => setFormData({ ...formData, miles: e.target.value })}
                        placeholder="0.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vehicle</Label>
                      <Input 
                        value={formData.vehicle}
                        onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes (optional)</Label>
                    <Textarea 
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional details..."
                    />
                  </div>
                  <Button type="submit" className="w-full">Log Journey</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tax Year Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Total Miles</div>
              <div className="text-3xl font-bold">{summary.totalMiles.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Tax Year 2025/26</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Claimable Amount</div>
              <div className="text-3xl font-bold text-green-600">£{summary.totalClaimable.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">@ 45p/mile</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Journeys Logged</div>
              <div className="text-3xl font-bold">{summary.journeyCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Journey List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Journeys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {log.from_location} → {log.to_location}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(log.journey_date), 'd MMM yyyy')}
                      </span>
                      <Badge variant="secondary">{JOURNEY_PURPOSE_LABELS[log.purpose]}</Badge>
                      {log.notes && <span>• {log.notes}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{log.miles} mi</div>
                    <div className="text-sm text-green-600">£{(log.miles * log.rate_per_mile).toFixed(2)}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(log.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No journeys logged yet</p>
                <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Journey
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

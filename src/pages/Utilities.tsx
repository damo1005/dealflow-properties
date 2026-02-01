import { useState } from 'react';
import { format } from 'date-fns';
import { Zap, Flame, Droplet, Wifi, Building, Plus, ArrowRight, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtilityType, UTILITY_ICONS, UTILITY_SUPPLIERS } from '@/types/utilities';
import { toast } from 'sonner';

const mockUtilities = [
  { id: '1', type: 'electricity' as UtilityType, supplier: 'British Gas', tariff: 'Fixed Mar 2026', monthlyCost: 65, unitRate: 24.5, paidBy: 'landlord', contractEnd: '2026-03-15', daysRemaining: 43 },
  { id: '2', type: 'gas' as UtilityType, supplier: 'Octopus', tariff: 'Flexible', monthlyCost: 45, unitRate: 7.5, paidBy: 'tenant', contractEnd: null, tenantName: 'James Wilson' },
  { id: '3', type: 'water' as UtilityType, supplier: 'United Utilities', tariff: null, monthlyCost: 32, paidBy: 'tenant', metered: true },
  { id: '4', type: 'council_tax' as UtilityType, supplier: 'Manchester City Council', tariff: 'Band B', monthlyCost: 121, paidBy: 'tenant' },
];

const mockReadings = [
  { date: '2026-02-01', electricity: 45678, gas: 2345, water: 156, submitted: true },
  { date: '2026-01-01', electricity: 45432, gas: 2298, water: 148, submitted: true },
  { date: '2025-12-01', electricity: 45190, gas: 2245, water: 141, submitted: true },
];

const UtilityIcon = ({ type }: { type: UtilityType }) => {
  const icons = {
    electricity: Zap,
    gas: Flame,
    water: Droplet,
    broadband: Wifi,
    council_tax: Building,
  };
  const Icon = icons[type];
  return <Icon className="h-5 w-5" />;
};

export default function Utilities() {
  const [switchDialogOpen, setSwitchDialogOpen] = useState(false);
  const [readingDialogOpen, setReadingDialogOpen] = useState(false);

  const handleSwitch = () => {
    toast.success('Switch request submitted');
    setSwitchDialogOpen(false);
  };

  const handleLogReading = () => {
    toast.success('Reading logged');
    setReadingDialogOpen(false);
  };

  return (
    <AppLayout title="Utilities">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Property Utilities
            </h1>
            <p className="text-muted-foreground">Manage utilities and meter readings for 14 Oak Street</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Utility
          </Button>
        </div>

        <Tabs defaultValue="utilities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="utilities">Utilities</TabsTrigger>
            <TabsTrigger value="readings">Meter Readings</TabsTrigger>
          </TabsList>

          <TabsContent value="utilities" className="space-y-4">
            {mockUtilities.map((utility) => (
              <Card key={utility.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        utility.type === 'electricity' ? 'bg-yellow-100 text-yellow-600' :
                        utility.type === 'gas' ? 'bg-orange-100 text-orange-600' :
                        utility.type === 'water' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <UtilityIcon type={utility.type} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold capitalize">{utility.type.replace('_', ' ')}</span>
                          <Badge variant="secondary">
                            Paid by: {utility.paidBy === 'tenant' ? 'Tenant' : 'You'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Supplier: {utility.supplier} {utility.tariff && `| Tariff: ${utility.tariff}`}
                        </div>
                        {utility.paidBy === 'landlord' && utility.monthlyCost && (
                          <div className="text-sm">
                            Cost: £{utility.monthlyCost}/month
                            {utility.unitRate && ` | Rate: ${utility.unitRate}p/kWh`}
                          </div>
                        )}
                        {utility.paidBy === 'tenant' && utility.tenantName && (
                          <div className="text-sm text-muted-foreground">
                            In tenant name: {utility.tenantName}
                          </div>
                        )}
                        {utility.contractEnd && (
                          <div className="text-sm text-yellow-600">
                            Contract ends: {format(new Date(utility.contractEnd), 'd MMM yyyy')} ({utility.daysRemaining} days)
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {utility.paidBy === 'landlord' && utility.contractEnd && (
                        <Dialog open={switchDialogOpen} onOpenChange={setSwitchDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Switch
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Compare & Switch {utility.type}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-3 bg-muted rounded-lg text-sm">
                                <p><strong>Current:</strong> {utility.supplier} {utility.tariff} - £{utility.monthlyCost}/month</p>
                                <p><strong>Contract ends:</strong> {utility.contractEnd}</p>
                              </div>
                              <div className="space-y-2">
                                <Label>Annual Usage (kWh)</Label>
                                <Input type="number" defaultValue={3200} />
                              </div>
                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-3">Available Deals</h4>
                                <div className="space-y-3">
                                  {[
                                    { supplier: 'Octopus Energy', tariff: 'Flexible', monthly: 52, rate: 22.1, saving: 156, green: true },
                                    { supplier: 'EDF', tariff: 'Fixed 2yr', monthly: 54, rate: 23.0, saving: 132, green: false },
                                    { supplier: 'E.ON', tariff: 'Fix Online', monthly: 56, rate: 23.5, saving: 108, green: false },
                                  ].map((deal, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                      <div>
                                        <div className="font-medium flex items-center gap-2">
                                          {deal.supplier} - {deal.tariff}
                                          {deal.green && <Badge variant="secondary" className="bg-green-100 text-green-800">🌱 Green</Badge>}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {deal.rate}p/kWh | No exit fee
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold">£{deal.monthly}/month</div>
                                        <div className="text-sm text-green-600">Save £{deal.saving}/yr</div>
                                        <Button size="sm" className="mt-1" onClick={handleSwitch}>Switch Now</Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Dialog open={readingDialogOpen} onOpenChange={setReadingDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Log Reading</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Log Meter Reading</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Date</Label>
                              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div className="space-y-2">
                              <Label>Reading</Label>
                              <Input type="number" placeholder="Enter meter reading" />
                            </div>
                            <div className="space-y-2">
                              <Label>Photo (optional)</Label>
                              <Input type="file" accept="image/*" />
                            </div>
                            <Button className="w-full" onClick={handleLogReading}>Save Reading</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="readings" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Meter Readings History</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Reading
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date</th>
                        <th className="text-right py-2">Elec (kWh)</th>
                        <th className="text-right py-2">Gas (m³)</th>
                        <th className="text-right py-2">Water (m³)</th>
                        <th className="text-right py-2">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockReadings.map((reading, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{format(new Date(reading.date), 'd MMM yyyy')}</td>
                          <td className="text-right">{reading.electricity.toLocaleString()}</td>
                          <td className="text-right">{reading.gas.toLocaleString()}</td>
                          <td className="text-right">{reading.water}</td>
                          <td className="text-right">
                            {reading.submitted ? '✅' : '⏳'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

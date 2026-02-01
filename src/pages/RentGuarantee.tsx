import { useState } from 'react';
import { Shield, Plus, FileText, AlertTriangle, Check } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RGI_PROVIDERS } from '@/types/rentGuarantee';
import { toast } from 'sonner';

const mockPolicies = [
  { id: '1', property: '14 Oak Street', tenant: 'James Wilson', provider: 'HomeLet', policyNumber: 'RG-123456', monthlyRent: 850, maxMonths: 12, annualPremium: 306, premiumRate: 3, endDate: '2026-06-15', status: 'active' as const },
];

const mockUncoveredProperties = [
  { id: '2', property: '28 Victoria Road', tenant: 'Sarah Brown', monthlyRent: 1200 },
];

export default function RentGuarantee() {
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const handleGetQuote = () => {
    toast.success('Quote request submitted');
    setQuoteDialogOpen(false);
  };

  return (
    <AppLayout title="Rent Guarantee Insurance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Rent Guarantee Insurance
            </h1>
            <p className="text-muted-foreground">Protect your rental income with RGI policies</p>
          </div>
        </div>

        {/* Why RGI */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Protect Your Rental Income</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Up to 12 months rent covered if tenant stops paying</li>
                  <li>• Legal expenses for eviction included</li>
                  <li>• From just 3% of annual rent</li>
                  <li>• Claims paid monthly while tenant in arrears</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Policies */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Current Policies</h2>
          
          {mockPolicies.map((policy) => (
            <Card key={policy.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{policy.property}</span>
                      <span className="text-muted-foreground">- {policy.tenant}</span>
                      <Badge variant="default" className="bg-green-600">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Provider: {policy.provider} | Policy: {policy.policyNumber}
                    </div>
                    <div className="text-sm">
                      Cover: £{policy.monthlyRent}/month (max {policy.maxMonths} months = £{policy.monthlyRent * policy.maxMonths})
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Premium: £{policy.annualPremium}/year ({policy.premiumRate}%) | Expires: Jun 2026
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Policy
                    </Button>
                    <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Make Claim</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Start Rent Guarantee Claim</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-3 bg-muted rounded-lg text-sm">
                            <p><strong>Property:</strong> {policy.property}</p>
                            <p><strong>Tenant:</strong> {policy.tenant}</p>
                            <p><strong>Policy:</strong> {policy.provider} {policy.policyNumber}</p>
                          </div>
                          <div className="space-y-2">
                            <Label>When did arrears start?</Label>
                            <Input type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label>Current arrears amount</Label>
                            <Input type="number" placeholder="0.00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Have you:</Label>
                            <div className="space-y-2 text-sm">
                              <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                Issued written rent demand?
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                Attempted contact with tenant?
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                Served Section 8 notice?
                              </label>
                            </div>
                          </div>
                          <Button className="w-full" onClick={() => {
                            toast.success('Claim submitted');
                            setClaimDialogOpen(false);
                          }}>
                            Submit Claim
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="secondary" size="sm">Renew</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Uncovered Properties */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Properties Without Cover</h2>
          
          {mockUncoveredProperties.map((prop) => (
            <Card key={prop.id} className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold">{prop.property}</span>
                      <span className="text-muted-foreground">- {prop.tenant}</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Not Covered</Badge>
                    </div>
                    <div className="text-sm">
                      Monthly rent: £{prop.monthlyRent}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Est. premium: £{Math.round(prop.monthlyRent * 12 * 0.036)}/year (3.6%)
                    </div>
                  </div>
                  <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedProperty(prop.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Get Quote
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Get Rent Guarantee Quotes</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Property</Label>
                            <Input value={prop.property} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label>Monthly Rent</Label>
                            <Input value={`£${prop.monthlyRent}`} disabled />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Reference Provider</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="openrent">OpenRent</SelectItem>
                              <SelectItem value="homelet">HomeLet</SelectItem>
                              <SelectItem value="lettingagent">Letting Agent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3">Available Quotes</h4>
                          <div className="space-y-3">
                            {RGI_PROVIDERS.map((provider) => {
                              const premium = Math.round(prop.monthlyRent * 12 * (provider.rate / 100));
                              return (
                                <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                  <div>
                                    <div className="font-medium">{provider.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      Cover: £{prop.monthlyRent * provider.maxMonths} ({provider.maxMonths} months) | Legal: £{provider.legalCover.toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">£{premium}/year ({provider.rate}%)</div>
                                    <Button size="sm" className="mt-1" onClick={handleGetQuote}>Select</Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

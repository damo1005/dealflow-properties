import { useState } from 'react';
import { Building2, Calculator, TrendingUp, AlertTriangle, Check, Save, Download } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { PROJECT_TYPE_LABELS, ProjectType, ExitStrategy } from '@/types/development';
import { toast } from 'sonner';

export default function DevelopmentAppraisal() {
  const [formData, setFormData] = useState({
    projectName: 'Victorian House to 4 Flats',
    address: '45 High Street, M14 5AB',
    projectType: 'conversion' as ProjectType,
    existingUnits: 1,
    proposedUnits: 4,
    purchasePrice: 250000,
    sdlt: 17500,
    legalFees: 2000,
    survey: 500,
    constructionCost: 120000,
    contingencyPercent: 10,
    architectFees: 8000,
    planningFees: 2500,
    buildingRegsFees: 1500,
    projectManagement: 6000,
    financeType: 'development_finance',
    loanAmount: 340000,
    interestRate: 12,
    termMonths: 12,
    arrangementFeePercent: 2,
    exitStrategy: 'sell' as ExitStrategy,
    oneBedValue: 140000,
    oneBedCount: 2,
    twoBedValue: 175000,
    twoBedCount: 2,
    agentFeesPercent: 1.5,
    salesLegalFees: 4000,
  });

  // Calculations
  const totalAcquisition = formData.purchasePrice + formData.sdlt + formData.legalFees + formData.survey;
  const contingency = formData.constructionCost * (formData.contingencyPercent / 100);
  const totalProfessionalFees = formData.architectFees + formData.planningFees + formData.buildingRegsFees + formData.projectManagement;
  const totalBuildCost = formData.constructionCost + contingency + totalProfessionalFees;
  const arrangementFee = formData.loanAmount * (formData.arrangementFeePercent / 100);
  const grossInterest = formData.loanAmount * (formData.interestRate / 100) * (formData.termMonths / 12);
  const totalFinanceCost = arrangementFee + grossInterest;
  const gdv = (formData.oneBedValue * formData.oneBedCount) + (formData.twoBedValue * formData.twoBedCount);
  const agentFees = gdv * (formData.agentFeesPercent / 100);
  const totalSalesCosts = agentFees + formData.salesLegalFees;
  const netSales = gdv - totalSalesCosts;
  const totalCosts = totalAcquisition + totalBuildCost + totalFinanceCost;
  const grossProfit = netSales - totalCosts;
  const profitOnCost = (grossProfit / totalCosts) * 100;
  const profitPerUnit = grossProfit / formData.proposedUnits;

  const handleSave = () => {
    toast.success('Appraisal saved');
  };

  return (
    <AppLayout title="Development Appraisal">
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Development Appraisal
            </h1>
            <p className="text-muted-foreground">Analyze project feasibility and returns</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Project Type</Label>
                    <Select value={formData.projectType} onValueChange={(v) => setFormData({ ...formData, projectType: v as ProjectType })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Existing Units</Label>
                    <Input type="number" value={formData.existingUnits} onChange={(e) => setFormData({ ...formData, existingUnits: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Proposed Units</Label>
                    <Input type="number" value={formData.proposedUnits} onChange={(e) => setFormData({ ...formData, proposedUnits: Number(e.target.value) })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Purchase Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Purchase Price</Label>
                    <Input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>SDLT</Label>
                    <Input type="number" value={formData.sdlt} onChange={(e) => setFormData({ ...formData, sdlt: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Legal Fees</Label>
                    <Input type="number" value={formData.legalFees} onChange={(e) => setFormData({ ...formData, legalFees: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Survey</Label>
                    <Input type="number" value={formData.survey} onChange={(e) => setFormData({ ...formData, survey: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total Acquisition</span>
                  <span>£{totalAcquisition.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Build Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Build Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Construction</Label>
                    <Input type="number" value={formData.constructionCost} onChange={(e) => setFormData({ ...formData, constructionCost: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contingency (%)</Label>
                    <Input type="number" value={formData.contingencyPercent} onChange={(e) => setFormData({ ...formData, contingencyPercent: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total Build</span>
                  <span>£{totalBuildCost.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* GDV */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Exit / Sales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>1-bed value</Label>
                    <Input type="number" value={formData.oneBedValue} onChange={(e) => setFormData({ ...formData, oneBedValue: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Count</Label>
                    <Input type="number" value={formData.oneBedCount} onChange={(e) => setFormData({ ...formData, oneBedCount: Number(e.target.value) })} />
                  </div>
                  <div className="text-right pt-6 font-medium">
                    = £{(formData.oneBedValue * formData.oneBedCount).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>2-bed value</Label>
                    <Input type="number" value={formData.twoBedValue} onChange={(e) => setFormData({ ...formData, twoBedValue: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Count</Label>
                    <Input type="number" value={formData.twoBedCount} onChange={(e) => setFormData({ ...formData, twoBedCount: Number(e.target.value) })} />
                  </div>
                  <div className="text-right pt-6 font-medium">
                    = £{(formData.twoBedValue * formData.twoBedCount).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t text-lg">
                  <span>GDV</span>
                  <span>£{gdv.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Appraisal Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Costs</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Acquisition:</span>
                        <span>£{totalAcquisition.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Build:</span>
                        <span>£{totalBuildCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Finance:</span>
                        <span>£{totalFinanceCost.toLocaleString()}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total Costs:</span>
                        <span>£{totalCosts.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Returns</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GDV:</span>
                        <span>£{gdv.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sales Costs:</span>
                        <span>£{totalSalesCosts.toLocaleString()}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Net Sales:</span>
                        <span>£{netSales.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>GROSS PROFIT:</span>
                    <span className={grossProfit > 0 ? 'text-green-600' : 'text-red-600'}>
                      £{grossProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-background rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">
                        {profitOnCost.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Profit on Cost</div>
                    </div>
                    <div className="p-3 bg-background rounded-lg text-center">
                      <div className="text-2xl font-bold">
                        £{profitPerUnit.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Profit per Unit</div>
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${profitOnCost >= 20 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'}`}>
                  <div className="flex items-center gap-2">
                    {profitOnCost >= 20 ? (
                      <>
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-200">
                          This deal exceeds target margins (20%+)
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">
                          Below target 20% profit on cost
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sensitivity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sensitivity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Build costs +20%:</span>
                    <span>Profit: £{(grossProfit - formData.constructionCost * 0.2).toLocaleString()} ({((grossProfit - formData.constructionCost * 0.2) / (totalCosts + formData.constructionCost * 0.2) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GDV -10%:</span>
                    <span>Profit: £{(grossProfit - gdv * 0.1).toLocaleString()} ({((grossProfit - gdv * 0.1) / totalCosts * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between text-yellow-600">
                    <span>Both scenarios:</span>
                    <span>Profit: £{(grossProfit - formData.constructionCost * 0.2 - gdv * 0.1).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

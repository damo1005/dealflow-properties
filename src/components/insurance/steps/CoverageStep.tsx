import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { CurrencyInput } from "@/components/calculators/CurrencyInput";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Sofa, Shield, Gavel, Wrench, Home, PoundSterling, Ban } from "lucide-react";

export function CoverageStep() {
  const { wizardData, updateWizardData } = useInsuranceStore();

  return (
    <div className="space-y-6">
      {/* Coverage Type */}
      <div className="space-y-3">
        <Label>Coverage Type *</Label>
        <RadioGroup
          value={wizardData.coverageType}
          onValueChange={(v) => updateWizardData({ coverageType: v as typeof wizardData.coverageType })}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { value: 'buildings', label: 'Buildings Only', icon: Building },
            { value: 'contents', label: 'Contents Only', icon: Sofa },
            { value: 'combined', label: 'Buildings + Contents', icon: Shield },
            { value: 'liability', label: 'Liability Only', icon: Gavel },
          ].map((type) => (
            <div key={type.value}>
              <RadioGroupItem
                value={type.value}
                id={`cover-${type.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`cover-${type.value}`}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer text-center"
              >
                <type.icon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Buildings Cover */}
      {(wizardData.coverageType === 'buildings' || wizardData.coverageType === 'combined') && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Buildings Insurance</h4>
            </div>
            <div className="space-y-2">
              <Label>Cover Amount *</Label>
              <CurrencyInput
                value={wizardData.buildingsCoverAmount}
                onChange={(v) => updateWizardData({ buildingsCoverAmount: v })}
              />
              <p className="text-xs text-muted-foreground">Usually the rebuild cost</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contents Cover */}
      {(wizardData.coverageType === 'contents' || wizardData.coverageType === 'combined') && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Sofa className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Contents Insurance</h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Is the property furnished?</Label>
                <RadioGroup
                  value={wizardData.isFurnished}
                  onValueChange={(v) => updateWizardData({ isFurnished: v as typeof wizardData.isFurnished })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="furnished" id="furn-yes" />
                    <Label htmlFor="furn-yes" className="cursor-pointer">Furnished</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="part_furnished" id="furn-part" />
                    <Label htmlFor="furn-part" className="cursor-pointer">Part-furnished</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unfurnished" id="furn-no" />
                    <Label htmlFor="furn-no" className="cursor-pointer">Unfurnished</Label>
                  </div>
                </RadioGroup>
              </div>
              {wizardData.isFurnished !== 'unfurnished' && (
                <div className="space-y-2">
                  <Label>Contents Value</Label>
                  <CurrencyInput
                    value={wizardData.contentsCoverAmount}
                    onChange={(v) => updateWizardData({ contentsCoverAmount: v })}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Cover */}
      <div className="space-y-4">
        <h4 className="font-medium">Additional Cover</h4>
        
        {/* Rent Guarantee */}
        <Card className={wizardData.needsRentGuarantee ? 'border-primary' : ''}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PoundSterling className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Rent Guarantee Insurance</p>
                  <p className="text-sm text-muted-foreground">Protect against non-payment</p>
                </div>
              </div>
              <Switch
                checked={wizardData.needsRentGuarantee}
                onCheckedChange={(checked) => updateWizardData({ needsRentGuarantee: checked })}
              />
            </div>
            {wizardData.needsRentGuarantee && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Cover up to (£/month)</Label>
                  <Input
                    type="number"
                    value={wizardData.rentGuaranteeAmount}
                    onChange={(e) => updateWizardData({ rentGuaranteeAmount: parseInt(e.target.value) || 1500 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>For (months)</Label>
                  <Input
                    type="number"
                    min={3}
                    max={12}
                    value={wizardData.rentGuaranteeMonths}
                    onChange={(e) => updateWizardData({ rentGuaranteeMonths: parseInt(e.target.value) || 6 })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legal Expenses */}
        <Card className={wizardData.needsLegalExpenses ? 'border-primary' : ''}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gavel className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Legal Expenses Insurance</p>
                  <p className="text-sm text-muted-foreground">Eviction costs, disputes</p>
                </div>
              </div>
              <Switch
                checked={wizardData.needsLegalExpenses}
                onCheckedChange={(checked) => updateWizardData({ needsLegalExpenses: checked })}
              />
            </div>
            {wizardData.needsLegalExpenses && (
              <div className="mt-4 pt-4 border-t">
                <Label>Cover up to</Label>
                <CurrencyInput
                  value={wizardData.legalExpensesLimit}
                  onChange={(v) => updateWizardData({ legalExpensesLimit: v })}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Cover */}
        <Card className={wizardData.needsEmergencyCover ? 'border-primary' : ''}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Emergency Assistance</p>
                  <p className="text-sm text-muted-foreground">24/7 emergency repairs</p>
                </div>
              </div>
              <Switch
                checked={wizardData.needsEmergencyCover}
                onCheckedChange={(checked) => updateWizardData({ needsEmergencyCover: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Loss of Rent */}
        <Card className={wizardData.needsLossOfRent ? 'border-primary' : ''}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Loss of Rent</p>
                  <p className="text-sm text-muted-foreground">If property damaged</p>
                </div>
              </div>
              <Switch
                checked={wizardData.needsLossOfRent}
                onCheckedChange={(checked) => updateWizardData({ needsLossOfRent: checked })}
              />
            </div>
            {wizardData.needsLossOfRent && (
              <div className="mt-4 pt-4 border-t">
                <Label>Cover rent for (months)</Label>
                <Input
                  type="number"
                  min={3}
                  max={24}
                  value={wizardData.lossOfRentMonths}
                  onChange={(e) => updateWizardData({ lossOfRentMonths: parseInt(e.target.value) || 12 })}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accidental Damage */}
        <Card className={wizardData.needsAccidentalDamage ? 'border-primary' : ''}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ban className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Accidental Damage</p>
                  <p className="text-sm text-muted-foreground">Tenant accidents</p>
                </div>
              </div>
              <Switch
                checked={wizardData.needsAccidentalDamage}
                onCheckedChange={(checked) => updateWizardData({ needsAccidentalDamage: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

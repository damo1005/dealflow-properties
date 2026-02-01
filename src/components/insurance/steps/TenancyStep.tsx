import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Shield, AlertTriangle } from "lucide-react";

export function TenancyStep() {
  const { wizardData, updateWizardData } = useInsuranceStore();

  return (
    <div className="space-y-6">
      {/* Tenancy Status */}
      <div className="space-y-3">
        <Label>Current Tenancy Status *</Label>
        <RadioGroup
          value={wizardData.tenancyStatus}
          onValueChange={(v) => updateWizardData({ tenancyStatus: v as typeof wizardData.tenancyStatus })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="let" id="status-let" />
            <Label htmlFor="status-let" className="cursor-pointer">Let to tenants</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vacant" id="status-vacant" />
            <Label htmlFor="status-vacant" className="cursor-pointer">Vacant (between tenants)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="refurbishing" id="status-refurb" />
            <Label htmlFor="status-refurb" className="cursor-pointer">Being refurbished</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Tenancy Type */}
      <div className="space-y-3">
        <Label>Tenancy Type</Label>
        <RadioGroup
          value={wizardData.tenancyType}
          onValueChange={(v) => updateWizardData({ tenancyType: v as typeof wizardData.tenancyType })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ast" id="type-ast" />
            <Label htmlFor="type-ast" className="cursor-pointer">Assured Shorthold Tenancy (AST)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="type-company" />
            <Label htmlFor="type-company" className="cursor-pointer">Company let</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="students" id="type-students" />
            <Label htmlFor="type-students" className="cursor-pointer">Students</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="housing_benefit" id="type-hb" />
            <Label htmlFor="type-hb" className="cursor-pointer">Housing Benefit tenants</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="holiday" id="type-holiday" />
            <Label htmlFor="type-holiday" className="cursor-pointer">Holiday let</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Number of Tenants */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tenants">Number of tenants</Label>
          <Input
            id="tenants"
            type="number"
            min={1}
            max={20}
            value={wizardData.numberOfTenants}
            onChange={(e) => updateWizardData({ numberOfTenants: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="flex items-center space-x-2 pt-8">
          <Checkbox
            id="hmo"
            checked={wizardData.isHmo}
            onCheckedChange={(checked) => updateWizardData({ isHmo: !!checked })}
          />
          <Label htmlFor="hmo" className="cursor-pointer">
            This is an HMO (5+ unrelated tenants)
          </Label>
        </div>
      </div>

      {/* Security Features */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Security Features</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'hasLocks', label: '5-lever mortice locks' },
              { key: 'hasWindowLocks', label: 'Window locks' },
              { key: 'hasBurglarAlarm', label: 'Burglar alarm' },
              { key: 'hasCCTV', label: 'CCTV' },
              { key: 'hasSecurityLights', label: 'Security lights' },
            ].map((feature) => (
              <div key={feature.key} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.key}
                  checked={wizardData[feature.key as keyof typeof wizardData] as boolean}
                  onCheckedChange={(checked) => 
                    updateWizardData({ [feature.key]: checked })
                  }
                />
                <Label htmlFor={feature.key} className="cursor-pointer text-sm">{feature.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Claims History */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h4 className="font-medium">Claims History</h4>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="claims">Claims in last 5 years</Label>
              <Input
                id="claims"
                type="number"
                min={0}
                max={10}
                value={wizardData.claimsCount}
                onChange={(e) => updateWizardData({ claimsCount: parseInt(e.target.value) || 0 })}
              />
            </div>
            {wizardData.claimsCount > 0 && (
              <div className="space-y-2">
                <Label htmlFor="claimsDetails">Claim details</Label>
                <Textarea
                  id="claimsDetails"
                  placeholder="Briefly describe the claims..."
                  value={wizardData.claimsDetails}
                  onChange={(e) => updateWizardData({ claimsDetails: e.target.value })}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Excess Preference */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Excess Preference</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Higher excess = lower premium. This is what you pay towards each claim.
          </p>
          <RadioGroup
            value={String(wizardData.excessPreference)}
            onValueChange={(v) => updateWizardData({ excessPreference: parseInt(v) })}
            className="grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            {[
              { value: '0', label: '£0', note: 'Higher premium' },
              { value: '100', label: '£100', note: '' },
              { value: '250', label: '£250', note: 'Recommended' },
              { value: '500', label: '£500', note: 'Lower premium' },
              { value: '1000', label: '£1,000', note: 'Lowest premium' },
            ].map((excess) => (
              <div key={excess.value}>
                <RadioGroupItem
                  value={excess.value}
                  id={`excess-${excess.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`excess-${excess.value}`}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer text-center"
                >
                  <span className="font-medium">{excess.label}</span>
                  {excess.note && (
                    <span className="text-xs text-muted-foreground">{excess.note}</span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

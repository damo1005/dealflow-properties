import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { CurrencyInput } from "@/components/calculators/CurrencyInput";
import { Home, Building2, HousePlus, Users } from "lucide-react";

export function PropertyDetailsStep() {
  const { wizardData, updateWizardData } = useInsuranceStore();

  return (
    <div className="space-y-6">
      {/* Property Address */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Property Address</Label>
          <Input
            id="address"
            placeholder="123 High Street"
            value={wizardData.propertyAddress}
            onChange={(e) => updateWizardData({ propertyAddress: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode *</Label>
          <Input
            id="postcode"
            placeholder="SW1A 1AA"
            value={wizardData.postcode}
            onChange={(e) => updateWizardData({ postcode: e.target.value.toUpperCase() })}
            className="uppercase"
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label>Property Type *</Label>
        <RadioGroup
          value={wizardData.propertyType}
          onValueChange={(v) => updateWizardData({ propertyType: v as typeof wizardData.propertyType })}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { value: 'house', label: 'House', icon: Home },
            { value: 'flat', label: 'Flat/Apartment', icon: Building2 },
            { value: 'bungalow', label: 'Bungalow', icon: HousePlus },
            { value: 'hmo', label: 'HMO', icon: Users },
          ].map((type) => (
            <div key={type.value}>
              <RadioGroupItem
                value={type.value}
                id={`type-${type.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`type-${type.value}`}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
              >
                <type.icon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Bedrooms */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms *</Label>
          <Input
            id="bedrooms"
            type="number"
            min={1}
            max={10}
            value={wizardData.bedrooms}
            onChange={(e) => updateWizardData({ bedrooms: parseInt(e.target.value) || 2 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Property Value *</Label>
          <CurrencyInput
            value={wizardData.propertyValue}
            onChange={(v) => updateWizardData({ propertyValue: v })}
          />
        </div>
        <div className="space-y-2">
          <Label>Rebuild Cost</Label>
          <CurrencyInput
            value={wizardData.rebuildCost}
            onChange={(v) => updateWizardData({ rebuildCost: v })}
          />
          <p className="text-xs text-muted-foreground">Usually lower than market value</p>
        </div>
      </div>

      {/* Year Built */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yearBuilt">Year Built</Label>
          <Input
            id="yearBuilt"
            type="number"
            min={1700}
            max={2026}
            value={wizardData.yearBuilt}
            onChange={(e) => updateWizardData({ yearBuilt: parseInt(e.target.value) || 1990 })}
          />
        </div>
        <div className="space-y-3">
          <Label>Construction Type</Label>
          <RadioGroup
            value={wizardData.construction}
            onValueChange={(v) => updateWizardData({ construction: v as typeof wizardData.construction })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="const-standard" />
              <Label htmlFor="const-standard" className="cursor-pointer">Standard brick/stone</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non_standard" id="const-non-standard" />
              <Label htmlFor="const-non-standard" className="cursor-pointer">Non-standard (timber, concrete)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="listed" id="const-listed" />
              <Label htmlFor="const-listed" className="cursor-pointer">Listed building</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Special Features */}
      <div className="space-y-3">
        <Label>Special Features</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'hasFlatRoof', label: 'Flat roof' },
            { key: 'hasSwimmingPool', label: 'Swimming pool' },
            { key: 'hasSolarPanels', label: 'Solar panels' },
            { key: 'hasBasement', label: 'Basement' },
          ].map((feature) => (
            <div key={feature.key} className="flex items-center space-x-2">
              <Checkbox
                id={feature.key}
                checked={wizardData[feature.key as keyof typeof wizardData] as boolean}
                onCheckedChange={(checked) => 
                  updateWizardData({ [feature.key]: checked })
                }
              />
              <Label htmlFor={feature.key} className="cursor-pointer">{feature.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

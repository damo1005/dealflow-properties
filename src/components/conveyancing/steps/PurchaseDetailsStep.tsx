import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useConveyancingStore } from "@/stores/conveyancingStore";
import { CurrencyInput } from "@/components/calculators/CurrencyInput";
import { Card, CardContent } from "@/components/ui/card";

export function PurchaseDetailsStep() {
  const { wizardData, updateWizardData } = useConveyancingStore();
  const isPurchase = ['purchase', 'purchase_and_sale'].includes(wizardData.transactionType);
  const isSale = ['sale', 'purchase_and_sale'].includes(wizardData.transactionType);
  const isRemortgage = wizardData.transactionType === 'remortgage';

  return (
    <div className="space-y-6">
      {isPurchase && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <h3 className="font-semibold">Purchase Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Purchase Price *</Label>
                <CurrencyInput
                  value={wizardData.purchasePrice}
                  onChange={(v) => updateWizardData({ purchasePrice: v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Property Postcode *</Label>
                <Input
                  placeholder="SW1A 1AA"
                  value={wizardData.purchasePostcode}
                  onChange={(e) => updateWizardData({ purchasePostcode: e.target.value.toUpperCase() })}
                  className="uppercase"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Property Type *</Label>
              <RadioGroup
                value={wizardData.purchasePropertyType}
                onValueChange={(v) => updateWizardData({ purchasePropertyType: v as typeof wizardData.purchasePropertyType })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freehold" id="prop-freehold" />
                  <Label htmlFor="prop-freehold" className="cursor-pointer">Freehold house/bungalow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="leasehold" id="prop-leasehold" />
                  <Label htmlFor="prop-leasehold" className="cursor-pointer">Leasehold flat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new_build" id="prop-newbuild" />
                  <Label htmlFor="prop-newbuild" className="cursor-pointer">New build</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shared_ownership" id="prop-shared" />
                  <Label htmlFor="prop-shared" className="cursor-pointer">Shared ownership</Label>
                </div>
              </RadioGroup>
            </div>

            {wizardData.purchasePropertyType === 'leasehold' && (
              <div className="space-y-2">
                <Label>Years remaining on lease</Label>
                <Input
                  type="number"
                  value={wizardData.leaseYearsRemaining}
                  onChange={(e) => updateWizardData({ leaseYearsRemaining: parseInt(e.target.value) || 99 })}
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Are you a first-time buyer?</Label>
                <RadioGroup
                  value={wizardData.isFirstTimeBuyer ? 'yes' : 'no'}
                  onValueChange={(v) => updateWizardData({ isFirstTimeBuyer: v === 'yes' })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="ftb-yes" />
                    <Label htmlFor="ftb-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="ftb-no" />
                    <Label htmlFor="ftb-no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>How are you buying?</Label>
                <RadioGroup
                  value={wizardData.buyingMethod}
                  onValueChange={(v) => updateWizardData({ buyingMethod: v as typeof wizardData.buyingMethod })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mortgage" id="buy-mortgage" />
                    <Label htmlFor="buy-mortgage" className="cursor-pointer">With a mortgage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="buy-cash" />
                    <Label htmlFor="buy-cash" className="cursor-pointer">Cash purchase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="help_to_buy" id="buy-htb" />
                    <Label htmlFor="buy-htb" className="cursor-pointer">Help to Buy</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Is this a Buy-to-Let?</Label>
                <RadioGroup
                  value={wizardData.isBtl ? 'yes' : 'no'}
                  onValueChange={(v) => updateWizardData({ isBtl: v === 'yes' })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="btl-yes" />
                    <Label htmlFor="btl-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="btl-no" />
                    <Label htmlFor="btl-no" className="cursor-pointer">No (main residence)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Buying through Ltd company?</Label>
                <RadioGroup
                  value={wizardData.isLtdCompany ? 'yes' : 'no'}
                  onValueChange={(v) => updateWizardData({ isLtdCompany: v === 'yes' })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="ltd-yes" />
                    <Label htmlFor="ltd-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="ltd-no" />
                    <Label htmlFor="ltd-no" className="cursor-pointer">No (personal)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Chain position</Label>
              <RadioGroup
                value={wizardData.chainPosition}
                onValueChange={(v) => updateWizardData({ chainPosition: v as typeof wizardData.chainPosition })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no_chain" id="chain-no" />
                  <Label htmlFor="chain-no" className="cursor-pointer">No - no property to sell</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selling_too" id="chain-selling" />
                  <Label htmlFor="chain-selling" className="cursor-pointer">Yes - selling property too</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="already_sold" id="chain-sold" />
                  <Label htmlFor="chain-sold" className="cursor-pointer">Yes - but already sold</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {isSale && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <h3 className="font-semibold">Sale Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sale Price *</Label>
                <CurrencyInput
                  value={wizardData.salePrice}
                  onChange={(v) => updateWizardData({ salePrice: v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Property Postcode *</Label>
                <Input
                  placeholder="SW1A 1AA"
                  value={wizardData.salePostcode}
                  onChange={(e) => updateWizardData({ salePostcode: e.target.value.toUpperCase() })}
                  className="uppercase"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Property Type</Label>
              <RadioGroup
                value={wizardData.salePropertyType}
                onValueChange={(v) => updateWizardData({ salePropertyType: v as typeof wizardData.salePropertyType })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freehold" id="sale-freehold" />
                  <Label htmlFor="sale-freehold" className="cursor-pointer">Freehold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="leasehold" id="sale-leasehold" />
                  <Label htmlFor="sale-leasehold" className="cursor-pointer">Leasehold</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Outstanding mortgage?</Label>
              <RadioGroup
                value={wizardData.hasOutstandingMortgage ? 'yes' : 'no'}
                onValueChange={(v) => updateWizardData({ hasOutstandingMortgage: v === 'yes' })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="mortgage-yes" />
                  <Label htmlFor="mortgage-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="mortgage-no" />
                  <Label htmlFor="mortgage-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {isRemortgage && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <h3 className="font-semibold">Remortgage Details</h3>
            <p className="text-sm text-muted-foreground">
              Coming soon - remortgage conveyancing quotes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Wallet,
  Home,
  Target,
  Bell,
  Zap,
  TrendingUp,
  X,
} from "lucide-react";
import { useDealScoutStore } from "@/stores/dealScoutStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { INVESTMENT_STRATEGIES, PROPERTY_TYPES, ALERT_FREQUENCIES } from "@/types/dealScout";

interface CreateScoutWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateScoutWizard({ open, onOpenChange }: CreateScoutWizardProps) {
  const { wizardData, updateWizardData, nextStep, prevStep, resetWizardData, addScout } = useDealScoutStore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [areaInput, setAreaInput] = useState('');

  const totalSteps = 5;
  const progress = (wizardData.step / totalSteps) * 100;

  const handleAddArea = () => {
    if (areaInput.trim() && !wizardData.location_areas.includes(areaInput.toUpperCase())) {
      updateWizardData({
        location_areas: [...wizardData.location_areas, areaInput.toUpperCase()]
      });
      setAreaInput('');
    }
  };

  const handleRemoveArea = (area: string) => {
    updateWizardData({
      location_areas: wizardData.location_areas.filter(a => a !== area)
    });
  };

  const handleTogglePropertyType = (type: string) => {
    const types = wizardData.property_types.includes(type)
      ? wizardData.property_types.filter(t => t !== type)
      : [...wizardData.property_types, type];
    updateWizardData({ property_types: types });
  };

  const handleToggleAlertMethod = (method: string) => {
    const methods = wizardData.alert_methods.includes(method)
      ? wizardData.alert_methods.filter(m => m !== method)
      : [...wizardData.alert_methods, method];
    updateWizardData({ alert_methods: methods });
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const scoutData = {
        user_id: user.id,
        name: wizardData.name || `${wizardData.location_areas[0] || 'New'} ${wizardData.investment_strategy.toUpperCase()} Scout`,
        is_active: true,
        location_areas: wizardData.location_areas,
        price_min: wizardData.price_min,
        price_max: wizardData.price_max,
        property_types: wizardData.property_types,
        bedrooms_min: wizardData.bedrooms_min,
        bedrooms_max: wizardData.bedrooms_max,
        investment_strategy: wizardData.investment_strategy,
        yield_min: wizardData.target_yield,
        cash_flow_min: wizardData.target_cash_flow,
        alert_frequency: wizardData.alert_frequency,
        alert_score_threshold: wizardData.min_score,
        alert_methods: wizardData.alert_methods,
        exclude_leasehold: wizardData.exclude_leasehold,
        exclude_shared_ownership: wizardData.exclude_shared_ownership,
        require_parking: wizardData.require_parking,
        require_garden: wizardData.require_garden,
        prioritize_yield: wizardData.priority_yield > 60,
        prioritize_cash_flow: wizardData.priority_cash_flow > 60,
        prioritize_capital_growth: wizardData.priority_capital_growth > 60,
        prioritize_below_market: wizardData.priority_bmv > 60,
        scan_frequency: (wizardData as any).scan_frequency || 'daily',
      };

      const { data, error } = await supabase
        .from('deal_scouts')
        .insert(scoutData)
        .select()
        .single();

      if (error) throw error;

      addScout(data as any);
      toast({
        title: "Scout Created! 🎉",
        description: `"${data.name}" is now active and scanning for properties.`,
      });
      
      resetWizardData();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating scout:', error);
      toast({
        title: "Error",
        description: "Failed to create scout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    resetWizardData();
    onOpenChange(false);
  };

  const canProceed = () => {
    switch (wizardData.step) {
      case 1:
        return !!wizardData.investment_strategy;
      case 2:
        return wizardData.location_areas.length > 0;
      case 3:
        return wizardData.price_max > wizardData.price_min && wizardData.property_types.length > 0;
      case 4:
        return true;
      case 5:
        return wizardData.alert_methods.length > 0;
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Create Deal Scout
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {wizardData.step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {wizardData.step === 1 && (
            <Step1Strategy 
              selected={wizardData.investment_strategy}
              onSelect={(strategy) => updateWizardData({ investment_strategy: strategy })}
              targetYield={wizardData.target_yield}
              onTargetYieldChange={(v) => updateWizardData({ target_yield: v })}
              targetCashFlow={wizardData.target_cash_flow}
              onTargetCashFlowChange={(v) => updateWizardData({ target_cash_flow: v })}
              riskTolerance={wizardData.risk_tolerance}
              onRiskToleranceChange={(v) => updateWizardData({ risk_tolerance: v })}
            />
          )}

          {wizardData.step === 2 && (
            <Step2Location
              areas={wizardData.location_areas}
              areaInput={areaInput}
              onAreaInputChange={setAreaInput}
              onAddArea={handleAddArea}
              onRemoveArea={handleRemoveArea}
            />
          )}

          {wizardData.step === 3 && (
            <Step3Budget
              priceMin={wizardData.price_min}
              priceMax={wizardData.price_max}
              onPriceMinChange={(v) => updateWizardData({ price_min: v })}
              onPriceMaxChange={(v) => updateWizardData({ price_max: v })}
              propertyTypes={wizardData.property_types}
              onTogglePropertyType={handleTogglePropertyType}
              bedroomsMin={wizardData.bedrooms_min}
              bedroomsMax={wizardData.bedrooms_max}
              onBedroomsMinChange={(v) => updateWizardData({ bedrooms_min: v })}
              onBedroomsMaxChange={(v) => updateWizardData({ bedrooms_max: v })}
              excludeLeasehold={wizardData.exclude_leasehold}
              onExcludeLeaseholdChange={(v) => updateWizardData({ exclude_leasehold: v })}
              requireParking={wizardData.require_parking}
              onRequireParkingChange={(v) => updateWizardData({ require_parking: v })}
            />
          )}

          {wizardData.step === 4 && (
            <Step4Scoring
              priorityYield={wizardData.priority_yield}
              onPriorityYieldChange={(v) => updateWizardData({ priority_yield: v })}
              priorityCashFlow={wizardData.priority_cash_flow}
              onPriorityCashFlowChange={(v) => updateWizardData({ priority_cash_flow: v })}
              priorityBMV={wizardData.priority_bmv}
              onPriorityBMVChange={(v) => updateWizardData({ priority_bmv: v })}
              priorityCapitalGrowth={wizardData.priority_capital_growth}
              onPriorityCapitalGrowthChange={(v) => updateWizardData({ priority_capital_growth: v })}
              minScore={wizardData.min_score}
              onMinScoreChange={(v) => updateWizardData({ min_score: v })}
            />
          )}

          {wizardData.step === 5 && (
            <Step5Alerts
              frequency={wizardData.alert_frequency}
              onFrequencyChange={(v) => updateWizardData({ alert_frequency: v })}
              methods={wizardData.alert_methods}
              onToggleMethod={handleToggleAlertMethod}
              name={wizardData.name}
              onNameChange={(v) => updateWizardData({ name: v })}
              wizardData={wizardData}
              scanFrequency={(wizardData as any).scan_frequency || 'daily'}
              onScanFrequencyChange={(v) => updateWizardData({ scan_frequency: v } as any)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={wizardData.step === 1 ? handleClose : prevStep}
            disabled={isCreating}
          >
            {wizardData.step === 1 ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </>
            )}
          </Button>

          {wizardData.step < totalSteps ? (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={isCreating || !canProceed()}>
              {isCreating ? 'Creating...' : 'Start Hunting'}
              <Zap className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Step 1: Strategy
function Step1Strategy({ 
  selected, 
  onSelect, 
  targetYield, 
  onTargetYieldChange,
  targetCashFlow,
  onTargetCashFlowChange,
  riskTolerance,
  onRiskToleranceChange,
}: {
  selected: string;
  onSelect: (strategy: string) => void;
  targetYield: number;
  onTargetYieldChange: (value: number) => void;
  targetCashFlow: number;
  onTargetCashFlowChange: (value: number) => void;
  riskTolerance: string;
  onRiskToleranceChange: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">What's your investment strategy?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INVESTMENT_STRATEGIES.map((strategy) => (
            <Card
              key={strategy.value}
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selected === strategy.value ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onSelect(strategy.value)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{strategy.icon}</span>
                <div>
                  <div className="font-medium">{strategy.label}</div>
                  <div className="text-sm text-muted-foreground">{strategy.description}</div>
                </div>
                {selected === strategy.value && (
                  <Check className="h-5 w-5 text-primary ml-auto" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Your Goals</h4>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Label>Target Yield</Label>
            <span className="font-medium">{targetYield}%</span>
          </div>
          <Slider
            value={[targetYield]}
            onValueChange={([v]) => onTargetYieldChange(v)}
            min={4}
            max={15}
            step={0.5}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Label>Target Cash Flow</Label>
            <span className="font-medium">£{targetCashFlow}/mo</span>
          </div>
          <Slider
            value={[targetCashFlow]}
            onValueChange={([v]) => onTargetCashFlowChange(v)}
            min={0}
            max={1000}
            step={50}
          />
        </div>

        <div className="space-y-2">
          <Label>Risk Tolerance</Label>
          <div className="flex gap-2">
            {['conservative', 'moderate', 'aggressive'].map((risk) => (
              <Button
                key={risk}
                variant={riskTolerance === risk ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRiskToleranceChange(risk)}
                className="capitalize flex-1"
              >
                {risk}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Location
function Step2Location({
  areas,
  areaInput,
  onAreaInputChange,
  onAddArea,
  onRemoveArea,
}: {
  areas: string[];
  areaInput: string;
  onAreaInputChange: (value: string) => void;
  onAddArea: () => void;
  onRemoveArea: (area: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Where should I look?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter postcode areas like EN3, N9, SW1
        </p>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter postcode area (e.g., EN3)"
            value={areaInput}
            onChange={(e) => onAreaInputChange(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && onAddArea()}
          />
          <Button onClick={onAddArea} disabled={!areaInput.trim()}>Add</Button>
        </div>

        {areas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {areas.map((area) => (
              <Badge key={area} variant="secondary" className="gap-1 px-3 py-1">
                {area}
                <button onClick={() => onRemoveArea(area)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Popular Investment Areas</h4>
          <div className="flex flex-wrap gap-2">
            {['EN1', 'EN3', 'N9', 'E17', 'RM1', 'IG1'].map((area) => (
              <Button
                key={area}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!areas.includes(area)) {
                    onRemoveArea('__ADD__');
                    onAreaInputChange('');
                    // Add the area
                  }
                }}
                disabled={areas.includes(area)}
              >
                {area}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Budget & Property
function Step3Budget({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  propertyTypes,
  onTogglePropertyType,
  bedroomsMin,
  bedroomsMax,
  onBedroomsMinChange,
  onBedroomsMaxChange,
  excludeLeasehold,
  onExcludeLeaseholdChange,
  requireParking,
  onRequireParkingChange,
}: {
  priceMin: number;
  priceMax: number;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
  propertyTypes: string[];
  onTogglePropertyType: (type: string) => void;
  bedroomsMin: number;
  bedroomsMax: number;
  onBedroomsMinChange: (value: number) => void;
  onBedroomsMaxChange: (value: number) => void;
  excludeLeasehold: boolean;
  onExcludeLeaseholdChange: (value: boolean) => void;
  requireParking: boolean;
  onRequireParkingChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Wallet className="h-5 w-5" />
        Budget & Property Criteria
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Price</Label>
          <Input
            type="number"
            value={priceMin}
            onChange={(e) => onPriceMinChange(Number(e.target.value))}
            placeholder="100,000"
          />
        </div>
        <div className="space-y-2">
          <Label>Max Price</Label>
          <Input
            type="number"
            value={priceMax}
            onChange={(e) => onPriceMaxChange(Number(e.target.value))}
            placeholder="300,000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property Type</Label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <Badge
              key={type.value}
              variant={propertyTypes.includes(type.value) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onTogglePropertyType(type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Bedrooms</Label>
          <Input
            type="number"
            value={bedroomsMin}
            onChange={(e) => onBedroomsMinChange(Number(e.target.value))}
            min={0}
            max={10}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Bedrooms</Label>
          <Input
            type="number"
            value={bedroomsMax}
            onChange={(e) => onBedroomsMaxChange(Number(e.target.value))}
            min={0}
            max={10}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Filters</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="leasehold"
              checked={excludeLeasehold}
              onCheckedChange={(checked) => onExcludeLeaseholdChange(checked as boolean)}
            />
            <Label htmlFor="leasehold" className="text-sm font-normal">
              Exclude leasehold properties
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="parking"
              checked={requireParking}
              onCheckedChange={(checked) => onRequireParkingChange(checked as boolean)}
            />
            <Label htmlFor="parking" className="text-sm font-normal">
              Require parking
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Scoring
function Step4Scoring({
  priorityYield,
  onPriorityYieldChange,
  priorityCashFlow,
  onPriorityCashFlowChange,
  priorityBMV,
  onPriorityBMVChange,
  priorityCapitalGrowth,
  onPriorityCapitalGrowthChange,
  minScore,
  onMinScoreChange,
}: {
  priorityYield: number;
  onPriorityYieldChange: (value: number) => void;
  priorityCashFlow: number;
  onPriorityCashFlowChange: (value: number) => void;
  priorityBMV: number;
  onPriorityBMVChange: (value: number) => void;
  priorityCapitalGrowth: number;
  onPriorityCapitalGrowthChange: (value: number) => void;
  minScore: number;
  onMinScoreChange: (value: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
          <Target className="h-5 w-5" />
          What makes a great deal for you?
        </h3>
        <p className="text-sm text-muted-foreground">
          AI will score every property 0-100 based on these priorities
        </p>
      </div>

      <div className="space-y-4">
        <PrioritySlider
          label="Yield Potential"
          icon="💰"
          value={priorityYield}
          onChange={onPriorityYieldChange}
        />
        <PrioritySlider
          label="Cash Flow"
          icon="📈"
          value={priorityCashFlow}
          onChange={onPriorityCashFlowChange}
        />
        <PrioritySlider
          label="Below Market Value"
          icon="🎯"
          value={priorityBMV}
          onChange={onPriorityBMVChange}
        />
        <PrioritySlider
          label="Capital Growth"
          icon="📊"
          value={priorityCapitalGrowth}
          onChange={onPriorityCapitalGrowthChange}
        />
      </div>

      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <Label>Minimum Score to Show</Label>
          <span className="font-medium">{minScore}/100</span>
        </div>
        <Slider
          value={[minScore]}
          onValueChange={([v]) => onMinScoreChange(v)}
          min={50}
          max={100}
          step={5}
        />
        <p className="text-xs text-muted-foreground">
          Only show properties scoring at least {minScore}
        </p>
      </div>
    </div>
  );
}

function PrioritySlider({ label, icon, value, onChange }: {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <Label className="flex items-center gap-2">
          <span>{icon}</span>
          {label}
        </Label>
        <span className="font-medium">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={100}
        step={5}
      />
    </div>
  );
}

// Step 5: Alerts
function Step5Alerts({
  frequency,
  onFrequencyChange,
  methods,
  onToggleMethod,
  name,
  onNameChange,
  wizardData,
  scanFrequency,
  onScanFrequencyChange,
}: {
  frequency: string;
  onFrequencyChange: (value: string) => void;
  methods: string[];
  onToggleMethod: (method: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  wizardData: any;
  scanFrequency: string;
  onScanFrequencyChange: (value: string) => void;
}) {
  const SCAN_FREQUENCIES = [
    { value: 'every_6_hours', label: 'Every 6 Hours', description: 'Most aggressive - catch deals first' },
    { value: 'every_12_hours', label: 'Every 12 Hours', description: 'Twice daily scans' },
    { value: 'daily', label: 'Daily', description: 'Once per day, recommended' },
    { value: 'manual', label: 'Manual Only', description: 'Only scan when you click' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Bell className="h-5 w-5" />
        Alerts & Scheduling
      </h3>

      <div className="space-y-2">
        <Label>Scout Name</Label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={`${wizardData.location_areas[0] || 'New'} ${wizardData.investment_strategy.toUpperCase()} Scout`}
        />
      </div>

      <div className="space-y-2">
        <Label>Scan Frequency</Label>
        <p className="text-xs text-muted-foreground mb-2">
          How often should this scout search for new properties?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SCAN_FREQUENCIES.map((freq) => (
            <Card
              key={freq.value}
              className={`p-3 cursor-pointer transition-all ${
                scanFrequency === freq.value ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onScanFrequencyChange(freq.value)}
            >
              <div className="font-medium text-sm">{freq.label}</div>
              <div className="text-xs text-muted-foreground">{freq.description}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Alert Frequency</Label>
        <div className="grid grid-cols-2 gap-2">
          {ALERT_FREQUENCIES.map((freq) => (
            <Card
              key={freq.value}
              className={`p-3 cursor-pointer transition-all ${
                frequency === freq.value ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onFrequencyChange(freq.value)}
            >
              <div className="font-medium text-sm">{freq.label}</div>
              <div className="text-xs text-muted-foreground">{freq.description}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Delivery Methods</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'email', label: '📧 Email' },
            { value: 'push', label: '📱 Push' },
            { value: 'whatsapp', label: '💬 WhatsApp' },
          ].map((method) => (
            <Badge
              key={method.value}
              variant={methods.includes(method.value) ? 'default' : 'outline'}
              className="cursor-pointer py-2 px-3"
              onClick={() => onToggleMethod(method.value)}
            >
              {method.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card className="p-4 bg-muted/50">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Summary
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{wizardData.investment_strategy}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{wizardData.location_areas.join(', ') || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span>£{(wizardData.price_min / 1000).toFixed(0)}k - £{(wizardData.price_max / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span>{wizardData.property_types.join(', ') || 'Any'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

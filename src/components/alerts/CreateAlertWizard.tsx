import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Home,
  Users,
  Repeat,
  MapPin,
  PoundSterling,
  Check,
  Mail,
  Smartphone,
  MessageCircle,
  Bell,
  Zap,
  Clock,
  CalendarDays,
} from "lucide-react";
import { useAlertsStore } from "@/stores/alertsStore";
import { useToast } from "@/hooks/use-toast";
import type { CreateAlertFormData, RequestAlert } from "@/types/alerts";
import { defaultAlertFormData } from "@/types/alerts";

interface CreateAlertWizardProps {
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: "What to Alert", icon: Bell },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Budget & Details", icon: PoundSterling },
  { id: 4, title: "Requirements", icon: Check },
  { id: 5, title: "Delivery", icon: Mail },
  { id: 6, title: "Review", icon: Zap },
];

const PROPERTY_TYPES = [
  { value: "studio", label: "Studio" },
  { value: "1-bed", label: "1 Bed" },
  { value: "2-bed", label: "2 Bed" },
  { value: "3-bed", label: "3+ Bed" },
  { value: "house", label: "House" },
  { value: "flat", label: "Flat" },
];

const POPULAR_AREAS = ["EN1", "EN2", "EN3", "N9", "N18", "E8", "E9", "NW1", "W1"];

export function CreateAlertWizard({ onClose }: CreateAlertWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateAlertFormData>(defaultAlertFormData);
  const [areaInput, setAreaInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [excludeKeywordInput, setExcludeKeywordInput] = useState("");
  
  const { addAlert } = useAlertsStore();
  const { toast } = useToast();

  const updateFormData = (updates: Partial<CreateAlertFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleAddArea = (area: string) => {
    const normalizedArea = area.toUpperCase().trim();
    if (normalizedArea && !formData.location_areas.includes(normalizedArea)) {
      updateFormData({ location_areas: [...formData.location_areas, normalizedArea] });
    }
    setAreaInput("");
  };

  const handleRemoveArea = (area: string) => {
    updateFormData({
      location_areas: formData.location_areas.filter((a) => a !== area),
    });
  };

  const handleAddKeyword = (keyword: string, type: "include" | "exclude") => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (type === "include") {
      if (normalizedKeyword && !formData.include_keywords.includes(normalizedKeyword)) {
        updateFormData({ include_keywords: [...formData.include_keywords, normalizedKeyword] });
      }
      setKeywordInput("");
    } else {
      if (normalizedKeyword && !formData.exclude_keywords.includes(normalizedKeyword)) {
        updateFormData({ exclude_keywords: [...formData.exclude_keywords, normalizedKeyword] });
      }
      setExcludeKeywordInput("");
    }
  };

  const togglePropertyType = (type: string) => {
    if (formData.property_types.includes(type)) {
      updateFormData({
        property_types: formData.property_types.filter((t) => t !== type),
      });
    } else {
      updateFormData({
        property_types: [...formData.property_types, type],
      });
    }
  };

  const toggleDeliveryMethod = (method: string) => {
    if (formData.delivery_methods.includes(method)) {
      updateFormData({
        delivery_methods: formData.delivery_methods.filter((m) => m !== method),
      });
    } else {
      updateFormData({
        delivery_methods: [...formData.delivery_methods, method],
      });
    }
  };

  const handleSubmit = () => {
    const newAlert: RequestAlert = {
      id: crypto.randomUUID(),
      user_id: "user1",
      name: formData.name || `${formData.location_areas[0] || "Custom"} Alert`,
      alert_for: formData.alert_for,
      location_areas: formData.location_areas.length > 0 ? formData.location_areas : null,
      location_radius_miles: formData.location_radius_miles,
      location_center_lat: null,
      location_center_lng: null,
      budget_min: formData.budget_min,
      budget_max: formData.budget_max,
      property_types: formData.property_types.length > 0 ? formData.property_types : null,
      move_in_date_from: formData.move_in_date_from,
      move_in_date_to: formData.move_in_date_to,
      duration_min_months: formData.duration_min_months,
      duration_max_months: formData.duration_max_months,
      must_be_self_contained: formData.must_be_self_contained,
      must_allow_pets: formData.must_allow_pets,
      must_allow_children: formData.must_allow_children,
      must_have_parking: formData.must_have_parking,
      furnished_preference: formData.furnished_preference,
      delivery_methods: formData.delivery_methods,
      email_address: formData.email_address || null,
      phone_number: formData.phone_number || null,
      whatsapp_number: formData.whatsapp_number || null,
      slack_webhook_url: null,
      webhook_url: null,
      frequency: formData.frequency,
      digest_time: formData.digest_time || null,
      digest_day: 1,
      ai_match_threshold: formData.ai_match_threshold,
      exclude_keywords: formData.exclude_keywords.length > 0 ? formData.exclude_keywords : null,
      include_keywords: formData.include_keywords.length > 0 ? formData.include_keywords : null,
      is_active: true,
      last_triggered_at: null,
      total_matches_sent: 0,
      max_alerts_per_day: 20,
      alerts_sent_today: 0,
      last_reset_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addAlert(newAlert);
    toast({
      title: "Alert Created!",
      description: `Your alert "${newAlert.name}" is now active.`,
    });
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">What are you looking for?</h2>
              <p className="text-muted-foreground mt-2">
                Choose what type of requests you want to be alerted about
              </p>
            </div>

            <RadioGroup
              value={formData.alert_for}
              onValueChange={(value) => updateFormData({ alert_for: value as "seeking" | "offering" | "both" })}
              className="grid gap-4"
            >
              <Label
                htmlFor="seeking"
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.alert_for === "seeking" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="seeking" id="seeking" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Tenants Seeking</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get alerts when tenants post requirements. Perfect if you're a landlord looking for tenants.
                  </p>
                </div>
              </Label>

              <Label
                htmlFor="offering"
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.alert_for === "offering" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="offering" id="offering" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Properties Available</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get alerts when landlords post properties. Perfect if you're looking for accommodation.
                  </p>
                </div>
              </Label>

              <Label
                htmlFor="both"
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.alert_for === "both" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="both" id="both" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Both</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Alert me to all new accommodation requests.
                  </p>
                </div>
              </Label>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Where should we look?</h2>
              <p className="text-muted-foreground mt-2">
                Add postcode areas you're interested in
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type postcode area (e.g., EN3)"
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddArea(areaInput);
                    }
                  }}
                />
                <Button onClick={() => handleAddArea(areaInput)}>Add</Button>
              </div>

              {formData.location_areas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.location_areas.map((area) => (
                    <Badge key={area} variant="secondary" className="px-3 py-1.5">
                      {area}
                      <button
                        onClick={() => handleRemoveArea(area)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-4">
                <Label className="text-sm text-muted-foreground">Popular areas:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {POPULAR_AREAS.filter((a) => !formData.location_areas.includes(a)).map((area) => (
                    <Button
                      key={area}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArea(area)}
                    >
                      {area}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Budget & Property Details</h2>
              <p className="text-muted-foreground mt-2">
                Set your budget range and property preferences
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Monthly Budget Range</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Min</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.budget_min || ""}
                        onChange={(e) => updateFormData({ budget_min: e.target.value ? parseInt(e.target.value) : null })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <span className="text-muted-foreground mt-5">to</span>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Max</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="5000"
                        value={formData.budget_max || ""}
                        onChange={(e) => updateFormData({ budget_max: e.target.value ? parseInt(e.target.value) : null })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Property Types</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <Button
                      key={type.value}
                      variant={formData.property_types.includes(type.value) ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => togglePropertyType(type.value)}
                    >
                      {formData.property_types.includes(type.value) && (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Duration (months)</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      type="number"
                      placeholder="Any"
                      value={formData.duration_min_months || ""}
                      onChange={(e) => updateFormData({ duration_min_months: e.target.value ? parseInt(e.target.value) : null })}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      type="number"
                      placeholder="Any"
                      value={formData.duration_max_months || ""}
                      onChange={(e) => updateFormData({ duration_max_months: e.target.value ? parseInt(e.target.value) : null })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Requirements</h2>
              <p className="text-muted-foreground mt-2">
                Filter for specific requirements
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Must-Have Features</Label>
                <div className="space-y-3">
                  {[
                    { key: "must_be_self_contained", label: "Self-contained only" },
                    { key: "must_have_parking", label: "Parking required" },
                    { key: "must_allow_pets", label: "Pets allowed" },
                    { key: "must_allow_children", label: "Children allowed" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData[key as keyof CreateAlertFormData] as boolean}
                        onCheckedChange={(checked) => updateFormData({ [key]: checked })}
                      />
                      <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Furnished Preference</Label>
                <RadioGroup
                  value={formData.furnished_preference}
                  onValueChange={(value) => updateFormData({ furnished_preference: value as "furnished" | "unfurnished" | "either" })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="either" id="either" />
                    <Label htmlFor="either">Either</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="furnished" id="furnished" />
                    <Label htmlFor="furnished">Furnished</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unfurnished" id="unfurnished" />
                    <Label htmlFor="unfurnished">Unfurnished</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label>AI Match Threshold</Label>
                <div className="space-y-2">
                  <Slider
                    value={[formData.ai_match_threshold]}
                    onValueChange={([value]) => updateFormData({ ai_match_threshold: value })}
                    min={50}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>50% (More alerts)</span>
                    <span className="font-medium text-foreground">{formData.ai_match_threshold}%</span>
                    <span>100% (Strict)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Include Keywords (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., professional, quiet"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword(keywordInput, "include");
                      }
                    }}
                  />
                  <Button onClick={() => handleAddKeyword(keywordInput, "include")} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.include_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.include_keywords.map((kw) => (
                      <Badge key={kw} variant="secondary">
                        {kw}
                        <button
                          onClick={() => updateFormData({ include_keywords: formData.include_keywords.filter((k) => k !== kw) })}
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Exclude Keywords (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., party, smoking"
                    value={excludeKeywordInput}
                    onChange={(e) => setExcludeKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword(excludeKeywordInput, "exclude");
                      }
                    }}
                  />
                  <Button onClick={() => handleAddKeyword(excludeKeywordInput, "exclude")} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.exclude_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.exclude_keywords.map((kw) => (
                      <Badge key={kw} variant="destructive">
                        {kw}
                        <button
                          onClick={() => updateFormData({ exclude_keywords: formData.exclude_keywords.filter((k) => k !== kw) })}
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">How should we notify you?</h2>
              <p className="text-muted-foreground mt-2">
                Choose your preferred delivery channels and frequency
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Delivery Channels</Label>
                <div className="space-y-3">
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.delivery_methods.includes("email") ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => toggleDeliveryMethod("email")}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <div>
                        <span className="font-medium">Email</span>
                        <p className="text-sm text-muted-foreground">Receive detailed notifications</p>
                      </div>
                    </div>
                    <Checkbox checked={formData.delivery_methods.includes("email")} />
                  </div>

                  <div
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.delivery_methods.includes("push") ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => toggleDeliveryMethod("push")}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <span className="font-medium">Push Notifications</span>
                        <p className="text-sm text-muted-foreground">Instant browser/app notifications</p>
                      </div>
                    </div>
                    <Checkbox checked={formData.delivery_methods.includes("push")} />
                  </div>

                  <div
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.delivery_methods.includes("whatsapp") ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => toggleDeliveryMethod("whatsapp")}
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5" />
                      <div>
                        <span className="font-medium">WhatsApp</span>
                        <p className="text-sm text-muted-foreground">Get messages on WhatsApp</p>
                      </div>
                    </div>
                    <Checkbox checked={formData.delivery_methods.includes("whatsapp")} />
                  </div>
                </div>
              </div>

              {formData.delivery_methods.includes("email") && (
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email_address}
                    onChange={(e) => updateFormData({ email_address: e.target.value })}
                  />
                </div>
              )}

              {formData.delivery_methods.includes("whatsapp") && (
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input
                    type="tel"
                    placeholder="+44 7XXX XXXXXX"
                    value={formData.whatsapp_number}
                    onChange={(e) => updateFormData({ whatsapp_number: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-4">
                <Label>Frequency</Label>
                <RadioGroup
                  value={formData.frequency}
                  onValueChange={(value) => updateFormData({ frequency: value as "instant" | "hourly" | "daily" | "weekly" })}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="instant"
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.frequency === "instant" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="instant" id="instant" />
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <div>
                      <span className="font-medium">Instant</span>
                      <p className="text-sm text-muted-foreground">Get notified immediately</p>
                    </div>
                  </Label>

                  <Label
                    htmlFor="daily"
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.frequency === "daily" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="daily" id="daily" />
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-medium">Daily Digest</span>
                      <p className="text-sm text-muted-foreground">One email per day with all matches</p>
                    </div>
                  </Label>

                  <Label
                    htmlFor="weekly"
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.frequency === "weekly" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="weekly" id="weekly" />
                    <CalendarDays className="h-5 w-5 text-green-500" />
                    <div>
                      <span className="font-medium">Weekly Digest</span>
                      <p className="text-sm text-muted-foreground">One email per week</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              {(formData.frequency === "daily" || formData.frequency === "weekly") && (
                <div className="space-y-2">
                  <Label>Digest Time</Label>
                  <Input
                    type="time"
                    value={formData.digest_time}
                    onChange={(e) => updateFormData({ digest_time: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Review Your Alert</h2>
              <p className="text-muted-foreground mt-2">
                Give your alert a name and confirm the settings
              </p>
            </div>

            <div className="space-y-2">
              <Label>Alert Name</Label>
              <Input
                placeholder="e.g., Enfield Studios Under £1.5K"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Looking for:</span>
                  <span className="font-medium capitalize">{formData.alert_for} accommodation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">
                    {formData.location_areas.length > 0 ? formData.location_areas.join(", ") : "Any"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">
                    {formData.budget_min || formData.budget_max
                      ? `£${formData.budget_min || 0} - £${formData.budget_max || "Any"}`
                      : "Any"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-medium">
                    {formData.property_types.length > 0 ? formData.property_types.join(", ") : "Any"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="font-medium capitalize">{formData.delivery_methods.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium capitalize">{formData.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Match threshold:</span>
                  <span className="font-medium">{formData.ai_match_threshold}%+</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="text-muted-foreground">
                💡 Based on current activity, you'll likely receive <strong>2-3 matches per week</strong> with these settings.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto max-w-3xl py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step >= s.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-2xl py-8 px-4">
        {renderStep()}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="container mx-auto max-w-3xl py-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {step < 6 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Bell className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

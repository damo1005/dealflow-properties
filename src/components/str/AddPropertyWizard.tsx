import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X, Plus } from "lucide-react";
import { AMENITIES_LIST, TARGET_GUESTS_OPTIONS, type PropertyType } from "@/types/str";
import { Badge } from "@/components/ui/badge";

interface WizardData {
  property_name: string;
  address: string;
  postcode: string;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sleeps: number;
  square_feet: number;
  amenities: string[];
  unique_features: string;
  nearby_attractions: string[];
  distance_to_beach_km: number;
  distance_to_city_center_km: number;
  target_guests: string[];
  airbnb_url: string;
  airbnb_ical_url: string;
  vrbo_url: string;
  vrbo_ical_url: string;
  booking_com_url: string;
  booking_com_ical_url: string;
}

interface AddPropertyWizardProps {
  onComplete: (data: WizardData) => void;
  onCancel: () => void;
}

const STEPS = [
  { title: "Basic Details", description: "Property information" },
  { title: "Amenities", description: "Features & facilities" },
  { title: "Unique Features", description: "What makes it special" },
  { title: "Target Guests", description: "Ideal guest types" },
  { title: "Platform Links", description: "Connect your listings" },
];

export function AddPropertyWizard({ onComplete, onCancel }: AddPropertyWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    property_name: "",
    address: "",
    postcode: "",
    property_type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    sleeps: 2,
    square_feet: 0,
    amenities: [],
    unique_features: "",
    nearby_attractions: [],
    distance_to_beach_km: 0,
    distance_to_city_center_km: 0,
    target_guests: [],
    airbnb_url: "",
    airbnb_ical_url: "",
    vrbo_url: "",
    vrbo_ical_url: "",
    booking_com_url: "",
    booking_com_ical_url: "",
  });
  const [newAttraction, setNewAttraction] = useState("");

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const toggleAmenity = (amenity: string) => {
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const toggleTargetGuest = (guest: string) => {
    setData((prev) => ({
      ...prev,
      target_guests: prev.target_guests.includes(guest)
        ? prev.target_guests.filter((g) => g !== guest)
        : [...prev.target_guests, guest],
    }));
  };

  const addAttraction = () => {
    if (newAttraction.trim()) {
      setData((prev) => ({
        ...prev,
        nearby_attractions: [...prev.nearby_attractions, newAttraction.trim()],
      }));
      setNewAttraction("");
    }
  };

  const removeAttraction = (attraction: string) => {
    setData((prev) => ({
      ...prev,
      nearby_attractions: prev.nearby_attractions.filter((a) => a !== attraction),
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.property_name && data.postcode && data.bedrooms > 0 && data.sleeps > 0;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    onComplete(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Add New Property</CardTitle>
            <CardDescription>{STEPS[step - 1].description}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of {STEPS.length}</span>
            <span>{STEPS[step - 1].title}</span>
          </div>
          <Progress value={(step / STEPS.length) * 100} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property_name">Property Name *</Label>
              <Input
                id="property_name"
                placeholder="e.g., Cozy Beach Cottage"
                value={data.property_name}
                onChange={(e) => updateData({ property_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Full address"
                value={data.address}
                onChange={(e) => updateData({ address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                placeholder="e.g., SW1A 1AA"
                value={data.postcode}
                onChange={(e) => updateData({ postcode: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Property Type *</Label>
              <RadioGroup
                value={data.property_type}
                onValueChange={(v) => updateData({ property_type: v as PropertyType })}
                className="grid grid-cols-3 gap-2"
              >
                {["apartment", "house", "room", "studio", "villa", "cottage"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="capitalize">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={data.bedrooms}
                  onChange={(e) => updateData({ bedrooms: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={data.bathrooms}
                  onChange={(e) => updateData({ bathrooms: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleeps">Sleeps *</Label>
                <Input
                  id="sleeps"
                  type="number"
                  min="1"
                  value={data.sleeps}
                  onChange={(e) => updateData({ sleeps: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="square_feet">Square Feet</Label>
                <Input
                  id="square_feet"
                  type="number"
                  min="0"
                  value={data.square_feet || ""}
                  onChange={(e) => updateData({ square_feet: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Amenities */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Select all that apply</p>
            {AMENITIES_LIST.map((category) => (
              <div key={category.category} className="space-y-3">
                <Label className="text-base font-medium">{category.category}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={data.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm font-normal">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Unique Features */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="unique_features">What makes your property special?</Label>
              <Textarea
                id="unique_features"
                placeholder="Describe unique features, views, recent renovations, special equipment, local highlights..."
                rows={5}
                value={data.unique_features}
                onChange={(e) => updateData({ unique_features: e.target.value })}
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Examples:</p>
                <ul className="list-disc list-inside">
                  <li>Rooftop terrace with panoramic city views</li>
                  <li>Newly renovated with designer furniture</li>
                  <li>5-minute walk to sandy beach</li>
                  <li>Original exposed brick and high ceilings</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nearby Attractions</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add an attraction"
                  value={newAttraction}
                  onChange={(e) => setNewAttraction(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addAttraction()}
                />
                <Button type="button" variant="outline" onClick={addAttraction}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.nearby_attractions.map((attraction) => (
                  <Badge key={attraction} variant="secondary" className="pr-1">
                    {attraction}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => removeAttraction(attraction)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance_to_beach">Distance to Beach (km)</Label>
                <Input
                  id="distance_to_beach"
                  type="number"
                  min="0"
                  step="0.1"
                  value={data.distance_to_beach_km || ""}
                  onChange={(e) => updateData({ distance_to_beach_km: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance_to_city">Distance to City Center (km)</Label>
                <Input
                  id="distance_to_city"
                  type="number"
                  min="0"
                  step="0.1"
                  value={data.distance_to_city_center_km || ""}
                  onChange={(e) => updateData({ distance_to_city_center_km: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Target Guests */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Who is this property perfect for?</p>
            <div className="grid grid-cols-2 gap-3">
              {TARGET_GUESTS_OPTIONS.map((guest) => (
                <div key={guest} className="flex items-center space-x-2">
                  <Checkbox
                    id={guest}
                    checked={data.target_guests.includes(guest)}
                    onCheckedChange={() => toggleTargetGuest(guest)}
                  />
                  <Label htmlFor={guest} className="text-sm font-normal">
                    {guest}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Platform Links */}
        {step === 5 && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Connect your listing platforms (optional)</p>
            
            <div className="space-y-4 p-4 border rounded-lg">
              <Label className="text-base font-medium">Airbnb</Label>
              <div className="space-y-2">
                <Label htmlFor="airbnb_url" className="text-sm font-normal">Listing URL</Label>
                <Input
                  id="airbnb_url"
                  placeholder="https://airbnb.com/rooms/..."
                  value={data.airbnb_url}
                  onChange={(e) => updateData({ airbnb_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="airbnb_ical" className="text-sm font-normal">iCal URL</Label>
                <Input
                  id="airbnb_ical"
                  placeholder="https://airbnb.com/calendar/ical/..."
                  value={data.airbnb_ical_url}
                  onChange={(e) => updateData({ airbnb_ical_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  We'll sync bookings automatically from this calendar
                </p>
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <Label className="text-base font-medium">VRBO</Label>
              <div className="space-y-2">
                <Label htmlFor="vrbo_url" className="text-sm font-normal">Listing URL</Label>
                <Input
                  id="vrbo_url"
                  placeholder="https://vrbo.com/..."
                  value={data.vrbo_url}
                  onChange={(e) => updateData({ vrbo_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vrbo_ical" className="text-sm font-normal">iCal URL</Label>
                <Input
                  id="vrbo_ical"
                  placeholder="https://vrbo.com/icalendar/..."
                  value={data.vrbo_ical_url}
                  onChange={(e) => updateData({ vrbo_ical_url: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <Label className="text-base font-medium">Booking.com</Label>
              <div className="space-y-2">
                <Label htmlFor="booking_url" className="text-sm font-normal">Listing URL</Label>
                <Input
                  id="booking_url"
                  placeholder="https://booking.com/..."
                  value={data.booking_com_url}
                  onChange={(e) => updateData({ booking_com_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking_ical" className="text-sm font-normal">iCal URL</Label>
                <Input
                  id="booking_ical"
                  placeholder="https://admin.booking.com/..."
                  value={data.booking_com_ical_url}
                  onChange={(e) => updateData({ booking_com_ical_url: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {step < STEPS.length ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Check className="h-4 w-4 mr-2" />
              Create Property
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

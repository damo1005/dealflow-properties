import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Building2, User, Target, Settings, ArrowRight, ArrowLeft, X } from "lucide-react";

const INVESTOR_TYPES = ["Beginner", "Intermediate", "Experienced", "Professional"];
const STRATEGIES = ["BTL", "BRR", "HMO", "Flip", "Commercial", "SA", "Development"];
const LOOKING_FOR = ["JV Partners", "Mentors", "Deals", "Networking", "Finance"];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step 1: About You
  const [investorType, setInvestorType] = useState("Beginner");
  const [yearsInvesting, setYearsInvesting] = useState("0");
  const [strategies, setStrategies] = useState<string[]>([]);

  // Step 2: Your Goals
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [targetLocations, setTargetLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [dealTarget, setDealTarget] = useState([5]);

  // Step 3: Preferences
  const [emailAlerts, setEmailAlerts] = useState("weekly");
  const [dealAlerts, setDealAlerts] = useState(true);
  const [openToJV, setOpenToJV] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("network");

  const toggleStrategy = (strategy: string) => {
    setStrategies((prev) =>
      prev.includes(strategy)
        ? prev.filter((s) => s !== strategy)
        : [...prev, strategy]
    );
  };

  const toggleLookingFor = (item: string) => {
    setLookingFor((prev) =>
      prev.includes(item) ? prev.filter((l) => l !== item) : [...prev, item]
    );
  };

  const addLocation = () => {
    if (locationInput.trim() && !targetLocations.includes(locationInput.trim())) {
      setTargetLocations([...targetLocations, locationInput.trim()]);
      setLocationInput("");
    }
  };

  const removeLocation = (location: string) => {
    setTargetLocations(targetLocations.filter((l) => l !== location));
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      navigate("/auth/login");
      return;
    }

    setLoading(true);

    try {
      // Check if user_profiles entry exists
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const profileData = {
        user_id: user.id,
        investor_type: investorType,
        years_investing: parseInt(yearsInvesting),
        specialties: strategies,
        looking_for: lookingFor,
        open_to_jv: openToJV,
        profile_visibility: profileVisibility,
        updated_at: new Date().toISOString(),
      };

      if (existingProfile) {
        await supabase
          .from("user_profiles")
          .update(profileData)
          .eq("user_id", user.id);
      } else {
        await supabase.from("user_profiles").insert({
          ...profileData,
          created_at: new Date().toISOString(),
        });
      }

      toast.success("Profile setup complete!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-[600px] shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DealFlow</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Let's set up your account</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>

          {/* Progress bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium">
                <User className="h-5 w-5 text-primary" />
                About You
              </div>

              <div className="space-y-3">
                <Label>What type of investor are you?</Label>
                <RadioGroup value={investorType} onValueChange={setInvestorType}>
                  {INVESTOR_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="font-normal cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Years investing in property</Label>
                <Select value={yearsInvesting} onValueChange={setYearsInvesting}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not started yet</SelectItem>
                    <SelectItem value="1">Less than 1 year</SelectItem>
                    <SelectItem value="2">1-2 years</SelectItem>
                    <SelectItem value="5">3-5 years</SelectItem>
                    <SelectItem value="10">5-10 years</SelectItem>
                    <SelectItem value="20">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Investment strategies (select all that apply)</Label>
                <div className="flex flex-wrap gap-2">
                  {STRATEGIES.map((strategy) => (
                    <Badge
                      key={strategy}
                      variant={strategies.includes(strategy) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleStrategy(strategy)}
                    >
                      {strategy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Target className="h-5 w-5 text-primary" />
                Your Goals
              </div>

              <div className="space-y-3">
                <Label>What are you looking for?</Label>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR.map((item) => (
                    <Badge
                      key={item}
                      variant={lookingFor.includes(item) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleLookingFor(item)}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Target locations</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Manchester, London..."
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
                  />
                  <Button type="button" onClick={addLocation} variant="secondary">
                    Add
                  </Button>
                </div>
                {targetLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {targetLocations.map((location) => (
                      <Badge key={location} variant="secondary" className="gap-1">
                        {location}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeLocation(location)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Annual deal target: {dealTarget[0]}+ deals</Label>
                <Slider
                  value={dealTarget}
                  onValueChange={setDealTarget}
                  min={1}
                  max={50}
                  step={1}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Settings className="h-5 w-5 text-primary" />
                Preferences
              </div>

              <div className="space-y-3">
                <Label>Email digest frequency</Label>
                <RadioGroup value={emailAlerts} onValueChange={setEmailAlerts}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="font-normal cursor-pointer">
                      Daily digest
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly" className="font-normal cursor-pointer">
                      Weekly summary
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="off" id="off" />
                    <Label htmlFor="off" className="font-normal cursor-pointer">
                      No emails
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Deal alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new matching deals
                    </p>
                  </div>
                  <Checkbox
                    checked={dealAlerts}
                    onCheckedChange={(checked) => setDealAlerts(!!checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Open to JV opportunities</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others know you're looking for partners
                    </p>
                  </div>
                  <Checkbox
                    checked={openToJV}
                    onCheckedChange={(checked) => setOpenToJV(!!checked)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Profile visibility</Label>
                <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="font-normal cursor-pointer">
                      Public - Anyone can see your profile
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="network" id="network" />
                    <Label htmlFor="network" className="font-normal cursor-pointer">
                      Network only - Only connections can see
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="font-normal cursor-pointer">
                      Private - Hidden from others
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Skip for now
              </Button>
            )}

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

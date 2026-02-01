import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Loader2, 
  Building2, 
  User, 
  Target, 
  Rocket, 
  ArrowRight, 
  ArrowLeft, 
  X,
  Search,
  Radar,
  LayoutDashboard,
  Sparkles
} from "lucide-react";

const MOTIVATIONS = [
  { value: "first_investor", label: "First-time investor" },
  { value: "growing_portfolio", label: "Growing my portfolio" },
  { value: "professional_developer", label: "Professional developer" },
  { value: "property_sourcer", label: "Property sourcer" },
];

const STRATEGIES = [
  { value: "BTL", label: "Buy-to-Let", description: "Standard rental properties" },
  { value: "BRR", label: "BRR", description: "Buy, Refurbish, Refinance" },
  { value: "HMO", label: "HMO", description: "Houses of Multiple Occupation" },
  { value: "Flip", label: "Flip", description: "Buy, renovate, sell" },
  { value: "Commercial", label: "Commercial", description: "Commercial properties" },
];

const BUDGET_RANGES = [
  { value: "50k-100k", label: "£50K - £100K" },
  { value: "100k-200k", label: "£100K - £200K" },
  { value: "200k-500k", label: "£200K - £500K" },
  { value: "500k+", label: "£500K+" },
];

const FIRST_ACTIONS = [
  { 
    id: "search", 
    title: "Search Properties", 
    description: "Find investment opportunities now",
    icon: Search,
    path: "/search"
  },
  { 
    id: "scout", 
    title: "Set Up Deal Scout", 
    description: "Get automated deal alerts",
    icon: Radar,
    path: "/deal-scout"
  },
  { 
    id: "explore", 
    title: "Explore Features", 
    description: "Tour the platform",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step 1: Welcome
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [motivation, setMotivation] = useState("");

  // Step 2: Investment Strategy
  const [primaryStrategy, setPrimaryStrategy] = useState("");
  const [secondaryStrategies, setSecondaryStrategies] = useState<string[]>([]);

  // Step 3: Budget & Criteria
  const [budgetRange, setBudgetRange] = useState("");
  const [targetLocations, setTargetLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");

  const totalSteps = 4;
  const progressValue = (step / totalSteps) * 100;

  const toggleSecondaryStrategy = (strategy: string) => {
    if (strategy === primaryStrategy) return; // Can't select primary as secondary
    setSecondaryStrategies((prev) =>
      prev.includes(strategy)
        ? prev.filter((s) => s !== strategy)
        : [...prev, strategy]
    );
  };

  const addLocation = () => {
    const trimmed = locationInput.trim();
    if (trimmed && !targetLocations.includes(trimmed)) {
      setTargetLocations([...targetLocations, trimmed]);
      setLocationInput("");
    }
  };

  const removeLocation = (loc: string) => {
    setTargetLocations(targetLocations.filter((l) => l !== loc));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLocation();
    }
  };

  const saveAndComplete = async (redirectPath: string) => {
    if (!user) {
      toast.error("Please log in to continue");
      navigate("/auth/login");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName || null,
          location: location || null,
          user_motivation: motivation || null,
          primary_strategy: primaryStrategy || null,
          secondary_strategies: secondaryStrategies.length > 0 ? secondaryStrategies : null,
          budget_range: budgetRange || null,
          target_locations: targetLocations.length > 0 ? targetLocations : null,
          completed_onboarding: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Welcome to DealFlow! 🎉");
      navigate(redirectPath);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!user) {
      navigate("/dashboard");
      return;
    }

    setLoading(true);
    try {
      await supabase
        .from("profiles")
        .update({
          completed_onboarding: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return displayName.trim().length > 0;
      case 2:
        return primaryStrategy.length > 0;
      case 3:
        return budgetRange.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4">
      <Card className="w-full max-w-[600px] shadow-xl border-border/50">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DealFlow</span>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progressValue)}% complete</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          {/* Step indicator dots */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  s === step 
                    ? "bg-primary scale-125" 
                    : s < step 
                      ? "bg-primary/60" 
                      : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                  <User className="h-5 w-5 text-primary" />
                  Welcome to DealFlow
                </div>
                <CardDescription>Let's get to know you</CardDescription>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name *</Label>
                  <Input
                    id="displayName"
                    placeholder="How should we call you?"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City or postcode"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>What brings you to DealFlow?</Label>
                  <Select value={motivation} onValueChange={setMotivation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOTIVATIONS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Investment Strategy */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                  <Target className="h-5 w-5 text-primary" />
                  Investment Strategy
                </div>
                <CardDescription>Tell us how you invest</CardDescription>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary strategy *</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {STRATEGIES.map((strategy) => (
                      <button
                        key={strategy.value}
                        type="button"
                        onClick={() => {
                          setPrimaryStrategy(strategy.value);
                          // Remove from secondary if it was selected
                          setSecondaryStrategies(prev => 
                            prev.filter(s => s !== strategy.value)
                          );
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          primaryStrategy === strategy.value
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="font-medium">{strategy.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {strategy.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {primaryStrategy && (
                  <div className="space-y-2">
                    <Label>Secondary strategies (optional)</Label>
                    <div className="flex flex-wrap gap-2">
                      {STRATEGIES.filter(s => s.value !== primaryStrategy).map((strategy) => (
                        <Badge
                          key={strategy.value}
                          variant={secondaryStrategies.includes(strategy.value) ? "default" : "outline"}
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => toggleSecondaryStrategy(strategy.value)}
                        >
                          {strategy.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Budget & Criteria */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Budget & Criteria
                </div>
                <CardDescription>Help us find the right deals for you</CardDescription>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Budget range *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGET_RANGES.map((range) => (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => setBudgetRange(range.value)}
                        className={`p-3 rounded-lg border text-center font-medium transition-all ${
                          budgetRange === range.value
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Locations interested in</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Manchester, Birmingham..."
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button type="button" onClick={addLocation} variant="secondary">
                      Add
                    </Button>
                  </div>
                  {targetLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {targetLocations.map((loc) => (
                        <Badge key={loc} variant="secondary" className="gap-1 pr-1">
                          {loc}
                          <button
                            type="button"
                            onClick={() => removeLocation(loc)}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
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
          )}

          {/* Step 4: First Action */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                  <Rocket className="h-5 w-5 text-primary" />
                  You're all set!
                </div>
                <CardDescription>What would you like to do first?</CardDescription>
              </div>

              <div className="space-y-3">
                {FIRST_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => saveAndComplete(action.path)}
                      disabled={loading}
                      className="w-full p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 text-left transition-all group flex items-center gap-4 disabled:opacity-50"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>

              {loading && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving your preferences...</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                disabled={loading}
              >
                Skip for now
              </Button>
            )}

            {step < 4 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                disabled={loading}
              >
                Skip for now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

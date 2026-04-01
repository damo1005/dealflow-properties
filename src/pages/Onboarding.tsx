import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Loader2,
  Building2,
  ArrowRight,
  ArrowLeft,
  Target,
  FileText,
  LayoutDashboard,
  BedDouble,
  Rocket,
} from "lucide-react";

const PROPERTY_COUNTS = [
  { value: "0", label: "0 — I'm just getting started" },
  { value: "1-3", label: "1–3 properties" },
  { value: "4-10", label: "4–10 properties" },
  { value: "10+", label: "10+ properties" },
];

const STRATEGIES = [
  { value: "R2SA", label: "Rent-to-SA (R2SA)", description: "I rent from landlords and sublet as serviced accommodation" },
  { value: "Own", label: "Own property SA", description: "I operate SA from properties I own" },
  { value: "Both", label: "Both", description: "A mix of rented and owned SA properties" },
];

const FIRST_ACTIONS = [
  {
    id: "analyse",
    title: "Analyse a deal",
    description: "Check if a property works as an SA unit",
    icon: Target,
    path: "/deal-analyser",
  },
  {
    id: "pitch",
    title: "Generate a landlord pitch",
    description: "Create a guaranteed rent proposal",
    icon: FileText,
    path: "/deal-analyser",
  },
  {
    id: "setup",
    title: "Set up my existing SA property",
    description: "Add a property and connect your platforms",
    icon: BedDouble,
    path: "/str-management",
  },
  {
    id: "dashboard",
    title: "View my dashboard",
    description: "See your portfolio overview",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step 1
  const [propertyCount, setPropertyCount] = useState("");
  const [strategy, setStrategy] = useState("");

  // Step 2
  const [selectedAction, setSelectedAction] = useState("");

  const totalSteps = 2;
  const progressValue = (step / totalSteps) * 100;

  const canProceed = () => {
    if (step === 1) return propertyCount !== "" && strategy !== "";
    return true;
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
          user_motivation: propertyCount || null,
          primary_strategy: strategy || null,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4">
      <Card className="w-full max-w-[540px] shadow-xl border-border/50">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DealFlow</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progressValue)}% complete</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2].map((s) => (
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
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                  <Building2 className="h-5 w-5 text-primary" />
                  Tell us about your SA business
                </div>
                <CardDescription>So we can tailor DealFlow to you</CardDescription>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium">How many SA properties do you currently operate?</p>
                  <div className="grid grid-cols-1 gap-2">
                    {PROPERTY_COUNTS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPropertyCount(opt.value)}
                        className={`p-3 rounded-lg border text-left text-sm font-medium transition-all ${
                          propertyCount === opt.value
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">What's your main property strategy?</p>
                  <div className="grid grid-cols-1 gap-2">
                    {STRATEGIES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setStrategy(s.value)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          strategy === s.value
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{s.label}</div>
                        <div className="text-xs text-muted-foreground">{s.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                  <Rocket className="h-5 w-5 text-primary" />
                  What are you looking to do first?
                </div>
                <CardDescription>We'll take you straight there</CardDescription>
              </div>

              <div className="space-y-3">
                {FIRST_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => {
                        setSelectedAction(action.id);
                        saveAndComplete(action.path);
                      }}
                      disabled={loading}
                      className="w-full p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 text-left transition-all group flex items-center gap-4 disabled:opacity-50"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
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

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleSkip} disabled={loading}>
                Skip for now
              </Button>
            )}

            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleSkip} disabled={loading}>
                Skip for now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from "react";
import { CreditCard, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PricingCard } from "./PricingCard";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/stripe";
import { format } from "date-fns";

interface SubscriptionStatus {
  subscribed: boolean;
  tier: SubscriptionTier;
  subscription_end: string | null;
}

export function SubscriptionManager() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const checkSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw error;
      
      setStatus(data as SubscriptionStatus);
    } catch (error) {
      console.error("Error checking subscription:", error);
      // Default to free tier on error
      setStatus({ subscribed: false, tier: "free", subscription_end: null });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    
    // Check for checkout result in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast.success("Subscription activated successfully!");
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
      // Refresh subscription status
      setTimeout(checkSubscription, 2000);
    } else if (params.get("checkout") === "cancelled") {
      toast.info("Checkout was cancelled");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [user]);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!user || tier === "free") return;
    
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig.priceId) {
      toast.error("Price not configured for this tier");
      return;
    }
    
    setIsCheckoutLoading(tier);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: tierConfig.priceId,
          tier,
        },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckoutLoading(null);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;
    
    setIsPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error: any) {
      console.error("Error opening billing portal:", error);
      toast.error(error.message || "Failed to open billing portal");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const currentTier = status?.tier || "free";
  const currentTierConfig = SUBSCRIPTION_TIERS[currentTier];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={checkSubscription}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">{currentTierConfig.name}</span>
                <Badge variant={currentTier === "free" ? "secondary" : "default"}>
                  {currentTier === "free" ? "Free" : "Active"}
                </Badge>
              </div>
              {status?.subscription_end && (
                <p className="text-sm text-muted-foreground mt-1">
                  Renews on {format(new Date(status.subscription_end), "MMMM d, yyyy")}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">£{currentTierConfig.price}</span>
              {currentTierConfig.price > 0 && (
                <span className="text-muted-foreground">/month</span>
              )}
            </div>
          </div>
          
          {status?.subscribed && (
            <>
              <Separator />
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={isPortalLoading}
                className="w-full sm:w-auto"
              >
                {isPortalLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage Billing
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {status?.subscribed ? "Change Plan" : "Upgrade Your Plan"}
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.entries(SUBSCRIPTION_TIERS) as [SubscriptionTier, typeof SUBSCRIPTION_TIERS.free][]).map(
            ([tier, config]) => (
              <PricingCard
                key={tier}
                name={config.name}
                price={config.price}
                features={config.features}
                isCurrentPlan={tier === currentTier}
                isPopular={tier === "pro"}
                onSelect={() => handleUpgrade(tier)}
                isLoading={isCheckoutLoading === tier}
                disabled={tier === "free" || !!isCheckoutLoading}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

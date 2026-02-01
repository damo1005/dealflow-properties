import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/stripe";
import { useNavigate } from "react-router-dom";

interface UpgradeButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showBadge?: boolean;
  className?: string;
}

export function UpgradeButton({
  variant = "default",
  size = "default",
  showBadge = false,
  className,
}: UpgradeButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkTier = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .single();
        
        if (data?.subscription_tier) {
          setCurrentTier(data.subscription_tier as SubscriptionTier);
        }
      } catch (error) {
        console.error("Error checking tier:", error);
      }
    };
    
    checkTier();
  }, [user]);

  const handleUpgrade = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    
    // If already on pro or premium, go to settings
    if (currentTier !== "free") {
      navigate("/settings");
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: SUBSCRIPTION_TIERS.pro.priceId,
          tier: "pro",
        },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Failed to start checkout");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show upgrade button if already premium
  if (currentTier === "premium") {
    return showBadge ? (
      <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
        Premium
      </Badge>
    ) : null;
  }

  // Show manage button if on pro
  if (currentTier === "pro") {
    return showBadge ? (
      <Badge variant="secondary">Pro</Badge>
    ) : (
      <Button variant={variant} size={size} className={className} onClick={() => navigate("/settings")}>
        Manage Plan
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleUpgrade}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          Upgrade to Pro
        </>
      )}
    </Button>
  );
}

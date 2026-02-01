import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, Key, Shield, ExternalLink } from "lucide-react";

interface Integration {
  id: string;
  integration_key: string;
  name: string;
  description: string;
  category: string;
  logo_url: string | null;
  requires_api_key: boolean;
  requires_oauth: boolean;
  features: string[];
  available_in_tiers: string[];
  is_active: boolean;
  is_beta: boolean;
  total_connections: number;
}

interface ConnectIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: Integration | null;
  onSuccess: () => void;
}

const INTEGRATION_LOGOS: Record<string, string> = {
  stripe: "💳",
  xero: "📊",
  quickbooks: "📒",
  google_calendar: "📅",
  zapier: "⚡",
  propertydata: "🏠",
  rightmove: "🏡",
  zoopla: "🔍",
  open_banking: "🏦",
};

export function ConnectIntegrationDialog({
  open,
  onOpenChange,
  integration,
  onSuccess,
}: ConnectIntegrationDialogProps) {
  const [step, setStep] = useState<"auth" | "config" | "syncing" | "complete">("auth");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [syncProgress, setSyncProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!integration) return null;

  const handleConnect = async () => {
    setLoading(true);

    if (integration.requires_oauth) {
      // Simulate OAuth redirect
      await new Promise((r) => setTimeout(r, 1000));
      setStep("config");
    } else if (integration.requires_api_key) {
      // Validate API key
      await new Promise((r) => setTimeout(r, 1000));
      setStep("config");
    }

    setLoading(false);
  };

  const handleStartSync = async () => {
    setStep("syncing");
    
    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setSyncProgress(i);
    }

    setStep("complete");
  };

  const handleComplete = () => {
    onSuccess();
    // Reset state
    setStep("auth");
    setApiKey("");
    setApiSecret("");
    setSyncProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {INTEGRATION_LOGOS[integration.integration_key] || "🔌"}
            </div>
            <DialogTitle>Connect {integration.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Authentication */}
          {step === "auth" && (
            <div className="space-y-4">
              {integration.requires_oauth ? (
                <div className="text-center space-y-4">
                  <Shield className="h-16 w-16 mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Click below to authorize DealFlow to access your {integration.name} account.
                  </p>
                  <div className="p-4 bg-muted rounded-lg text-left">
                    <p className="text-sm font-medium mb-2">We'll be able to:</p>
                    {integration.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" onClick={handleConnect} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Authorize with {integration.name}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">Secure OAuth 2.0 authentication</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Key className="h-4 w-4" />
                    Enter your {integration.name} API credentials
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <Input
                      id="api_key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api_secret">API Secret (if required)</Label>
                    <Input
                      id="api_secret"
                      type="password"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      placeholder="Enter your API secret"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleConnect}
                    disabled={!apiKey || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Don't have an API key?{" "}
                    <a href="#" className="text-primary hover:underline">
                      Get one from {integration.name}
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === "config" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Successfully authenticated!</span>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-4">
                <h4 className="font-medium">Sync Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Sync frequency</span>
                    <span className="font-medium">Daily</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-sync</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handleStartSync}>
                Start Syncing
              </Button>
            </div>
          )}

          {/* Step 3: Syncing */}
          {step === "syncing" && (
            <div className="space-y-4 text-center">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <div>
                <p className="font-medium">Syncing with {integration.name}...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments
                </p>
              </div>
              <Progress value={syncProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{syncProgress}% complete</p>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === "complete" && (
            <div className="space-y-4 text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <div>
                <p className="text-lg font-medium">Connected Successfully!</p>
                <p className="text-sm text-muted-foreground">
                  {integration.name} is now connected to DealFlow
                </p>
              </div>
              <Button className="w-full" onClick={handleComplete}>
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

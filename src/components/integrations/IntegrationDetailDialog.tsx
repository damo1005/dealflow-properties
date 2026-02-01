import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Clock, Star, ArrowRight, Lock } from "lucide-react";

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

interface IntegrationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: Integration | null;
  isConnected: boolean;
  canConnect: boolean;
  onConnect: () => void;
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

const CATEGORY_LABELS: Record<string, string> = {
  accounting: "Accounting",
  banking: "Banking",
  property_portals: "Property Portals",
  crm: "CRM",
  communication: "Communication",
  payments: "Payments",
  analytics: "Analytics",
  marketing: "Marketing",
  automation: "Automation",
};

export function IntegrationDetailDialog({
  open,
  onOpenChange,
  integration,
  isConnected,
  canConnect,
  onConnect,
}: IntegrationDetailDialogProps) {
  if (!integration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="text-5xl">
              {INTEGRATION_LOGOS[integration.integration_key] || "🔌"}
            </div>
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {integration.name}
                {integration.is_beta && (
                  <Badge variant="outline">Beta</Badge>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">
                  {CATEGORY_LABELS[integration.category] || integration.category}
                </Badge>
                {isConnected && (
                  <Badge className="bg-green-500/10 text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overview */}
          <div>
            <h4 className="font-medium mb-2">Overview</h4>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-medium mb-2">Features</h4>
            <div className="space-y-2">
              {integration.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="font-medium mb-2">Requirements</h4>
            <div className="space-y-2 text-sm">
              {integration.requires_api_key && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">•</span>
                  API key from {integration.name}
                </div>
              )}
              {integration.requires_oauth && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">•</span>
                  {integration.name} account for OAuth authorization
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">•</span>
                DealFlow {integration.available_in_tiers.join(" or ")} tier
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 py-3 border-t border-b">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{integration.total_connections} users connected</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">~5 min setup</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isConnected ? (
              <>
                <Button className="flex-1">
                  Configure
                </Button>
                <Button variant="outline" className="flex-1">
                  View Logs
                </Button>
              </>
            ) : canConnect ? (
              <Button className="w-full" onClick={onConnect}>
                Connect to {integration.name}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button className="w-full" variant="outline">
                <Lock className="h-4 w-4 mr-2" />
                Upgrade to {integration.available_in_tiers[0]}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

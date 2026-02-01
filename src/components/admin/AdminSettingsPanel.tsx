import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import type { PlatformSetting } from "@/types/admin";
import { toast } from "sonner";

interface AdminSettingsPanelProps {
  settings: PlatformSetting[];
  onUpdateSetting: (key: string, value: any) => void;
  isLoading: boolean;
}

export function AdminSettingsPanel({
  settings,
  onUpdateSetting,
  isLoading,
}: AdminSettingsPanelProps) {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});

  const getSettingValue = (key: string) => {
    const setting = settings.find((s) => s.setting_key === key);
    if (!setting) return "";
    
    // Handle JSONB values
    if (typeof setting.setting_value === "string") {
      try {
        return JSON.parse(setting.setting_value);
      } catch {
        return setting.setting_value;
      }
    }
    return setting.setting_value;
  };

  const handleChange = (key: string, value: any) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    const value = editedValues[key] ?? getSettingValue(key);
    onUpdateSetting(key, value);
    setEditedValues((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    toast.success("Setting saved");
  };

  const getValue = (key: string) => {
    return editedValues[key] ?? getSettingValue(key);
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSettingInput = (
    key: string,
    label: string,
    type: "text" | "number" | "boolean" | "secret" = "text",
    description?: string
  ) => {
    const value = getValue(key);
    const hasChanges = key in editedValues;

    if (type === "boolean") {
      return (
        <div className="flex items-center justify-between py-3 border-b last:border-0">
          <div>
            <Label>{label}</Label>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <Switch
            checked={value === true || value === "true"}
            onCheckedChange={(checked) => {
              handleChange(key, checked);
              onUpdateSetting(key, checked);
            }}
          />
        </div>
      );
    }

    return (
      <div className="space-y-2 py-3 border-b last:border-0">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          {hasChanges && (
            <Button size="sm" onClick={() => handleSave(key)}>
              <Check className="h-3 w-3 mr-1" />
              Save
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            type={type === "secret" && !showSecrets[key] ? "password" : type === "number" ? "number" : "text"}
            value={value || ""}
            onChange={(e) =>
              handleChange(
                key,
                type === "number" ? parseFloat(e.target.value) : e.target.value
              )
            }
            className={type === "secret" ? "font-mono" : ""}
          />
          {type === "secret" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleSecretVisibility(key)}
            >
              {showSecrets[key] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="api">API Keys</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic platform configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {renderSettingInput("site_name", "Site Name", "text", "The name displayed throughout the platform")}
            {renderSettingInput("support_email", "Support Email", "text", "Email address for support inquiries")}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pricing">
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Plans</CardTitle>
            <CardDescription>
              Configure subscription tiers and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {renderSettingInput("free_tier_limit", "Free Tier Property Limit", "number", "Maximum properties for free users")}
            {renderSettingInput("pro_tier_price", "Pro Tier Price (£/month)", "number")}
            {renderSettingInput("premium_tier_price", "Premium Tier Price (£/month)", "number")}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features">
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>
              Enable or disable platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {renderSettingInput("enable_mortgage_comparison", "Mortgage Comparison", "boolean", "Enable the mortgage comparison feature")}
            {renderSettingInput("enable_str_management", "STR Management", "boolean", "Enable short-term rental management")}
            {renderSettingInput("enable_network", "Deal Network", "boolean", "Enable the social deal network")}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>API Keys & Integrations</CardTitle>
            <CardDescription>
              Manage third-party API credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-600">
                API keys are sensitive. Handle with care.
              </span>
            </div>
            {renderSettingInput("propertydata_api_key", "PropertyData API Key", "secret")}
            {renderSettingInput("stripe_publishable_key", "Stripe Publishable Key", "secret")}
            {renderSettingInput("awin_publisher_id", "Awin Publisher ID", "text")}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

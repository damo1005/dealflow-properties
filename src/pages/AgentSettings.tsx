import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Palette, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { useWhiteLabelStore } from "@/stores/whiteLabelStore";
import { useToast } from "@/hooks/use-toast";

export default function AgentSettings() {
  const { toast } = useToast();
  const { config, updateConfig } = useWhiteLabelStore();
  const [formData, setFormData] = useState({
    company_name: config?.company_name || "",
    company_website: config?.company_website || "",
    primary_color: config?.primary_color || "#1e40af",
    secondary_color: config?.secondary_color || "#3b82f6",
    accent_color: config?.accent_color || "#10b981",
    custom_domain: config?.custom_domain || "",
  });

  const handleSave = () => {
    updateConfig(formData);
    toast({ title: "Settings saved successfully" });
  };

  return (
    <AppLayout title="Agency Settings">
      <div className="max-w-3xl space-y-6">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Branding
            </CardTitle>
            <CardDescription>
              Customize how your portal looks to landlord clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                  {config?.company_logo_url ? (
                    <img src={config.company_logo_url} alt="Logo" className="max-w-full max-h-full" />
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_website">Website</Label>
              <Input
                id="company_website"
                value={formData.company_website}
                onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                placeholder="https://yourcompany.co.uk"
              />
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Brand Colors
            </CardTitle>
            <CardDescription>
              Customize the color scheme of your client portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent_color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent_color"
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">Preview</p>
              <div className="flex gap-2">
                <Button style={{ backgroundColor: formData.primary_color }}>Primary Button</Button>
                <Button variant="outline" style={{ borderColor: formData.secondary_color, color: formData.secondary_color }}>
                  Secondary
                </Button>
                <Badge style={{ backgroundColor: formData.accent_color }}>Accent Badge</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Domain */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Custom Domain
            </CardTitle>
            <CardDescription>
              Use your own domain for the client portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom_domain">Domain</Label>
              <div className="flex gap-2">
                <Input
                  id="custom_domain"
                  value={formData.custom_domain}
                  onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                  placeholder="portal.yourcompany.co.uk"
                />
                <Button variant="outline">Verify</Button>
              </div>
            </div>

            {config?.domain_verified ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Domain Verified</p>
                  <p className="text-sm text-green-700">Your custom domain is active and working.</p>
                </div>
              </div>
            ) : formData.custom_domain ? (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-medium">DNS Configuration Required</p>
                <p className="text-sm text-muted-foreground">
                  Add the following CNAME record to your DNS:
                </p>
                <code className="block p-2 bg-background rounded text-sm">
                  {formData.custom_domain} → app.propertytracker.com
                </code>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">Agent Pro</p>
                  <Badge>Current Plan</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Up to {config?.max_clients || 50} clients • {config?.max_properties_per_client || 20} properties each
                </p>
              </div>
              <Button variant="outline">Upgrade Plan</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

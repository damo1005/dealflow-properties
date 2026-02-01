import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Link,
  Plus,
  Copy,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Lock,
  Calendar,
  BarChart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortfolioShare, CreateShareInput } from "@/types/sharing";
import { formatDistanceToNow, format, addDays } from "date-fns";

const PortfolioSharing = () => {
  const [shares, setShares] = useState<PortfolioShare[]>([
    {
      id: "share-1",
      user_id: "user-1",
      name: "Mortgage Application Summary",
      share_token: "abc123xyz",
      include_properties: true,
      include_financials: true,
      include_tenants: false,
      include_compliance: true,
      hide_addresses: false,
      password_hash: "hashedpassword",
      expires_at: addDays(new Date(), 27).toISOString(),
      view_count: 3,
      is_active: true,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newShare, setNewShare] = useState<CreateShareInput>({
    name: "",
    include_properties: true,
    include_financials: true,
    include_tenants: false,
    include_compliance: true,
    hide_addresses: false,
    expires_in_days: 30,
  });
  const { toast } = useToast();

  const baseUrl = window.location.origin;

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`${baseUrl}/share/${token}`);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleCreateShare = () => {
    const share: PortfolioShare = {
      id: `share-${Date.now()}`,
      user_id: "user-1",
      name: newShare.name,
      share_token: Math.random().toString(36).substring(2, 15),
      include_properties: newShare.include_properties,
      include_financials: newShare.include_financials,
      include_tenants: newShare.include_tenants,
      include_compliance: newShare.include_compliance,
      hide_addresses: newShare.hide_addresses,
      password_hash: newShare.password ? "hashed" : undefined,
      expires_at: newShare.expires_in_days
        ? addDays(new Date(), newShare.expires_in_days).toISOString()
        : undefined,
      view_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setShares((prev) => [...prev, share]);
    setShowCreateDialog(false);
    setNewShare({
      name: "",
      include_properties: true,
      include_financials: true,
      include_tenants: false,
      include_compliance: true,
      hide_addresses: false,
      expires_in_days: 30,
    });

    toast({
      title: "Share link created",
      description: "Your portfolio share link is ready",
    });
  };

  const toggleShareStatus = (shareId: string) => {
    setShares((prev) =>
      prev.map((s) => (s.id === shareId ? { ...s, is_active: !s.is_active } : s))
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Sharing</h1>
            <p className="text-muted-foreground">
              Create secure links to share your portfolio with lenders, partners, or investors
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Link
          </Button>
        </div>

        {/* Active Share Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Active Share Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shares.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No share links yet</p>
                <p className="text-sm">Create a link to share your portfolio</p>
              </div>
            ) : (
              shares.map((share) => (
                <div
                  key={share.id}
                  className="p-4 rounded-lg border space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{share.name}</h3>
                        {!share.is_active && (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">
                          {baseUrl}/share/{share.share_token}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyLink(share.share_token)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Switch
                      checked={share.is_active}
                      onCheckedChange={() => toggleShareStatus(share.id)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Includes:</span>
                      {share.include_properties && <Badge variant="outline">Properties</Badge>}
                      {share.include_financials && <Badge variant="outline">Financials</Badge>}
                      {share.include_compliance && <Badge variant="outline">Compliance</Badge>}
                      {share.include_tenants && <Badge variant="outline">Tenants</Badge>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {share.expires_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Expires: {format(new Date(share.expires_at), "dd MMM yyyy")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      <span>Views: {share.view_count}</span>
                    </div>
                    {share.password_hash && (
                      <div className="flex items-center gap-1">
                        <Lock className="h-4 w-4" />
                        <span>Password protected</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Create Share Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Share Link</DialogTitle>
              <DialogDescription>
                Create a secure link to share your portfolio
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Link Name</Label>
                <Input
                  placeholder="e.g. Mortgage Application Summary"
                  value={newShare.name}
                  onChange={(e) => setNewShare((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <Label>Include</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-properties" className="font-normal">
                      Property Details
                    </Label>
                    <Switch
                      id="include-properties"
                      checked={newShare.include_properties}
                      onCheckedChange={(checked) =>
                        setNewShare((p) => ({ ...p, include_properties: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-financials" className="font-normal">
                      Financials
                    </Label>
                    <Switch
                      id="include-financials"
                      checked={newShare.include_financials}
                      onCheckedChange={(checked) =>
                        setNewShare((p) => ({ ...p, include_financials: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-compliance" className="font-normal">
                      Compliance
                    </Label>
                    <Switch
                      id="include-compliance"
                      checked={newShare.include_compliance}
                      onCheckedChange={(checked) =>
                        setNewShare((p) => ({ ...p, include_compliance: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-tenants" className="font-normal">
                      Tenants
                    </Label>
                    <Switch
                      id="include-tenants"
                      checked={newShare.include_tenants}
                      onCheckedChange={(checked) =>
                        setNewShare((p) => ({ ...p, include_tenants: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hide-addresses" className="font-normal">
                  Hide full addresses (show postcode only)
                </Label>
                <Switch
                  id="hide-addresses"
                  checked={newShare.hide_addresses}
                  onCheckedChange={(checked) =>
                    setNewShare((p) => ({ ...p, hide_addresses: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Password (optional)</Label>
                <Input
                  type="password"
                  placeholder="Leave empty for no password"
                  value={newShare.password || ""}
                  onChange={(e) => setNewShare((p) => ({ ...p, password: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Expires after (days)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={newShare.expires_in_days || ""}
                  onChange={(e) =>
                    setNewShare((p) => ({
                      ...p,
                      expires_in_days: parseInt(e.target.value) || undefined,
                    }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateShare} disabled={!newShare.name}>
                Create Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default PortfolioSharing;

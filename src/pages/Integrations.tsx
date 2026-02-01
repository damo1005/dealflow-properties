import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  Check,
  ExternalLink,
  FileSpreadsheet,
  Cloud,
  MessageSquare,
  Home,
  CreditCard,
  Building,
  RefreshCw,
  Clock,
  Zap,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  comingSoon?: boolean;
  features: string[];
}

const integrations: Integration[] = [
  {
    id: "xero",
    name: "Xero",
    category: "Accounting",
    description: "Sync rental income, expenses, and invoices with your Xero account.",
    icon: <FileSpreadsheet className="h-8 w-8 text-[#13B5EA]" />,
    connected: false,
    features: [
      "Auto-sync rental income",
      "Import property expenses",
      "Generate tax reports",
      "Multi-property tracking",
    ],
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "Accounting",
    description: "Connect QuickBooks for seamless financial management and reporting.",
    icon: <FileSpreadsheet className="h-8 w-8 text-[#2CA01C]" />,
    connected: false,
    features: [
      "Automatic transaction sync",
      "Expense categorization",
      "Financial reports",
      "Invoice management",
    ],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "Storage",
    description: "Backup deal packs, contracts, and documents to Google Drive.",
    icon: <Cloud className="h-8 w-8 text-[#4285F4]" />,
    connected: false,
    features: [
      "Auto-backup documents",
      "Sync deal packs",
      "Store contracts",
      "Share with team",
    ],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    category: "Storage",
    description: "Store and share property documents securely in Dropbox.",
    icon: <Cloud className="h-8 w-8 text-[#0061FF]" />,
    connected: false,
    comingSoon: true,
    features: [
      "Document backup",
      "File sharing",
      "Version history",
      "Team collaboration",
    ],
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Get deal alerts and notifications directly in your Slack workspace.",
    icon: <MessageSquare className="h-8 w-8 text-[#4A154B]" />,
    connected: false,
    comingSoon: true,
    features: [
      "Deal Scout alerts",
      "Price drop notifications",
      "Team deal sharing",
      "Custom channels",
    ],
  },
  {
    id: "openrent",
    name: "OpenRent",
    category: "Property Management",
    description: "Sync tenant data and rental listings from OpenRent.",
    icon: <Home className="h-8 w-8 text-[#FF6B35]" />,
    connected: false,
    comingSoon: true,
    features: [
      "Import tenant details",
      "Sync rental payments",
      "Listing management",
      "Tenant communications",
    ],
  },
  {
    id: "arthur",
    name: "Arthur Online",
    category: "Property Management",
    description: "Connect your Arthur property management account.",
    icon: <Building className="h-8 w-8 text-[#1E3A5F]" />,
    connected: false,
    comingSoon: true,
    features: [
      "Portfolio sync",
      "Maintenance tracking",
      "Tenant management",
      "Financial reporting",
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    description: "Accept rent payments and manage subscriptions via Stripe.",
    icon: <CreditCard className="h-8 w-8 text-[#635BFF]" />,
    connected: false,
    comingSoon: true,
    features: [
      "Rent collection",
      "Payment tracking",
      "Automated reminders",
      "Receipt generation",
    ],
  },
];

const categories = ["All", "Accounting", "Storage", "Communication", "Property Management", "Payments"];

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedIntegrations = integrations.filter((i) => i.connected);

  const handleConnect = (integration: Integration) => {
    if (integration.comingSoon) {
      toast.info(`${integration.name} integration coming soon! We're working with ${integration.name} to bring this to you.`);
    } else {
      toast.info(`${integration.name} connection flow coming soon!`);
    }
  };

  const openDetails = (integration: Integration) => {
    setSelectedIntegration(integration);
    setDetailsOpen(true);
  };

  return (
    <AppLayout title="Integrations">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Integration Marketplace</h1>
          <p className="text-muted-foreground">
            Connect DealFlow with your favorite tools and services
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Integrations</TabsTrigger>
            <TabsTrigger value="connected">
              My Integrations ({connectedIntegrations.length})
            </TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Integration Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration) => (
                <Card
                  key={integration.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openDetails(integration)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {integration.icon}
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {integration.name}
                            {integration.comingSoon && (
                              <Badge variant="secondary" className="text-xs">
                                Coming Soon
                              </Badge>
                            )}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {integration.category}
                          </Badge>
                        </div>
                      </div>
                      {integration.connected && (
                        <Badge className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {integration.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={integration.connected ? "outline" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(integration);
                        }}
                        disabled={integration.connected}
                      >
                        {integration.connected ? "Connected" : "Connect"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(integration);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No integrations found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="connected" className="mt-6">
            {connectedIntegrations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No integrations connected</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your first integration to sync data automatically.
                  </p>
                  <Button onClick={() => document.querySelector('[value="all"]')?.dispatchEvent(new Event('click'))}>
                    Browse Integrations
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectedIntegrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {integration.icon}
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Last synced: Just now
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </Button>
                        <Button size="sm" variant="ghost">
                          Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="automations" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Automations coming soon</h3>
                <p className="text-muted-foreground mb-4">
                  Create automated workflows between your connected apps. For example:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• When a deal is added → Create Xero invoice</li>
                  <li>• When Scout finds deal → Send Slack notification</li>
                  <li>• When deal pack is created → Backup to Drive</li>
                </ul>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Detail Modal */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          {selectedIntegration && (
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  {selectedIntegration.icon}
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      {selectedIntegration.name}
                      {selectedIntegration.comingSoon && (
                        <Badge variant="secondary">Coming Soon</Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription>{selectedIntegration.category}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedIntegration.description}</p>

                <div>
                  <h4 className="font-semibold mb-2">What you can do:</h4>
                  <ul className="space-y-2">
                    {selectedIntegration.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => handleConnect(selectedIntegration)}
                    disabled={selectedIntegration.connected}
                  >
                    {selectedIntegration.connected
                      ? "Already Connected"
                      : selectedIntegration.comingSoon
                      ? "Coming Soon"
                      : "Connect"}
                  </Button>
                  {!selectedIntegration.comingSoon && (
                    <Button variant="outline" asChild>
                      <a href="#" target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </AppLayout>
  );
}

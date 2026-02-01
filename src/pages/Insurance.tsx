import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsuranceWizard } from "@/components/insurance/InsuranceWizard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Clock, Plus, ArrowRight, Star, AlertTriangle, Eye, RefreshCw } from "lucide-react";
import { useInsuranceStore } from "@/stores/insuranceStore";

const Insurance = () => {
  const { policies, getExpiringPolicies } = useInsuranceStore();
  const expiringPolicies = getExpiringPolicies(90);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <AppLayout title="Insurance Manager">
      <div className="space-y-6">
        {/* Renewal Alerts */}
        {expiringPolicies.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Renewal Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {expiringPolicies.map((policy) => (
                <div key={policy.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium">{policy.property_address}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires in {getDaysUntilExpiry(policy.end_date!)} days
                    </p>
                  </div>
                  <Button size="sm">Get Quotes</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="policies" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="policies" className="gap-2">
              <Shield className="h-4 w-4 hidden sm:block" />
              My Policies
            </TabsTrigger>
            <TabsTrigger value="get-quote" className="gap-2">
              <Plus className="h-4 w-4 hidden sm:block" />
              Get Quote
            </TabsTrigger>
            <TabsTrigger value="saved-quotes" className="gap-2">
              <FileText className="h-4 w-4 hidden sm:block" />
              Saved Quotes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="mt-6">
            <div className="space-y-4">
              {policies.map((policy) => {
                const daysLeft = policy.end_date ? getDaysUntilExpiry(policy.end_date) : null;
                const isExpiringSoon = daysLeft !== null && daysLeft <= 60;

                return (
                  <Card key={policy.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{policy.property_address}</h3>
                            {isExpiringSoon && (
                              <Badge variant="destructive" className="text-xs">
                                Renews in {daysLeft} days
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {policy.provider} - Landlord Insurance
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">{policy.status}</Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Buildings</p>
                          <p className="font-medium">{policy.buildings_cover ? formatCurrency(policy.buildings_cover) : '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contents</p>
                          <p className="font-medium">{policy.contents_cover ? formatCurrency(policy.contents_cover) : '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Liability</p>
                          <p className="font-medium">{policy.liability_cover ? formatCurrency(policy.liability_cover) : '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Premium</p>
                          <p className="font-medium">{policy.annual_premium ? `${formatCurrency(policy.annual_premium)}/yr` : '-'}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Policy
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Get Renewal Quotes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {policies.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Policies Found</h3>
                    <p className="text-muted-foreground mb-4">Add your existing policies or get new quotes.</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Policy
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="get-quote" className="mt-6">
            <InsuranceWizard />
          </TabsContent>

          <TabsContent value="saved-quotes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Quotes</CardTitle>
                <CardDescription>Your saved insurance quotes (valid for 14 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Saved Quotes</h3>
                  <p className="text-muted-foreground mb-4">
                    Get a quote and save it to view it later
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Get a Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          {[
            { icon: Shield, label: "FCA Regulated", value: "All providers" },
            { icon: Star, label: "Average Rating", value: "4.3★ Trustpilot" },
            { icon: Clock, label: "Get Quotes", value: "In 2 minutes" },
            { icon: FileText, label: "Policies Compared", value: "50,000+" },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-4">
                <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Insurance;

import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsuranceWizard } from "@/components/insurance/InsuranceWizard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Shield, FileText, Clock, Plus, ArrowRight, Star } from "lucide-react";

const Insurance = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Landlord Insurance Comparison</h1>
          <p className="text-muted-foreground text-lg">
            Compare quotes and protect your investment
          </p>
          <p className="text-sm text-muted-foreground">
            Get the right cover at the best price. Compare UK's leading landlord insurers.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="get-quote" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="get-quote" className="gap-2">
              <Plus className="h-4 w-4 hidden sm:block" />
              Get Quote
            </TabsTrigger>
            <TabsTrigger value="saved-quotes" className="gap-2">
              <FileText className="h-4 w-4 hidden sm:block" />
              Saved Quotes
            </TabsTrigger>
            <TabsTrigger value="my-policies" className="gap-2">
              <Shield className="h-4 w-4 hidden sm:block" />
              My Policies
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="my-policies" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Insurance Policies</CardTitle>
                <CardDescription>Track and manage your active policies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Policies</h3>
                  <p className="text-muted-foreground mb-4">
                    Get protected - compare insurance quotes
                  </p>
                  <Button>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Compare Quotes
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

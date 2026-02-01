import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConveyancingWizard } from "@/components/conveyancing/ConveyancingWizard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, FileText, Clock, Plus, ArrowRight, Shield, Star } from "lucide-react";

const Conveyancing = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Conveyancing Solicitors Comparison</h1>
          <p className="text-muted-foreground text-lg">
            Compare quotes from CQS accredited conveyancing solicitors
          </p>
          <p className="text-sm text-muted-foreground">
            Get instant quotes. Fixed fees. No hidden costs. Complete faster.
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
            <TabsTrigger value="my-cases" className="gap-2">
              <Scale className="h-4 w-4 hidden sm:block" />
              My Cases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="get-quote" className="mt-6">
            <ConveyancingWizard />
          </TabsContent>

          <TabsContent value="saved-quotes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Quotes</CardTitle>
                <CardDescription>Your saved conveyancing quotes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Saved Quotes</h3>
                  <p className="text-muted-foreground mb-4">
                    Get a quote and save it to view later
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Get a Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-cases" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Conveyancing Cases</CardTitle>
                <CardDescription>Track your active conveyancing matters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Scale className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Cases</h3>
                  <p className="text-muted-foreground mb-4">
                    Instruct a solicitor to start tracking your case
                  </p>
                  <Button>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Get Quotes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          {[
            { icon: Shield, label: "SRA Regulated", value: "All solicitors" },
            { icon: Star, label: "Average Rating", value: "4.6★ Trustpilot" },
            { icon: Clock, label: "Avg Completion", value: "56 days" },
            { icon: FileText, label: "Cases Completed", value: "25,000+" },
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

export default Conveyancing;

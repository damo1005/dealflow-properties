import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, Users, PoundSterling, Shield, Wrench } from "lucide-react";
import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview";
import { PortfolioProperties } from "@/components/portfolio/PortfolioProperties";
import { PortfolioTenants } from "@/components/portfolio/PortfolioTenants";
import { PortfolioFinancials } from "@/components/portfolio/PortfolioFinancials";
import { PortfolioCompliance } from "@/components/portfolio/PortfolioCompliance";
import { PortfolioMaintenance } from "@/components/portfolio/PortfolioMaintenance";
import { AddPropertyDialog } from "@/components/portfolio/AddPropertyDialog";
import {
  usePortfolioStore,
  mockPortfolioProperties,
  mockTenancies,
  mockCompliance,
  mockMaintenance,
  mockPortfolioSummary,
} from "@/stores/portfolioStore";

const Portfolio = () => {
  const [showAddProperty, setShowAddProperty] = useState(false);
  const {
    setProperties,
    setTenancies,
    setCompliance,
    setMaintenance,
    setSummary,
  } = usePortfolioStore();

  useEffect(() => {
    // Load mock data
    setProperties(mockPortfolioProperties);
    setTenancies(mockTenancies);
    setCompliance(mockCompliance);
    setMaintenance(mockMaintenance);
    setSummary(mockPortfolioSummary);
  }, [setProperties, setTenancies, setCompliance, setMaintenance, setSummary]);

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Portfolio</h1>
            <p className="text-muted-foreground">
              Track and manage your property investments
            </p>
          </div>
          <Button onClick={() => setShowAddProperty(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutGrid className="h-4 w-4 hidden sm:block" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2">
              <LayoutGrid className="h-4 w-4 hidden sm:block" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="tenants" className="gap-2">
              <Users className="h-4 w-4 hidden sm:block" />
              Tenants
            </TabsTrigger>
            <TabsTrigger value="financials" className="gap-2">
              <PoundSterling className="h-4 w-4 hidden sm:block" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <Shield className="h-4 w-4 hidden sm:block" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2">
              <Wrench className="h-4 w-4 hidden sm:block" />
              Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <PortfolioOverview />
          </TabsContent>

          <TabsContent value="properties" className="mt-6">
            <PortfolioProperties onAddClick={() => setShowAddProperty(true)} />
          </TabsContent>

          <TabsContent value="tenants" className="mt-6">
            <PortfolioTenants />
          </TabsContent>

          <TabsContent value="financials" className="mt-6">
            <PortfolioFinancials />
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <PortfolioCompliance />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6">
            <PortfolioMaintenance />
          </TabsContent>
        </Tabs>
      </div>

      <AddPropertyDialog
        open={showAddProperty}
        onOpenChange={setShowAddProperty}
      />
    </AppLayout>
  );
};

export default Portfolio;

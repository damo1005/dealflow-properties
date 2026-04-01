import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, Users, PoundSterling, Shield, Wrench, Building2 } from "lucide-react";
import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview";
import { PortfolioProperties } from "@/components/portfolio/PortfolioProperties";
import { PortfolioTenants } from "@/components/portfolio/PortfolioTenants";
import { PortfolioFinancials } from "@/components/portfolio/PortfolioFinancials";
import { PortfolioCompliance } from "@/components/portfolio/PortfolioCompliance";
import { PortfolioMaintenance } from "@/components/portfolio/PortfolioMaintenance";
import { AddPropertyDialog } from "@/components/portfolio/AddPropertyDialog";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Portfolio = () => {
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    properties,
    setProperties,
    setTenancies,
    setCompliance,
    setMaintenance,
    setSummary,
  } = usePortfolioStore();

  useEffect(() => {
    if (!user) return;

    const fetchPortfolio = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("portfolio_properties")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Map DB rows to the store shape
        const mapped = (data || []).map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          address: p.address || p.property_name || "Untitled",
          postcode: p.postcode || "",
          property_type: p.property_type || "Other",
          bedrooms: p.bedrooms || 0,
          purchase_date: p.purchase_date || p.created_at,
          purchase_price: p.purchase_price || 0,
          current_value: p.current_value || p.purchase_price || 0,
          mortgage_lender: p.mortgage_lender || null,
          mortgage_amount: p.mortgage_amount || 0,
          mortgage_rate: p.mortgage_rate || 0,
          monthly_payment: p.monthly_payment || 0,
          tenure: p.tenure || "Unknown",
          lease_years: p.lease_years || null,
          investment_strategy: p.strategy || "SA",
          property_status: p.status || "active",
          total_income_ytd: 0,
          total_expenses_ytd: 0,
          current_yield: 0,
          images: [],
          created_at: p.created_at,
          updated_at: p.updated_at || p.created_at,
        }));

        setProperties(mapped);
        setTenancies([]);
        setCompliance([]);
        setMaintenance([]);
        setSummary(null);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 space-y-6 max-w-7xl">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (properties.length === 0) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center py-20 border rounded-lg border-dashed">
            <Building2 className="h-14 w-14 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your SA portfolio will appear here</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Add your first property to get started tracking your serviced accommodation portfolio, compliance, and financials.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowAddProperty(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/deal-analyser")}>
                Analyse a Deal
              </Button>
            </div>
          </div>
          <AddPropertyDialog
            open={showAddProperty}
            onOpenChange={setShowAddProperty}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Portfolio</h1>
            <p className="text-muted-foreground">
              Track and manage your SA property investments
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

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContractorStore, filterContractors } from "@/stores/contractorStore";
import { ContractorCard } from "@/components/contractors/ContractorCard";
import { ContractorFilters } from "@/components/contractors/ContractorFilters";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

const Contractors = () => {
  const {
    categories,
    setCategories,
    contractors,
    setContractors,
    filters,
    isLoading,
    setIsLoading,
  } = useContractorStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load categories
      const { data: catData, error: catError } = await supabase
        .from('contractor_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (catError) throw catError;
      setCategories((catData || []) as any);

      // Load contractors
      const { data: conData, error: conError } = await supabase
        .from('contractors')
        .select('*')
        .eq('is_active', true)
        .eq('is_vetted', true)
        .order('avg_rating', { ascending: false });
      
      if (conError) throw conError;
      setContractors((conData || []) as any);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load contractors');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContractors = filterContractors(contractors, filters).filter(c => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        c.business_name.toLowerCase().includes(query) ||
        c.bio?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Find Trusted Tradespeople</h1>
          <p className="text-muted-foreground">
            Vetted contractors for landlords. Get quotes. Book jobs.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contractors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post a Job Request
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <ContractorFilters categories={categories} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredContractors.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No contractors found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or expanding your search area
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {filteredContractors.length} contractor{filteredContractors.length !== 1 ? 's' : ''} found
                </p>
                {filteredContractors.map((contractor) => (
                  <ContractorCard
                    key={contractor.id}
                    contractor={contractor}
                    onViewProfile={() => toast.info("View profile coming soon")}
                    onRequestQuote={() => toast.info("Request quote coming soon")}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contractors;

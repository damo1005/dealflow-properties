import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, Zap, MapPin, BarChart3, RefreshCw } from "lucide-react";
import { useDealScoutStore } from "@/stores/dealScoutStore";
import { ScoutsList } from "@/components/dealscout/ScoutsList";
import { DiscoveriesList } from "@/components/dealscout/DiscoveriesList";
import { OffMarketTab } from "@/components/dealscout/OffMarketTab";
import { MarketIntelTab } from "@/components/dealscout/MarketIntelTab";
import { CreateScoutWizard } from "@/components/dealscout/CreateScoutWizard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DealScout() {
  const [activeTab, setActiveTab] = useState("scouts");
  const [isScanning, setIsScanning] = useState(false);
  const { scouts, discoveries, setWizardOpen, wizardOpen } = useDealScoutStore();
  const { toast } = useToast();

  // Calculate stats
  const activeScoutsCount = scouts.filter(s => s.is_active).length;
  const todayDeals = discoveries.filter(d => {
    const today = new Date();
    const discovered = new Date(d.discovered_at);
    return discovered.toDateString() === today.toDateString();
  }).length;
  const weekDeals = discoveries.filter(d => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(d.discovered_at) >= weekAgo;
  }).length;

  const handleScanNow = async () => {
    if (activeScoutsCount === 0) {
      toast({
        title: "No Active Scouts",
        description: "Create a scout first to start scanning for properties.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('scan-deal-scouts', {
        body: {},
      });

      if (error) throw error;

      toast({
        title: "Scan Complete! 🎯",
        description: `Found ${data.totalPropertiesFound} properties, ${data.totalNewDiscoveries} new discoveries.`,
      });

      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan for properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <AppLayout title="AI Deal Scout">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              AI Deal Scout
            </h1>
            <p className="text-muted-foreground">
              Let AI hunt properties for you 24/7
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={handleScanNow}
              disabled={isScanning || activeScoutsCount === 0}
            >
              <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan Now'}
            </Button>
            <Button onClick={() => setWizardOpen(true)} size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Scout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">{activeScoutsCount}</div>
            <div className="text-sm text-muted-foreground">Active Scouts</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{todayDeals}</div>
            <div className="text-sm text-muted-foreground">Deals Found Today</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">{weekDeals}</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {discoveries.length > 0 
                ? Math.round(discoveries.reduce((acc, d) => acc + d.overall_score, 0) / discoveries.length)
                : 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scouts" className="gap-2">
              <Zap className="h-4 w-4" />
              My Scouts
            </TabsTrigger>
            <TabsTrigger value="discoveries" className="gap-2">
              <Search className="h-4 w-4" />
              Discovered Deals
            </TabsTrigger>
            <TabsTrigger value="offmarket" className="gap-2">
              <MapPin className="h-4 w-4" />
              Off-Market
            </TabsTrigger>
            <TabsTrigger value="intel" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Market Intel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scouts" className="mt-6">
            <ScoutsList />
          </TabsContent>

          <TabsContent value="discoveries" className="mt-6">
            <DiscoveriesList />
          </TabsContent>

          <TabsContent value="offmarket" className="mt-6">
            <OffMarketTab />
          </TabsContent>

          <TabsContent value="intel" className="mt-6">
            <MarketIntelTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Scout Wizard */}
      <CreateScoutWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </AppLayout>
  );
}

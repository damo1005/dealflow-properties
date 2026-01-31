import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RefreshCw, Users, Hammer, Building2, Save, Download, Link2, Copy, RotateCcw, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BTLCalculator } from "@/components/calculators/BTLCalculator";
import { BRRCalculator } from "@/components/calculators/BRRCalculator";
import { HMOCalculator } from "@/components/calculators/HMOCalculator";
import { FlipCalculator } from "@/components/calculators/FlipCalculator";
import { CommercialCalculator } from "@/components/calculators/CommercialCalculator";
import { useCalculatorStore } from "@/stores/calculatorStore";
import { useToast } from "@/hooks/use-toast";

const calculatorTabs = [
  { id: "btl", label: "Buy-to-Let", icon: Home },
  { id: "brr", label: "BRR", icon: RefreshCw },
  { id: "hmo", label: "HMO", icon: Users },
  { id: "flip", label: "Flip", icon: Hammer },
  { id: "commercial", label: "Commercial", icon: Building2 },
] as const;

export default function Calculators() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, resetBTL, resetBRR, resetHMO, resetFlip } = useCalculatorStore();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Calculation saved",
      description: "Your calculation has been saved to your account.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Your calculation report is being generated.",
    });
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard.",
    });
  };

  const handleReset = () => {
    switch (activeTab) {
      case "btl":
        resetBTL();
        break;
      case "brr":
        resetBRR();
        break;
      case "hmo":
        resetHMO();
        break;
      case "flip":
        resetFlip();
        break;
    }
    toast({
      title: "Calculator reset",
      description: "All inputs have been reset to defaults.",
    });
  };

  return (
    <AppLayout title="Investment Calculators">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-muted-foreground">
            Analyze potential deals with our investment calculators
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Copy share link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSave}>
                  <Copy className="mr-2 h-4 w-4" />
                  Clone calculation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2" 
              onClick={() => navigate("/scenarios?from=calculator")}
            >
              <TrendingUp className="h-4 w-4" />
              What If?
            </Button>
          </div>
        </div>

        {/* Calculator Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            {calculatorTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-background"
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="btl" className="mt-0">
            <BTLCalculator />
          </TabsContent>

          <TabsContent value="brr" className="mt-0">
            <BRRCalculator />
          </TabsContent>

          <TabsContent value="hmo" className="mt-0">
            <HMOCalculator />
          </TabsContent>

          <TabsContent value="flip" className="mt-0">
            <FlipCalculator />
          </TabsContent>

          <TabsContent value="commercial" className="mt-0">
            <CommercialCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

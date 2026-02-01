import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Save,
  Trash2,
  Download,
  Trophy,
  FileText,
  Bell,
  Share2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useComparisonStore, calculatePropertyMetrics } from "@/stores/comparisonStore";
import { EmptyComparison } from "@/components/comparison/EmptyComparison";
import { PropertySearchModal } from "@/components/comparison/PropertySearchModal";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { CalculatorBar } from "@/components/comparison/CalculatorBar";
import { AddPropertySlot } from "@/components/comparison/AddPropertySlot";
import { SaveComparisonDialog } from "@/components/comparison/SaveComparisonDialog";
import { WinnerSummaryCards } from "@/components/comparison/WinnerSummaryCards";
import { DecisionDialog } from "@/components/comparison/DecisionDialog";
import { InvestmentMemoDialog } from "@/components/comparison/InvestmentMemoDialog";
import type { ComparisonProperty } from "@/types/comparison";

export default function Compare() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [showMemoDialog, setShowMemoDialog] = useState(false);
  const { toast } = useToast();

  const {
    properties,
    calculatorInputs,
    addProperty,
    removeProperty,
    clearAll,
    updatePropertyCalculations,
  } = useComparisonStore();

  // Calculate metrics for all properties on mount and input change
  const recalculateAll = useCallback(() => {
    properties.forEach((property) => {
      const metrics = calculatePropertyMetrics(property, calculatorInputs);
      updatePropertyCalculations(property.id, metrics);
    });
  }, [properties.length, calculatorInputs]);

  useEffect(() => {
    if (properties.length > 0) {
      recalculateAll();
    }
  }, [calculatorInputs]);

  // Calculate on property add
  const handleAddProperties = (newProperties: ComparisonProperty[]) => {
    newProperties.forEach((property) => {
      const metrics = calculatePropertyMetrics(property, calculatorInputs);
      addProperty({ ...property, ...metrics });
    });
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all properties from comparison?")) {
      clearAll();
    }
  };

  const handleExportCSV = () => {
    const headers = ["Property", "Price", "Rent", "Yield %", "Cash Flow", "ROI %"];
    const rows = properties.map((p) => [
      p.address,
      p.price,
      p.estimatedRent,
      p.calculatedYield?.toFixed(2),
      p.calculatedCashFlow,
      p.calculatedROI?.toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "property-comparison.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "CSV file downloaded successfully.",
    });
  };

  const handleDecisionMade = (chosenId: string, ranking: string[], reasons: string[]) => {
    toast({
      title: "Decision recorded!",
      description: "Your property choice has been saved.",
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && properties.length >= 2) {
        e.preventDefault();
        setShowSaveDialog(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "r" && properties.length >= 2) {
        e.preventDefault();
        setShowDecisionDialog(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "m" && properties.length >= 2) {
        e.preventDefault();
        setShowMemoDialog(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [properties.length]);

  const maxProperties = 4;
  const remainingSlots = maxProperties - properties.length;

  return (
    <AppLayout title="Compare Properties">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Compare Properties</h1>
              {properties.length >= 2 && (
                <Badge variant="secondary">
                  Comparing {properties.length} properties
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Side-by-side analysis with intelligent diff highlighting
            </p>
          </div>

          {properties.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearchModal(true)}
                disabled={properties.length >= maxProperties}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>

              {properties.length >= 2 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDecisionDialog(true)}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Rank
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleExportCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowMemoDialog(true)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Investment Memo
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                disabled={properties.length < 2}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <EmptyComparison onAddProperty={() => setShowSearchModal(true)} />
        )}

        {/* Properties with slots when only 1 property */}
        {properties.length > 0 && properties.length < 2 && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {Array.from({ length: remainingSlots }).map((_, i) => (
              <AddPropertySlot
                key={i}
                slotNumber={properties.length + i + 1}
                onClick={() => setShowSearchModal(true)}
              />
            ))}
          </div>
        )}

        {/* Winner Summary Cards */}
        {properties.length >= 2 && <WinnerSummaryCards properties={properties} />}

        {/* Calculator Bar (when 2+ properties) */}
        {properties.length >= 2 && <CalculatorBar onCalculate={recalculateAll} />}

        {/* Comparison Table */}
        {properties.length >= 2 && (
          <ComparisonTable properties={properties} onRemove={removeProperty} />
        )}

        {/* Property Search Modal */}
        <PropertySearchModal
          open={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelect={handleAddProperties}
          excludeIds={properties.map((p) => p.id)}
          maxSelect={remainingSlots}
        />

        {/* Save Dialog */}
        <SaveComparisonDialog
          open={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
        />

        {/* Decision Dialog */}
        <DecisionDialog
          open={showDecisionDialog}
          onOpenChange={setShowDecisionDialog}
          properties={properties}
          onDecisionMade={handleDecisionMade}
        />

        {/* Investment Memo Dialog */}
        <InvestmentMemoDialog
          open={showMemoDialog}
          onOpenChange={setShowMemoDialog}
          properties={properties}
        />
      </div>
    </AppLayout>
  );
}

import { useState, useEffect, useCallback } from "react";
import { Plus, Save, Trash2, Download } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useComparisonStore, calculatePropertyMetrics } from "@/stores/comparisonStore";
import { EmptyComparison } from "@/components/comparison/EmptyComparison";
import { PropertySearchModal } from "@/components/comparison/PropertySearchModal";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { CalculatorBar } from "@/components/comparison/CalculatorBar";
import { AddPropertySlot } from "@/components/comparison/AddPropertySlot";
import { SaveComparisonDialog } from "@/components/comparison/SaveComparisonDialog";
import type { ComparisonProperty } from "@/types/comparison";

export default function Compare() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
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
    // Simple CSV export
    const headers = ["Property", "Price", "Rent", "Yield %", "Cash Flow", "ROI %"];
    const rows = properties.map((p) => [
      p.address,
      p.price,
      p.estimatedRent,
      p.calculatedYield,
      p.calculatedCashFlow,
      p.calculatedROI,
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
            <h1 className="text-2xl font-bold">Compare Properties</h1>
            <p className="text-muted-foreground">
              Compare 2-4 properties side-by-side with intelligent diff highlighting
            </p>
          </div>

          {properties.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearchModal(true)}
                disabled={properties.length >= maxProperties}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
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

        {/* Properties with slots */}
        {properties.length > 0 && properties.length < 2 && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {/* Existing properties would show as cards here */}
            {Array.from({ length: remainingSlots }).map((_, i) => (
              <AddPropertySlot
                key={i}
                slotNumber={properties.length + i + 1}
                onClick={() => setShowSearchModal(true)}
              />
            ))}
          </div>
        )}

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
      </div>
    </AppLayout>
  );
}

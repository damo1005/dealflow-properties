import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ComparisonHeader } from "./ComparisonHeader";
import { ComparisonTableRow } from "./ComparisonTableRow";
import type { ComparisonProperty } from "@/types/comparison";
import { getRowsByCategory } from "@/lib/comparisonUtils";
import { useComparisonStore } from "@/stores/comparisonStore";

interface ComparisonTableProps {
  properties: ComparisonProperty[];
  onRemove: (id: string) => void;
}

const categoryLabels = {
  all: "All",
  financial: "Financial",
  property: "Property",
  location: "Location",
  investment: "Investment",
};

export function ComparisonTable({ properties, onRemove }: ComparisonTableProps) {
  const {
    selectedCategory,
    setSelectedCategory,
    showOnlyDifferences,
    setShowOnlyDifferences,
  } = useComparisonStore();

  const rows = getRowsByCategory(selectedCategory);

  // Filter rows if showing only differences
  const filteredRows = showOnlyDifferences
    ? rows.filter((row) => {
        const values = properties.map((p) => row.getValue(p));
        const uniqueValues = new Set(values.map((v) => JSON.stringify(v)));
        return uniqueValues.size > 1;
      })
    : rows;

  // Group rows by category for display
  const groupedRows = selectedCategory === "all"
    ? Object.entries(
        filteredRows.reduce((acc, row) => {
          if (!acc[row.category]) acc[row.category] = [];
          acc[row.category].push(row);
          return acc;
        }, {} as Record<string, typeof filteredRows>)
      )
    : [[selectedCategory, filteredRows] as const];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Comparison Details</CardTitle>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="show-diff"
                checked={showOnlyDifferences}
                onCheckedChange={setShowOnlyDifferences}
              />
              <Label htmlFor="show-diff" className="text-sm">
                Show only differences
              </Label>
            </div>

            <Tabs
              value={selectedCategory}
              onValueChange={(v) => setSelectedCategory(v as typeof selectedCategory)}
            >
              <TabsList>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="min-w-[600px]">
            {/* Property Headers */}
            <div className="p-4 border-b bg-muted/30">
              <ComparisonHeader properties={properties} onRemove={onRemove} />
            </div>

            {/* Comparison Rows */}
            <div>
              {groupedRows.map(([category, categoryRows]) => (
                <div key={category}>
                  {selectedCategory === "all" && (
                    <div
                      className="grid bg-muted/50 border-b"
                      style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}
                    >
                      <div className="sticky left-0 z-10 bg-muted/50 px-4 py-2 font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </div>
                      {properties.map((p) => (
                        <div key={p.id} />
                      ))}
                    </div>
                  )}
                  {categoryRows.map((row) => (
                    <ComparisonTableRow key={row.key} row={row} properties={properties} />
                  ))}
                </div>
              ))}
            </div>

            {filteredRows.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No differences found between properties
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

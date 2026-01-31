import { Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyComparisonProps {
  onAddProperty: () => void;
}

export function EmptyComparison({ onAddProperty }: EmptyComparisonProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Compare Properties Side-by-Side</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Add 2-4 properties to compare their financial metrics, features, and investment
          potential with intelligent diff highlighting.
        </p>

        <Button size="lg" onClick={onAddProperty}>
          <Plus className="h-5 w-5 mr-2" />
          Add Properties to Compare
        </Button>

        <div className="mt-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 dark:text-green-400 font-bold">1</span>
            </div>
            <p className="text-sm text-muted-foreground">Add properties</p>
          </div>
          <div>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
            </div>
            <p className="text-sm text-muted-foreground">Run calculations</p>
          </div>
          <div>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
            </div>
            <p className="text-sm text-muted-foreground">Find the winner</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

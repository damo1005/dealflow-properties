import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CommercialCalculator() {
  return (
    <Card className="shadow-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Commercial Calculator
        </h3>
        <p className="text-muted-foreground max-w-md mb-4">
          Commercial property analysis tools are coming soon. This will include retail, office, and industrial property calculations.
        </p>
      </CardContent>
    </Card>
  );
}

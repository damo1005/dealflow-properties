import { Calculator, PoundSterling } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CostEstimates } from "@/types/voiceNotes";
import { formatCurrency } from "@/services/propertyDataApi";
import { useNavigate } from "react-router-dom";

interface CostEstimatesCardProps {
  estimates: CostEstimates;
}

export function CostEstimatesCard({ estimates }: CostEstimatesCardProps) {
  const navigate = useNavigate();

  const cosmeticTotal = estimates.cosmetic.reduce((sum, item) => sum + item.cost, 0);
  const essentialTotal = estimates.essential.reduce((sum, item) => sum + item.cost, 0);
  const upgradesTotal = estimates.upgrades.reduce((sum, item) => sum + item.cost, 0);

  const renderCostTable = (items: { item: string; cost: number }[], total: number) => {
    if (items.length === 0) {
      return <p className="text-muted-foreground text-sm italic">No items identified</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Estimated Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.item}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.cost)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium bg-muted/50">
            <TableCell>Subtotal</TableCell>
            <TableCell className="text-right">{formatCurrency(total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <Accordion type="single" collapsible defaultValue="costs">
        <AccordionItem value="costs" className="border-none">
          <CardHeader className="pb-0">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Cost Estimates</CardTitle>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(estimates.total)}
                </span>
              </div>
            </AccordionTrigger>
          </CardHeader>

          <AccordionContent>
            <CardContent className="pt-4 space-y-6">
              {/* Cosmetic */}
              <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground">Cosmetic Work</h4>
                {renderCostTable(estimates.cosmetic, cosmeticTotal)}
              </div>

              {/* Essential */}
              <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground">Essential Repairs</h4>
                {renderCostTable(estimates.essential, essentialTotal)}
              </div>

              {/* Upgrades */}
              <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground">Optional Upgrades</h4>
                {renderCostTable(estimates.upgrades, upgradesTotal)}
              </div>

              {/* Grand Total */}
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PoundSterling className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Grand Total</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(estimates.total)}
                  </span>
                </div>
              </div>

              {/* Add to Calculator Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/calculators/brr")}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Add to Refurb Calculator
              </Button>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

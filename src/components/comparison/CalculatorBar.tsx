import { Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { useComparisonStore, calculatePropertyMetrics } from "@/stores/comparisonStore";

interface CalculatorBarProps {
  onCalculate: () => void;
}

export function CalculatorBar({ onCalculate }: CalculatorBarProps) {
  const { calculatorInputs, updateCalculatorInputs, properties, updatePropertyCalculations } =
    useComparisonStore();

  const handleCalculateAll = () => {
    properties.forEach((property) => {
      const metrics = calculatePropertyMetrics(property, calculatorInputs);
      updatePropertyCalculations(property.id, metrics);
    });
    onCalculate();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px] space-y-2">
            <Label className="text-xs">Deposit: {calculatorInputs.depositPercent}%</Label>
            <Slider
              value={[calculatorInputs.depositPercent]}
              onValueChange={([v]) => updateCalculatorInputs({ depositPercent: v })}
              min={5}
              max={50}
              step={5}
            />
          </div>

          <div className="w-28 space-y-1">
            <Label htmlFor="rate" className="text-xs">
              Mortgage Rate %
            </Label>
            <Input
              id="rate"
              type="number"
              step="0.1"
              value={calculatorInputs.mortgageRate}
              onChange={(e) =>
                updateCalculatorInputs({ mortgageRate: parseFloat(e.target.value) || 0 })
              }
              className="h-9"
            />
          </div>

          <div className="w-28 space-y-1">
            <Label htmlFor="mgmt" className="text-xs">
              Management %
            </Label>
            <Input
              id="mgmt"
              type="number"
              value={calculatorInputs.managementFee}
              onChange={(e) =>
                updateCalculatorInputs({ managementFee: parseFloat(e.target.value) || 0 })
              }
              className="h-9"
            />
          </div>

          <div className="w-28 space-y-1">
            <Label htmlFor="void" className="text-xs">
              Void %
            </Label>
            <Input
              id="void"
              type="number"
              value={calculatorInputs.voidPercent}
              onChange={(e) =>
                updateCalculatorInputs({ voidPercent: parseFloat(e.target.value) || 0 })
              }
              className="h-9"
            />
          </div>

          <Button onClick={handleCalculateAll} className="h-9">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

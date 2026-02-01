import { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Target, ArrowRight, CheckCircle2, AlertCircle, XCircle, Zap } from "lucide-react";
import type { BTLInputs } from "@/stores/calculatorStore";
import { calculateBTLResults } from "@/stores/calculatorStore";
import { formatCurrency } from "@/lib/scenarioConfig";
import { cn } from "@/lib/utils";

interface GoalSeekerDialogProps {
  open: boolean;
  onClose: () => void;
  baseInputs: BTLInputs;
  onApplyResult: (changes: Partial<BTLInputs>) => void;
}

type GoalType = "cashFlow" | "roi" | "yield" | "maxCash";
type AdjustVariable = "purchasePrice" | "monthlyRent" | "depositPercent" | "mortgageRate";

interface GoalSeekResult {
  requiredValue: number | null;
  achievable: boolean;
  feasibilityScore: number;
  feasibilityLabel: string;
}

interface AlternativeSolution {
  variable: AdjustVariable;
  label: string;
  requiredValue: number;
  feasibilityScore: number;
  feasibilityLabel: string;
  description: string;
}

export function GoalSeekerDialog({
  open,
  onClose,
  baseInputs,
  onApplyResult,
}: GoalSeekerDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [goalType, setGoalType] = useState<GoalType>("cashFlow");
  const [targetValue, setTargetValue] = useState(500);
  const [adjustVariable, setAdjustVariable] = useState<AdjustVariable>("purchasePrice");
  const [result, setResult] = useState<GoalSeekResult | null>(null);
  const [alternatives, setAlternatives] = useState<AlternativeSolution[]>([]);

  const currentMetrics = useMemo(() => calculateBTLResults(baseInputs), [baseInputs]);

  const goalConfig: Record<GoalType, { label: string; unit: string; current: number }> = {
    cashFlow: {
      label: "Monthly Cash Flow",
      unit: "£/mo",
      current: currentMetrics.monthlyCashFlow,
    },
    roi: { label: "Annual ROI", unit: "%", current: currentMetrics.roi },
    yield: { label: "Net Yield", unit: "%", current: currentMetrics.netYield },
    maxCash: {
      label: "Maximum Cash Required",
      unit: "£",
      current: currentMetrics.totalCashRequired,
    },
  };

  const variableConfig: Record<AdjustVariable, { label: string; current: number; format: (v: number) => string }> = {
    purchasePrice: {
      label: "Purchase Price",
      current: baseInputs.purchasePrice,
      format: formatCurrency,
    },
    monthlyRent: {
      label: "Monthly Rent",
      current: baseInputs.monthlyRent,
      format: (v) => `${formatCurrency(v)}/mo`,
    },
    depositPercent: {
      label: "Deposit %",
      current: baseInputs.depositPercent,
      format: (v) => `${v.toFixed(1)}%`,
    },
    mortgageRate: {
      label: "Interest Rate",
      current: baseInputs.mortgageRate,
      format: (v) => `${v.toFixed(2)}%`,
    },
  };

  const calculateRequiredValue = useCallback(
    (variable: AdjustVariable): GoalSeekResult => {
      // Define constraints based on variable
      const constraints: Record<AdjustVariable, { min: number; max: number }> = {
        purchasePrice: {
          min: baseInputs.purchasePrice * 0.7,
          max: baseInputs.purchasePrice * 1.3,
        },
        monthlyRent: {
          min: baseInputs.monthlyRent * 0.7,
          max: baseInputs.monthlyRent * 1.3,
        },
        depositPercent: { min: 5, max: 50 },
        mortgageRate: { min: 2, max: 10 },
      };

      const c = constraints[variable];
      let low = c.min;
      let high = c.max;
      const tolerance = variable === "purchasePrice" ? 100 : variable === "monthlyRent" ? 5 : 0.1;
      let bestValue = low;
      let bestDiff = Infinity;

      // Binary search
      for (let i = 0; i < 50; i++) {
        const mid = (low + high) / 2;
        const testInputs = { ...baseInputs, [variable]: mid };
        const testResults = calculateBTLResults(testInputs);

        let currentValue: number;
        switch (goalType) {
          case "cashFlow":
            currentValue = testResults.monthlyCashFlow;
            break;
          case "roi":
            currentValue = testResults.roi;
            break;
          case "yield":
            currentValue = testResults.netYield;
            break;
          case "maxCash":
            currentValue = testResults.totalCashRequired;
            break;
        }

        const diff = Math.abs(currentValue - targetValue);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestValue = mid;
        }

        if (diff < tolerance) {
          break;
        }

        // Determine search direction
        const needIncrease = goalType === "maxCash" ? currentValue > targetValue : currentValue < targetValue;

        // Different variables affect metrics differently
        if (variable === "purchasePrice") {
          // Lower price = better cash flow/yield/roi, lower cash required
          if (goalType === "maxCash") {
            needIncrease ? (low = mid) : (high = mid);
          } else {
            needIncrease ? (high = mid) : (low = mid);
          }
        } else if (variable === "monthlyRent") {
          // Higher rent = better cash flow/yield/roi
          needIncrease ? (low = mid) : (high = mid);
        } else if (variable === "depositPercent") {
          // Higher deposit = better cash flow, lower ROI, more cash required
          if (goalType === "roi" || goalType === "maxCash") {
            needIncrease ? (high = mid) : (low = mid);
          } else {
            needIncrease ? (low = mid) : (high = mid);
          }
        } else if (variable === "mortgageRate") {
          // Lower rate = better cash flow/roi
          needIncrease ? (high = mid) : (low = mid);
        }
      }

      // Calculate feasibility
      const changePercent = Math.abs((bestValue - variableConfig[variable].current) / variableConfig[variable].current) * 100;
      let feasibilityScore = 100;
      let feasibilityLabel = "Achievable";

      if (variable === "purchasePrice") {
        // Price negotiations
        if (changePercent > 15) {
          feasibilityScore = 20;
          feasibilityLabel = "Very Unlikely";
        } else if (changePercent > 10) {
          feasibilityScore = 40;
          feasibilityLabel = "Challenging";
        } else if (changePercent > 5) {
          feasibilityScore = 70;
          feasibilityLabel = "Possible";
        } else {
          feasibilityScore = 90;
          feasibilityLabel = "Likely";
        }
      } else if (variable === "monthlyRent") {
        if (changePercent > 15) {
          feasibilityScore = 10;
          feasibilityLabel = "Unrealistic";
        } else if (changePercent > 10) {
          feasibilityScore = 30;
          feasibilityLabel = "Unlikely";
        } else if (changePercent > 5) {
          feasibilityScore = 60;
          feasibilityLabel = "Possible";
        } else {
          feasibilityScore = 85;
          feasibilityLabel = "Achievable";
        }
      } else {
        feasibilityScore = 80;
        feasibilityLabel = "Your Choice";
      }

      // Check if achieved
      const testResults = calculateBTLResults({ ...baseInputs, [variable]: bestValue });
      let achieved = false;
      switch (goalType) {
        case "cashFlow":
          achieved = testResults.monthlyCashFlow >= targetValue;
          break;
        case "roi":
          achieved = testResults.roi >= targetValue;
          break;
        case "yield":
          achieved = testResults.netYield >= targetValue;
          break;
        case "maxCash":
          achieved = testResults.totalCashRequired <= targetValue;
          break;
      }

      return {
        requiredValue: bestValue,
        achievable: achieved && bestDiff < tolerance * 10,
        feasibilityScore,
        feasibilityLabel,
      };
    },
    [baseInputs, goalType, targetValue, variableConfig]
  );

  const runGoalSeek = useCallback(() => {
    const mainResult = calculateRequiredValue(adjustVariable);
    setResult(mainResult);

    // Calculate alternatives
    const altVariables: AdjustVariable[] = ["purchasePrice", "monthlyRent", "depositPercent", "mortgageRate"].filter(
      (v) => v !== adjustVariable
    ) as AdjustVariable[];

    const alts: AlternativeSolution[] = altVariables.map((variable) => {
      const res = calculateRequiredValue(variable);
      return {
        variable,
        label: variableConfig[variable].label,
        requiredValue: res.requiredValue || 0,
        feasibilityScore: res.feasibilityScore,
        feasibilityLabel: res.feasibilityLabel,
        description: `Change from ${variableConfig[variable].format(variableConfig[variable].current)} to ${variableConfig[variable].format(res.requiredValue || 0)}`,
      };
    });

    setAlternatives(alts.sort((a, b) => b.feasibilityScore - a.feasibilityScore));
    setStep(3);
  }, [adjustVariable, calculateRequiredValue, variableConfig]);

  const handleApply = useCallback(() => {
    if (result?.requiredValue) {
      onApplyResult({ [adjustVariable]: result.requiredValue });
      onClose();
    }
  }, [result, adjustVariable, onApplyResult, onClose]);

  const gap = targetValue - goalConfig[goalType].current;
  const gapLabel = goalType === "maxCash"
    ? gap < 0 ? "under budget" : "over budget"
    : gap > 0 ? "short" : "ahead";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Goal Seeker
          </DialogTitle>
          <DialogDescription>
            Work backwards from your target to find required values
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {/* Step 1: Choose Goal */}
          {step >= 1 && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Badge variant={step === 1 ? "default" : "secondary"}>1</Badge>
                <h3 className="font-medium">Choose Your Goal</h3>
              </div>

              <RadioGroup
                value={goalType}
                onValueChange={(v) => setGoalType(v as GoalType)}
                className="grid grid-cols-2 gap-3"
              >
                {(Object.keys(goalConfig) as GoalType[]).map((type) => (
                  <div key={type} className="relative">
                    <RadioGroupItem
                      value={type}
                      id={type}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type}
                      className={cn(
                        "flex flex-col items-start p-3 border rounded-lg cursor-pointer transition-colors",
                        "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      )}
                    >
                      <span className="font-medium">{goalConfig[type].label}</span>
                      <span className="text-sm text-muted-foreground">
                        Current: {goalType === "cashFlow" || goalType === "maxCash"
                          ? formatCurrency(goalConfig[type].current)
                          : `${goalConfig[type].current.toFixed(1)}%`}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {step === 1 && (
                <Button onClick={() => setStep(2)} className="w-full">
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          )}

          <Separator className="my-4" />

          {/* Step 2: Set Target & Variable */}
          {step >= 2 && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Badge variant={step === 2 ? "default" : "secondary"}>2</Badge>
                <h3 className="font-medium">Set Target & Variable</h3>
              </div>

              <div className="space-y-3">
                <Label>Target {goalConfig[goalType].label}</Label>
                <div className="flex items-center gap-2">
                  {(goalType === "cashFlow" || goalType === "maxCash") && (
                    <span className="text-lg">£</span>
                  )}
                  <Input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
                    className="text-lg font-semibold"
                  />
                  {goalType !== "cashFlow" && goalType !== "maxCash" && (
                    <span className="text-lg">%</span>
                  )}
                </div>
                <p className={cn(
                  "text-sm",
                  Math.abs(gap) < 50 ? "text-green-600" : Math.abs(gap) < 200 ? "text-yellow-600" : "text-red-600"
                )}>
                  Gap: {goalType === "cashFlow" || goalType === "maxCash"
                    ? formatCurrency(Math.abs(gap))
                    : `${Math.abs(gap).toFixed(1)}%`} {gapLabel}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Variable to Adjust</Label>
                <RadioGroup
                  value={adjustVariable}
                  onValueChange={(v) => setAdjustVariable(v as AdjustVariable)}
                  className="grid grid-cols-2 gap-2"
                >
                  {(Object.keys(variableConfig) as AdjustVariable[]).map((variable) => (
                    <div key={variable} className="relative">
                      <RadioGroupItem value={variable} id={variable} className="peer sr-only" />
                      <Label
                        htmlFor={variable}
                        className={cn(
                          "flex items-center gap-2 p-2 border rounded cursor-pointer text-sm",
                          "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                        )}
                      >
                        {variableConfig[variable].label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {step === 2 && (
                <Button onClick={runGoalSeek} className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Calculate Required Value
                </Button>
              )}
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <div className="space-y-4">
              <Separator className="my-4" />

              <div className="flex items-center gap-2">
                <Badge>3</Badge>
                <h3 className="font-medium">Results</h3>
              </div>

              {/* Main Result */}
              <Card className={cn(
                "border-2",
                result.achievable ? "border-green-500" : "border-yellow-500"
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>To achieve your target:</span>
                    <Badge variant={result.achievable ? "default" : "secondary"}>
                      {result.feasibilityLabel}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{variableConfig[adjustVariable].label}</span>
                    <span className="text-2xl font-bold">
                      {variableConfig[adjustVariable].format(result.requiredValue || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Current:</span>
                    <span>{variableConfig[adjustVariable].format(variableConfig[adjustVariable].current)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Change:</span>
                    <span className={result.requiredValue && result.requiredValue < variableConfig[adjustVariable].current ? "text-green-600" : "text-red-600"}>
                      {result.requiredValue
                        ? ((result.requiredValue - variableConfig[adjustVariable].current) / variableConfig[adjustVariable].current * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Feasibility</span>
                      <span>{result.feasibilityScore}/100</span>
                    </div>
                    <Progress value={result.feasibilityScore} className="h-2" />
                  </div>

                  <Button onClick={handleApply} className="w-full mt-4">
                    Apply This Value
                  </Button>
                </CardContent>
              </Card>

              {/* Alternatives */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Or try these alternatives:</h4>
                {alternatives.map((alt) => (
                  <Card key={alt.variable} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{alt.label}</p>
                        <p className="text-xs text-muted-foreground">{alt.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={alt.feasibilityScore >= 70 ? "default" : alt.feasibilityScore >= 40 ? "secondary" : "destructive"}>
                          {alt.feasibilityLabel}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onApplyResult({ [alt.variable]: alt.requiredValue });
                            onClose();
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

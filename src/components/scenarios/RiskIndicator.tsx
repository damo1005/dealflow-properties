import { AlertTriangle, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ScenarioMetrics } from "@/types/scenario";
import type { BTLInputs } from "@/stores/calculatorStore";

interface RiskIndicatorProps {
  metrics: ScenarioMetrics;
  inputs: BTLInputs;
}

function calculateRiskScore(metrics: ScenarioMetrics, inputs: BTLInputs): number {
  let score = 0;
  
  // Cash flow risk (0-30 points)
  if (metrics.monthlyCashFlow < 0) score += 30;
  else if (metrics.monthlyCashFlow < 100) score += 20;
  else if (metrics.monthlyCashFlow < 200) score += 10;
  
  // LTV risk (0-20 points)
  const ltv = 100 - inputs.depositPercent;
  if (ltv > 85) score += 20;
  else if (ltv > 75) score += 10;
  else if (ltv > 60) score += 5;
  
  // Yield risk (0-20 points)
  if (metrics.netYield < 3) score += 20;
  else if (metrics.netYield < 5) score += 15;
  else if (metrics.netYield < 6) score += 5;
  
  // Rate risk (0-15 points)
  if (inputs.mortgageRate > 7) score += 15;
  else if (inputs.mortgageRate > 6) score += 10;
  else if (inputs.mortgageRate > 5) score += 5;
  
  // Break-even buffer (0-15 points)
  const rentBuffer = metrics.breakEvenRent 
    ? ((inputs.monthlyRent - metrics.breakEvenRent) / inputs.monthlyRent) * 100
    : 100;
  if (rentBuffer < 5) score += 15;
  else if (rentBuffer < 10) score += 10;
  else if (rentBuffer < 20) score += 5;
  
  return Math.min(100, score);
}

function getRiskLevel(score: number): { label: string; color: string; icon: React.ElementType } {
  if (score < 25) return { label: "Low Risk", color: "text-green-600", icon: ShieldCheck };
  if (score < 50) return { label: "Medium Risk", color: "text-yellow-600", icon: Shield };
  if (score < 75) return { label: "High Risk", color: "text-orange-600", icon: AlertTriangle };
  return { label: "Very High Risk", color: "text-red-600", icon: ShieldX };
}

function getViabilityZone(score: number): { label: string; position: number; color: string } {
  if (score < 25) return { label: "Excellent", position: 87.5, color: "bg-green-600" };
  if (score < 50) return { label: "Good", position: 62.5, color: "bg-green-500" };
  if (score < 75) return { label: "Risky", position: 37.5, color: "bg-yellow-500" };
  return { label: "Avoid", position: 12.5, color: "bg-red-500" };
}

export function RiskIndicator({ metrics, inputs }: RiskIndicatorProps) {
  const riskScore = calculateRiskScore(metrics, inputs);
  const { label, color, icon: Icon } = getRiskLevel(riskScore);
  const viability = getViabilityZone(riskScore);

  const riskFactors = [];
  
  if (metrics.monthlyCashFlow < 100) {
    riskFactors.push("Low cash flow buffer");
  }
  if (100 - inputs.depositPercent > 75) {
    riskFactors.push("High LTV ratio");
  }
  if (metrics.netYield < 5) {
    riskFactors.push("Below average yield");
  }
  if (inputs.mortgageRate > 6) {
    riskFactors.push("High interest rate");
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className={cn("h-5 w-5", color)} />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Risk Score</span>
            <span className={cn("font-medium", color)}>{riskScore}/100</span>
          </div>
          <Progress value={100 - riskScore} className="h-2" />
          <p className={cn("text-sm font-medium", color)}>{label}</p>
        </div>

        {/* Viability Meter */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Deal Viability</p>
          <div className="relative h-6 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${100 - riskScore}%`, transform: "translateX(-50%)" }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Avoid</span>
            <span>Risky</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Risk Factors */}
        {riskFactors.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Risk Factors</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {riskFactors.map((factor, i) => (
                <li key={i} className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

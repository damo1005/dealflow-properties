import { Trophy, TrendingUp, Target, Percent, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ComparisonProperty } from "@/types/comparison";
import { calculateWinnerScores, getPropertyBadges } from "@/lib/comparisonUtils";
import { formatCurrency } from "@/services/propertyDataApi";
import { cn } from "@/lib/utils";

interface WinnerSummaryCardsProps {
  properties: ComparisonProperty[];
}

export function WinnerSummaryCards({ properties }: WinnerSummaryCardsProps) {
  if (properties.length < 2) return null;

  const scores = calculateWinnerScores(properties);
  
  // Find overall winner
  const sortedByScore = [...properties].sort(
    (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
  );
  const overallWinner = sortedByScore[0];
  const winnerScore = scores[overallWinner.id] || 0;
  const maxPossibleScore = 18 * (properties.length - 1); // Approximate max
  const winnerPercent = Math.round((winnerScore / Math.max(maxPossibleScore, 1)) * 100);

  // Find best in each category
  const findBest = (
    getValue: (p: ComparisonProperty) => number | undefined,
    higherIsBetter = true
  ): ComparisonProperty | null => {
    const sorted = [...properties]
      .filter((p) => getValue(p) != null)
      .sort((a, b) => {
        const aVal = getValue(a) || 0;
        const bVal = getValue(b) || 0;
        return higherIsBetter ? bVal - aVal : aVal - bVal;
      });
    return sorted[0] || null;
  };

  const bestCashFlow = findBest((p) => p.calculatedCashFlow);
  const bestYield = findBest((p) => p.calculatedYield);
  const bestValue = findBest((p) => 
    p.estimatedValue && p.price ? p.estimatedValue - p.price : undefined
  );

  const cards = [
    {
      title: "Overall Winner",
      icon: Crown,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
      property: overallWinner,
      value: `${winnerPercent}/100`,
      subtext: `${Object.values(scores).filter(s => s < winnerScore).length} categories won`,
    },
    bestCashFlow && {
      title: "Best Cash Flow",
      icon: TrendingUp,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10 border-green-500/20",
      property: bestCashFlow,
      value: formatCurrency(bestCashFlow.calculatedCashFlow || 0) + "/mo",
      subtext: bestCashFlow.calculatedCashFlow && bestCashFlow.calculatedCashFlow > 0 
        ? "Positive monthly income" 
        : "Needs cost review",
    },
    bestYield && {
      title: "Highest Yield",
      icon: Percent,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10 border-purple-500/20",
      property: bestYield,
      value: `${(bestYield.calculatedYield || 0).toFixed(1)}%`,
      subtext: (bestYield.calculatedYield || 0) >= 6 
        ? "Above average yield" 
        : "Market average",
    },
    bestValue && bestValue.estimatedValue && {
      title: "Best Value",
      icon: Target,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      property: bestValue,
      value: formatCurrency((bestValue.estimatedValue || 0) - bestValue.price),
      subtext: `${Math.round(((bestValue.estimatedValue - bestValue.price) / bestValue.estimatedValue) * 100)}% below market`,
    },
  ].filter(Boolean);

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        if (!card) return null;
        const IconComponent = card.icon;
        
        return (
          <Card 
            key={index} 
            className={cn("border-2", card.bgColor)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("p-1.5 rounded-full", card.bgColor)}>
                  <IconComponent className={cn("h-4 w-4", card.iconColor)} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium truncate" title={card.property.address}>
                  {card.property.address.split(",")[0]}
                </p>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.subtext}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

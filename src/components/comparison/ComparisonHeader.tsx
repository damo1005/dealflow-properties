import { X, Trophy, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/services/propertyDataApi";
import type { ComparisonProperty } from "@/types/comparison";
import { getPropertyBadges, calculateWinnerScores } from "@/lib/comparisonUtils";
import { cn } from "@/lib/utils";

interface ComparisonHeaderProps {
  properties: ComparisonProperty[];
  onRemove: (id: string) => void;
}

export function ComparisonHeader({ properties, onRemove }: ComparisonHeaderProps) {
  const scores = calculateWinnerScores(properties);
  const maxScore = Math.max(...Object.values(scores));

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
      {/* Empty cell for row labels column */}
      <div className="sticky left-0 z-20 bg-background" />

      {/* Property cards */}
      {properties.map((property) => {
        const badges = getPropertyBadges(property, properties);
        const isWinner = scores[property.id] === maxScore && maxScore > 0;

        return (
          <div
            key={property.id}
            className={cn(
              "relative rounded-lg border bg-card p-4 space-y-3",
              isWinner && "ring-2 ring-primary"
            )}
          >
            {/* Remove button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => onRemove(property.id)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Winner crown */}
            {isWinner && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                  <Crown className="h-4 w-4" />
                </div>
              </div>
            )}

            {/* Property image */}
            <div className="aspect-[4/3] overflow-hidden rounded-md">
              <img
                src={property.images?.[0] || "/placeholder.svg"}
                alt={property.address}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Property info */}
            <div className="space-y-1">
              <p className="font-medium text-sm line-clamp-2" title={property.address}>
                {property.address}
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(property.price)}
              </p>
              <p className="text-sm text-muted-foreground">
                {property.bedrooms} bed • {property.propertyType}
              </p>
            </div>

            {/* Winner badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {badges.slice(0, 2).map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
                {badges.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{badges.length - 2} more
                  </Badge>
                )}
              </div>
            )}

            {/* Score */}
            <div className="text-center pt-2 border-t">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-lg font-bold">{scores[property.id]} pts</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyDetail } from "@/data/mockPropertyDetail";
import { cn } from "@/lib/utils";

interface PropertyDescriptionProps {
  property: PropertyDetail;
}

export function PropertyDescription({ property }: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 400;
  const shouldTruncate = property.description.length > maxLength;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Description</CardTitle>
          {property.aiSummary && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI Summary
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Summary */}
        {property.aiSummary && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">AI Analysis</p>
                <p className="text-sm text-muted-foreground">{property.aiSummary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Agent Description */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Agent Description</h4>
          <div className="text-muted-foreground whitespace-pre-wrap">
            {shouldTruncate && !isExpanded
              ? `${property.description.slice(0, maxLength)}...`
              : property.description}
          </div>
          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 -ml-2 gap-1"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Key Features */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Key Features</h4>
          <ul className="grid gap-2 sm:grid-cols-2">
            {property.keyFeatures.map((feature, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-start gap-2 text-sm text-muted-foreground animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

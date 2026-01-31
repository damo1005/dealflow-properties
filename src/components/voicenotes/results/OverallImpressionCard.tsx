import { TrendingUp, Target, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OverallImpression } from "@/types/voiceNotes";
import { cn } from "@/lib/utils";

interface OverallImpressionCardProps {
  impression: OverallImpression;
  onAddToPipeline: () => void;
}

const sentimentColors: Record<string, string> = {
  Positive: "bg-green-500/10 text-green-700 border-green-500/20",
  Neutral: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Negative: "bg-red-500/10 text-red-700 border-red-500/20",
};

const interestColors: Record<string, string> = {
  High: "bg-green-500/10 text-green-700 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Low: "bg-red-500/10 text-red-700 border-red-500/20",
};

export function OverallImpressionCard({
  impression,
  onAddToPipeline,
}: OverallImpressionCardProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Overall Impression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Sentiment
            </p>
            <Badge className={cn("text-sm", sentimentColors[impression.sentiment])}>
              {impression.sentiment}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Interest Level
            </p>
            <Badge className={cn("text-sm", interestColors[impression.interest_level])}>
              {impression.interest_level}
            </Badge>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground mb-1">Recommended Next Action</p>
          <p className="font-medium flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            {impression.next_action}
          </p>
        </div>

        <Button onClick={onAddToPipeline} className="w-full">
          <TrendingUp className="h-4 w-4 mr-2" />
          Add to Pipeline
        </Button>
      </CardContent>
    </Card>
  );
}

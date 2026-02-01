import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { InvestmentMilestone } from "@/types/investment";
import { MILESTONE_LABELS } from "@/types/investment";

interface InvestmentTimelineProps {
  milestones: InvestmentMilestone[];
}

export function InvestmentTimeline({ milestones }: InvestmentTimelineProps) {
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.milestone_date).getTime() - new Date(b.milestone_date).getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Investment Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {sortedMilestones.map((milestone, index) => {
              const config = MILESTONE_LABELS[milestone.milestone_type];
              return (
                <div key={milestone.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">{config.icon}</span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{config.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(milestone.milestone_date), "d MMMM yyyy")}
                        </p>
                      </div>
                      {milestone.milestone_value && (
                        <Badge variant="outline" className="font-mono">
                          £{milestone.milestone_value.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    {milestone.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {milestone.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

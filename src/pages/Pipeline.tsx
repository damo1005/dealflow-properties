import { Plus, GitBranch } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stages = ["Lead", "Analyzing", "Negotiating", "Due Diligence", "Closed"];

export default function Pipeline() {
  return (
    <AppLayout title="My Pipeline">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Track and manage your property deals
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </div>

        {/* Pipeline Stages */}
        <div className="grid gap-4 md:grid-cols-5">
          {stages.map((stage) => (
            <div key={stage} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{stage}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  0
                </span>
              </div>
              <Card className="min-h-[200px] border-dashed shadow-sm">
                <CardContent className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <GitBranch className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No properties
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

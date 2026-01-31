import { Bookmark, Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SavedSearches() {
  return (
    <AppLayout title="Saved Searches">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Manage your saved search criteria and alerts
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Search
          </Button>
        </div>

        {/* Empty State */}
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Saved Searches Yet
            </h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Save your search criteria to receive alerts when new properties matching your requirements are listed.
            </p>
            <Button>Create Your First Search</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

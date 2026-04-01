import { useState } from "react";
import { MessageSquare, CheckSquare } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AccommodationRequests() {
  const [activeTab, setActiveTab] = useState("browse");

  const handleShareLink = () => {
    navigator.clipboard.writeText("https://realtysync-co.lovable.app/accommodation-requests");
    toast("Link copied — share this with corporate clients to post accommodation requests");
  };

  return (
    <AppLayout title="Accommodation Requests">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Accommodation Requests</h1>
          <p className="text-muted-foreground">
            Corporate and contractor clients post accommodation needs here. Respond directly to secure long-stay bookings.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Browse Requests</TabsTrigger>
            <TabsTrigger value="responses">My Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="flex flex-col items-center justify-center py-16 border rounded-lg border-dashed bg-muted/20">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-1">No requests yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                When corporate clients and contractors post accommodation requests near your properties, they'll appear here.
              </p>
              <Button onClick={handleShareLink}>
                Share with your corporate contacts →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="responses" className="mt-6">
            <div className="flex flex-col items-center justify-center py-16 border rounded-lg border-dashed bg-muted/20">
              <CheckSquare className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-1">No responses sent yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Your responses to accommodation requests will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

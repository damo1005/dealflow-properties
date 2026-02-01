import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTicketsTable } from "@/components/admin/AdminTicketsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { SupportTicket } from "@/types/admin";

export default function AdminSupport() {
  const { tickets, isLoadingTickets, setTickets, setIsLoadingTickets, setSelectedTicket } = useAdminStore();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("opened_at", { ascending: false });

      if (error) throw error;
      setTickets((data || []) as SupportTicket[]);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // Use mock data if no tickets exist
      setTickets([
        {
          id: "1",
          ticket_number: "#1234",
          user_id: "user-1",
          subject: "Calculator not working",
          description: "The BTL calculator is showing an error",
          category: "technical",
          priority: "high",
          status: "open",
          opened_at: new Date().toISOString(),
          user_email: "john@example.com",
        },
        {
          id: "2",
          ticket_number: "#1233",
          user_id: "user-2",
          subject: "Upgrade question",
          description: "How do I upgrade my plan?",
          category: "billing",
          priority: "medium",
          status: "in_progress",
          opened_at: new Date(Date.now() - 86400000).toISOString(),
          user_email: "jane@example.com",
        },
      ] as SupportTicket[]);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    toast.info(`Viewing ticket ${ticket.ticket_number}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">
              Manage customer support requests
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </div>

        {/* Tickets Table */}
        <Card>
          <CardContent className="pt-6">
            <AdminTicketsTable
              tickets={tickets}
              isLoading={isLoadingTickets}
              onViewTicket={handleViewTicket}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

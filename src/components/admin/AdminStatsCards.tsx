import { Card, CardContent } from "@/components/ui/card";
import { Users, CreditCard, Handshake, TicketCheck } from "lucide-react";
import type { AdminStats } from "@/types/admin";

interface AdminStatsCardsProps {
  stats: AdminStats | null;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      subtitle: `+${stats?.newUsersThisWeek || 0} this week`,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Subscriptions",
      value: `${stats?.proSubscriptions || 0} Pro, ${stats?.premiumSubscriptions || 0} Premium`,
      subtitle: `MRR: £${(stats?.mrr || 0).toLocaleString()}`,
      icon: CreditCard,
      color: "text-emerald-500",
    },
    {
      title: "Pending Commissions",
      value: `£${(stats?.pendingCommissions || 0).toLocaleString()}`,
      subtitle: `${stats?.pendingCommissionCount || 0} conversions`,
      icon: Handshake,
      color: "text-amber-500",
    },
    {
      title: "Support Tickets",
      value: `${stats?.openTickets || 0} open, ${stats?.urgentTickets || 0} urgent`,
      subtitle: `Avg response: ${stats?.avgResponseTime?.toFixed(1) || 0}hrs`,
      icon: TicketCheck,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </div>
              <div className={`p-3 rounded-full bg-muted ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

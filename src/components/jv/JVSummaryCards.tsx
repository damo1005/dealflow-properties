import { Card, CardContent } from "@/components/ui/card";
import { Handshake, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { JVSummary } from "@/types/jv";

interface JVSummaryCardsProps {
  summary: JVSummary;
}

export function JVSummaryCards({ summary }: JVSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    {
      title: "Active Deals",
      value: summary.activeDeals.toString(),
      icon: Handshake,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Your Invested",
      value: formatCurrency(summary.totalInvested),
      icon: PiggyBank,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Your Equity",
      value: formatCurrency(summary.totalEquity),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Distributions",
      value: formatCurrency(summary.totalDistributions),
      icon: Wallet,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.title}</p>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

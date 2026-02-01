import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Handshake, History, PieChart } from "lucide-react";
import { JVDealCard } from "@/components/jv/JVDealCard";
import { JVSummaryCards } from "@/components/jv/JVSummaryCards";
import { useJVStore, mockJVDeals, mockJVSummary, mockJVTransactions } from "@/stores/jvStore";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const JVDeals = () => {
  const { deals, summary, transactions, setDeals, setSummary, setTransactions } = useJVStore();
  const { toast } = useToast();
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  useEffect(() => {
    setDeals(mockJVDeals);
    setSummary(mockJVSummary);
    setTransactions(mockJVTransactions);
  }, [setDeals, setSummary, setTransactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const activeDeals = deals.filter((d) => d.status === "active");
  const exitedDeals = deals.filter((d) => d.status === "exited");

  const handleViewDetails = (dealId: string) => {
    setSelectedDeal(dealId);
  };

  const handleRecordDistribution = (dealId: string) => {
    toast({
      title: "Coming soon",
      description: "Record distribution feature is coming soon",
    });
  };

  const handleExitDeal = (dealId: string) => {
    toast({
      title: "Coming soon",
      description: "Exit deal feature is coming soon",
    });
  };

  // Chart data for selected deal
  const currentDeal = deals.find((d) => d.id === selectedDeal);
  const pieData = currentDeal?.partners?.map((p) => ({
    name: p.partner_name,
    value: p.equity_percentage,
  })) || [];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">JV Deals</h1>
            <p className="text-muted-foreground">
              Track joint venture partnerships and investments
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New JV Deal
          </Button>
        </div>

        <JVSummaryCards summary={summary} />

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Handshake className="h-4 w-4" />
              Active ({activeDeals.length})
            </TabsTrigger>
            <TabsTrigger value="exited" className="gap-2">
              <History className="h-4 w-4" />
              Exited ({exitedDeals.length})
            </TabsTrigger>
            {selectedDeal && (
              <TabsTrigger value="details" className="gap-2">
                <PieChart className="h-4 w-4" />
                Deal Details
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeDeals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Handshake className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No active JV deals</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first joint venture deal to start tracking
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create JV Deal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeDeals.map((deal) => (
                <JVDealCard
                  key={deal.id}
                  deal={deal}
                  onViewDetails={() => handleViewDetails(deal.id)}
                  onRecordDistribution={() => handleRecordDistribution(deal.id)}
                  onExit={() => handleExitDeal(deal.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="exited" className="space-y-4">
            {exitedDeals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No exited deals yet
                </CardContent>
              </Card>
            ) : (
              exitedDeals.map((deal) => (
                <JVDealCard
                  key={deal.id}
                  deal={deal}
                  onViewDetails={() => handleViewDetails(deal.id)}
                />
              ))
            )}
          </TabsContent>

          {selectedDeal && currentDeal && (
            <TabsContent value="details" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Partnership Structure */}
                <Card>
                  <CardHeader>
                    <CardTitle>Partnership Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Partner Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Partners</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentDeal.partners?.map((partner, index) => (
                      <div key={partner.id} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{partner.partner_name}</p>
                          <Badge>{partner.equity_percentage}%</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>
                            <p>Invested</p>
                            <p className="text-foreground font-medium">
                              {formatCurrency(partner.initial_investment)}
                            </p>
                          </div>
                          <div>
                            <p>Distributions</p>
                            <p className="text-foreground font-medium">
                              {formatCurrency(partner.distributions_received)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Record Transaction
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions
                        .filter((t) => t.jv_deal_id === selectedDeal)
                        .map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              {format(new Date(tx.transaction_date), "dd MMM yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {tx.transaction_type.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{tx.description}</TableCell>
                            <TableCell className="text-right font-medium">
                              {tx.transaction_type === "distribution" || tx.transaction_type === "income"
                                ? "+"
                                : "-"}
                              {formatCurrency(tx.total_amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default JVDeals;

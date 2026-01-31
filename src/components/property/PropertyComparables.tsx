import { useState } from "react";
import { Home, Calendar, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyDetail } from "@/data/mockPropertyDetail";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PropertyComparablesProps {
  property: PropertyDetail;
}

export function PropertyComparables({ property }: PropertyComparablesProps) {
  const [filter, setFilter] = useState<"all" | "sold" | "listed">("all");
  const [sortBy, setSortBy] = useState<"price" | "date">("date");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredComparables = property.comparables
    .filter((comp) => filter === "all" || comp.status === filter)
    .sort((a, b) => {
      if (sortBy === "price") return b.price - a.price;
      if (!a.soldDate) return 1;
      if (!b.soldDate) return -1;
      return new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime();
    });

  // Price per sqft comparison chart data
  const chartData = [
    { name: "This Property", value: property.pricePerSqft, fill: "hsl(var(--primary))" },
    ...property.comparables.slice(0, 3).map((comp, i) => ({
      name: comp.address.split(",")[0].slice(0, 15),
      value: Math.round(comp.price / 1200), // Approximate sqft
      fill: "hsl(var(--muted-foreground))",
    })),
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Comparable Properties
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="listed">Listed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setSortBy(sortBy === "price" ? "date" : "price")}
            >
              <ArrowUpDown className="h-3 w-3" />
              {sortBy === "price" ? "Price" : "Date"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comparables Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Beds</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComparables.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {comp.address}
                  </TableCell>
                  <TableCell className="text-center">{comp.bedrooms}</TableCell>
                  <TableCell className="text-center text-sm">
                    {comp.propertyType}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(comp.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={comp.status === "sold" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {comp.status === "sold" ? formatDate(comp.soldDate) : "Listed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Price Comparison Chart */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground text-sm">Price per sqft Comparison</h4>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `£${value}`}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => [`£${value}/sqft`, "Price"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuctionStore } from "@/stores/auctionStore";
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Mock results data
const mockResults = [
  {
    id: "r1",
    lot_number: "24",
    address: "123 High Street, EN3",
    property_type: "2-bed flat",
    guide_price: 180000,
    sale_price: 188000,
    sold: true,
    vs_guide: 4.4,
  },
  {
    id: "r2",
    lot_number: "45",
    address: "45 Oak Road, N17",
    property_type: "3-bed terraced",
    guide_price: 285000,
    sale_price: 310000,
    sold: true,
    vs_guide: 8.8,
  },
  {
    id: "r3",
    lot_number: "67",
    address: "67 Elm Street, E17",
    property_type: "1-bed flat",
    guide_price: 155000,
    sale_price: null,
    sold: false,
    vs_guide: null,
  },
  {
    id: "r4",
    lot_number: "89",
    address: "89 Park Road, N1",
    property_type: "2-bed flat",
    guide_price: 350000,
    sale_price: 365000,
    sold: true,
    vs_guide: 4.3,
  },
];

const successRateData = [
  { name: "EIG", rate: 72 },
  { name: "Allsop", rate: 68 },
  { name: "SDL", rate: 65 },
  { name: "Barnett Ross", rate: 70 },
];

const propertyTypeData = [
  { name: "Flats", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Terraced", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Semi-Detached", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Detached", value: 10, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
];

export function AuctionResults() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const soldCount = mockResults.filter((r) => r.sold).length;
  const avgOverGuide = mockResults
    .filter((r) => r.vs_guide)
    .reduce((sum, r) => sum + (r.vs_guide || 0), 0) / soldCount;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Lots</p>
            <p className="text-2xl font-bold">{mockResults.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Sold</p>
            <p className="text-2xl font-bold text-green-500">{soldCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Unsold</p>
            <p className="text-2xl font-bold text-red-500">
              {mockResults.length - soldCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Avg vs Guide</p>
            <p className="text-2xl font-bold text-green-500">
              +{avgOverGuide.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Results</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Lot</th>
                  <th className="text-left py-3 px-2 font-medium">Property</th>
                  <th className="text-right py-3 px-2 font-medium">Guide</th>
                  <th className="text-right py-3 px-2 font-medium">Result</th>
                  <th className="text-right py-3 px-2 font-medium">vs Guide</th>
                  <th className="text-center py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockResults.map((result) => (
                  <tr key={result.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">{result.lot_number}</td>
                    <td className="py-3 px-2">
                      <p className="font-medium">{result.address}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.property_type}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {formatCurrency(result.guide_price)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {result.sale_price
                        ? formatCurrency(result.sale_price)
                        : "-"}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {result.vs_guide ? (
                        <span className="text-green-500">
                          +{result.vs_guide}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {result.sold ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Sold
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Unsold
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Success Rate by Auction House</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={successRateData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="rate" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property Types Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">💡</Badge>
            <span>Properties in EN3 sold 4.2% over guide on average</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">📊</Badge>
            <span>68% of lots sold in February auctions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">💰</Badge>
            <span>Average buyer premium: 1.2% (+ VAT)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">🏠</Badge>
            <span>2-bed flats are the most popular property type at auction</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

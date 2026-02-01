import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface MarketTrendsChartProps {
  postcode: string;
}

export function MarketTrendsChart({ postcode }: MarketTrendsChartProps) {
  // Generate mock trend data
  const generatePriceData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let basePrice = 250000;
    return months.map((month) => {
      basePrice = basePrice * (1 + (Math.random() * 0.02 - 0.005));
      return {
        month,
        price: Math.round(basePrice),
        forecast: month === 'Nov' || month === 'Dec' ? Math.round(basePrice * 1.02) : null,
      };
    });
  };

  const generateSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month) => ({
      month,
      sales: Math.floor(20 + Math.random() * 30),
    }));
  };

  const generateYieldData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let baseYield = 5.5;
    return months.map((month) => {
      baseYield = baseYield + (Math.random() * 0.2 - 0.1);
      return {
        month,
        yield: parseFloat(baseYield.toFixed(2)),
      };
    });
  };

  const priceData = generatePriceData();
  const salesData = generateSalesData();
  const yieldData = generateYieldData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Trends: {postcode}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prices">
          <TabsList className="mb-4">
            <TabsTrigger value="prices">Price Trends</TabsTrigger>
            <TabsTrigger value="sales">Sales Volume</TabsTrigger>
            <TabsTrigger value="yields">Yield Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="prices">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelClassName="font-medium"
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Average Price"
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast"
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="sales">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar 
                    dataKey="sales" 
                    fill="hsl(var(--primary))" 
                    name="Properties Sold"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="yields">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yieldData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    domain={['auto', 'auto']}
                    className="text-xs"
                  />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Line 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="hsl(142, 76%, 36%)" 
                    strokeWidth={2}
                    name="Gross Yield"
                    dot={{ fill: 'hsl(142, 76%, 36%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

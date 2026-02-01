import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Download,
  DollarSign,
  Receipt
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { STRBooking, STRExpense, ExpenseCategory } from "@/types/str";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface STRFinancialsProps {
  bookings: STRBooking[];
  expenses: STRExpense[];
  onAddExpense: (expense: Omit<STRExpense, 'id' | 'created_at'>) => void;
  propertyId: string;
  userId: string;
}

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "mortgage", label: "Mortgage" },
  { value: "utilities", label: "Utilities" },
  { value: "internet", label: "Internet" },
  { value: "cleaning", label: "Cleaning" },
  { value: "maintenance", label: "Maintenance" },
  { value: "supplies", label: "Supplies" },
  { value: "toiletries", label: "Toiletries" },
  { value: "linens", label: "Linens" },
  { value: "platform_fees", label: "Platform Fees" },
  { value: "insurance", label: "Insurance" },
  { value: "property_tax", label: "Property Tax" },
  { value: "hoa_fees", label: "HOA Fees" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function STRFinancials({ 
  bookings, 
  expenses, 
  onAddExpense,
  propertyId,
  userId
}: STRFinancialsProps) {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    expense_date: format(new Date(), "yyyy-MM-dd"),
    category: "cleaning" as ExpenseCategory,
    description: "",
    amount: 0,
    is_recurring: false,
    recurrence_frequency: "monthly" as const,
    vendor: "",
    is_tax_deductible: true,
  });

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Calculate financials
  const financials = useMemo(() => {
    const monthBookings = bookings.filter((b) => {
      const date = parseISO(b.checkin_date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    const monthExpenses = expenses.filter((e) => {
      const date = parseISO(e.expense_date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    const totalRevenue = monthBookings.reduce((sum, b) => sum + (b.total_payout || 0), 0);
    const cleaningFees = monthBookings.reduce((sum, b) => sum + (b.cleaning_fee || 0), 0);
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue + cleaningFees - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / (totalRevenue + cleaningFees)) * 100 : 0;

    // Group expenses by category
    const expensesByCategory = monthExpenses.reduce((acc, e) => {
      const category = e.category || "other";
      acc[category] = (acc[category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    const expensePieData = Object.entries(expensesByCategory).map(([name, value]) => ({
      name: EXPENSE_CATEGORIES.find((c) => c.value === name)?.label || name,
      value,
    }));

    return {
      totalRevenue,
      cleaningFees,
      totalExpenses,
      netProfit,
      profitMargin,
      monthBookings,
      monthExpenses,
      expensePieData,
    };
  }, [bookings, expenses, monthStart, monthEnd]);

  const handleAddExpense = () => {
    onAddExpense({
      str_property_id: propertyId,
      user_id: userId,
      ...newExpense,
    });
    setShowAddExpense(false);
    setNewExpense({
      expense_date: format(new Date(), "yyyy-MM-dd"),
      category: "cleaning",
      description: "",
      amount: 0,
      is_recurring: false,
      recurrence_frequency: "monthly",
      vendor: "",
      is_tax_deductible: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold">£{financials.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold">£{financials.totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <p className={`text-2xl font-bold ${financials.netProfit >= 0 ? "text-emerald-600" : "text-destructive"}`}>
            £{financials.netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">This month</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{financials.profitMargin.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Target: 50%+</p>
        </Card>
      </div>

      <Tabs defaultValue="income" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="pnl">P&L Statement</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setShowAddExpense(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Income Tab */}
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Income</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Nights</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Fees</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financials.monthBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No bookings this month
                      </TableCell>
                    </TableRow>
                  ) : (
                    financials.monthBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{format(parseISO(booking.checkin_date), "MMM d")}</TableCell>
                        <TableCell>{booking.guest_name || "Guest"}</TableCell>
                        <TableCell>{booking.nights}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {booking.platform || "Direct"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">£{booking.nightly_rate || 0}</TableCell>
                        <TableCell className="text-right">£{booking.cleaning_fee || 0}</TableCell>
                        <TableCell className="text-right font-medium">
                          £{(booking.total_payout || 0) + (booking.cleaning_fee || 0)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="mt-4 pt-4 border-t flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-xl font-bold">
                    £{(financials.totalRevenue + financials.cleaningFees).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Pie Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financials.expensePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {financials.expensePieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `£${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 mt-4">
                  {financials.expensePieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{entry.name}</span>
                      </div>
                      <span className="font-medium">£{entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expense List */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Expense Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financials.monthExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No expenses this month
                        </TableCell>
                      </TableRow>
                    ) : (
                      financials.monthExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{format(parseISO(expense.expense_date), "MMM d")}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {expense.category?.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{expense.description || "-"}</TableCell>
                          <TableCell className="text-right font-medium">
                            £{expense.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                <div className="mt-4 pt-4 border-t flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-xl font-bold text-destructive">
                      £{financials.totalExpenses.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* P&L Statement Tab */}
        <TabsContent value="pnl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-emerald-600">Income</h3>
                <div className="pl-4 space-y-1">
                  <div className="flex justify-between">
                    <span>Booking Revenue</span>
                    <span>£{financials.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning Fees</span>
                    <span>£{financials.cleaningFees.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total Income</span>
                  <span>£{(financials.totalRevenue + financials.cleaningFees).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-destructive">Expenses</h3>
                <div className="pl-4 space-y-1">
                  {financials.expensePieData.map((item) => (
                    <div key={item.name} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>£{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total Expenses</span>
                  <span>£{financials.totalExpenses.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t-2 border-primary pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>NET PROFIT</span>
                  <span className={financials.netProfit >= 0 ? "text-emerald-600" : "text-destructive"}>
                    £{financials.netProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Expense Dialog */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newExpense.expense_date}
                  onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(v) => setNewExpense({ ...newExpense, category: v as ExpenseCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Monthly cleaning service"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (£)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newExpense.amount || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Input
                  placeholder="e.g., CleanCo"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={newExpense.is_recurring}
                onCheckedChange={(checked) => 
                  setNewExpense({ ...newExpense, is_recurring: checked as boolean })
                }
              />
              <Label htmlFor="recurring">Recurring expense</Label>
            </div>

            {newExpense.is_recurring && (
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={newExpense.recurrence_frequency}
                  onValueChange={(v) => setNewExpense({ ...newExpense, recurrence_frequency: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tax_deductible"
                checked={newExpense.is_tax_deductible}
                onCheckedChange={(checked) => 
                  setNewExpense({ ...newExpense, is_tax_deductible: checked as boolean })
                }
              />
              <Label htmlFor="tax_deductible">Tax deductible</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExpense(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense} disabled={!newExpense.amount}>
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

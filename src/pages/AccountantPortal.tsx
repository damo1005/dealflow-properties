import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Calculator,
  Download,
  FileSpreadsheet,
  FileText,
  PoundSterling,
  Home,
  CheckCircle,
  AlertTriangle,
  Building,
} from "lucide-react";

const AccountantPortal = () => {
  const [taxYear, setTaxYear] = useState("2025-26");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Mock data
  const summaryData = {
    rentalIncome: 42600,
    expenses: 14150,
    taxableProfit: 28450,
    mortgageInterest: 8200,
    section24: 1640,
    properties: 4,
  };

  const propertyBreakdown = [
    { address: "14 Oak Street", income: 10200, expenses: 2850, mortgage: 1800, profit: 5550 },
    { address: "28 Victoria Road", income: 11400, expenses: 3200, mortgage: 2100, profit: 6100 },
    { address: "7 Park Avenue", income: 9300, expenses: 4100, mortgage: 2000, profit: 3200 },
    { address: "52 High Street", income: 11700, expenses: 4000, mortgage: 2300, profit: 5400 },
  ];

  const expenseCategories = [
    { category: "Repairs & Maintenance", amount: 4200, percentage: 29.7 },
    { category: "Letting Agent Fees", amount: 4260, percentage: 30.1 },
    { category: "Insurance", amount: 1400, percentage: 9.9 },
    { category: "Ground Rent & Service", amount: 1800, percentage: 12.7 },
    { category: "Legal & Professional", amount: 890, percentage: 6.3 },
    { category: "Other Allowable", amount: 1600, percentage: 11.3 },
  ];

  const documents = [
    { type: "Rental Income Statements", status: "complete", count: "4/4" },
    { type: "Mortgage Interest Statements", status: "complete", count: "4/4" },
    { type: "Agent Fee Invoices", status: "partial", count: "10/12" },
    { type: "Repair Receipts", status: "partial", count: "8/11" },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Accountant Portal</h1>
            <p className="text-muted-foreground">
              Tax-ready financial summaries and exports
            </p>
          </div>
          <Select value={taxYear} onValueChange={setTaxYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-26">2025/26</SelectItem>
              <SelectItem value="2024-25">2024/25</SelectItem>
              <SelectItem value="2023-24">2023/24</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tax Year Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Year Summary: {taxYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Rental Income</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(summaryData.rentalIncome)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Expenses</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(summaryData.expenses)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Taxable Profit</p>
                <p className="text-xl font-bold">
                  {formatCurrency(summaryData.taxableProfit)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Mortgage Interest</p>
                <p className="text-xl font-bold">
                  {formatCurrency(summaryData.mortgageInterest)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Section 24</p>
                <p className="text-xl font-bold">
                  {formatCurrency(summaryData.section24)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">Properties</p>
                <p className="text-xl font-bold">{summaryData.properties}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income & Expenses by Property */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Income & Expenses by Property
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="mr-1 h-4 w-4" />
                Export to Excel
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead className="text-right">Income</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Mortgage</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertyBreakdown.map((property) => (
                  <TableRow key={property.address}>
                    <TableCell className="font-medium">{property.address}</TableCell>
                    <TableCell className="text-right">{formatCurrency(property.income)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(property.expenses)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(property.mortgage)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(property.profit)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(propertyBreakdown.reduce((sum, p) => sum + p.income, 0))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(propertyBreakdown.reduce((sum, p) => sum + p.expenses, 0))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(propertyBreakdown.reduce((sum, p) => sum + p.mortgage, 0))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(propertyBreakdown.reduce((sum, p) => sum + p.profit, 0))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PoundSterling className="h-5 w-5" />
                Expense Breakdown by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.map((cat) => (
                    <TableRow key={cat.category}>
                      <TableCell>{cat.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(cat.amount)}</TableCell>
                      <TableCell className="text-right">{cat.percentage}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expenseCategories.reduce((sum, c) => sum + c.amount, 0))}
                    </TableCell>
                    <TableCell className="text-right">100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Supporting Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Supporting Documents
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-muted-foreground">3 missing documents</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.type}>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {doc.status === "complete" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span>{doc.count}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View All
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" />
                  Download All (ZIP)
                </Button>
                <Button variant="outline" size="sm">
                  Request Missing Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Generate Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Tax Return Summary</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Property Income Report</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileSpreadsheet className="h-6 w-6" />
                <span>Transaction Export</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Mileage Log</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AccountantPortal;

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, FileText, AlertTriangle, PoundSterling, TrendingUp, Calendar, Download } from "lucide-react";

// Mock data
const mockCompany = {
  id: "1",
  company_name: "Smith Property Holdings Ltd",
  company_number: "12345678",
  incorporation_date: "2022-03-15",
  company_type: "spv",
  year_end_month: 3,
  vat_registered: false,
  properties: 3,
  total_value: 485000,
  total_debt: 310000,
};

const mockFilings = [
  { id: "1", filing_type: "confirmation_statement", period_end: "2026-03-15", due_date: "2026-03-29", status: "pending" },
  { id: "2", filing_type: "annual_accounts", period_end: "2026-03-31", due_date: "2026-12-31", status: "pending" },
  { id: "3", filing_type: "corporation_tax", period_end: "2026-03-31", due_date: "2027-01-01", status: "pending" },
];

const mockPL = {
  income: {
    rental: 34200,
    other: 0,
    total: 34200,
  },
  expenses: {
    mortgage_interest: 12400,
    insurance: 855,
    repairs: 1250,
    management: 0,
    accountancy: 600,
    other: 645,
    total: 15750,
  },
  netProfit: 18450,
  corporationTax: 3505,
  profitAfterTax: 14945,
};

const mockBalance = {
  assets: {
    properties: 425000,
    cash: 8450,
    total: 433450,
  },
  liabilities: {
    mortgages: 310000,
    directorLoan: 45000,
    corporationTax: 3505,
    total: 358505,
  },
  netAssets: 74945,
  equity: {
    shareCapital: 100,
    retainedEarnings: 74845,
    total: 74945,
  },
};

const mockDirectorLoan = {
  director_name: "John Smith",
  direction: "to_company",
  amount: 50000,
  amount_repaid: 5000,
  balance: 45000,
};

export default function Companies() {
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [selectedCompany] = useState(mockCompany);

  const getFilingLabel = (type: string) => {
    const labels: Record<string, string> = {
      confirmation_statement: "Confirmation Statement",
      annual_accounts: "Annual Accounts",
      corporation_tax: "Corporation Tax Return",
      vat_return: "VAT Return",
    };
    return labels[type] || type;
  };

  const getFilingStatus = (status: string, dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysUntil = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (status === "filed") return <Badge className="bg-green-500">Filed</Badge>;
    if (daysUntil < 0) return <Badge variant="destructive">Overdue</Badge>;
    if (daysUntil < 30) return <Badge className="bg-yellow-500">Due Soon</Badge>;
    return <Badge variant="secondary">Future</Badge>;
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Property Companies</h1>
            <p className="text-muted-foreground">Manage your SPV and property company accounts</p>
          </div>
          <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Company</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Property Company</DialogTitle>
                <DialogDescription>Add an existing company to track</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Smith Property Holdings Ltd" />
                </div>
                <div className="space-y-2">
                  <Label>Companies House Number</Label>
                  <Input placeholder="12345678" />
                </div>
                <div className="space-y-2">
                  <Label>Year End Month</Label>
                  <Input type="number" min="1" max="12" placeholder="3" />
                </div>
                <Button className="w-full">Add Company</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Company Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedCompany.company_name}</h2>
                  <p className="text-muted-foreground">Company #{selectedCompany.company_number}</p>
                  <p className="text-sm text-muted-foreground">
                    SPV | Incorporated: {new Date(selectedCompany.incorporation_date).toLocaleDateString()} | Year End: 31 March
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Properties: {selectedCompany.properties}</p>
                <p>Value: £{selectedCompany.total_value.toLocaleString()}</p>
                <p>Debt: £{selectedCompany.total_debt.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">🔴 Confirmation Statement - Due 29 Mar 2026 (56 days)</span>
              <Button size="sm" variant="outline">File Now</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">🟡 Annual Accounts - Due 31 Dec 2026 (333 days)</span>
              <Button size="sm" variant="ghost">View</Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rental Income YTD</CardDescription>
              <CardTitle className="text-2xl">£{mockPL.income.rental.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Net Profit YTD</CardDescription>
              <CardTitle className="text-2xl">£{mockPL.netProfit.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Corporation Tax Est.</CardDescription>
              <CardTitle className="text-2xl">£{mockPL.corporationTax.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="pl">
          <TabsList>
            <TabsTrigger value="pl" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Profit & Loss
            </TabsTrigger>
            <TabsTrigger value="balance" className="gap-2">
              <PoundSterling className="h-4 w-4" />
              Balance Sheet
            </TabsTrigger>
            <TabsTrigger value="filings" className="gap-2">
              <Calendar className="h-4 w-4" />
              Filings
            </TabsTrigger>
            <TabsTrigger value="loans" className="gap-2">
              <FileText className="h-4 w-4" />
              Director Loans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pl" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss (Current Year)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">INCOME</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Rental Income</span>
                        <span>£{mockPL.income.rental.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Income</span>
                        <span>£{mockPL.income.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">EXPENSES</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Mortgage Interest</span>
                        <span>£{mockPL.expenses.mortgage_interest.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance</span>
                        <span>£{mockPL.expenses.insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Repairs & Maintenance</span>
                        <span>£{mockPL.expenses.repairs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accountancy</span>
                        <span>£{mockPL.expenses.accountancy.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Expenses</span>
                        <span>£{mockPL.expenses.other.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Expenses</span>
                        <span>£{mockPL.expenses.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-1">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>NET PROFIT</span>
                      <span>£{mockPL.netProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Corporation Tax (19%)</span>
                      <span>£{mockPL.corporationTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Profit After Tax</span>
                      <span>£{mockPL.profitAfterTax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">ASSETS</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Properties (at cost)</span>
                        <span>£{mockBalance.assets.properties.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cash at Bank</span>
                        <span>£{mockBalance.assets.cash.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Assets</span>
                        <span>£{mockBalance.assets.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">LIABILITIES</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Mortgages</span>
                        <span>£{mockBalance.liabilities.mortgages.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Director Loan</span>
                        <span>£{mockBalance.liabilities.directorLoan.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Corporation Tax</span>
                        <span>£{mockBalance.liabilities.corporationTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Liabilities</span>
                        <span>£{mockBalance.liabilities.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>NET ASSETS</span>
                      <span>£{mockBalance.netAssets.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">EQUITY</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Share Capital</span>
                        <span>£{mockBalance.equity.shareCapital.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retained Earnings</span>
                        <span>£{mockBalance.equity.retainedEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Equity</span>
                        <span>£{mockBalance.equity.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filings" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Filing Calendar</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export for Accountant
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filing</TableHead>
                      <TableHead>Period End</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFilings.map(filing => (
                      <TableRow key={filing.id}>
                        <TableCell className="font-medium">{getFilingLabel(filing.filing_type)}</TableCell>
                        <TableCell>{new Date(filing.period_end).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(filing.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>{getFilingStatus(filing.status, filing.due_date)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">File</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Director Loan Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{mockDirectorLoan.director_name} - Loan to Company</h4>
                        <p className="text-sm text-muted-foreground">Interest-free director loan</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Original Amount</p>
                        <p className="font-medium">£{mockDirectorLoan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Repaid</p>
                        <p className="font-medium">£{mockDirectorLoan.amount_repaid.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Balance</p>
                        <p className="font-medium">£{mockDirectorLoan.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">Tax Implications</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Loans over £10,000 may have tax implications. Consult your accountant.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Record Repayment</Button>
                    <Button variant="outline">View History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

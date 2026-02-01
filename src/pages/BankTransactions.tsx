import { useState } from 'react';
import { format } from 'date-fns';
import { Building2, Check, X, ArrowRight, Plus, RefreshCw, Settings, Filter, Landmark } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBankFeedsStore } from '@/stores/bankFeedsStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BankTransactions() {
  const { connections, transactions, rules, confirmTransaction, ignoreTransaction, getPendingTransactions } = useBankFeedsStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const pendingCount = getPendingTransactions().length;

  const filteredTransactions = filterStatus === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filterStatus);

  const handleConfirm = (id: string, description: string) => {
    confirmTransaction(id, 'prop-1', 'Rent Income');
    toast.success(`Transaction confirmed: ${description}`);
  };

  const handleIgnore = (id: string) => {
    ignoreTransaction(id);
    toast.info('Transaction ignored');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      matched: 'bg-green-100 text-green-800',
      created: 'bg-blue-100 text-blue-800',
      ignored: 'bg-gray-100 text-gray-500',
    };
    return variants[status] || 'bg-gray-100 text-gray-500';
  };

  return (
    <AppLayout title="Bank Transactions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Landmark className="h-6 w-6 text-primary" />
              Bank Transactions
            </h1>
            <p className="text-muted-foreground">Import and categorize transactions from your bank</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Connect Bank
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">To Review</div>
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">This Month</div>
              <div className="text-xl font-bold">
                <span className="text-green-600">£{transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0).toLocaleString()} in</span>
                <span className="text-muted-foreground mx-2">|</span>
                <span className="text-red-600">£{Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)).toLocaleString()} out</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Auto-Matched</div>
              <div className="text-3xl font-bold text-green-600">
                {Math.round((transactions.filter(t => t.status === 'matched').length / transactions.length) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connected Accounts */}
        {connections.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {connections.map((conn) => (
                <div key={conn.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{conn.institution_name} - {conn.account_name} {conn.account_id}</div>
                      <div className="text-sm text-muted-foreground">
                        Last synced: {conn.last_synced_at ? format(new Date(conn.last_synced_at), 'h:mm a') : 'Never'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="rules">Matching Rules ({rules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <Card key={tx.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-sm text-muted-foreground w-20">
                          {format(new Date(tx.transaction_date), 'd MMM')}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{tx.description}</div>
                          {tx.status === 'pending' && tx.category_auto && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              Suggested: {tx.category_auto}
                              {tx.property_id_suggested && ' - 14 Oak Street'}
                              <span className="text-green-600 text-xs">(95% match)</span>
                            </div>
                          )}
                          {tx.status === 'matched' && (
                            <div className="text-sm text-muted-foreground">
                              {tx.category_confirmed} - 14 Oak Street
                            </div>
                          )}
                        </div>
                        <div className={cn(
                          "font-semibold text-right w-24",
                          tx.amount > 0 ? "text-green-600" : "text-foreground"
                        )}>
                          {tx.amount > 0 ? '+' : ''}£{Math.abs(tx.amount).toFixed(2)}
                        </div>
                        <Badge className={getStatusBadge(tx.status)} variant="secondary">
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {tx.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleIgnore(tx.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleConfirm(tx.id, tx.description || '')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                          </>
                        )}
                        {tx.status === 'matched' && (
                          <Button variant="ghost" size="sm">
                            View
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <div className="flex justify-end">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Matching Rules</CardTitle>
                <CardDescription>Rules to automatically categorize and assign transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{rule.rule_name}</div>
                      <div className="text-sm text-muted-foreground">
                        "{rule.match_value}" {rule.match_type} → {rule.assign_category}
                        {rule.assign_property_id && ', 14 Oak Street'}
                        {rule.auto_create && (
                          <Badge variant="secondary" className="ml-2 text-xs">Auto-create</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

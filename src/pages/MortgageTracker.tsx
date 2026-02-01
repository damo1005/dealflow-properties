import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Plus, AlertTriangle, TrendingUp, Building2, Percent, CreditCard, Calendar } from "lucide-react";
import { useMortgageTrackerStore } from "@/stores/mortgageTrackerStore";
import { AddMortgageDialog } from "@/components/mortgages/AddMortgageDialog";
import { MortgageCard } from "@/components/mortgages/MortgageCard";

export default function MortgageTracker() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { mortgages, getAlerts, getSummary } = useMortgageTrackerStore();
  
  const alerts = getAlerts();
  const summary = getSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <AppLayout 
      title="Mortgage Tracker" 
      actions={
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Mortgage
        </Button>
      }
    >
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Remortgage Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.mortgage.id}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'critical' ? 'bg-destructive/10 border-destructive/30' :
                  alert.severity === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-muted border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{alert.mortgage.property_address}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.mortgage.lender_name} • {alert.mortgage.current_rate}% fixed ending in {alert.days_remaining} days
                    </p>
                    {alert.svr_impact && (
                      <p className="text-sm text-destructive mt-1">
                        SVR impact: +{formatCurrency(alert.svr_impact)}/month if not remortgaged
                      </p>
                    )}
                  </div>
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.days_remaining} days
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">Get Quotes</Button>
                  <Button size="sm" variant="ghost">Set Reminder</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm">Total Debt</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(summary.total_debt)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Monthly Cost</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(summary.monthly_cost)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Percent className="h-4 w-4" />
              <span className="text-sm">Avg Rate</span>
            </div>
            <p className="text-2xl font-bold">{summary.avg_rate.toFixed(2)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Portfolio LTV</span>
            </div>
            <p className="text-2xl font-bold">{summary.portfolio_ltv.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Annual Interest</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(summary.annual_interest)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mortgage List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Mortgages</h2>
        {mortgages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No mortgages yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your mortgages to track deals and get remortgage alerts.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Mortgage
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {mortgages.map((mortgage) => (
              <MortgageCard key={mortgage.id} mortgage={mortgage} />
            ))}
          </div>
        )}
      </div>

      <AddMortgageDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </AppLayout>
  );
}

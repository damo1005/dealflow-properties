import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Eye, CreditCard, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mortgage } from "@/types/mortgage";

interface MortgageCardProps {
  mortgage: Mortgage;
}

export function MortgageCard({ mortgage }: MortgageCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  // Calculate deal progress
  const getDealProgress = () => {
    if (!mortgage.deal_start_date || !mortgage.deal_end_date) return null;
    
    const start = new Date(mortgage.deal_start_date).getTime();
    const end = new Date(mortgage.deal_end_date).getTime();
    const now = Date.now();
    
    const total = end - start;
    const elapsed = now - start;
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    
    const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    
    return { progress, daysRemaining };
  };

  const dealProgress = getDealProgress();

  // Calculate LTV (would need property value in real implementation)
  const estimatedPropertyValue = mortgage.original_amount / 0.75; // Assume 75% LTV at purchase
  const currentLtv = (mortgage.current_balance / estimatedPropertyValue) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{mortgage.property_address}</h3>
            <p className="text-muted-foreground">
              {mortgage.lender_name} • {mortgage.account_number}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mortgage.rate_type === 'fixed' ? 'default' : 'secondary'}>
              {mortgage.rate_type}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record Payment
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Get Quotes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-lg font-semibold">{formatCurrency(mortgage.current_balance)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rate</p>
            <p className="text-lg font-semibold">{mortgage.current_rate}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">LTV</p>
            <p className="text-lg font-semibold">{currentLtv.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-lg font-semibold">{formatCurrency(mortgage.monthly_payment || 0)}</p>
          </div>
        </div>

        {dealProgress && mortgage.deal_end_date && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Deal Period</span>
              <span className={dealProgress.daysRemaining <= 90 ? 'text-destructive font-medium' : ''}>
                {dealProgress.daysRemaining} days remaining
              </span>
            </div>
            <Progress value={dealProgress.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{mortgage.deal_start_date}</span>
              <span>{mortgage.deal_end_date}</span>
            </div>
          </div>
        )}

        {mortgage.svr_rate && dealProgress && dealProgress.daysRemaining <= 90 && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm">
              <span className="font-medium text-destructive">SVR Warning:</span>{' '}
              Rate will increase to {mortgage.svr_rate}% (+{(mortgage.svr_rate - mortgage.current_rate).toFixed(2)}%) 
              if not remortgaged
            </p>
          </div>
        )}

        {mortgage.erc_percent && mortgage.erc_end_date && (
          <div className="mt-3 text-sm text-muted-foreground">
            <span className="font-medium">ERC:</span> {mortgage.erc_percent}% until {mortgage.erc_end_date}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

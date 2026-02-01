import { useState, useEffect } from "react";
import { Building2, TrendingUp, Calculator, BadgeCheck, Percent, Clock } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MortgageCalculator } from "@/components/mortgages/MortgageCalculator";
import { MortgageFilters } from "@/components/mortgages/MortgageFilters";
import { MortgageResults } from "@/components/mortgages/MortgageResults";
import { useMortgageStore } from "@/stores/mortgageStore";
import { supabase } from "@/integrations/supabase/client";

export default function Mortgages() {
  const { products, setProducts, isLoading, setIsLoading, loanAmount, ltv } = useMortgageStore();
  const [hasSearched, setHasSearched] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mortgage_products')
        .select('*')
        .eq('is_active', true)
        .order('rate', { ascending: true });

      if (error) throw error;

      // Map database fields to store format
      const mappedProducts = (data || []).map(p => ({
        id: p.id,
        lender: p.lender,
        product_name: p.product_name || '',
        rate: Number(p.rate),
        initial_rate_period: p.initial_rate_period || 60,
        mortgage_type: p.mortgage_type || 'btl',
        rate_type: p.rate_type || 'fixed',
        max_ltv: Number(p.max_ltv) || 75,
        min_loan: p.min_loan || 25000,
        max_loan: p.max_loan || 2000000,
        product_fee: p.product_fee || 0,
        cashback: p.cashback || 0,
        is_active: p.is_active,
      }));

      setProducts(mappedProducts);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching mortgage products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate best rate from current products
  const bestRate = products.length > 0 
    ? Math.min(...products.filter(p => ltv <= p.max_ltv).map(p => p.rate))
    : null;

  return (
    <AppLayout title="Mortgage Comparison">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mortgage Comparison</h1>
            <p className="text-muted-foreground">
              Find the best BTL mortgage rates from 90+ lenders
            </p>
          </div>
          <Badge variant="outline" className="gap-2 text-green-600 border-green-600 self-start">
            <BadgeCheck className="h-4 w-4" />
            Fee-free broker service
          </Badge>
        </div>

        {/* Info Banner */}
        <Alert className="bg-primary/5 border-primary/20">
          <TrendingUp className="h-4 w-4 text-primary" />
          <AlertDescription>
            💰 <strong>Save money with our broker partner.</strong> We get paid by lenders, not you. 
            Apply through us and get access to exclusive rates.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Percent className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {bestRate ? `${bestRate.toFixed(2)}%` : '---'}
                  </p>
                  <p className="text-xs text-muted-foreground">Best BTL Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">90+</p>
                  <p className="text-xs text-muted-foreground">Lenders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calculator className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(loanAmount)}</p>
                  <p className="text-xs text-muted-foreground">Loan Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-xs text-muted-foreground">Decision Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Left Sidebar - Calculator & Filters */}
          <div className="lg:col-span-1 space-y-6">
            <MortgageCalculator onCompare={fetchProducts} />
            {hasSearched && <MortgageFilters />}
          </div>

          {/* Right - Results */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {hasSearched ? 'Available Mortgages' : 'Find Your Perfect Mortgage'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MortgageResults products={products} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Info */}
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  DealFlow is a mortgage introducer. We introduce customers to Mojo Mortgages, 
                  who are authorised and regulated by the FCA (FRN 699607).
                </p>
                <p className="mt-1">
                  We may receive a commission if you take out a mortgage through our partners. 
                  This does not affect the price you pay.
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                <BadgeCheck className="h-3 w-3 mr-1" />
                FCA Regulated
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

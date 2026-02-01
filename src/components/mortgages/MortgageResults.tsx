import { useState, useMemo } from "react";
import { Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMortgageStore, MortgageProduct } from "@/stores/mortgageStore";
import { MortgageProductCard } from "./MortgageProductCard";
import { MortgageApplyDialog } from "./MortgageApplyDialog";

interface MortgageResultsProps {
  products: MortgageProduct[];
  isLoading: boolean;
}

export function MortgageResults({ products, isLoading }: MortgageResultsProps) {
  const [selectedProduct, setSelectedProduct] = useState<MortgageProduct | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const {
    loanAmount,
    ltv,
    termYears,
    rateType,
    fixedPeriod,
    maxFee,
    sortBy,
    calculateMonthlyPayment,
  } = useMortgageStore();

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      // LTV check
      if (ltv > p.max_ltv) return false;
      
      // Loan amount check
      if (loanAmount < p.min_loan || loanAmount > p.max_loan) return false;
      
      // Rate type filter
      if (rateType !== 'all' && p.rate_type !== rateType) return false;
      
      // Fixed period filter
      if (fixedPeriod !== 'all') {
        const periodMonths = parseInt(fixedPeriod) * 12;
        if (p.initial_rate_period !== periodMonths) return false;
      }
      
      // Max fee filter
      if (maxFee !== null && p.product_fee > maxFee) return false;
      
      return true;
    });

    // Calculate monthly payments and total costs
    const withCalculations = filtered.map(p => {
      const monthlyPayment = calculateMonthlyPayment(loanAmount, p.rate, termYears);
      const periodYears = p.initial_rate_period / 12;
      const totalCost = (monthlyPayment * p.initial_rate_period) + p.product_fee / 100;
      
      return {
        ...p,
        monthlyPayment,
        totalCost,
      };
    });

    // Sort
    return withCalculations.sort((a, b) => {
      switch (sortBy) {
        case 'rate':
          return a.rate - b.rate;
        case 'fee':
          return a.product_fee - b.product_fee;
        case 'monthly':
          return a.monthlyPayment - b.monthlyPayment;
        case 'total':
          return a.totalCost - b.totalCost;
        default:
          return a.rate - b.rate;
      }
    });
  }, [products, loanAmount, ltv, termYears, rateType, fixedPeriod, maxFee, sortBy, calculateMonthlyPayment]);

  const handleApply = (product: MortgageProduct) => {
    setSelectedProduct(product);
    setApplyDialogOpen(true);
  };

  const handleConfirmApply = () => {
    // Track the referral
    console.log('Referral confirmed for:', selectedProduct?.lender);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Searching for the best rates...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Ready to Compare</h3>
        <p className="text-muted-foreground max-w-md">
          Enter your property details and click "Compare Rates" to see the best mortgage deals.
        </p>
      </div>
    );
  }

  if (filteredAndSortedProducts.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No mortgages match your criteria. Try adjusting your filters or reducing your LTV.
        </AlertDescription>
      </Alert>
    );
  }

  const bestRate = filteredAndSortedProducts[0];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredAndSortedProducts.length} mortgages found
        </p>
        <p className="text-sm">
          Best rate: <span className="font-bold text-primary">{bestRate.rate.toFixed(2)}%</span> with {bestRate.lender}
        </p>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredAndSortedProducts.map((product, index) => (
          <MortgageProductCard
            key={product.id}
            product={product}
            monthlyPayment={product.monthlyPayment}
            totalCost={product.totalCost}
            rank={sortBy === 'rate' ? index + 1 : undefined}
            onApply={handleApply}
          />
        ))}
      </div>

      {/* Apply Dialog */}
      <MortgageApplyDialog
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
        product={selectedProduct}
        loanAmount={loanAmount}
        onConfirm={handleConfirmApply}
      />
    </div>
  );
}

import { useState } from "react";
import { ExternalLink, Shield, CheckCircle2, BadgeCheck, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MortgageProduct } from "@/stores/mortgageStore";

interface MortgageApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: MortgageProduct | null;
  loanAmount: number;
  onConfirm: () => void;
}

export function MortgageApplyDialog({
  open,
  onOpenChange,
  product,
  loanAmount,
  onConfirm,
}: MortgageApplyDialogProps) {
  const [agreed, setAgreed] = useState(false);

  if (!product) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleContinue = () => {
    // Generate tracking URL for affiliate
    const referralUrl = `https://www.mojomortgages.com/apply?ref=dealflow&lender=${encodeURIComponent(product.lender)}&amount=${loanAmount}`;
    
    // Track the referral (in production, this would be saved to database)
    console.log('Mortgage referral:', {
      partner: 'mojo',
      lender: product.lender,
      rate: product.rate,
      loanAmount,
      referralUrl,
    });

    onConfirm();
    
    // Open in new tab
    window.open(referralUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for {product.lender} Mortgage</DialogTitle>
          <DialogDescription>
            We've partnered with Mojo Mortgages to help you apply
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{product.lender}</p>
                <p className="text-sm text-muted-foreground">{product.product_name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{product.rate.toFixed(2)}%</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(loanAmount)} loan
                </p>
              </div>
            </div>
          </div>

          {/* Broker Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BadgeCheck className="h-5 w-5 text-blue-500" />
              <span>Why use Mojo Mortgages?</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Access to 90+ lenders (not just {product.lender})
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                May find you an even better deal
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Handle all paperwork for you
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                100% free service (lenders pay them)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Increase your approval chances
              </li>
            </ul>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium text-sm">FCA Regulated Broker</p>
              <p className="text-xs text-muted-foreground">
                Award-winning service with 4.8★ Trustpilot rating
              </p>
            </div>
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
              I agree to share my details with Mojo Mortgages for my application.
              I understand this is a referral and DealFlow may receive a commission.
            </Label>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!agreed} className="gap-2">
            Continue to Mojo
            <ExternalLink className="h-4 w-4" />
          </Button>
        </DialogFooter>

        {/* Alternative Contact */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Prefer to talk? Call Mojo on{' '}
            <a href="tel:03301234567" className="text-primary hover:underline">
              <Phone className="h-3 w-3 inline mr-1" />
              0330 123 4567
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

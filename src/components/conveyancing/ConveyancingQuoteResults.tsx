import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConveyancingStore } from "@/stores/conveyancingStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Scale, Star, Check, Clock, ExternalLink, Lightbulb, Shield } from "lucide-react";
import { toast } from "sonner";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function ConveyancingQuoteResults() {
  const { wizardData, generatedQuotes, setCurrentStep } = useConveyancingStore();
  const [showInstructDialog, setShowInstructDialog] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<{ name: string; id: string; total: number } | null>(null);

  const handleInstruct = (firmId: string, firmName: string, total: number) => {
    setSelectedFirm({ name: firmName, id: firmId, total });
    setShowInstructDialog(true);
  };

  const handleConfirmInstruct = () => {
    if (selectedFirm) {
      const trackingId = `DFW-CONV-${Date.now()}`;
      toast.success(`Instructing ${selectedFirm.name}...`, {
        description: "Reference: " + trackingId,
      });
      setShowInstructDialog(false);
    }
  };

  if (generatedQuotes.length === 0) {
    return (
      <div className="text-center py-12">
        <Scale className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No quotes available</h3>
        <p className="text-muted-foreground">Please complete all steps to get quotes</p>
      </div>
    );
  }

  const bestPrice = generatedQuotes[0];
  const fastest = [...generatedQuotes].sort((a, b) => a.avg_completion_days - b.avg_completion_days)[0];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Transaction</p>
              <p className="font-medium capitalize">{wizardData.transactionType.replace('_', ' & ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">{formatCurrency(wizardData.purchasePrice || wizardData.salePrice)}</p>
            </div>
            <div className="flex gap-2">
              {wizardData.isBtl && <Badge variant="secondary">BTL</Badge>}
              {wizardData.isLtdCompany && <Badge variant="secondary">Ltd Company</Badge>}
              {wizardData.purchasePropertyType === 'leasehold' && <Badge variant="secondary">Leasehold</Badge>}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{generatedQuotes.length} quotes</p>
              <p className="text-lg font-bold text-primary">
                Best price: {formatCurrency(bestPrice.total_cost)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Cards */}
      <div className="space-y-4">
        {generatedQuotes.map((quote, index) => {
          const isBestPrice = index === 0;
          const isFastest = quote.firm_id === fastest.firm_id && !isBestPrice;
          
          return (
            <Card 
              key={quote.firm_id}
              className={`relative overflow-hidden ${isBestPrice ? 'border-green-500 border-2' : isFastest ? 'border-blue-500 border-2' : ''}`}
            >
              {(isBestPrice || isFastest) && (
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium text-white ${isBestPrice ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {isBestPrice ? '⭐ BEST VALUE' : '⚡ FASTEST'}
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Firm Info */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-2">
                      <Scale className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold">{quote.firm_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{quote.trustpilot_rating}</span>
                      <span className="text-xs text-muted-foreground">({quote.reviews_count.toLocaleString()})</span>
                    </div>
                    {quote.cqs_accredited && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        CQS Accredited
                      </Badge>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">Legal Fee</p>
                    <p className="text-2xl font-bold">{formatCurrency(quote.legal_fee)}</p>
                    <p className="text-sm text-muted-foreground">
                      + {formatCurrency(quote.disbursements)} disbursements
                    </p>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(quote.total_cost)} total
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">What's included:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {quote.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>Avg completion: {quote.avg_completion_days} days</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => handleInstruct(quote.firm_id, quote.firm_name, quote.total_cost)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Instruct {quote.firm_name.split(' ')[0]}
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Full Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  {generatedQuotes.slice(0, 4).map((q) => (
                    <TableHead key={q.firm_id} className="text-center">
                      {q.firm_name.split(' ')[0]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Legal Fee</TableCell>
                  {generatedQuotes.slice(0, 4).map((q) => (
                    <TableCell key={q.firm_id} className="text-center">
                      {formatCurrency(q.legal_fee)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Cost</TableCell>
                  {generatedQuotes.slice(0, 4).map((q, i) => (
                    <TableCell key={q.firm_id} className="text-center">
                      <span className={i === 0 ? 'text-green-600 font-bold' : ''}>
                        {formatCurrency(q.total_cost)}
                        {i === 0 && <Check className="h-4 w-4 inline ml-1" />}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rating</TableCell>
                  {generatedQuotes.slice(0, 4).map((q) => (
                    <TableCell key={q.firm_id} className="text-center">
                      <Star className="h-4 w-4 inline fill-amber-400 text-amber-400" />
                      {q.trustpilot_rating}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Avg Days</TableCell>
                  {generatedQuotes.slice(0, 4).map((q) => (
                    <TableCell key={q.firm_id} className="text-center">
                      {q.avg_completion_days}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">No Sale No Fee</TableCell>
                  {generatedQuotes.slice(0, 4).map((q) => (
                    <TableCell key={q.firm_id} className="text-center">
                      {q.offers_no_sale_no_fee ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Decision Helper */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Lightbulb className="h-5 w-5" />
            Which Should You Choose?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200">
              Best Overall: {bestPrice.firm_name}
            </p>
            <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 mt-1">
              <li>Lowest total cost ({formatCurrency(bestPrice.total_cost)})</li>
              <li>{bestPrice.trustpilot_rating}★ rating from {bestPrice.reviews_count.toLocaleString()} reviews</li>
              {bestPrice.offers_no_sale_no_fee && <li>No completion, no fee protection</li>}
            </ul>
          </div>
          {fastest.firm_id !== bestPrice.firm_id && (
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Fastest: {fastest.firm_name}
              </p>
              <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 mt-1">
                <li>Average {fastest.avg_completion_days} days to completion</li>
                <li>Premium for speed: +{formatCurrency(fastest.total_cost - bestPrice.total_cost)}</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruct Dialog */}
      <Dialog open={showInstructDialog} onOpenChange={setShowInstructDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instructing {selectedFirm?.name}...</DialogTitle>
            <DialogDescription>
              We're sending your details to start your conveyancing.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Your Reference</p>
              <p className="font-mono font-medium">DFW-CONV-{Date.now()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>{selectedFirm?.name} will email you a welcome pack</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>You'll complete ID verification online</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>Track progress in your dashboard</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInstructDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmInstruct}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Continue to {selectedFirm?.name?.split(' ')[0]}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

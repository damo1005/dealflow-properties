import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Star } from "lucide-react";
import type { ProviderQuote, InsuranceProvider } from "@/types/insurance";

interface QuoteComparisonTableProps {
  quotes: ProviderQuote[];
  providers: InsuranceProvider[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function QuoteComparisonTable({ quotes, providers }: QuoteComparisonTableProps) {
  const getProvider = (id: string) => providers.find(p => p.id === id);

  // Find best values for highlighting
  const lowestPrice = Math.min(...quotes.map(q => q.annual_premium));
  const lowestExcess = Math.min(...quotes.map(q => q.excess));
  const highestRating = Math.max(...quotes.map(q => getProvider(q.provider_id)?.trustpilot_rating || 0));
  const highestRentGuarantee = Math.max(...quotes.map(q => (q.rent_guarantee_limit || 0) * (q.rent_guarantee_months || 0)));

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            {quotes.slice(0, 4).map((quote) => (
              <TableHead key={quote.provider_id} className="text-center">
                {quote.provider_name.split(' ')[0]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Price */}
          <TableRow>
            <TableCell className="font-medium">Price</TableCell>
            {quotes.slice(0, 4).map((quote) => (
              <TableCell key={quote.provider_id} className="text-center">
                <span className={quote.annual_premium === lowestPrice ? 'text-green-600 font-bold' : ''}>
                  {formatCurrency(quote.annual_premium)}
                </span>
                {quote.annual_premium === lowestPrice && (
                  <Check className="h-4 w-4 text-green-600 inline ml-1" />
                )}
              </TableCell>
            ))}
          </TableRow>

          {/* Buildings Cover */}
          <TableRow>
            <TableCell className="font-medium">Buildings</TableCell>
            {quotes.slice(0, 4).map((quote) => (
              <TableCell key={quote.provider_id} className="text-center">
                {formatCurrency(quote.buildings_cover)}
              </TableCell>
            ))}
          </TableRow>

          {/* Rent Guarantee */}
          <TableRow>
            <TableCell className="font-medium">Rent Guarantee</TableCell>
            {quotes.slice(0, 4).map((quote) => {
              const total = (quote.rent_guarantee_limit || 0) * (quote.rent_guarantee_months || 0);
              const isBest = total === highestRentGuarantee && total > 0;
              return (
                <TableCell key={quote.provider_id} className="text-center">
                  {quote.rent_guarantee_limit ? (
                    <span className={isBest ? 'text-green-600 font-bold' : ''}>
                      {formatCurrency(quote.rent_guarantee_limit)}/{quote.rent_guarantee_months}mo
                      {isBest && <Check className="h-4 w-4 text-green-600 inline ml-1" />}
                    </span>
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </TableCell>
              );
            })}
          </TableRow>

          {/* Legal Expenses */}
          <TableRow>
            <TableCell className="font-medium">Legal Expenses</TableCell>
            {quotes.slice(0, 4).map((quote) => (
              <TableCell key={quote.provider_id} className="text-center">
                {quote.legal_expenses_limit ? (
                  formatCurrency(quote.legal_expenses_limit)
                ) : (
                  <X className="h-4 w-4 text-muted-foreground mx-auto" />
                )}
              </TableCell>
            ))}
          </TableRow>

          {/* Emergency */}
          <TableRow>
            <TableCell className="font-medium">Emergency</TableCell>
            {quotes.slice(0, 4).map((quote) => (
              <TableCell key={quote.provider_id} className="text-center">
                {quote.has_emergency_cover ? (
                  <Check className="h-4 w-4 text-green-600 mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground mx-auto" />
                )}
              </TableCell>
            ))}
          </TableRow>

          {/* Excess */}
          <TableRow>
            <TableCell className="font-medium">Excess</TableCell>
            {quotes.slice(0, 4).map((quote) => (
              <TableCell key={quote.provider_id} className="text-center">
                <span className={quote.excess === lowestExcess ? 'text-green-600 font-bold' : ''}>
                  {formatCurrency(quote.excess)}
                </span>
                {quote.excess === lowestExcess && (
                  <Check className="h-4 w-4 text-green-600 inline ml-1" />
                )}
              </TableCell>
            ))}
          </TableRow>

          {/* Rating */}
          <TableRow>
            <TableCell className="font-medium">Rating</TableCell>
            {quotes.slice(0, 4).map((quote) => {
              const provider = getProvider(quote.provider_id);
              const rating = provider?.trustpilot_rating || 0;
              const isBest = rating === highestRating;
              return (
                <TableCell key={quote.provider_id} className="text-center">
                  <span className={isBest ? 'text-amber-500 font-bold' : ''}>
                    <Star className="h-4 w-4 inline fill-amber-400 text-amber-400" />
                    {rating}
                  </span>
                  {isBest && <Check className="h-4 w-4 text-green-600 inline ml-1" />}
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

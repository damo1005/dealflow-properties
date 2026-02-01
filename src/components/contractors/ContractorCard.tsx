import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Contractor } from "@/types/contractor";
import { Star, Check, Shield, Zap, MapPin, Phone } from "lucide-react";

interface ContractorCardProps {
  contractor: Contractor;
  onViewProfile: () => void;
  onRequestQuote: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function ContractorCard({ contractor, onViewProfile, onRequestQuote }: ContractorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar/Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {contractor.business_name.charAt(0)}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{contractor.business_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 font-medium">{contractor.avg_rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({contractor.total_reviews} reviews)
                  </span>
                </div>
              </div>
              {contractor.emergency_callout && (
                <Badge className="bg-red-500 hover:bg-red-600">
                  <Zap className="h-3 w-3 mr-1" />
                  Emergency
                </Badge>
              )}
            </div>

            {/* Qualifications */}
            <div className="flex flex-wrap gap-2 mt-3">
              {contractor.is_gas_safe_registered && (
                <Badge variant="outline" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Gas Safe ({contractor.gas_safe_number})
                </Badge>
              )}
              {contractor.is_niceic_registered && (
                <Badge variant="outline" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  NICEIC Approved
                </Badge>
              )}
              {contractor.has_public_liability && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Insured
                </Badge>
              )}
              {contractor.dbs_checked && (
                <Badge variant="outline" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  DBS Checked
                </Badge>
              )}
              {contractor.is_vetted && (
                <Badge variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Coverage */}
            {contractor.coverage_areas && contractor.coverage_areas.length > 0 && (
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Coverage: {contractor.coverage_areas.slice(0, 3).join(', ')}</span>
              </div>
            )}

            {/* Bio */}
            {contractor.bio && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {contractor.bio}
              </p>
            )}

            {/* Pricing */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              {contractor.hourly_rate && (
                <div>
                  <span className="text-muted-foreground">Hourly:</span>
                  <span className="font-medium ml-1">{formatCurrency(contractor.hourly_rate)}</span>
                </div>
              )}
              {contractor.callout_fee && (
                <div>
                  <span className="text-muted-foreground">Callout:</span>
                  <span className="font-medium ml-1">{formatCurrency(contractor.callout_fee)}</span>
                </div>
              )}
              {contractor.day_rate && (
                <div>
                  <span className="text-muted-foreground">Day rate:</span>
                  <span className="font-medium ml-1">{formatCurrency(contractor.day_rate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onViewProfile}>
            View Profile
          </Button>
          <Button className="flex-1" onClick={onRequestQuote}>
            Request Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

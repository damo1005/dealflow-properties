import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import type { LandRegistryData, PricePaidRecord, PROPERTY_TYPE_LABELS, TENURE_LABELS } from "@/types/landRegistry";
import {
  RefreshCw,
  Building,
  User,
  Calendar,
  PoundSterling,
  AlertTriangle,
  Check,
  FileText,
  Map,
  Loader2,
  History,
  ExternalLink,
  Shield,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface LandRegistryTabProps {
  propertyAddress: string;
  postcode: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

const PROPERTY_TYPES: Record<string, string> = {
  D: "Detached",
  S: "Semi-detached",
  T: "Terraced",
  F: "Flat/Maisonette",
  O: "Other",
};

export function LandRegistryTab({ propertyAddress, postcode }: LandRegistryTabProps) {
  const [data, setData] = useState<LandRegistryData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePaidRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchData(false);
  }, [propertyAddress, postcode]);

  const fetchData = async (forceRefresh: boolean) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("land-registry-fetch", {
        body: { address: propertyAddress, postcode, forceRefresh },
      });

      if (error) throw error;

      if (response.success) {
        setData(response.data);
        setPriceHistory(response.priceHistory || []);
        setLastUpdated(response.data?.last_refreshed_at);
        
        if (response.source === "mock") {
          toast.info("Using demo data", { description: response.message });
        }
      } else {
        toast.error("Failed to fetch data", { description: response.error });
      }
    } catch (error) {
      console.error("Error fetching Land Registry data:", error);
      toast.error("Failed to fetch Land Registry data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
    toast.info("Refreshing Land Registry data...");
  };

  if (isLoading && !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading Land Registry data...</span>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Land Registry Data</h3>
          <p className="text-muted-foreground mb-4">
            Click below to fetch ownership and title information
          </p>
          <Button onClick={() => fetchData(false)} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Fetch Land Registry Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  const daysSinceUpdate = lastUpdated
    ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Land Registry Information
          </h3>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {daysSinceUpdate === 0 ? "today" : `${daysSinceUpdate} days ago`}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Title Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Title Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Title Number</p>
              <p className="font-mono font-medium">{data.title_number || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tenure</p>
              <Badge variant={data.tenure === "freehold" ? "default" : "secondary"}>
                {data.tenure ? data.tenure.charAt(0).toUpperCase() + data.tenure.slice(1) : "Unknown"}
              </Badge>
            </div>
          </div>
          {data.tenure === "leasehold" && data.lease_term_years && (
            <>
              <Separator />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Lease Term</p>
                  <p className="font-medium">{data.lease_term_years} years</p>
                </div>
                {data.lease_start_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Lease Start</p>
                    <p className="font-medium">{format(new Date(data.lease_start_date), "dd MMM yyyy")}</p>
                  </div>
                )}
                {data.lease_expiry_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Lease Expiry</p>
                    <p className="font-medium">{format(new Date(data.lease_expiry_date), "dd MMM yyyy")}</p>
                  </div>
                )}
                {data.ground_rent && (
                  <div>
                    <p className="text-sm text-muted-foreground">Ground Rent</p>
                    <p className="font-medium">{formatCurrency(data.ground_rent)}/year</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Ownership */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Registered Owner</p>
            <p className="font-medium">{data.proprietor_name || "Not available"}</p>
          </div>
          {data.proprietorship_category && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{data.proprietorship_category}</Badge>
              {data.company_registration_number && (
                <span className="text-sm text-muted-foreground">
                  Company No: {data.company_registration_number}
                </span>
              )}
            </div>
          )}
          {data.date_proprietor_added && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Added to register: {format(new Date(data.date_proprietor_added), "dd MMM yyyy")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charges & Mortgages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PoundSterling className="h-4 w-4" />
            Charges & Mortgages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.has_charges && data.charges && data.charges.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">{data.charge_count} charge(s) registered</span>
              </div>
              {data.charges.map((charge, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">{index + 1}.</span> Charge dated {charge.date}
                  </p>
                  <p className="text-sm text-muted-foreground">Chargee: {charge.chargee}</p>
                  <p className="text-sm text-muted-foreground">Type: {charge.type}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span>No charges registered</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restrictions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Restrictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.has_restrictions && data.restrictions && data.restrictions.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">{data.restrictions.length} restriction(s) registered</span>
              </div>
              {data.restrictions.map((restriction, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{restriction.type}</p>
                  <p className="text-sm text-muted-foreground">{restriction.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span>No restrictions registered</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sale History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Sale History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.last_sale_date && data.last_sale_price ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Last Sale</p>
                  <p className="font-medium">{format(new Date(data.last_sale_date), "dd MMM yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-primary">{formatCurrency(data.last_sale_price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{data.last_sale_type || "Standard"}</p>
                </div>
              </div>
              {priceHistory.length > 1 && (
                <Button variant="outline" size="sm" onClick={() => setShowPriceHistory(true)}>
                  View Full Price History ({priceHistory.length})
                </Button>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">No sale history available</p>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-muted-foreground" />
              <span>Title Plan (Map)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled>View PDF</Button>
              <Button variant="ghost" size="sm" disabled>Download</Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Title Register (Summary)</span>
            </div>
            <Button variant="ghost" size="sm" disabled>View - Free</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Official Copy of Register</span>
            </div>
            <Button variant="outline" size="sm" disabled>
              Purchase £3
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">Important Notice</p>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                This Land Registry data is for informational purposes only. For legal or financial
                decisions, obtain an Official Copy of the Register (£3) or consult a solicitor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price History Dialog */}
      <Dialog open={showPriceHistory} onOpenChange={setShowPriceHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sale History - {propertyAddress}</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tenure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceHistory.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{format(new Date(sale.sale_date), "dd MMM yyyy")}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(sale.sale_price)}</TableCell>
                    <TableCell>{sale.property_type ? PROPERTY_TYPES[sale.property_type] : "-"}</TableCell>
                    <TableCell>
                      {sale.duration === "F" ? "Freehold" : sale.duration === "L" ? "Leasehold" : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {priceHistory.length >= 2 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Price Analysis</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Total Appreciation</p>
                  <p className="font-medium text-green-600">
                    {Math.round(
                      ((priceHistory[0].sale_price - priceHistory[priceHistory.length - 1].sale_price) /
                        priceHistory[priceHistory.length - 1].sale_price) *
                        100
                    )}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Since First Record</p>
                  <p className="font-medium">
                    {format(new Date(priceHistory[priceHistory.length - 1].sale_date), "yyyy")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

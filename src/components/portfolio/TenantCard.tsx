import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, Building2, AlertTriangle, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { Tenancy } from "@/types/portfolio";

interface TenantCardProps {
  tenancy: Tenancy;
  propertyAddress?: string;
  paymentStatus?: "up_to_date" | "late" | "arrears";
  daysLate?: number;
  onView: () => void;
  onRecordPayment: () => void;
  onMessage: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function TenantCard({
  tenancy,
  propertyAddress,
  paymentStatus = "up_to_date",
  daysLate = 0,
  onView,
  onRecordPayment,
  onMessage,
}: TenantCardProps) {
  const daysUntilEnd = tenancy.end_date
    ? differenceInDays(new Date(tenancy.end_date), new Date())
    : null;

  const isExpiringSoon = daysUntilEnd !== null && daysUntilEnd < 90 && daysUntilEnd > 0;
  const isExpired = daysUntilEnd !== null && daysUntilEnd <= 0;

  const getPaymentBadge = () => {
    switch (paymentStatus) {
      case "up_to_date":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Up to date
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {daysLate} days late
          </Badge>
        );
      case "arrears":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Arrears
          </Badge>
        );
    }
  };

  const getStatusBadge = () => {
    if (tenancy.status === "ended") {
      return <Badge variant="secondary">Ended</Badge>;
    }
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isExpiringSoon) {
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          {daysUntilEnd} days left
        </Badge>
      );
    }
    return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{tenancy.tenant_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
              </div>
            </div>
          </div>
          {getPaymentBadge()}
        </div>

        {/* Property */}
        {propertyAddress && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{propertyAddress}</span>
          </div>
        )}

        {/* Tenancy dates */}
        <div className="text-sm text-muted-foreground">
          <span>
            {format(new Date(tenancy.start_date), "dd MMM yyyy")} -{" "}
            {tenancy.end_date
              ? format(new Date(tenancy.end_date), "dd MMM yyyy")
              : "Rolling"}
          </span>
        </div>

        {/* Contact */}
        <div className="space-y-1 text-sm">
          {tenancy.tenant_email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${tenancy.tenant_email}`}
                className="text-primary hover:underline truncate"
              >
                {tenancy.tenant_email}
              </a>
            </div>
          )}
          {tenancy.tenant_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${tenancy.tenant_phone}`}
                className="text-primary hover:underline"
              >
                {tenancy.tenant_phone}
              </a>
            </div>
          )}
        </div>

        {/* Rent details */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t text-sm">
          <div>
            <p className="text-muted-foreground">Rent</p>
            <p className="font-semibold">{formatCurrency(tenancy.monthly_rent)}/mo</p>
          </div>
          <div>
            <p className="text-muted-foreground">Deposit</p>
            <p className="font-semibold">{formatCurrency(tenancy.deposit_amount)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onMessage}>
            Message
          </Button>
          <Button size="sm" className="flex-1" onClick={onRecordPayment}>
            Record Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

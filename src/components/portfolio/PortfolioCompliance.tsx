import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from "@/stores/portfolioStore";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Upload,
  Calendar,
  Building2,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { COMPLIANCE_TYPES } from "@/types/portfolio";

export function PortfolioCompliance() {
  const { compliance, properties } = usePortfolioStore();

  const validItems = compliance.filter((c) => c.status === "valid");
  const expiringItems = compliance.filter((c) => c.status === "expiring");
  const expiredItems = compliance.filter((c) => c.status === "expired");

  // Group compliance by type
  const complianceByType = COMPLIANCE_TYPES.map((type) => {
    const items = compliance.filter((c) => c.compliance_type === type.value);
    const valid = items.filter((c) => c.status === "valid").length;
    const expiring = items.filter((c) => c.status === "expiring").length;
    const expired = items.filter((c) => c.status === "expired").length;
    return { ...type, items, valid, expiring, expired, total: items.length };
  }).filter((t) => t.total > 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        );
      case "expiring":
        return (
          <Badge className="bg-yellow-500 text-white">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Valid</span>
            </div>
            <p className="text-3xl font-bold text-green-500 mt-1">
              {validItems.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Expiring Soon</span>
            </div>
            <p className="text-3xl font-bold text-yellow-500 mt-1">
              {expiringItems.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-muted-foreground">Expired</span>
            </div>
            <p className="text-3xl font-bold text-red-500 mt-1">
              {expiredItems.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance by Type */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complianceByType.map((type) => (
          <Card key={type.value}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{type.icon}</span>
                {type.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{type.valid}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{type.expiring}</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{type.expired}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Certificate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Properties Compliance List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance by Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {properties.map((property) => {
            const propertyCompliance = compliance.filter(
              (c) => c.portfolio_property_id === property.id
            );
            const hasExpired = propertyCompliance.some((c) => c.status === "expired");
            const hasExpiring = propertyCompliance.some((c) => c.status === "expiring");

            return (
              <div key={property.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{property.address}</h4>
                      <p className="text-sm text-muted-foreground">{property.postcode}</p>
                    </div>
                  </div>
                  <div>
                    {hasExpired ? (
                      <Badge variant="destructive">Action Required</Badge>
                    ) : hasExpiring ? (
                      <Badge className="bg-yellow-500 text-white">Renew Soon</Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white">All Valid</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {COMPLIANCE_TYPES.slice(0, 4).map((type) => {
                    const item = propertyCompliance.find(
                      (c) => c.compliance_type === type.value
                    );

                    if (!item) {
                      return (
                        <div
                          key={type.value}
                          className="p-3 bg-muted/50 rounded-lg text-center"
                        >
                          <p className="text-xs text-muted-foreground">{type.label}</p>
                          <p className="text-sm font-medium mt-1">Not Added</p>
                          <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                            Add
                          </Button>
                        </div>
                      );
                    }

                    const daysUntilExpiry = differenceInDays(
                      new Date(item.expiry_date),
                      new Date()
                    );

                    return (
                      <div
                        key={type.value}
                        className={`p-3 rounded-lg text-center ${
                          item.status === "expired"
                            ? "bg-red-500/10"
                            : item.status === "expiring"
                            ? "bg-yellow-500/10"
                            : "bg-green-500/10"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground">{type.label}</p>
                        <p className="text-sm font-medium mt-1">
                          {item.status === "expired" ? (
                            <span className="text-red-500">Expired</span>
                          ) : (
                            <span className={item.status === "expiring" ? "text-yellow-600" : "text-green-600"}>
                              {daysUntilExpiry} days
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(item.expiry_date), "dd MMM yyyy")}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {(hasExpired || hasExpiring) && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button size="sm">Schedule Renewal</Button>
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Certificate
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Upcoming Renewals Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Renewals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...expiringItems, ...expiredItems]
              .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())
              .map((item) => {
                const property = properties.find((p) => p.id === item.portfolio_property_id);
                const typeInfo = COMPLIANCE_TYPES.find((t) => t.value === item.compliance_type);
                const daysUntil = differenceInDays(new Date(item.expiry_date), new Date());

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{typeInfo?.icon}</span>
                      <div>
                        <p className="font-medium">{typeInfo?.label}</p>
                        <p className="text-sm text-muted-foreground">{property?.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${daysUntil < 0 ? "text-red-500" : daysUntil < 30 ? "text-yellow-600" : ""}`}>
                        {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.expiry_date), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

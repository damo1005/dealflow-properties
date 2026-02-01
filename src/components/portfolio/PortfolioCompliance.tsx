import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePortfolioStore } from "@/stores/portfolioStore";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Upload,
  Calendar,
  Building2,
  Plus,
  List,
  CalendarDays,
  FileText,
  Phone,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { COMPLIANCE_TYPES } from "@/types/portfolio";
import { AddCertificateWizard, CertificateFormData } from "./AddCertificateWizard";
import { toast } from "sonner";

export function PortfolioCompliance() {
  const { compliance, properties, addCompliance } = usePortfolioStore();
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const validItems = compliance.filter((c) => c.status === "valid");
  const expiringItems = compliance.filter((c) => c.status === "expiring");
  const expiredItems = compliance.filter((c) => c.status === "expired");

  // Group compliance by property
  const complianceByProperty = properties.map((property) => {
    const items = compliance.filter((c) => c.portfolio_property_id === property.id);
    return {
      property,
      items,
      hasExpired: items.some((c) => c.status === "expired"),
      hasExpiring: items.some((c) => c.status === "expiring"),
    };
  });

  const handleAddCertificate = async (data: CertificateFormData) => {
    // In real app, would save to Supabase
    const newCompliance = {
      id: crypto.randomUUID(),
      portfolio_property_id: data.portfolio_property_id,
      compliance_type: data.compliance_type as any,
      certificate_number: data.certificate_number || null,
      issued_date: data.issued_date,
      expiry_date: data.expiry_date,
      certificate_url: null,
      status: "valid" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addCompliance(newCompliance);
    toast.success("Certificate added successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        );
      case "expiring":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
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
              <span className="text-sm text-muted-foreground">Up to Date</span>
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
              <span className="text-sm text-muted-foreground">Overdue</span>
            </div>
            <p className="text-3xl font-bold text-red-500 mt-1">
              {expiredItems.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle & Add Button */}
      <div className="flex justify-between items-center">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "calendar")}>
          <TabsList>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setShowAddWizard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {complianceByProperty.map(({ property, items, hasExpired, hasExpiring }) => (
            <Card key={property.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{property.address}</CardTitle>
                      <p className="text-sm text-muted-foreground">{property.postcode}</p>
                    </div>
                  </div>
                  <div>
                    {hasExpired ? (
                      <Badge variant="destructive">Action Required</Badge>
                    ) : hasExpiring ? (
                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Renew Soon
                      </Badge>
                    ) : items.length > 0 ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        All Valid
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No Certificates</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No certificates added yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const typeInfo = COMPLIANCE_TYPES.find((t) => t.value === item.compliance_type);
                      const daysUntilExpiry = differenceInDays(new Date(item.expiry_date), new Date());

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-lg border ${
                            item.status === "expired"
                              ? "bg-red-500/5 border-red-500/20"
                              : item.status === "expiring"
                              ? "bg-yellow-500/5 border-yellow-500/20"
                              : "bg-green-500/5 border-green-500/20"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{typeInfo?.icon}</span>
                              <div>
                                <p className="font-medium">{typeInfo?.label}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.status === "expired" ? (
                                    <span className="text-red-600">
                                      Expired {Math.abs(daysUntilExpiry)} days ago
                                    </span>
                                  ) : (
                                    <>
                                      Expires{" "}
                                      <span className={daysUntilExpiry < 30 ? "text-yellow-600 font-medium" : ""}>
                                        {format(new Date(item.expiry_date), "dd MMM yyyy")}
                                      </span>
                                      {daysUntilExpiry > 0 && ` (${daysUntilExpiry} days)`}
                                    </>
                                  )}
                                </p>
                                {item.certificate_number && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Cert: {item.certificate_number}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-1" />
                              Renew
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setShowAddWizard(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certificate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
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
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{typeInfo?.icon}</span>
                        <div>
                          <p className="font-medium">{typeInfo?.label}</p>
                          <p className="text-sm text-muted-foreground">{property?.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            daysUntil < 0
                              ? "text-red-500"
                              : daysUntil < 14
                              ? "text-red-500"
                              : daysUntil < 30
                              ? "text-yellow-600"
                              : ""
                          }`}
                        >
                          {daysUntil < 0
                            ? `${Math.abs(daysUntil)} days overdue`
                            : `${daysUntil} days`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(item.expiry_date), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                  );
                })}

              {expiringItems.length === 0 && expiredItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No upcoming renewals
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Certificate Wizard */}
      <AddCertificateWizard
        open={showAddWizard}
        onOpenChange={setShowAddWizard}
        properties={properties}
        onSave={handleAddCertificate}
      />
    </div>
  );
}

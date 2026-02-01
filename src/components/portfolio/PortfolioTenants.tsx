import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Users, Mail, Phone, Calendar, Building2, AlertTriangle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export function PortfolioTenants() {
  const { tenancies, properties } = usePortfolioStore();

  const activeTenancies = tenancies.filter((t) => t.status === "active");
  const endedTenancies = tenancies.filter((t) => t.status === "ended");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  // Check for upcoming rent due (mock - would be based on payment dates)
  const upcomingRentDue = activeTenancies.slice(0, 2);

  if (tenancies.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold mb-2">No tenants yet</h3>
          <p className="text-muted-foreground text-center">
            Add properties and tenants to track your rental income
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rent Due Banner */}
      {upcomingRentDue.length > 0 && (
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Rent Due Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingRentDue.map((tenancy) => {
                const property = properties.find(
                  (p) => p.id === tenancy.portfolio_property_id
                );
                return (
                  <div
                    key={tenancy.id}
                    className="flex items-center justify-between bg-background rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{tenancy.tenant_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {property?.address} • {formatCurrency(tenancy.monthly_rent)} due 1st Feb
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Send Reminder
                    </Button>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Send All Reminders
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Tenants */}
      <div>
        <h3 className="font-semibold mb-4">Active Tenants ({activeTenancies.length})</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTenancies.map((tenancy) => {
            const property = properties.find(
              (p) => p.id === tenancy.portfolio_property_id
            );
            const daysUntilEnd = tenancy.end_date
              ? differenceInDays(new Date(tenancy.end_date), new Date())
              : null;

            return (
              <Card key={tenancy.id}>
                <CardContent className="p-4 space-y-4">
                  {/* Tenant Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{tenancy.tenant_name}</h4>
                        <Badge variant="secondary" className="mt-1">
                          Active
                        </Badge>
                      </div>
                    </div>
                    {daysUntilEnd !== null && daysUntilEnd < 90 && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        {daysUntilEnd} days left
                      </Badge>
                    )}
                  </div>

                  {/* Property */}
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{property?.address}</span>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 text-sm">
                    {tenancy.tenant_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${tenancy.tenant_email}`}
                          className="text-primary hover:underline"
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

                  {/* Tenancy Details */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t text-sm">
                    <div>
                      <p className="text-muted-foreground">Monthly Rent</p>
                      <p className="font-semibold">{formatCurrency(tenancy.monthly_rent)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deposit</p>
                      <p className="font-semibold">{formatCurrency(tenancy.deposit_amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">
                        {format(new Date(tenancy.start_date), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">
                        {tenancy.end_date
                          ? format(new Date(tenancy.end_date), "dd MMM yyyy")
                          : "Rolling"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Payments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ended Tenancies */}
      {endedTenancies.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Past Tenants ({endedTenancies.length})</h3>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Tenant</th>
                    <th className="text-left py-3 px-4 font-medium">Property</th>
                    <th className="text-left py-3 px-4 font-medium">Period</th>
                    <th className="text-right py-3 px-4 font-medium">Rent</th>
                  </tr>
                </thead>
                <tbody>
                  {endedTenancies.map((tenancy) => {
                    const property = properties.find(
                      (p) => p.id === tenancy.portfolio_property_id
                    );
                    return (
                      <tr key={tenancy.id} className="border-b">
                        <td className="py-3 px-4">{tenancy.tenant_name}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {property?.address}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {format(new Date(tenancy.start_date), "MMM yyyy")} -{" "}
                          {tenancy.end_date
                            ? format(new Date(tenancy.end_date), "MMM yyyy")
                            : "Present"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(tenancy.monthly_rent)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

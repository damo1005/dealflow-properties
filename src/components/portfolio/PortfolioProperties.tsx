import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from "@/stores/portfolioStore";
import {
  Building2,
  MapPin,
  Bed,
  TrendingUp,
  MoreVertical,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PROPERTY_STATUSES } from "@/types/portfolio";

interface PortfolioPropertiesProps {
  onAddClick: () => void;
}

export function PortfolioProperties({ onAddClick }: PortfolioPropertiesProps) {
  const { properties, tenancies } = usePortfolioStore();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  if (properties.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold mb-2">No properties yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add your first property to start tracking your portfolio
          </p>
          <Button onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => {
        const tenancy = tenancies.find(
          (t) =>
            t.portfolio_property_id === property.id && t.status === "active"
        );
        const status = PROPERTY_STATUSES.find(
          (s) => s.value === property.property_status
        );

        const monthlyIncome = tenancy?.monthly_rent || 0;
        const monthlyExpenses = property.monthly_payment || 0;
        const cashFlow = monthlyIncome - monthlyExpenses;

        return (
          <Card key={property.id} className="overflow-hidden">
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
              <Building2 className="h-16 w-16 text-primary/30" />
              <Badge
                className={`absolute top-3 left-3 ${status?.color} text-white`}
              >
                {status?.label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Property
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardContent className="p-4 space-y-4">
              {/* Address */}
              <div>
                <h3 className="font-semibold line-clamp-1">{property.address}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{property.postcode}</span>
                  <span>•</span>
                  <Bed className="h-3 w-3" />
                  <span>{property.bedrooms} bed {property.property_type}</span>
                </div>
              </div>

              {/* Tenant */}
              {tenancy ? (
                <div className="text-sm">
                  <span className="text-muted-foreground">Tenant:</span>{" "}
                  <span className="font-medium">{tenancy.tenant_name}</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  No active tenant
                </div>
              )}

              {/* Financial metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Value</p>
                  <p className="font-semibold">
                    {formatCurrency(property.current_value || property.purchase_price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Yield</p>
                  <p className="font-semibold">
                    {property.current_yield ? `${property.current_yield}%` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rent</p>
                  <p className="font-semibold">
                    {tenancy ? formatCurrency(tenancy.monthly_rent) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cash Flow</p>
                  <p className={`font-semibold flex items-center gap-1 ${cashFlow >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <TrendingUp className="h-3 w-3" />
                    {formatCurrency(cashFlow)}
                  </p>
                </div>
              </div>

              {/* Strategy badge */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant="outline">{property.investment_strategy}</Badge>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Add Property Card */}
      <Card
        className="border-dashed cursor-pointer hover:border-primary/50 transition-colors"
        onClick={onAddClick}
      >
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px]">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <p className="font-medium">Add Property</p>
          <p className="text-sm text-muted-foreground">
            Track a new investment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { BedDouble, Bath, Sofa, Home, FileText, Zap, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyDetail } from "@/data/mockPropertyDetail";
import { cn } from "@/lib/utils";

interface PropertyKeyDetailsProps {
  property: PropertyDetail;
}

const epcColors: Record<string, string> = {
  A: "bg-green-600",
  B: "bg-green-500",
  C: "bg-yellow-400",
  D: "bg-yellow-500",
  E: "bg-orange-400",
  F: "bg-orange-500",
  G: "bg-red-500",
};

export function PropertyKeyDetails({ property }: PropertyKeyDetailsProps) {
  const [areaUnit, setAreaUnit] = useState<"sqft" | "sqm">("sqft");

  const getFloorArea = () => {
    if (areaUnit === "sqft") {
      return `${property.floorAreaSqft.toLocaleString()} sq ft`;
    }
    return `${Math.round(property.floorAreaSqft * 0.0929).toLocaleString()} sq m`;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Key Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Bedrooms */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BedDouble className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="font-semibold text-foreground">{property.bedrooms}</p>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bath className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="font-semibold text-foreground">{property.bathrooms}</p>
            </div>
          </div>

          {/* Reception Rooms */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sofa className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receptions</p>
              <p className="font-semibold text-foreground">{property.receptionRooms}</p>
            </div>
          </div>

          {/* Property Type */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Property Type</p>
              <p className="font-semibold text-foreground">{property.propertyType}</p>
            </div>
          </div>

          {/* Tenure */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tenure</p>
              <p className="font-semibold text-foreground">{property.tenure}</p>
            </div>
          </div>

          {/* Council Tax */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Council Tax</p>
              <p className="font-semibold text-foreground">Band {property.councilTaxBand}</p>
            </div>
          </div>

          {/* EPC Rating */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">EPC Rating</p>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-white", epcColors[property.epcRating])}>
                  {property.epcRating}
                </Badge>
                <span className="text-sm text-muted-foreground">({property.epcScore})</span>
              </div>
            </div>
          </div>

          {/* Floor Area */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 col-span-2 md:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Ruler className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Floor Area</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">{getFloorArea()}</p>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-6 px-2 rounded-none text-xs",
                      areaUnit === "sqft" && "bg-muted"
                    )}
                    onClick={() => setAreaUnit("sqft")}
                  >
                    sqft
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-6 px-2 rounded-none text-xs",
                      areaUnit === "sqm" && "bg-muted"
                    )}
                    onClick={() => setAreaUnit("sqm")}
                  >
                    sqm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

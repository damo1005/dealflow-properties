import { useState } from "react";
import { FileText, Zap, Key, ExternalLink, Check, X, AlertCircle, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PropertyDetail } from "@/data/mockPropertyDetail";
import { cn } from "@/lib/utils";
import { LandRegistryTab } from "./LandRegistryTab";
import { EPCTab } from "./EPCTab";
import { PlanningTab } from "./PlanningTab";

interface PropertyTabsProps {
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

const epcScoreRanges: Record<string, [number, number]> = {
  A: [92, 100],
  B: [81, 91],
  C: [69, 80],
  D: [55, 68],
  E: [39, 54],
  F: [21, 38],
  G: [1, 20],
};

export function PropertyTabs({ property }: PropertyTabsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Check className="h-4 w-4 text-success" />;
      case "refused":
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <Card className="shadow-card">
      <Tabs defaultValue="land-registry" className="w-full">
        <CardHeader className="pb-0">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="land-registry" className="gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Land Registry</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Planning</span>
            </TabsTrigger>
            <TabsTrigger value="ownership" className="gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Ownership</span>
            </TabsTrigger>
            <TabsTrigger value="epc" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Energy</span>
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Land Registry Tab */}
          <TabsContent value="land-registry" className="mt-0">
            <LandRegistryTab 
              propertyAddress={property.address} 
              postcode={property.postcode || property.address.split(',').pop()?.trim() || ''} 
            />
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="mt-0">
            <PlanningTab 
              propertyAddress={property.address} 
              postcode={property.postcode || property.address.split(',').pop()?.trim() || ''} 
            />
          </TabsContent>

          {/* Ownership Tab */}
          <TabsContent value="ownership" className="mt-0 space-y-4">
            <h4 className="font-medium text-foreground">Ownership History</h4>

            {/* Previous Sales */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Previous Sales (Land Registry)</p>
              <div className="space-y-2">
                {property.previousSales.map((sale, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm">{formatDate(sale.date)}</span>
                    <span className="font-semibold">{formatPrice(sale.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tenure Details */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tenure Details</p>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{property.tenure}</span>
                  {property.tenure === "Leasehold" && property.leaseInfo && (
                    <Badge variant="outline">
                      {property.leaseInfo.yearsRemaining} years remaining
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Leasehold Info */}
            {property.leaseInfo && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Leasehold Charges</p>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Ground Rent (annual)</span>
                    <span className="font-medium">{formatPrice(property.leaseInfo.groundRent)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Service Charge (annual)</span>
                    <span className="font-medium">{formatPrice(property.leaseInfo.serviceCharge)}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* EPC Tab */}
          <TabsContent value="epc" className="mt-0">
            <EPCTab 
              propertyAddress={property.address} 
              postcode={property.postcode || property.address.split(',').pop()?.trim() || ''} 
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

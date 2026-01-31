import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyKeyDetails } from "@/components/property/PropertyKeyDetails";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { PropertyFinancials } from "@/components/property/PropertyFinancials";
import { PropertyInvestment } from "@/components/property/PropertyInvestment";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyAreaStats } from "@/components/property/PropertyAreaStats";
import { PropertyComparables } from "@/components/property/PropertyComparables";
import { PropertyTabs } from "@/components/property/PropertyTabs";
import { PropertyNotes } from "@/components/property/PropertyNotes";
import { PropertyActionBar } from "@/components/property/PropertyActionBar";
import { mockPropertyDetail, PropertyDetail } from "@/data/mockPropertyDetail";
import { useToast } from "@/hooks/use-toast";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading property data
    const loadProperty = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProperty(mockPropertyDetail);
      setIsLoading(false);
    };

    loadProperty();
  }, [id]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Property saved",
      description: isSaved
        ? "Property removed from your saved list"
        : "Property added to your saved list",
    });
  };

  if (isLoading) {
    return (
      <AppLayout title="Property Details">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!property) {
    return (
      <AppLayout title="Property Details">
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
          <p className="text-muted-foreground">
            The property you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Property Details">
      <div className="space-y-6 pb-24">
        {/* Header */}
        <PropertyHeader property={property} isSaved={isSaved} onSave={handleSave} />

        {/* Gallery */}
        <PropertyGallery images={property.images} address={property.address} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <PropertyKeyDetails property={property} />
            <PropertyDescription property={property} />
            <PropertyMap property={property} />
            <PropertyComparables property={property} />
            <PropertyTabs property={property} />
            <PropertyNotes propertyId={property.id} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <PropertyFinancials property={property} />
            <PropertyInvestment property={property} />
            <PropertyAreaStats property={property} />
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <PropertyActionBar propertyId={property.id} agentPhone={property.agent.phone} />
    </AppLayout>
  );
}

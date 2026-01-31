import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/services/propertyDataApi";

interface PropertyContextHeaderProps {
  propertyId: string;
  address: string;
  price: number;
  image?: string;
}

export function PropertyContextHeader({
  propertyId,
  address,
  price,
  image,
}: PropertyContextHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center gap-4 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/property/${propertyId}`)}
          aria-label="Back to property"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          {image && (
            <img
              src={image}
              alt={address}
              className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-semibold text-foreground truncate">{address}</h1>
            <p className="text-sm text-muted-foreground">{formatCurrency(price)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

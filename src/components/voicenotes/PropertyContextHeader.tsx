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
  return (
    <div className="flex items-center gap-3">
      {image && (
        <img
          src={image}
          alt={address}
          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="min-w-0">
        <h1 className="font-semibold text-foreground truncate text-sm">{address}</h1>
        <p className="text-sm text-muted-foreground">{formatCurrency(price)}</p>
      </div>
    </div>
  );
}

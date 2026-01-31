import { useState } from "react";
import { 
  ChevronLeft, 
  Copy, 
  Heart, 
  Share2, 
  Plus, 
  Clock,
  Check,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PropertyDetail } from "@/data/mockPropertyDetail";
import { cn } from "@/lib/utils";

interface PropertyHeaderProps {
  property: PropertyDetail;
  isSaved?: boolean;
  onSave?: () => void;
}

export function PropertyHeader({ property, isSaved, onSave }: PropertyHeaderProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(property.address);
    setCopied(true);
    toast({ title: "Address copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property.address,
        text: `Check out this property: ${property.address}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard" });
    }
  };

  const handleAddToPipeline = (stage: string) => {
    toast({ 
      title: "Added to pipeline",
      description: `Property added to ${stage} stage`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/search")} className="cursor-pointer">
              Search
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/search")} className="cursor-pointer">
              {property.postcode.split(" ")[0]}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">
              {property.address.split(",")[0]}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-2 -ml-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to results
      </Button>

      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left: Address and Badges */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {property.address}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyAddress}
              className="shrink-0 h-8 w-8"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{property.propertyType}</Badge>
            <Badge variant="outline">{property.tenure}</Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {property.daysOnMarket} days on market
            </Badge>
            {property.priceReduced && (
              <Badge className="bg-destructive text-destructive-foreground gap-1">
                <TrendingDown className="h-3 w-3" />
                Price Reduced
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Price and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(property.price)}
              </span>
              {property.originalPrice && property.originalPrice > property.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(property.originalPrice)}
                </span>
              )}
            </div>
            {property.priceHistory.length > 1 && (
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                {property.priceHistory.length} price changes
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onSave}
              className={cn(isSaved && "text-destructive border-destructive")}
            >
              <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add to Pipeline
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["Lead", "Analyzing", "Negotiating", "Due Diligence"].map((stage) => (
                  <DropdownMenuItem
                    key={stage}
                    onClick={() => handleAddToPipeline(stage)}
                  >
                    Add to {stage}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

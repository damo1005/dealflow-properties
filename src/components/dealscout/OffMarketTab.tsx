import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Diamond, 
  Clock, 
  MessageSquare,
  Building,
  MapPin,
  Home,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/types/dealScout";
import { useToast } from "@/hooks/use-toast";

interface OffMarketProperty {
  id: string;
  source_type: string;
  source_name: string;
  source_contact?: any;
  address: string;
  postcode: string;
  property_type: string;
  bedrooms: number;
  price: number;
  description?: string;
  available_from?: string;
  reason_off_market?: string;
  images?: string[];
  expires_at?: string;
  created_at: string;
}

export function OffMarketTab() {
  const [properties, setProperties] = useState<OffMarketProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<OffMarketProperty | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOffMarketProperties();
  }, []);

  const loadOffMarketProperties = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('off_market_properties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties((data || []) as OffMarketProperty[]);
    } catch (error) {
      console.error('Error loading off-market properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnquiry = (property: OffMarketProperty) => {
    setSelectedProperty(property);
    setEnquiryOpen(true);
  };

  const submitEnquiry = async () => {
    toast({
      title: "Enquiry Sent!",
      description: `Your enquiry for ${selectedProperty?.address} has been sent.`,
    });
    setEnquiryOpen(false);
    setSelectedProperty(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Diamond className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Off-Market Opportunities</h3>
            <p className="text-sm text-amber-800">
              These are exclusive properties not listed on public portals. They come from estate agent lists, 
              pocket listings, pre-market testing, and direct owner sales.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      {properties.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Diamond className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Off-Market Properties</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Off-market opportunities are added as they become available. Check back soon or upgrade to get priority access.
          </p>
          <Button>Upgrade to Pro</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <OffMarketCard 
              key={property.id} 
              property={property}
              onEnquiry={() => handleEnquiry(property)}
            />
          ))}
        </div>
      )}

      {/* Enquiry Dialog */}
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
            <DialogDescription>
              Send an enquiry to the source about this off-market property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{selectedProperty?.address}</p>
              <p className="text-sm text-muted-foreground">
                {selectedProperty?.bedrooms} bed {selectedProperty?.property_type} • {selectedProperty?.price ? formatCurrency(selectedProperty.price) : 'POA'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Your Message</Label>
              <Textarea 
                placeholder="I'm interested in this property. Please provide more details."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="serious" />
                <Label htmlFor="serious" className="text-sm">
                  I'm a serious buyer (proof of funds available)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="quick" />
                <Label htmlFor="quick" className="text-sm">
                  I can move quickly (no chain)
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnquiryOpen(false)}>Cancel</Button>
            <Button onClick={submitEnquiry}>Send Enquiry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface OffMarketCardProps {
  property: OffMarketProperty;
  onEnquiry: () => void;
}

function OffMarketCard({ property, onEnquiry }: OffMarketCardProps) {
  const daysRemaining = property.expires_at 
    ? Math.ceil((new Date(property.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className="hover:border-amber-300 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Property Image */}
          <div className="w-full md:w-48 h-36 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
            {property.images?.[0] ? (
              <img 
                src={property.images[0]} 
                alt={property.address} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <Badge className="absolute top-2 left-2 bg-amber-500 text-white gap-1">
              <Diamond className="h-3 w-3" />
              Off-Market
            </Badge>
          </div>
          
          {/* Property Details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{property.address}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {property.postcode}
                </div>
              </div>
              {daysRemaining !== null && daysRemaining > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {daysRemaining} days left
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold">
                {property.price ? formatCurrency(property.price) : 'Price on Application'}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{property.bedrooms} bed</span>
                <span>•</span>
                <span className="capitalize">{property.property_type}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Building className="h-4 w-4" />
                Via: {property.source_name || 'Private Source'}
              </div>
              {property.reason_off_market && (
                <Badge variant="secondary">{property.reason_off_market}</Badge>
              )}
            </div>
            
            {property.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {property.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 pt-2">
              <Button onClick={onEnquiry} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Express Interest
              </Button>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Request Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

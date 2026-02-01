import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Home, MapPin, Zap, Flame, Droplets, Wind } from 'lucide-react';
import type { EPCProperty } from '@/types/contractorDemand';
import { useState } from 'react';

interface EPCRenovationTabProps {
  properties: EPCProperty[];
  onFindContractors: (property: EPCProperty) => void;
}

export function EPCRenovationTab({ properties, onFindContractors }: EPCRenovationTabProps) {
  const [ratingFilters, setRatingFilters] = useState<string[]>(['D', 'E', 'F', 'G']);
  const [propertyType, setPropertyType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRating = (rating: string) => {
    setRatingFilters(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const filteredProperties = properties.filter(prop => {
    if (!ratingFilters.includes(prop.current_rating)) return false;
    if (propertyType !== 'all' && prop.property_type?.toLowerCase() !== propertyType) return false;
    if (searchTerm && !prop.address.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'G': return 'bg-red-800 text-white';
      case 'F': return 'bg-red-600 text-white';
      case 'E': return 'bg-orange-500 text-white';
      case 'D': return 'bg-yellow-500 text-black';
      case 'C': return 'bg-yellow-300 text-black';
      case 'B': return 'bg-green-400 text-black';
      case 'A': return 'bg-green-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getEfficiencyIcon = (area: string) => {
    switch (area) {
      case 'walls': return <Wind className="h-4 w-4" />;
      case 'roof': return <Home className="h-4 w-4" />;
      case 'windows': return <Droplets className="h-4 w-4" />;
      case 'heating': return <Flame className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  if (properties.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Low EPC Properties Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Search an area to find properties with poor energy ratings that need renovation work.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rating:</span>
              {['D', 'E', 'F', 'G'].map(rating => (
                <div key={rating} className="flex items-center gap-1">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={ratingFilters.includes(rating)}
                    onCheckedChange={() => toggleRating(rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className={`px-2 py-0.5 rounded text-sm ${getRatingColor(rating)}`}>
                    {rating}
                  </Label>
                </div>
              ))}
            </div>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {['D', 'E', 'F', 'G'].map(rating => (
          <Card key={rating} className="p-4 text-center">
            <div className={`text-2xl font-bold ${
              rating === 'G' ? 'text-red-800' :
              rating === 'F' ? 'text-red-600' :
              rating === 'E' ? 'text-orange-500' : 'text-yellow-600'
            }`}>
              {properties.filter(p => p.current_rating === rating).length}
            </div>
            <p className="text-sm text-muted-foreground">Rating {rating}</p>
          </Card>
        ))}
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map(property => (
          <Card key={property.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="font-medium text-sm line-clamp-1">{property.address}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{property.postcode}</p>
                </div>
                <div className={`text-2xl font-bold px-3 py-1 rounded ${getRatingColor(property.current_rating)}`}>
                  {property.current_rating}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center flex-1">
                  <div className={`text-xl font-bold ${getRatingColor(property.current_rating).split(' ')[0].replace('bg-', 'text-')}`}>
                    {property.current_score}
                  </div>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="text-center flex-1">
                  <div className="text-xl font-bold text-green-600">
                    {property.potential_score}
                  </div>
                  <p className="text-xs text-muted-foreground">Potential</p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  +{property.potential_score - property.current_score} pts
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{property.property_type}</span>
                {property.built_form && <span>• {property.built_form}</span>}
                {property.floor_area && <span>• {property.floor_area}m²</span>}
              </div>

              {/* Efficiency Issues */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'walls_efficiency', label: 'Walls', icon: 'walls' },
                  { key: 'roof_efficiency', label: 'Roof', icon: 'roof' },
                  { key: 'windows_efficiency', label: 'Windows', icon: 'windows' },
                  { key: 'heating_efficiency', label: 'Heating', icon: 'heating' }
                ].map(({ key, label, icon }) => {
                  const efficiency = (property as any)[key];
                  if (!efficiency || efficiency === 'N/A') return null;
                  const isPoor = efficiency === 'Poor' || efficiency === 'Very Poor';
                  return (
                    <Badge 
                      key={key} 
                      variant={isPoor ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {getEfficiencyIcon(icon)}
                      <span className="ml-1">{label}</span>
                    </Badge>
                  );
                })}
              </div>

              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => onFindContractors(property)}
              >
                Find Contractors for This
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

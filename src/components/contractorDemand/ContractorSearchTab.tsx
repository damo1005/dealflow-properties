import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  CheckCircle2,
  Shield,
  Wrench,
  Zap,
  Droplets
} from 'lucide-react';
import type { AreaContractor } from '@/types/contractorDemand';
import { useState } from 'react';

interface ContractorSearchTabProps {
  contractors: AreaContractor[];
  onSave: (contractor: AreaContractor) => void;
}

const TRADE_OPTIONS = [
  { value: 'all', label: 'All Trades' },
  { value: 'builder', label: 'Builder' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'roofer', label: 'Roofer' },
  { value: 'glazier', label: 'Glazier' },
  { value: 'insulation', label: 'Insulation' },
  { value: 'main_contractor', label: 'Main Contractor' },
];

export function ContractorSearchTab({ contractors, onSave }: ContractorSearchTabProps) {
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContractors = contractors.filter(contractor => {
    if (tradeFilter !== 'all' && !contractor.trade_categories?.includes(tradeFilter)) return false;
    if (sourceFilter !== 'all' && contractor.source !== sourceFilter) return false;
    
    const rating = contractor.ccs_score || contractor.checkatrade_score || 0;
    if (rating < minRating) return false;
    
    if (searchTerm && 
        !contractor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !contractor.trading_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  const getTradeIcon = (trade: string) => {
    switch (trade) {
      case 'electrician': return <Zap className="h-3 w-3" />;
      case 'plumber': case 'gas_engineer': return <Droplets className="h-3 w-3" />;
      case 'builder': case 'main_contractor': return <Building2 className="h-3 w-3" />;
      default: return <Wrench className="h-3 w-3" />;
    }
  };

  if (contractors.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Contractors Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Search an area to find verified contractors operating in that location.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trade" />
              </SelectTrigger>
              <SelectContent>
                {TRADE_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="ccs">CCS Registered</SelectItem>
                <SelectItem value="checkatrade">Checkatrade</SelectItem>
                <SelectItem value="trustmark">TrustMark</SelectItem>
              </SelectContent>
            </Select>

            <div className="w-[200px] space-y-1">
              <label className="text-sm text-muted-foreground">Min Rating: {minRating}+</label>
              <Slider
                value={[minRating]}
                onValueChange={(v) => setMinRating(v[0])}
                min={0}
                max={5}
                step={0.5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{contractors.length}</div>
          <p className="text-sm text-muted-foreground">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {contractors.filter(c => c.source === 'ccs').length}
          </div>
          <p className="text-sm text-muted-foreground">CCS Registered</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {contractors.filter(c => c.source === 'checkatrade').length}
          </div>
          <p className="text-sm text-muted-foreground">Checkatrade</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {contractors.filter(c => c.is_verified).length}
          </div>
          <p className="text-sm text-muted-foreground">Verified</p>
        </Card>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredContractors.map(contractor => (
          <Card key={contractor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {(contractor.trading_name || contractor.company_name).charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {contractor.trading_name || contractor.company_name}
                    </h3>
                    {contractor.trading_name && (
                      <p className="text-xs text-muted-foreground">{contractor.company_name}</p>
                    )}
                  </div>
                </div>
                {contractor.is_verified && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Trades */}
              <div className="flex gap-1 flex-wrap">
                {contractor.trade_categories?.map(trade => (
                  <Badge key={trade} variant="outline" className="text-xs gap-1">
                    {getTradeIcon(trade)}
                    <span className="capitalize">{trade.replace('_', ' ')}</span>
                  </Badge>
                ))}
              </div>

              {/* Ratings */}
              <div className="flex gap-4">
                {contractor.ccs_score && (
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">CCS</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-0.5">{contractor.ccs_score.toFixed(1)}</span>
                    </div>
                    {contractor.ccs_project_count && (
                      <span className="text-xs text-muted-foreground">
                        ({contractor.ccs_project_count} projects)
                      </span>
                    )}
                  </div>
                )}
                {contractor.checkatrade_score && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">CT</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-0.5">{contractor.checkatrade_score.toFixed(1)}</span>
                    </div>
                    {contractor.checkatrade_reviews && (
                      <span className="text-xs text-muted-foreground">
                        ({contractor.checkatrade_reviews} reviews)
                      </span>
                    )}
                  </div>
                )}
                {contractor.trustmark_registered && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Shield className="h-3 w-3" />
                    TrustMark
                  </Badge>
                )}
              </div>

              {contractor.distance_miles && (
                <p className="text-xs text-muted-foreground">
                  {contractor.distance_miles.toFixed(1)} miles away
                </p>
              )}

              {/* Contact Buttons */}
              <div className="flex gap-2 pt-2">
                {contractor.phone && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${contractor.phone}`}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </a>
                  </Button>
                )}
                {contractor.email && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${contractor.email}`}>
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </a>
                  </Button>
                )}
                {contractor.website && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={contractor.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-1" />
                      Web
                    </a>
                  </Button>
                )}
                <Button 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => onSave(contractor)}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Search, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface MarketIntelSearchProps {
  onSearch: (postcode: string) => void;
  isLoading: boolean;
}

export function MarketIntelSearch({ onSearch, isLoading }: MarketIntelSearchProps) {
  const [postcode, setPostcode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim()) {
      onSearch(postcode.trim());
    }
  };

  const popularAreas = [
    { postcode: 'SW1A', name: 'Westminster' },
    { postcode: 'M1', name: 'Manchester' },
    { postcode: 'B1', name: 'Birmingham' },
    { postcode: 'LS1', name: 'Leeds' },
    { postcode: 'L1', name: 'Liverpool' },
    { postcode: 'BS1', name: 'Bristol' },
  ];

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="pt-8 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Market Intelligence</h1>
          <p className="text-muted-foreground">
            Analyze any UK postcode for investment insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                placeholder="Enter postcode (e.g., SW1A 1AA)"
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button type="submit" size="lg" disabled={isLoading || !postcode.trim()}>
              {isLoading ? (
                <span className="animate-pulse">Analyzing...</span>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Popular areas:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularAreas.map((area) => (
              <Button
                key={area.postcode}
                variant="outline"
                size="sm"
                onClick={() => {
                  setPostcode(area.postcode);
                  onSearch(area.postcode);
                }}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {area.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

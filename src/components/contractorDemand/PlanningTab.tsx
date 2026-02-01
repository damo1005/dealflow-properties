import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, MapPin, Building2, Calendar, User } from 'lucide-react';
import type { PlanningApplication } from '@/types/contractorDemand';
import { useState } from 'react';

interface PlanningTabProps {
  applications: PlanningApplication[];
  onTrack: (app: PlanningApplication) => void;
}

export function PlanningTab({ applications, onTrack }: PlanningTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (typeFilter !== 'all' && app.development_type !== typeFilter) return false;
    if (searchTerm && !app.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.reference.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'refused': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (applications.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Planning Applications Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Search an area to find planning applications in that location.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by address or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refused">Refused</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="mixed">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{applications.length}</div>
          <p className="text-sm text-muted-foreground">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(a => a.status === 'approved').length}
          </div>
          <p className="text-sm text-muted-foreground">Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {applications.filter(a => a.status === 'pending').length}
          </div>
          <p className="text-sm text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {applications.filter(a => a.status === 'refused').length}
          </div>
          <p className="text-sm text-muted-foreground">Refused</p>
        </Card>
      </div>

      {/* Results */}
      <div className="grid gap-4">
        {filteredApps.map(app => (
          <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                    <span className="text-sm font-medium">{app.reference}</span>
                    {app.distance_miles && (
                      <span className="text-xs text-muted-foreground">
                        {app.distance_miles.toFixed(1)} mi
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{app.address}</p>
                      <p className="text-sm text-muted-foreground">{app.postcode}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {app.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {app.development_type && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span className="capitalize">{app.development_type}</span>
                      </div>
                    )}
                    {app.proposed_units && (
                      <span>{app.proposed_units} units proposed</span>
                    )}
                    {app.submitted_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted {new Date(app.submitted_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {app.applicant_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{app.applicant_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => onTrack(app)}>
                    Track
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

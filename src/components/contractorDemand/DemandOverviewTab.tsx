import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  HardHat, 
  Home, 
  Users,
  Phone,
  Mail,
  Star,
  Award
} from 'lucide-react';
import type { PlanningApplication, EPCProperty, CCSProject, AreaContractor } from '@/types/contractorDemand';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DemandOverviewTabProps {
  coordinates: { lat: number; lng: number } | null;
  planningApplications: PlanningApplication[];
  ccsProjects: CCSProject[];
  epcProperties: EPCProperty[];
  contractors: AreaContractor[];
  radius: number;
}

export function DemandOverviewTab({
  coordinates,
  planningApplications,
  ccsProjects,
  epcProperties,
  contractors,
  radius
}: DemandOverviewTabProps) {
  const [showPlanning, setShowPlanning] = useState(true);
  const [showCCS, setShowCCS] = useState(true);
  const [showEPC, setShowEPC] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  if (!coordinates) {
    return (
      <Card className="p-12 text-center">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Search an Area</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Enter a postcode above to view construction activity, planning applications,
          and properties needing work.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Area Map</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Switch 
                    id="planning" 
                    checked={showPlanning} 
                    onCheckedChange={setShowPlanning}
                  />
                  <Label htmlFor="planning" className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    Planning
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    id="ccs" 
                    checked={showCCS} 
                    onCheckedChange={setShowCCS}
                  />
                  <Label htmlFor="ccs" className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    CCS Sites
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    id="epc" 
                    checked={showEPC} 
                    onCheckedChange={setShowEPC}
                  />
                  <Label htmlFor="epc" className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    Low EPC
                  </Label>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px]">
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Search center */}
                <Marker position={[coordinates.lat, coordinates.lng]}>
                  <Popup>Search Center</Popup>
                </Marker>

                {/* Planning markers */}
                {showPlanning && planningApplications.map(app => (
                  app.latitude && app.longitude && (
                    <CircleMarker
                      key={app.id}
                      center={[app.latitude, app.longitude]}
                      radius={8}
                      pathOptions={{
                        color: app.status === 'approved' ? '#22c55e' : 
                               app.status === 'pending' ? '#eab308' : '#ef4444',
                        fillColor: app.status === 'approved' ? '#22c55e' : 
                                   app.status === 'pending' ? '#eab308' : '#ef4444',
                        fillOpacity: 0.7
                      }}
                      eventHandlers={{
                        click: () => setSelectedItem({ type: 'planning', data: app })
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">{app.reference}</p>
                          <p>{app.address}</p>
                          <Badge variant={app.status === 'approved' ? 'default' : 'secondary'}>
                            {app.status}
                          </Badge>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )
                ))}

                {/* CCS markers */}
                {showCCS && ccsProjects.map(project => (
                  project.latitude && project.longitude && (
                    <CircleMarker
                      key={project.id}
                      center={[project.latitude, project.longitude]}
                      radius={10}
                      pathOptions={{
                        color: project.is_ultra_site ? '#8b5cf6' : '#22c55e',
                        fillColor: project.is_ultra_site ? '#8b5cf6' : '#22c55e',
                        fillOpacity: 0.8
                      }}
                      eventHandlers={{
                        click: () => setSelectedItem({ type: 'ccs', data: project })
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">{project.project_name}</p>
                          <p>{project.contractor_name}</p>
                          {project.overall_score && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {project.overall_score.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  )
                ))}

                {/* EPC markers */}
                {showEPC && epcProperties.map(epc => (
                  epc.latitude && epc.longitude && (
                    <CircleMarker
                      key={epc.id}
                      center={[epc.latitude, epc.longitude]}
                      radius={6}
                      pathOptions={{
                        color: epc.current_rating === 'G' ? '#991b1b' :
                               epc.current_rating === 'F' ? '#dc2626' :
                               epc.current_rating === 'E' ? '#f97316' : '#eab308',
                        fillColor: epc.current_rating === 'G' ? '#991b1b' :
                                   epc.current_rating === 'F' ? '#dc2626' :
                                   epc.current_rating === 'E' ? '#f97316' : '#eab308',
                        fillOpacity: 0.6
                      }}
                      eventHandlers={{
                        click: () => setSelectedItem({ type: 'epc', data: epc })
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">{epc.address}</p>
                          <p>Rating: <strong>{epc.current_rating}</strong> → {epc.potential_rating}</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Panel */}
      <div className="space-y-4">
        {selectedItem ? (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={
                  selectedItem.type === 'planning' ? 'default' :
                  selectedItem.type === 'ccs' ? 'secondary' : 'outline'
                }>
                  {selectedItem.type === 'planning' ? 'Planning Application' :
                   selectedItem.type === 'ccs' ? 'Construction Site' : 'EPC Property'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedItem.type === 'planning' && (
                <div className="space-y-3">
                  <h3 className="font-semibold">{selectedItem.data.reference}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.data.address}</p>
                  <p className="text-sm">{selectedItem.data.description}</p>
                  <div className="flex gap-2">
                    <Badge variant={selectedItem.data.status === 'approved' ? 'default' : 'secondary'}>
                      {selectedItem.data.status}
                    </Badge>
                    {selectedItem.data.proposed_units && (
                      <Badge variant="outline">{selectedItem.data.proposed_units} units</Badge>
                    )}
                  </div>
                  {selectedItem.data.applicant_name && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Applicant:</span> {selectedItem.data.applicant_name}
                    </p>
                  )}
                  <Button className="w-full" variant="outline">Track This Application</Button>
                </div>
              )}

              {selectedItem.type === 'ccs' && (
                <div className="space-y-3">
                  <h3 className="font-semibold">{selectedItem.data.project_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.data.address_line1}, {selectedItem.data.town}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedItem.data.is_ultra_site && (
                      <Badge className="bg-purple-600">Ultra Site</Badge>
                    )}
                    {selectedItem.data.has_award && (
                      <Badge variant="secondary">
                        <Award className="h-3 w-3 mr-1" />
                        Award Winner
                      </Badge>
                    )}
                    <Badge variant="outline">{selectedItem.data.project_category}</Badge>
                  </div>
                  {selectedItem.data.overall_score && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">CCS Score:</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= selectedItem.data.overall_score
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium">
                          {selectedItem.data.overall_score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm font-medium mb-2">Contractor</p>
                    <p className="font-semibold">{selectedItem.data.contractor_name}</p>
                    {selectedItem.data.site_manager_name && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Site Manager: {selectedItem.data.site_manager_name}
                        </p>
                        <div className="flex gap-2">
                          {selectedItem.data.site_manager_phone && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${selectedItem.data.site_manager_phone}`}>
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </a>
                            </Button>
                          )}
                          {selectedItem.data.site_manager_email && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`mailto:${selectedItem.data.site_manager_email}`}>
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button className="w-full">Save Contractor</Button>
                </div>
              )}

              {selectedItem.type === 'epc' && (
                <div className="space-y-3">
                  <h3 className="font-semibold">{selectedItem.data.address}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.data.postcode}</p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        selectedItem.data.current_rating === 'G' ? 'text-red-800' :
                        selectedItem.data.current_rating === 'F' ? 'text-red-600' :
                        selectedItem.data.current_rating === 'E' ? 'text-orange-500' : 'text-yellow-500'
                      }`}>
                        {selectedItem.data.current_rating}
                      </div>
                      <p className="text-xs text-muted-foreground">Current</p>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {selectedItem.data.potential_rating}
                      </div>
                      <p className="text-xs text-muted-foreground">Potential</p>
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3 space-y-2">
                    <p className="text-sm font-medium">Improvement Areas:</p>
                    {['walls', 'roof', 'windows', 'heating'].map(area => {
                      const efficiency = selectedItem.data[`${area}_efficiency`];
                      if (!efficiency) return null;
                      return (
                        <div key={area} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{area}</span>
                          <Badge variant={
                            efficiency === 'Very Poor' || efficiency === 'Poor' ? 'destructive' :
                            efficiency === 'Average' ? 'secondary' : 'default'
                          }>
                            {efficiency}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                  <Button className="w-full" variant="outline">Find Contractors</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Quick summary cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Planning Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{planningApplications.length}</div>
                <p className="text-xs text-muted-foreground">
                  {planningApplications.filter(p => p.status === 'approved').length} approved,{' '}
                  {planningApplications.filter(p => p.status === 'pending').length} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <HardHat className="h-4 w-4" />
                  Active CCS Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ccsProjects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {ccsProjects.filter(p => p.is_ultra_site).length} Ultra Sites
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Properties Need Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{epcProperties.length}</div>
                <p className="text-xs text-muted-foreground">
                  Low EPC ratings (D-G)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Local Contractors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contractors.length}</div>
                <p className="text-xs text-muted-foreground">
                  {contractors.filter(c => c.is_verified).length} verified
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

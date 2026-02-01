import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConstructionProject, PROJECT_STATUS_CONFIG } from '@/types/construction';
import { Star, Trophy, Eye } from 'lucide-react';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface ConstructionMapProps {
  projects: ConstructionProject[];
  onProjectClick: (project: ConstructionProject) => void;
}

// Create custom colored markers
function createColoredIcon(color: string, hasStar: boolean = false, hasAward: boolean = false) {
  const markerHtml = `
    <div style="position: relative;">
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5S25 25 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
      </svg>
      ${hasStar ? '<span style="position: absolute; top: -4px; right: -4px; font-size: 12px;">⭐</span>' : ''}
      ${hasAward ? '<span style="position: absolute; top: -4px; left: -4px; font-size: 12px;">🏆</span>' : ''}
    </div>
  `;
  
  return L.divIcon({
    html: markerHtml,
    className: 'custom-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
  });
}

function MapBoundsHandler({ projects }: { projects: ConstructionProject[] }) {
  const map = useMap();
  
  useEffect(() => {
    const validProjects = projects.filter(p => p.latitude && p.longitude);
    if (validProjects.length > 0) {
      const bounds = L.latLngBounds(
        validProjects.map(p => [p.latitude!, p.longitude!] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [projects, map]);
  
  return null;
}

export function ConstructionMap({ projects, onProjectClick }: ConstructionMapProps) {
  const projectsWithCoords = projects.filter(p => p.latitude && p.longitude);
  
  // Default center (London)
  const defaultCenter: [number, number] = [51.5074, -0.1278];
  const center = projectsWithCoords.length > 0
    ? [projectsWithCoords[0].latitude!, projectsWithCoords[0].longitude!] as [number, number]
    : defaultCenter;
  
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsHandler projects={projectsWithCoords} />
      
      {projectsWithCoords.map((project) => {
        const statusConfig = PROJECT_STATUS_CONFIG[project.status as keyof typeof PROJECT_STATUS_CONFIG];
        const icon = createColoredIcon(
          statusConfig?.mapColor || '#6B7280',
          project.is_ccs_registered,
          project.has_national_award
        );
        
        return (
          <Marker
            key={project.id}
            position={[project.latitude!, project.longitude!]}
            icon={icon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">
                  {project.project_name || 'Construction Project'}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {project.address}, {project.postcode}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge className={`${statusConfig?.color} text-xs`}>
                    {statusConfig?.label}
                  </Badge>
                  {project.is_ccs_registered && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Star className="h-2 w-2" />
                      {project.ccs_star_rating?.toFixed(1)}
                    </Badge>
                  )}
                  {project.has_national_award && (
                    <Trophy className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                
                {project.expected_completion && (
                  <p className="text-xs text-gray-500 mb-2">
                    Completion: {new Date(project.expected_completion).toLocaleDateString('en-GB', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}
                
                <Button
                  size="sm"
                  className="w-full gap-1"
                  onClick={() => onProjectClick(project)}
                >
                  <Eye className="h-3 w-3" />
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

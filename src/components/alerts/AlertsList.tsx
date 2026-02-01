import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  MapPin,
  PoundSterling,
  Home,
  Clock,
  Mail,
  MessageCircle,
  Smartphone,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAlertsStore } from "@/stores/alertsStore";
import type { RequestAlert } from "@/types/alerts";
import { formatDistanceToNow } from "date-fns";

interface AlertsListProps {
  alerts: RequestAlert[];
  emptyMessage: string;
  onCreateClick?: () => void;
}

export function AlertsList({ alerts, emptyMessage, onCreateClick }: AlertsListProps) {
  const { toggleAlertActive, deleteAlert } = useAlertsStore();

  if (alerts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-center mb-4">{emptyMessage}</p>
          {onCreateClick && (
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onToggle={() => toggleAlertActive(alert.id)}
          onDelete={() => deleteAlert(alert.id)}
        />
      ))}
    </div>
  );
}

interface AlertCardProps {
  alert: RequestAlert;
  onToggle: () => void;
  onDelete: () => void;
}

function AlertCard({ alert, onToggle, onDelete }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDeliveryIcons = () => {
    const icons = [];
    if (alert.delivery_methods.includes("email")) {
      icons.push(<Mail key="email" className="h-3.5 w-3.5" />);
    }
    if (alert.delivery_methods.includes("push")) {
      icons.push(<Smartphone key="push" className="h-3.5 w-3.5" />);
    }
    if (alert.delivery_methods.includes("whatsapp")) {
      icons.push(<MessageCircle key="whatsapp" className="h-3.5 w-3.5" />);
    }
    return icons;
  };

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{alert.name}</h3>
                  {alert.alerts_sent_today > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {alert.alerts_sent_today} new
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.last_triggered_at
                      ? formatDistanceToNow(new Date(alert.last_triggered_at), { addSuffix: true })
                      : "Never triggered"}
                  </span>
                  <span>{alert.total_matches_sent} matches</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {getDeliveryIcons()}
              </div>
              <Switch checked={alert.is_active} onCheckedChange={onToggle} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Alert
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Matches
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-center py-2 h-auto text-muted-foreground hover:text-foreground">
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                View details
              </>
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="border-t pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Criteria */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Criteria</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2">
                        {alert.location_areas?.join(", ") || "Any"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <PoundSterling className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="ml-2">
                        {alert.budget_min && alert.budget_max
                          ? `£${alert.budget_min.toLocaleString()} - £${alert.budget_max.toLocaleString()}`
                          : "Any"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Property:</span>
                      <span className="ml-2">
                        {alert.property_types?.join(", ") || "Any"}
                      </span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {alert.must_be_self_contained && (
                      <Badge variant="outline">Self-contained</Badge>
                    )}
                    {alert.must_allow_pets && (
                      <Badge variant="outline">Pets allowed</Badge>
                    )}
                    {alert.must_allow_children && (
                      <Badge variant="outline">Children allowed</Badge>
                    )}
                    {alert.must_have_parking && (
                      <Badge variant="outline">Parking</Badge>
                    )}
                    {alert.furnished_preference !== "either" && (
                      <Badge variant="outline">{alert.furnished_preference}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery & Performance */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Delivery</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{alert.frequency}</span>
                    {alert.frequency === "daily" && alert.digest_time && (
                      <span className="text-muted-foreground">
                        at {alert.digest_time.slice(0, 5)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Channels:</span>
                    <div className="flex gap-2">
                      {alert.delivery_methods.map((method) => (
                        <Badge key={method} variant="secondary" className="capitalize">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Match threshold:</span>
                    <span>{alert.ai_match_threshold}%+</span>
                  </div>

                  {alert.include_keywords && alert.include_keywords.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground">Keywords:</span>
                      <div className="flex flex-wrap gap-1">
                        {alert.include_keywords.map((kw) => (
                          <Badge key={kw} variant="outline" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Stats */}
                <div className="bg-muted/50 rounded-lg p-3 mt-4">
                  <h5 className="text-xs font-medium text-muted-foreground mb-2">Performance</h5>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-semibold">{alert.total_matches_sent}</p>
                      <p className="text-xs text-muted-foreground">Matches</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">85%</p>
                      <p className="text-xs text-muted-foreground">Open rate</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">3</p>
                      <p className="text-xs text-muted-foreground">Enquiries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Matches
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Test Alert
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

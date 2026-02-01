import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Check, AlertTriangle, Settings } from "lucide-react";
import { format } from "date-fns";
import type { PerformanceAlert } from "@/types/investment";
import { ALERT_CONFIG, SEVERITY_STYLES } from "@/types/investment";

interface PerformanceAlertsProps {
  activeAlerts: PerformanceAlert[];
  resolvedAlerts: PerformanceAlert[];
  onResolve?: (alertId: string) => void;
}

export function PerformanceAlerts({
  activeAlerts,
  resolvedAlerts,
  onResolve,
}: PerformanceAlertsProps) {
  const hasActiveAlerts = activeAlerts.length > 0;

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className={hasActiveAlerts ? "border-yellow-300 dark:border-yellow-800" : "border-green-300 dark:border-green-800"}>
        <CardContent className="py-6">
          <div className="text-center">
            {hasActiveAlerts ? (
              <>
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-yellow-500" />
                <h3 className="text-lg font-semibold">{activeAlerts.length} Active Alert{activeAlerts.length > 1 ? "s" : ""}</h3>
                <p className="text-muted-foreground text-sm">Review and resolve the issues below</p>
              </>
            ) : (
              <>
                <Shield className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                  ✅ ALL CLEAR - NO ACTIVE ALERTS
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  This property has no performance issues.<br />
                  All metrics are meeting or exceeding targets.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {hasActiveAlerts && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-yellow-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((alert) => {
              const config = ALERT_CONFIG[alert.alert_type];
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${SEVERITY_STYLES[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{config.icon}</span>
                      <div>
                        <p className="font-medium">{alert.alert_message}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span>{format(new Date(alert.created_at), "d MMM yyyy, HH:mm")}</span>
                          <Badge variant="outline" className="capitalize">
                            {alert.severity}
                          </Badge>
                        </div>
                        {alert.target_value && alert.actual_value && (
                          <p className="text-sm mt-2">
                            Target: {alert.target_value} | Actual: {alert.actual_value} |
                            Variance: {alert.variance && alert.variance > 0 ? "+" : ""}{alert.variance}
                          </p>
                        )}
                      </div>
                    </div>
                    {onResolve && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onResolve(alert.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Resolved Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resolvedAlerts.slice(0, 5).map((alert) => {
              const config = ALERT_CONFIG[alert.alert_type];
              return (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-muted/50 opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{format(new Date(alert.created_at), "d MMM yyyy")}</span>
                        {" - "}{config.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.alert_message}
                      </p>
                      {alert.resolved_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Resolved: {format(new Date(alert.resolved_at), "d MMM yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Alert Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Get notified when:</p>
          <div className="space-y-3">
            {[
              "Yield drops below target",
              "Monthly cash flow below threshold",
              "Occupancy below 90%",
              "Maintenance exceeds budget",
              "Property value drops by 5%",
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between">
                <Label htmlFor={`alert-${i}`} className="text-sm">{setting}</Label>
                <Switch id={`alert-${i}`} defaultChecked />
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            Edit Alert Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

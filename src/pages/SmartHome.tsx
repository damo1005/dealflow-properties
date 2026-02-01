import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Thermometer, Flame, Wind, Droplets, Wifi, WifiOff, Battery, 
  AlertTriangle, Plus, Bell, BellOff, Check, X, Zap, Home
} from "lucide-react";
import { DEVICE_TYPES, PLATFORMS } from "@/types/smartHome";

// Mock data
const mockDevices = [
  {
    id: "1",
    device_type: "thermostat",
    device_name: "Hallway Thermostat",
    manufacturer: "Nest",
    model: "Learning Thermostat",
    room: "Hallway",
    is_online: true,
    battery_level: null,
    current_temp: 19.5,
    target_temp: 20,
    mode: "heating",
  },
  {
    id: "2",
    device_type: "smoke_alarm",
    device_name: "Hallway Smoke Alarm",
    manufacturer: "Nest",
    model: "Protect",
    room: "Hallway",
    is_online: true,
    battery_level: 85,
    status: "all_clear",
    last_tested: "2026-01-15",
  },
  {
    id: "3",
    device_type: "co_alarm",
    device_name: "Kitchen CO Detector",
    manufacturer: "Nest",
    model: "Protect",
    room: "Kitchen",
    is_online: true,
    battery_level: 78,
    co_level: 0,
    status: "all_clear",
  },
  {
    id: "4",
    device_type: "leak_sensor",
    device_name: "Kitchen Leak Sensor",
    manufacturer: "Samsung",
    model: "SmartThings",
    room: "Kitchen",
    is_online: true,
    battery_level: 92,
    water_detected: true,
    alert_time: "10 mins ago",
  },
  {
    id: "5",
    device_type: "energy_monitor",
    device_name: "Energy Monitor",
    manufacturer: "Sense",
    model: "Home Energy Monitor",
    is_online: true,
    today_kwh: 12.4,
    month_kwh: 245,
    today_cost: 4.12,
    month_cost: 81.50,
  },
];

const mockAlerts = [
  {
    id: "1",
    device_id: "4",
    alert_type: "water_leak",
    severity: "critical",
    message: "Water leak detected - Kitchen sensor",
    status: "active",
    created_at: "10 mins ago",
  },
];

export default function SmartHome() {
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [selectedProperty] = useState("14 Oak Street");

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "thermostat":
        return <Thermometer className="h-5 w-5" />;
      case "smoke_alarm":
        return <Flame className="h-5 w-5" />;
      case "co_alarm":
        return <Wind className="h-5 w-5" />;
      case "leak_sensor":
        return <Droplets className="h-5 w-5" />;
      case "energy_monitor":
        return <Zap className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (device: typeof mockDevices[0]) => {
    if ('water_detected' in device && device.water_detected) {
      return <Badge variant="destructive">ALERT</Badge>;
    }
    if (device.is_online) {
      return <Badge className="bg-green-500">Online</Badge>;
    }
    return <Badge variant="secondary">Offline</Badge>;
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Home</h1>
            <p className="text-muted-foreground">{selectedProperty} - Device monitoring and alerts</p>
          </div>
          <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Device</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Device</DialogTitle>
                <DialogDescription>Connect a smart home platform to import devices</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map(platform => (
                      <Button key={platform.value} variant="outline" className="h-auto py-4">
                        {platform.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Click a platform to connect your account
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Critical Alerts */}
        {mockAlerts.filter(a => a.status === "active").length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="h-5 w-5" />
                Critical Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockAlerts.filter(a => a.status === "active").map(alert => (
                <div key={alert.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">{alert.message}</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Detected: {alert.created_at}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Acknowledge</Button>
                    <Button size="sm" variant="outline">Call Tenant</Button>
                    <Button size="sm">Mark Resolved</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Devices Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockDevices.map(device => (
            <Card key={device.id} className={device.device_type === 'leak_sensor' && 'water_detected' in device && device.water_detected ? 'border-red-300' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      device.device_type === 'leak_sensor' && 'water_detected' in device && device.water_detected 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {getDeviceIcon(device.device_type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{device.device_name}</h3>
                      <p className="text-sm text-muted-foreground">{device.manufacturer} {device.model}</p>
                    </div>
                  </div>
                  {getStatusBadge(device)}
                </div>

                {/* Device-specific content */}
                {device.device_type === 'thermostat' && 'current_temp' in device && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-medium">{device.current_temp}°C</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target:</span>
                      <span className="font-medium">{device.target_temp}°C</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mode:</span>
                      <span className="font-medium capitalize">{device.mode}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">Adjust</Button>
                      <Button variant="outline" size="sm" className="flex-1">Schedule</Button>
                    </div>
                  </div>
                )}

                {(device.device_type === 'smoke_alarm' || device.device_type === 'co_alarm') && 'status' in device && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">All clear</span>
                    </div>
                    {device.battery_level && (
                      <div className="flex items-center gap-2 text-sm">
                        <Battery className="h-4 w-4 text-muted-foreground" />
                        <span>Battery: {device.battery_level}%</span>
                      </div>
                    )}
                    {'last_tested' in device && device.last_tested && (
                      <div className="text-sm text-muted-foreground">
                        Last tested: {new Date(device.last_tested).toLocaleDateString()}
                      </div>
                    )}
                    {'co_level' in device && (
                      <div className="text-sm text-muted-foreground">
                        CO Level: {device.co_level} ppm
                      </div>
                    )}
                  </div>
                )}

                {device.device_type === 'leak_sensor' && 'water_detected' in device && (
                  <div className="space-y-2">
                    {device.water_detected ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">WATER DETECTED - {'alert_time' in device && device.alert_time}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-4 w-4" />
                        <span>No water detected</span>
                      </div>
                    )}
                    {device.battery_level && (
                      <div className="flex items-center gap-2 text-sm">
                        <Battery className="h-4 w-4 text-muted-foreground" />
                        <span>Battery: {device.battery_level}%</span>
                      </div>
                    )}
                  </div>
                )}

                {device.device_type === 'energy_monitor' && 'today_kwh' in device && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Today</p>
                        <p className="font-medium">{device.today_kwh} kWh</p>
                        <p className="text-sm text-muted-foreground">£{device.today_cost}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">This Month</p>
                        <p className="font-medium">{device.month_kwh} kWh</p>
                        <p className="text-sm text-muted-foreground">£{device.month_cost}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Usage Breakdown
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Void Property Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Void Property Mode
            </CardTitle>
            <CardDescription>
              Configure monitoring for vacant properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  28 Victoria Road is currently vacant. Enable alerts for:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="frost" defaultChecked />
                    <label htmlFor="frost" className="text-sm">Temperature below 10°C (frost protection)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="leak" defaultChecked />
                    <label htmlFor="leak" className="text-sm">Water leak detection</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="smoke" defaultChecked />
                    <label htmlFor="smoke" className="text-sm">Smoke/CO alerts</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="door" defaultChecked />
                    <label htmlFor="door" className="text-sm">Door/window opened alerts</label>
                  </div>
                </div>
              </div>
              <Button variant="outline">Configure Void Monitoring</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

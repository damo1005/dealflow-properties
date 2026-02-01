export interface SmartDevice {
  id: string;
  portfolio_property_id: string | null;
  user_id: string;
  device_type: 'thermostat' | 'smoke_alarm' | 'co_alarm' | 'leak_sensor' | 'door_sensor' | 'camera' | 'smart_lock' | 'energy_monitor';
  device_name: string | null;
  manufacturer: string | null;
  model: string | null;
  platform: 'google_home' | 'alexa' | 'homekit' | 'smartthings' | 'proprietary' | null;
  external_id: string | null;
  room: string | null;
  is_online: boolean;
  battery_level: number | null;
  last_seen_at: string | null;
  alerts_enabled: boolean;
  created_at: string;
}

export interface DeviceReading {
  id: string;
  device_id: string;
  reading_type: 'temperature' | 'humidity' | 'co_level' | 'water_detected' | 'energy_kwh' | null;
  reading_value: number | null;
  reading_unit: string | null;
  recorded_at: string;
}

export interface DeviceAlert {
  id: string;
  device_id: string;
  portfolio_property_id: string | null;
  alert_type: 'smoke_detected' | 'co_detected' | 'water_leak' | 'temperature_low' | 'temperature_high' | 'device_offline' | 'battery_low' | 'door_opened' | 'motion_detected';
  severity: 'info' | 'warning' | 'critical';
  message: string | null;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledged_at: string | null;
  resolved_at: string | null;
  created_at: string;
}

export const DEVICE_TYPES = [
  { value: 'thermostat', label: 'Thermostat', icon: '🌡️' },
  { value: 'smoke_alarm', label: 'Smoke Alarm', icon: '🔥' },
  { value: 'co_alarm', label: 'CO Detector', icon: '💨' },
  { value: 'leak_sensor', label: 'Leak Sensor', icon: '💧' },
  { value: 'door_sensor', label: 'Door/Window Sensor', icon: '🚪' },
  { value: 'camera', label: 'Camera', icon: '📷' },
  { value: 'smart_lock', label: 'Smart Lock', icon: '🔐' },
  { value: 'energy_monitor', label: 'Energy Monitor', icon: '⚡' },
] as const;

export const PLATFORMS = [
  { value: 'google_home', label: 'Google Home' },
  { value: 'alexa', label: 'Amazon Alexa' },
  { value: 'homekit', label: 'Apple HomeKit' },
  { value: 'smartthings', label: 'Samsung SmartThings' },
  { value: 'proprietary', label: 'Other' },
] as const;

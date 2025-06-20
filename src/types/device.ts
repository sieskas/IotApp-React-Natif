// src/types/device.ts

export interface Device {
  id: string;
  name: string;
  model: string;
  serial_number: string;
  firmware_version: string;
  status: 'online' | 'offline' | 'cleaning' | 'charging' | 'maintenance' | 'error';
  battery_level: number;
  location_id: string;
  device_type: 'robot_vacuum' | 'security_camera' | 'sensor' | 'other';
  last_seen: string;
  created_at: string;
  updated_at?: string;
  settings?: DeviceSettings;
  capabilities?: DeviceCapabilities;
}

export interface DeviceSettings {
  auto_clean_schedule?: {
    enabled: boolean;
    days: string[];
    time: string;
  };
  cleaning_mode?: 'quiet' | 'standard' | 'high' | 'max';
  notifications?: {
    low_battery: boolean;
    cleaning_complete: boolean;
    error_alerts: boolean;
  };
}

export interface DeviceCapabilities {
  can_vacuum: boolean;
  can_mop: boolean;
  has_mapping: boolean;
  has_camera: boolean;
  supports_zones: boolean;
  supports_no_go_zones: boolean;
}

export interface DeviceStats {
  total_cleaning_time: number; // en minutes
  total_cleanings: number;
  total_area_cleaned: number; // en m²
  average_battery_usage: number;
  last_maintenance_date?: string;
}

// Types pour les formulaires d'ajout/modification de device
export interface CreateDeviceRequest {
  name: string;
  model: string;
  serial_number: string;
  device_type: Device['device_type'];
  location_id: string;
  settings?: DeviceSettings;
}

export interface UpdateDeviceRequest extends Partial<CreateDeviceRequest> {
  id: string;
  status?: Device['status'];
  battery_level?: number;
  firmware_version?: string;
}

// Types pour les commandes de device
export interface DeviceCommand {
  id: string;
  device_id: string;
  command_type: 'start_cleaning' | 'stop_cleaning' | 'return_to_dock' | 'locate' | 'update_firmware';
  parameters?: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

// src/api/mockApi.ts
import { ApiResponse } from './apiClient';
import type { 
  OrganizationData, 
  Location, 
  CreateLocationRequest, 
  UpdateLocationRequest,
  Device,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  DeviceCommand 
} from '../types';

// Types pour les modèles de données (compatibilité avec l'ancien code)
export interface User {
    id: string;
    username: string;
    email: string;
}

// Données mockées pour l'organisation
const mockOrganizationData: OrganizationData = {
  client: {
    id: "client_123",
    name: "PET.com",
    email: "contact@pet.com",
    phone: "+1-555-0123",
    type: "enterprise",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-06-19T14:20:00Z",
    subscription: {
      plan: "premium",
      locations_limit: 10,
      features: ["multi_location", "analytics", "inventory_sync"]
    }
  },
  organization: {
    id: "org_456",
    name: "PET.com Corporation",
    headquarters: {
      location_id: "loc_001",
      is_main: true
    },
    settings: {
      currency: "USD",
      timezone: "UTC",
      language: "fr",
      fiscal_year_start: "01-01"
    }
  },
  locations: [
    {
      id: "loc_001",
      name: "Siège Social - PET.com",
      type: "headquarters",
      status: "active",
      address: {
        street: "123 Rue de la Paix",
        city: "Paris",
        state: "Île-de-France",
        postal_code: "75001",
        country: "FR",
        coordinates: {
          latitude: 48.8566,
          longitude: 2.3522
        }
      },
      contact: {
        phone: "+33-1-23-45-67-89",
        email: "paris@pet.com",
        manager: {
          name: "Marie Dubois",
          email: "marie.dubois@pet.com"
        }
      },
      business_info: {
        registration_number: "FR123456789",
        tax_id: "FR12345678901",
        industry: "Pet Supplies",
        opening_hours: {
          monday: { open: "09:00", close: "18:00" },
          tuesday: { open: "09:00", close: "18:00" },
          wednesday: { open: "09:00", close: "18:00" },
          thursday: { open: "09:00", close: "18:00" },
          friday: { open: "09:00", close: "18:00" },
          saturday: { open: "10:00", close: "16:00" },
          sunday: { closed: true }
        }
      },
      permissions: {
        can_create_locations: true,
        can_manage_inventory: true,
        can_view_all_reports: true,
        can_manage_users: true
      },
      created_at: "2025-01-15T10:30:00Z",
      updated_at: "2025-06-19T14:20:00Z"
    },
    {
      id: "loc_002",
      name: "PET Canada - Toronto",
      type: "branch",
      status: "active",
      parent_location_id: "loc_001",
      address: {
        street: "456 Queen Street West",
        city: "Toronto",
        state: "Ontario",
        postal_code: "M5V 2A4",
        country: "CA",
        coordinates: {
          latitude: 43.6426,
          longitude: -79.3871
        }
      },
      contact: {
        phone: "+1-416-555-0123",
        email: "toronto@pet.com",
        manager: {
          name: "John Smith",
          email: "john.smith@pet.com"
        }
      },
      business_info: {
        registration_number: "CA987654321",
        tax_id: "123456789RT0001",
        industry: "Pet Supplies",
        opening_hours: {
          monday: { open: "10:00", close: "19:00" },
          tuesday: { open: "10:00", close: "19:00" },
          wednesday: { open: "10:00", close: "19:00" },
          thursday: { open: "10:00", close: "19:00" },
          friday: { open: "10:00", close: "20:00" },
          saturday: { open: "09:00", close: "18:00" },
          sunday: { open: "11:00", close: "17:00" }
        }
      },
      local_settings: {
        currency: "CAD",
        timezone: "America/Toronto",
        language: "en"
      },
      permissions: {
        can_create_locations: false,
        can_manage_inventory: true,
        can_view_all_reports: false,
        can_manage_users: false
      },
      created_at: "2025-02-20T09:15:00Z",
      updated_at: "2025-06-19T14:20:00Z"
    }
  ],
  users: [
    {
      id: "user_001",
      name: "Pierre Martin",
      email: "pierre.martin@pet.com",
      role: "super_admin",
      locations_access: ["loc_001", "loc_002"],
      permissions: ["all"],
      primary_location_id: "loc_001",
      created_at: "2025-01-15T10:30:00Z"
    }
  ],
  location_relationships: [
    {
      parent_id: "loc_001",
      child_id: "loc_002",
      relationship_type: "branch",
      inheritance: {
        settings: true,
        users: false,
        inventory: false
      }
    }
  ]
};

// Données mockées pour les anciens devices (compatibilité)
const mockLegacyDevices: any[] = [
    {
        id: '1',
        name: 'Living Room Roborock',
        model: 'S7',
        firmwareVersion: 'V4.46.04(1)',
        status: 'online',
        batteryLevel: 85,
    },
    {
        id: '2',
        name: 'Kitchen Roborock',
        model: 'S7 MaxV',
        firmwareVersion: 'V4.46.04(1)',
        status: 'cleaning',
        batteryLevel: 62,
    },
];

// Données mockées pour les nouveaux devices
const mockDevices: Device[] = [
    {
        id: 'dev_001',
        name: 'Roborock Siège Social',
        model: 'S7 MaxV Ultra',
        serial_number: 'R7MU2025001',
        firmware_version: 'V4.46.04(1)',
        status: 'online',
        battery_level: 85,
        location_id: 'loc_001',
        device_type: 'robot_vacuum',
        last_seen: '2025-06-19T20:30:00Z',
        created_at: '2025-01-20T10:00:00Z',
        updated_at: '2025-06-19T20:30:00Z',
        settings: {
            auto_clean_schedule: {
                enabled: true,
                days: ['monday', 'wednesday', 'friday'],
                time: '09:00'
            },
            cleaning_mode: 'standard',
            notifications: {
                low_battery: true,
                cleaning_complete: true,
                error_alerts: true
            }
        },
        capabilities: {
            can_vacuum: true,
            can_mop: true,
            has_mapping: true,
            has_camera: true,
            supports_zones: true,
            supports_no_go_zones: true
        }
    },
    {
        id: 'dev_002',
        name: 'Roborock Toronto',
        model: 'S7',
        serial_number: 'R7T2025002',
        firmware_version: 'V4.46.04(1)',
        status: 'cleaning',
        battery_level: 62,
        location_id: 'loc_002',
        device_type: 'robot_vacuum',
        last_seen: '2025-06-19T20:25:00Z',
        created_at: '2025-02-25T14:30:00Z',
        updated_at: '2025-06-19T20:25:00Z',
        settings: {
            auto_clean_schedule: {
                enabled: false,
                days: [],
                time: '10:00'
            },
            cleaning_mode: 'high',
            notifications: {
                low_battery: true,
                cleaning_complete: false,
                error_alerts: true
            }
        },
        capabilities: {
            can_vacuum: true,
            can_mop: true,
            has_mapping: true,
            has_camera: false,
            supports_zones: true,
            supports_no_go_zones: true
        }
    }
];

// Données mockées pour les utilisateurs (compatibilité)
const mockUsers: User[] = [
    { id: '1', username: 'test', email: 'test@example.com' },
    { id: '2', username: 'demouser', email: 'demo@example.com' },
];

// Fonction pour simuler un délai de réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API
class MockApi {
    // Authentification (compatibilité avec l'ancien code)
    async login(username: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
        await delay(500);

        const user = mockUsers.find(u => u.username === username);

        if (user && password.length > 3) {
            return {
                data: {
                    token: 'mock-jwt-token',
                    user,
                },
                status: 200,
            };
        }

        return {
            data: {} as { token: string; user: User },
            status: 401,
            error: 'Invalid credentials',
        };
    }

    async register(userData: { username: string; email: string; password: string }): Promise<ApiResponse<User>> {
        await delay(700);

        if (mockUsers.some(u => u.username === userData.username)) {
            return {
                data: {} as User,
                status: 409,
                error: 'Username already exists',
            };
        }

        const newUser: User = {
            id: String(mockUsers.length + 1),
            username: userData.username,
            email: userData.email,
        };

        mockUsers.push(newUser);

        return {
            data: newUser,
            status: 201,
        };
    }

    // Organization & Locations
    async getOrganizationData(): Promise<ApiResponse<OrganizationData>> {
        await delay(600);
        return {
            data: mockOrganizationData,
            status: 200,
        };
    }

    async getLocations(): Promise<ApiResponse<Location[]>> {
        await delay(400);
        return {
            data: mockOrganizationData.locations,
            status: 200,
        };
    }

    async getLocation(id: string): Promise<ApiResponse<Location>> {
        await delay(300);
        
        const location = mockOrganizationData.locations.find(l => l.id === id);
        
        if (location) {
            return {
                data: location,
                status: 200,
            };
        }

        return {
            data: {} as Location,
            status: 404,
            error: 'Location not found',
        };
    }

    async createLocation(locationData: CreateLocationRequest): Promise<ApiResponse<Location>> {
        await delay(800);

        const newLocation: Location = {
            id: `loc_${Date.now()}`,
            ...locationData,
            status: 'pending',
            permissions: {
                can_create_locations: false,
                can_manage_inventory: true,
                can_view_all_reports: false,
                can_manage_users: false
            },
            created_at: new Date().toISOString(),
        };

        mockOrganizationData.locations.push(newLocation);

        return {
            data: newLocation,
            status: 201,
        };
    }

    async updateLocation(locationData: UpdateLocationRequest): Promise<ApiResponse<Location>> {
        await delay(600);

        const locationIndex = mockOrganizationData.locations.findIndex(l => l.id === locationData.id);
        
        if (locationIndex === -1) {
            return {
                data: {} as Location,
                status: 404,
                error: 'Location not found',
            };
        }

        const updatedLocation = {
            ...mockOrganizationData.locations[locationIndex],
            ...locationData,
            updated_at: new Date().toISOString(),
        };

        mockOrganizationData.locations[locationIndex] = updatedLocation;

        return {
            data: updatedLocation,
            status: 200,
        };
    }

    async deleteLocation(id: string): Promise<ApiResponse<{ success: boolean }>> {
        await delay(500);

        const locationIndex = mockOrganizationData.locations.findIndex(l => l.id === id);
        
        if (locationIndex === -1) {
            return {
                data: { success: false },
                status: 404,
                error: 'Location not found',
            };
        }

        // Vérifier s'il y a des devices associés
        const hasDevices = mockDevices.some(d => d.location_id === id);
        if (hasDevices) {
            return {
                data: { success: false },
                status: 400,
                error: 'Cannot delete location with associated devices',
            };
        }

        mockOrganizationData.locations.splice(locationIndex, 1);

        return {
            data: { success: true },
            status: 200,
        };
    }

    // Devices (compatibilité avec l'ancien code)
    async getDevices(): Promise<ApiResponse<Device[]>> {
        await delay(600);
        return {
            data: mockLegacyDevices,
            status: 200,
        };
    }

    async getDevice(id: string): Promise<ApiResponse<Device>> {
        await delay(400);

        const device = mockLegacyDevices.find(d => d.id === id);

        if (device) {
            return {
                data: device,
                status: 200,
            };
        }

        return {
            data: {} as Device,
            status: 404,
            error: 'Device not found',
        };
    }

    // Nouvelle API pour les devices avec locations
    async getLocationDevices(locationId: string): Promise<ApiResponse<Device[]>> {
        await delay(400);
        
        const devices = mockDevices.filter(d => d.location_id === locationId);
        
        return {
            data: devices,
            status: 200,
        };
    }

    async getDeviceById(id: string): Promise<ApiResponse<Device>> {
        await delay(300);
        
        const device = mockDevices.find(d => d.id === id);
        
        if (device) {
            return {
                data: device,
                status: 200,
            };
        }

        return {
            data: {} as Device,
            status: 404,
            error: 'Device not found',
        };
    }

    async createDevice(deviceData: CreateDeviceRequest): Promise<ApiResponse<Device>> {
        await delay(700);

        // Vérifier que la location existe
        const locationExists = mockOrganizationData.locations.some(l => l.id === deviceData.location_id);
        if (!locationExists) {
            return {
                data: {} as Device,
                status: 400,
                error: 'Location not found',
            };
        }

        const newDevice: Device = {
            id: `dev_${Date.now()}`,
            ...deviceData,
            firmware_version: 'V1.0.0',
            status: 'offline',
            battery_level: 100,
            last_seen: new Date().toISOString(),
            created_at: new Date().toISOString(),
            capabilities: {
                can_vacuum: deviceData.device_type === 'robot_vacuum',
                can_mop: deviceData.device_type === 'robot_vacuum',
                has_mapping: deviceData.device_type === 'robot_vacuum',
                has_camera: false,
                supports_zones: deviceData.device_type === 'robot_vacuum',
                supports_no_go_zones: deviceData.device_type === 'robot_vacuum'
            }
        };

        mockDevices.push(newDevice);

        return {
            data: newDevice,
            status: 201,
        };
    }

    async updateDevice(deviceData: UpdateDeviceRequest): Promise<ApiResponse<Device>> {
        await delay(500);

        const deviceIndex = mockDevices.findIndex(d => d.id === deviceData.id);
        
        if (deviceIndex === -1) {
            return {
                data: {} as Device,
                status: 404,
                error: 'Device not found',
            };
        }

        const updatedDevice = {
            ...mockDevices[deviceIndex],
            ...deviceData,
            updated_at: new Date().toISOString(),
        };

        mockDevices[deviceIndex] = updatedDevice;

        return {
            data: updatedDevice,
            status: 200,
        };
    }

    async deleteDevice(id: string): Promise<ApiResponse<{ success: boolean }>> {
        await delay(400);

        const deviceIndex = mockDevices.findIndex(d => d.id === id);
        
        if (deviceIndex === -1) {
            return {
                data: { success: false },
                status: 404,
                error: 'Device not found',
            };
        }

        mockDevices.splice(deviceIndex, 1);

        return {
            data: { success: true },
            status: 200,
        };
    }

    // Commandes de device
    async sendDeviceCommand(deviceId: string, command: string, parameters?: Record<string, any>): Promise<ApiResponse<DeviceCommand>> {
        await delay(300);

        const device = mockDevices.find(d => d.id === deviceId);
        if (!device) {
            return {
                data: {} as DeviceCommand,
                status: 404,
                error: 'Device not found',
            };
        }

        const deviceCommand: DeviceCommand = {
            id: `cmd_${Date.now()}`,
            device_id: deviceId,
            command_type: command as any,
            parameters,
            status: 'pending',
            created_at: new Date().toISOString(),
        };

        // Simuler l'exécution de la commande
        setTimeout(() => {
            deviceCommand.status = 'completed';
            deviceCommand.completed_at = new Date().toISOString();
            
            // Mettre à jour le statut du device selon la commande
            if (command === 'start_cleaning') {
                device.status = 'cleaning';
            } else if (command === 'return_to_dock') {
                device.status = 'online';
            }
        }, 2000);

        return {
            data: deviceCommand,
            status: 200,
        };
    }
}

export default new MockApi();

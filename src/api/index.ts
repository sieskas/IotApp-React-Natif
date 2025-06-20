// src/api/index.ts
import { getEnvironmentConfig } from '../utils/environment';
import apiClient from './apiClient';
import mockApi from './mockApi';
import type { 
  User, 
  OrganizationData, 
  Location, 
  CreateLocationRequest, 
  UpdateLocationRequest,
  Device,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  DeviceCommand 
} from '../types';

export type { 
  User, 
  OrganizationData, 
  Location, 
  CreateLocationRequest, 
  UpdateLocationRequest,
  Device,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  DeviceCommand 
};

// Cette fonction retourne l'API appropriée en fonction de l'environnement
const getApi = () => {
    const config = getEnvironmentConfig();

    if (config.usesMocks) {
        return mockApi;
    }

    // Implémentation réelle utilisant apiClient
    return {
        // Auth
        login: async (username: string, password: string) => {
            return await apiClient.post('/auth/login', { username, password });
        },

        register: async (userData: { username: string; email: string; password: string }) => {
            return await apiClient.post('/auth/register', userData);
        },

        // Organization & Locations
        getOrganizationData: async () => {
            return await apiClient.get('/organization');
        },

        getLocations: async () => {
            return await apiClient.get('/locations');
        },

        getLocation: async (id: string) => {
            return await apiClient.get(`/locations/${id}`);
        },

        createLocation: async (locationData: CreateLocationRequest) => {
            return await apiClient.post('/locations', locationData);
        },

        updateLocation: async (locationData: UpdateLocationRequest) => {
            return await apiClient.put(`/locations/${locationData.id}`, locationData);
        },

        deleteLocation: async (id: string) => {
            return await apiClient.delete(`/locations/${id}`);
        },

        // Devices (compatibilité avec l'ancien code)
        getDevices: async () => {
            return await apiClient.get('/devices');
        },

        getDevice: async (id: string) => {
            return await apiClient.get(`/devices/${id}`);
        },

        // Nouvelle API pour les devices avec locations
        getLocationDevices: async (locationId: string) => {
            return await apiClient.get(`/locations/${locationId}/devices`);
        },

        getDeviceById: async (id: string) => {
            return await apiClient.get(`/devices/${id}`);
        },

        createDevice: async (deviceData: CreateDeviceRequest) => {
            return await apiClient.post('/devices', deviceData);
        },

        updateDevice: async (deviceData: UpdateDeviceRequest) => {
            return await apiClient.put(`/devices/${deviceData.id}`, deviceData);
        },

        deleteDevice: async (id: string) => {
            return await apiClient.delete(`/devices/${id}`);
        },

        sendDeviceCommand: async (deviceId: string, command: string, parameters?: Record<string, any>) => {
            return await apiClient.post(`/devices/${deviceId}/commands`, { command, parameters });
        },
    };
};

export default getApi();

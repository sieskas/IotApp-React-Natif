// src/api/index.ts
import { getEnvironmentConfig } from '../utils/environment';
import apiClient from './apiClient';
import mockApi from './mockApi';
import type { User, Device } from './mockApi';

export type { User, Device };

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

        // Devices
        getDevices: async () => {
            return await apiClient.get('/devices');
        },

        getDevice: async (id: string) => {
            return await apiClient.get(`/devices/${id}`);
        },

        // Ajoutez d'autres méthodes d'API au besoin
    };
};

export default getApi();

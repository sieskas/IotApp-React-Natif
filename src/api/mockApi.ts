// src/api/mockApi.ts
import { ApiResponse } from './apiClient';

// Types pour les modèles de données
export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Device {
    id: string;
    name: string;
    model: string;
    firmwareVersion: string;
    status: 'online' | 'offline' | 'cleaning' | 'charging';
    batteryLevel: number;
}

// Données mockées
const mockUsers: User[] = [
    { id: '1', username: 'test', email: 'test@example.com' },
    { id: '2', username: 'demouser', email: 'demo@example.com' },
];

const mockDevices: Device[] = [
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

// Fonction pour simuler un délai de réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API
class MockApi {
    // Authentification
    async login(username: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
        await delay(500); // Simuler la latence réseau

        const user = mockUsers.find(u => u.username === username);

        if (user && password.length > 3) { // Validation simplifiée
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

    // Devices
    async getDevices(): Promise<ApiResponse<Device[]>> {
        await delay(600);

        return {
            data: mockDevices,
            status: 200,
        };
    }

    async getDevice(id: string): Promise<ApiResponse<Device>> {
        await delay(400);

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
}

export default new MockApi();

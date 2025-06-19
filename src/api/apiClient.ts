// src/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getEnvironmentConfig } from '../utils/environment';

export interface ApiResponse<T> {
    data: T;
    status: number;
    error?: string;
}

class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor() {
        const config = getEnvironmentConfig();

        this.axiosInstance = axios.create({
            baseURL: config.apiUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Intercepteurs pour ajouter le token d'authentification si nécessaire
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                // Vous pourriez ajouter ici la logique pour récupérer et ajouter le token
                // const token = await AsyncStorage.getItem('auth_token');
                // if (token) {
                //   config.headers.Authorization = `Bearer ${token}`;
                // }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error: any) {
            return {
                data: {} as T,
                status: error.response?.status || 500,
                error: error.message,
            };
        }
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<T>(url, data, config);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error: any) {
            return {
                data: {} as T,
                status: error.response?.status || 500,
                error: error.message,
            };
        }
    }

    // Ajoutez d'autres méthodes HTTP si nécessaire (PUT, DELETE, etc.)
}

export default new ApiClient();

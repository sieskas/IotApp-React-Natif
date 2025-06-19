// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import api from '../api';
import type { User, Device } from '../api';

// Import du type ApiResponse depuis apiClient
import { ApiResponse } from '../api/apiClient';

// Hook pour gérer les appels API avec gestion d'état
export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction générique pour exécuter un appel API
  const executeApiCall = useCallback(async <T>(apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();

      if (response.status >= 200 && response.status < 300) {
        setLoading(false);
        return { data: response.data, success: true };
      } else {
        setError(response.error || 'Une erreur est survenue');
        setLoading(false);
        return { data: null, success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setError(errorMessage);
      setLoading(false);
      return { data: null, success: false, error: errorMessage };
    }
  }, []);

  // Fonctions spécifiques pour chaque endpoint API
  const loginUser = useCallback(async (username: string, password: string) => {
    return executeApiCall<{ token: string; user: User }>(() => api.login(username, password) as Promise<ApiResponse<{ token: string; user: User }>>);
  }, [executeApiCall]);

  const registerUser = useCallback(async (userData: { username: string; email: string; password: string }) => {
    return executeApiCall<User>(() => api.register(userData) as Promise<ApiResponse<User>>);
  }, [executeApiCall]);

  const fetchDevices = useCallback(async () => {
    return executeApiCall<Device[]>(() => api.getDevices() as Promise<ApiResponse<Device[]>>);
  }, [executeApiCall]);

  const fetchDevice = useCallback(async (id: string) => {
    return executeApiCall<Device>(() => api.getDevice(id) as Promise<ApiResponse<Device>>);
  }, [executeApiCall]);

  return {
    loading,
    error,
    loginUser,
    registerUser,
    fetchDevices,
    fetchDevice,
    // Fonction utilitaire pour réinitialiser les états
    resetState: () => {
      setLoading(false);
      setError(null);
    }
  };
};

export default useApi;

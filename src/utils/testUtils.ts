// src/utils/testUtils.ts
import { Environment } from './environment';

// Utilitaires pour les tests
export const setupTestEnvironment = () => {
    // Configurez l'environnement pour les tests
    jest.mock('./environment', () => ({
        getCurrentEnvironment: jest.fn(() => Environment.TEST),
        getEnvironmentConfig: jest.fn(() => ({
            apiUrl: 'https://api.test.roborock.example',
            usesMocks: true,
        })),
    }));
};

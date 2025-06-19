// src/utils/environment.ts
import Config from 'react-native-config';

export enum Environment {
  TEST = 'test',
  DEV = 'dev',
  PROD = 'prod',
}

interface EnvironmentConfig {
  apiUrl: string;
  usesMocks: boolean;
}

// Déterminer l'environnement actuel à partir des variables d'environnement
export const getCurrentEnvironment = (): Environment => {
  const env = Config.ENV as Environment || Environment.PROD;

  if (Object.values(Environment).includes(env)) {
    return env;
  }

  // Fallback en production si la valeur n'est pas reconnue
  console.warn(`Environment value "${env}" not recognized. Using PROD as fallback.`);
  return Environment.PROD;
};

// Configuration basée sur l'environnement actuel
export const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    apiUrl: Config.API_URL || 'https://api.roborock.example',
    usesMocks: Config.USE_MOCKS === 'true',
  };
};

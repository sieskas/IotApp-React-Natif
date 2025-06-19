// src/navigation/RootNavigation.ts
import { createRef } from 'react';

// Définir un type générique pour la référence de navigation
type NavigationRef = {
  navigate: (name: string, params?: object) => void;
  goBack: () => void;
  reset: (state: any) => void;
};

export const navigationRef = createRef<NavigationRef>();

export function navigate(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  }
}

export function reset(state: any) {
  if (navigationRef.current) {
    navigationRef.current.reset(state);
  }
}

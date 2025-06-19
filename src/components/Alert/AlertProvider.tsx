// src/components/Alert/AlertProvider.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import AlertComponent from './AlertComponent';

export interface AlertOptions {
  id?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  showIcon?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  actions?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'destructive' | 'cancel';
  }>;
}

export interface Alert extends AlertOptions {
  id: string;
  timestamp: number;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => string;
  hideAlert: (id: string) => void;
  hideAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: React.ReactNode;
  maxAlerts?: number;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({
                                                              children,
                                                              maxAlerts = 3
                                                            }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const generateId = () => `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const hideAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const showAlert = useCallback((options: AlertOptions): string => {
    const id = options.id || generateId();
    const newAlert: Alert = {
      ...options,
      id,
      timestamp: Date.now(),
      type: options.type || 'info',
      duration: options.duration !== undefined ? options.duration : 4000,
      showIcon: options.showIcon !== false,
    };

    setAlerts(prev => {
      // Remove existing alert with same id if any
      const filtered = prev.filter(alert => alert.id !== id);

      // Add new alert and keep only maxAlerts
      const updated = [newAlert, ...filtered].slice(0, maxAlerts);

      return updated;
    });

    // Auto-hide after duration (if not persistent)
    if (!options.persistent && newAlert.duration! > 0) {
      setTimeout(() => {
        hideAlert(id);
      }, newAlert.duration);
    }

    return id;
  }, [maxAlerts, hideAlert]);

  const hideAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const handleAlertPress = (alert: Alert) => {
    if (alert.onPress) {
      alert.onPress();
    }
  };

  const handleAlertClose = (alert: Alert) => {
    hideAlert(alert.id);
    if (alert.onClose) {
      alert.onClose();
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, hideAllAlerts }}>
      {children}
      <View
        style={styles.alertContainer}
        pointerEvents="box-none"
        testID="alerts-container"
      >
        {alerts.map((alert, index) => (
          <AlertComponent
            key={alert.id}
            alert={alert}
            index={index}
            onPress={() => handleAlertPress(alert)}
            onClose={() => handleAlertClose(alert)}
          />
        ))}
      </View>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 60, // Safe area top + status bar
    paddingHorizontal: 16,
  },
});

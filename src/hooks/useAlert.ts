// src/hooks/useAlert.ts (hook utilitaire)
import {AlertOptions, useAlert as useAlertContext} from '../components/Alert/AlertProvider';

// Fonctions utilitaires pour des alertes rapides
export const useAlert = () => {
  const { showAlert, hideAlert, hideAllAlerts } = useAlertContext();

  const showSuccess = (message: string, options?: Partial<AlertOptions>) => {
    return showAlert({
      type: 'success',
      message,
      ...options,
    });
  };

  const showError = (message: string, options?: Partial<AlertOptions>) => {
    return showAlert({
      type: 'error',
      message,
      ...options,
    });
  };

  const showWarning = (message: string, options?: Partial<AlertOptions>) => {
    return showAlert({
      type: 'warning',
      message,
      ...options,
    });
  };

  const showInfo = (message: string, options?: Partial<AlertOptions>) => {
    return showAlert({
      type: 'info',
      message,
      ...options,
    });
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: Partial<AlertOptions>
  ) => {
    return showAlert({
      type: 'warning',
      message,
      persistent: true,
      actions: [
        {
          text: 'Annuler',
          style: 'cancel',
          onPress: onCancel || (() => {}),
        },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: onConfirm,
        },
      ],
      ...options,
    });
  };

  return {
    showAlert,
    hideAlert,
    hideAllAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};

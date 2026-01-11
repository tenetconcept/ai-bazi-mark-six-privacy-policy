import { useState, useCallback } from 'react';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
  title?: string;
  message: string;
  buttons?: AlertButton[];
}

interface AlertState extends AlertOptions {
  visible: boolean;
}

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    message: '',
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      ...options,
      visible: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    alertState,
    showAlert,
    hideAlert,
  };
};

import React, { createContext, useState, useCallback } from 'react';
import { SNACKBAR_STATUS } from '../hooks/useSnackbar.constants';

const SNACKBAR_TIMEOUT = 5000;

type Snackbar = {
  isShown: boolean;
  message: string | undefined;
  status: (typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS] | undefined;
};

type SnackbarContextType = {
  snackbar: Snackbar;
  showSnackbar: ({ message, status }: Omit<Snackbar, 'isShown'>) => void;
};

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<Snackbar>({
    isShown: false,
    message: undefined,
    status: undefined,
  });

  const showSnackbar = useCallback(({ message, status }: Omit<Snackbar, 'isShown'>) => {
    setSnackbar({ isShown: true, message, status });
    setTimeout(() => {
      setSnackbar({ isShown: false, message: undefined, status: undefined });
    }, SNACKBAR_TIMEOUT);
  }, []);

  return (
    <SnackbarContext.Provider value={{ snackbar, showSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
}

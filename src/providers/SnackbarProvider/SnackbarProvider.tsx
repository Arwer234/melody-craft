import React, { createContext, useState, useCallback } from 'react';
import { Snackbar, SnackbarContextType } from './SnackbarProvider.types';

const SNACKBAR_TIMEOUT = 5000;

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

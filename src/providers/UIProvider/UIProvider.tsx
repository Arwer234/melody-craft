import React, { createContext, useState, useCallback } from 'react';
import { DrawerType, SnackbarType, UIContextType } from './UIProvider.types';

const SNACKBAR_TIMEOUT = 5000;

export const UIContext = createContext<UIContextType>({
  drawer: { isOpen: false },
  showSnackbar: () => {},
  toggleDrawer: () => {},
  snackbar: { isShown: false, message: undefined, status: undefined },
});

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarType>({
    isShown: false,
    message: undefined,
    status: undefined,
  });
  const [drawer, setDrawer] = useState<DrawerType>({
    isOpen: false,
  });

  function toggleDrawer() {
    setDrawer(prevState => {
      return { ...prevState, isOpen: !prevState.isOpen };
    });
  }

  const showSnackbar = useCallback(({ message, status }: Omit<SnackbarType, 'isShown'>) => {
    setSnackbar({ isShown: true, message, status });
    setTimeout(() => {
      setSnackbar({ isShown: false, message: undefined, status: undefined });
    }, SNACKBAR_TIMEOUT);
  }, []);

  return (
    <UIContext.Provider value={{ snackbar, showSnackbar, drawer, toggleDrawer }}>
      {children}
    </UIContext.Provider>
  );
}

import React, { createContext, useState, useCallback } from 'react';
import { AudioPlayerType, DrawerType, SnackbarType, UIContextType } from './UIProvider.types';

const SNACKBAR_TIMEOUT = 5000;

export const UIContext = createContext<UIContextType>({
  drawer: { isOpen: false },
  showSnackbar: () => {},
  toggleDrawer: () => {},
  snackbar: { isShown: false, message: undefined, status: undefined },
  audioPlayer: { isPlaying: false, isShown: false, src: '', fileName: '' },
  togglePlay: () => {},
  setSrc: () => {},
  toggleAudioPlayer: () => {},
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
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayerType>({
    isPlaying: false,
    isShown: false,
    src: '',
    fileName: '',
  });

  function toggleDrawer() {
    setDrawer(prevState => {
      return { ...prevState, isOpen: !prevState.isOpen };
    });
  }

  function togglePlay() {
    setAudioPlayer(previousState => ({ ...previousState, isPlaying: !previousState.isPlaying }));
  }

  function toggleAudioPlayer() {
    setAudioPlayer(previousState => ({ ...previousState, isShown: !previousState.isShown }));
  }

  function setSrc(src: string, fileName: string) {
    setAudioPlayer(previousState => ({ ...previousState, src: src, fileName: fileName }));
  }

  const showSnackbar = useCallback(({ message, status }: Omit<SnackbarType, 'isShown'>) => {
    setSnackbar({ isShown: true, message, status });
    setTimeout(() => {
      setSnackbar({ isShown: false, message: undefined, status: undefined });
    }, SNACKBAR_TIMEOUT);
  }, []);

  return (
    <UIContext.Provider
      value={{
        snackbar,
        showSnackbar,
        drawer,
        toggleDrawer,
        audioPlayer,
        togglePlay,
        setSrc,
        toggleAudioPlayer,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

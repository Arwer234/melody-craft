import React, { createContext, useState, useCallback } from 'react';
import { AudioPlayerType, DrawerType, SnackbarType, UIContextType } from './UIProvider.types';
import { useQuery } from '@tanstack/react-query';
import { getAudioEditorTracks } from '../StoreProvider/StoreProvider.helpers';
import { useMediaQuery, useTheme } from '@mui/material';

const SNACKBAR_TIMEOUT = 5000;

export const UIContext = createContext<UIContextType>({
  drawer: { isOpen: false },
  showSnackbar: () => {},
  toggleDrawer: () => {},
  snackbar: { isShown: false, message: undefined, status: undefined },
  audioPlayer: { isPlaying: false, isShown: false, playlist: [], fileName: '' },
  togglePlay: () => {},
  toggleAudioPlayer: () => {},
  addToPlaylist: () => {},
  isLoading: false,
  isMobile: false,
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
    playlist: [],
    fileName: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up('sm'));

  function toggleDrawer() {
    setDrawer(prevState => {
      return { ...prevState, isOpen: !prevState.isOpen };
    });
  }

  const { data: userTracks, isLoading } = useQuery({
    queryKey: ['audioEditorTracks'],
    queryFn: () => getAudioEditorTracks({ isOwnTracks: false }),
  });

  function togglePlay() {
    setAudioPlayer(previousState => ({ ...previousState, isPlaying: !previousState.isPlaying }));
  }

  function toggleAudioPlayer() {
    setAudioPlayer(previousState => ({ ...previousState, isShown: !previousState.isShown }));
  }

  function addToPlaylist(trackName: string) {
    const track = userTracks?.find(track => track.name === trackName);
    if (track) {
      setAudioPlayer(previousState => ({
        ...previousState,
        playlist: [track],
      }));
    }
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
        toggleAudioPlayer,
        addToPlaylist,
        isLoading,
        isMobile,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

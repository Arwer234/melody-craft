import { createContext, useContext, useState } from 'react';
import React from 'react';
import { StoreContextType } from './StoreProvider.types';
import { getMusicFilesData } from './StoreProvider.helpers';
import { StorageError } from 'firebase/storage';
import { UIContext } from '../UIProvider/UIProvider';

export const StoreContext = createContext<StoreContextType>({
  musicFilesMetadata: [],
  fetchMusicFilesMetadata: () => {},
  isMusicFilesMetadataLoaded: false,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [musicFilesMetadata, setMusicFilesMetadata] = useState<
    StoreContextType['musicFilesMetadata']
  >([]);
  const [isMusicFilesMetadataLoaded, setIsMusicFilesMetadataLoaded] = useState(false);
  const { showSnackbar } = useContext(UIContext);

  function fetchMusicFilesMetadata() {
    getMusicFilesData({})
      .then((data: StoreContextType['musicFilesMetadata']) => {
        setMusicFilesMetadata(data);
        if (!isMusicFilesMetadataLoaded) setIsMusicFilesMetadataLoaded(true);
      })
      .catch((error: StorageError) => {
        showSnackbar({ message: `There was an error, ${error.message}`, status: 'error' });
      });
  }

  return (
    <StoreContext.Provider
      value={{ isMusicFilesMetadataLoaded, musicFilesMetadata, fetchMusicFilesMetadata }}
    >
      {children}
    </StoreContext.Provider>
  );
}

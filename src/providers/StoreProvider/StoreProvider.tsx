import { createContext } from 'react';
import React from 'react';
import { StoreContextType } from './StoreProvider.types';
import { getMusicFilesData } from './StoreProvider.helpers';
import { useQuery, QueryClient } from '@tanstack/react-query';

export const StoreContext = createContext<StoreContextType>({
  musicFilesMetadata: [],
  isMusicFilesMetadataLoaded: false,
  refetchMusicFilesMetadata: () => {},
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { data, isFetched } = useQuery<StoreContextType['musicFilesMetadata']>({
    queryKey: ['musicFilesMetadata'],
    queryFn: fetchMusicFilesMetadata,
  });

  const queryClient = new QueryClient();

  function fetchMusicFilesMetadata() {
    return getMusicFilesData({});
  }

  function refetchMusicFilesMetadata() {
    void queryClient.invalidateQueries({ queryKey: ['musicFilesMetadata'] });
  }

  return (
    <StoreContext.Provider
      value={{
        isMusicFilesMetadataLoaded: isFetched,
        musicFilesMetadata: data ?? [],
        refetchMusicFilesMetadata,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

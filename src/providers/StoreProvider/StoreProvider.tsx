import { createContext } from 'react';
import React from 'react';
import { StoreContextType } from './StoreProvider.types';
import { getMusicFilesData } from './StoreProvider.helpers';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../main';
import useAuth from '../../hooks/useAuth/useAuth';

export const StoreContext = createContext<StoreContextType>({
  musicFilesMetadata: [],
  isMusicFilesMetadataLoaded: false,
  refetchMusicFilesMetadata: () => {},
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { userInfo } = useAuth();
  const { data, isFetched } = useQuery<StoreContextType['musicFilesMetadata']>({
    queryKey: ['musicFilesMetadata', userInfo?.uid],
    queryFn: fetchMusicFilesMetadata,
  });

  function fetchMusicFilesMetadata() {
    return getMusicFilesData({ ownerUid: userInfo?.uid });
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

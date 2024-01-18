import { Box, Typography } from '@mui/material';
import { DEBOUNCE_TIME } from './Discover.constants';
import SearchBar from '../../components/SearchBar/SearchBar';
import useDebounce from '../../hooks/useDebounce/useDebounce';
import { useQuery } from '@tanstack/react-query';
import {
  getPlaylists,
  getTags,
  getTracks,
} from '../../providers/StoreProvider/StoreProvider.helpers';
import { useContext, useState } from 'react';
import TrackList from '../../components/TrackList/TrackList';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

export default function Discover() {
  const {
    isLoading,
    updateValue: setSearchValue,
    value,
    debouncedValue,
  } = useDebounce('', DEBOUNCE_TIME);
  const { data: tracks } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      return await getTracks({ name: '', tags: [] });
    },
  });
  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await getTags();
    },
  });

  const { userInfo } = useContext(AuthContext);

  const { data: playlists } = useQuery({
    queryKey: ['playlists', userInfo?.uid],
    queryFn: async () => getPlaylists({ ownerUid: userInfo?.uid }),
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  function handleTagClick(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  const tracksByName =
    debouncedValue.length > 0
      ? tracks?.filter(track => track.name.includes(debouncedValue))
      : tracks;
  const tracksByTags =
    selectedTags.length > 0
      ? tracksByName?.filter(track => track.tags.some(tag => selectedTags.includes(tag)))
      : tracksByName;

  return (
    <Box margin={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Discover</Typography>
      <SearchBar
        tags={tags ?? []}
        searchValue={value}
        onSearchValueChange={setSearchValue}
        onTagClick={handleTagClick}
        selectedTags={selectedTags}
      />
      <TrackList playlists={playlists ?? []} tracks={tracksByTags ?? []} isLoading={isLoading} />
    </Box>
  );
}

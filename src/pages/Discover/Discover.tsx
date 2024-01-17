import { Box, Skeleton, Typography } from '@mui/material';
import { DEBOUNCE_TIME } from './Discover.constants';
import DiscoverTile from './DiscoverTile/DiscoverTile';
import SearchBar from '../../components/SearchBar/SearchBar';
import useDebounce from '../../hooks/useDebounce/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { getTags, getTracks } from '../../providers/StoreProvider/StoreProvider.helpers';
import { useState } from 'react';

export default function Discover() {
  const {
    isLoading,
    updateValue: setSearchValue,
    value,
    debouncedValue,
  } = useDebounce('', DEBOUNCE_TIME);
  const { data: tracks } = useQuery({
    queryKey: ['discover'],
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
      {isLoading && <Skeleton variant="rectangular" height={288} />}
      {!isLoading && (
        <Box display="flex" gap={1} flexDirection="column">
          {tracksByTags?.map(item =>
            item.visibility === 'public' ? <DiscoverTile {...item} key={item.name} /> : null,
          )}
        </Box>
      )}
    </Box>
  );
}

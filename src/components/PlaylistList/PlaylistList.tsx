import { Box } from '@mui/material';
import { PlaylistListProps } from './PlaylistList.types';
import PlaylistListItem from './PlaylistListItem/PlaylistListItem';

export default function PlaylistList({ playlists }: PlaylistListProps) {
  return (
    <Box>
      {playlists?.map((playlist, key) => (
        <PlaylistListItem key={`${playlist.name} ${key}`} {...playlist} />
      ))}
    </Box>
  );
}

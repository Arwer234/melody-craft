import { Box } from '@mui/material';
import { PlaylistListProps } from './PlaylistList.types';
import PlaylistListItem from './PlaylistListItem/PlaylistListItem';
import TrackList from '../TrackList/TrackList';
import Spinner from '../Spinner/Spinner';

export default function PlaylistList({
  playlists,
  onRemovePlaylist,
  onRemoveTrackFromPlaylist,
  isLoading,
}: PlaylistListProps) {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box height="100%">
      {playlists?.map((playlist, key) => (
        <Box key={`${playlist.name} ${key}`}>
          <PlaylistListItem {...playlist} onRemove={() => onRemovePlaylist(playlist.name)} />
          <Box pl={2}>
            <TrackList
              tracks={playlist.tracks}
              playlists={playlists}
              onRemoveTrackFromPlaylist={(trackName: string) =>
                onRemoveTrackFromPlaylist(playlist.name, trackName)
              }
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

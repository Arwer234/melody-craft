import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
} from '@mui/material';
import { TrackListProps } from './TrackList.types';
import TrackListItem from './TrackListItem/TrackListItem';
import { queryClient } from '../../main';
import { setPlaylist } from '../../providers/StoreProvider/StoreProvider.helpers';
import { useContext, useState } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../providers/AuthProvider/AuthProvider.helpers';

export default function TrackList({ tracks, isLoading, playlists }: TrackListProps) {
  const [trackNameToAdd, setTrackNameToAdd] = useState<string | null>(null);
  const [isAddToPlaylistDialogOpen, setIsAddToPlaylistDialogOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const { showSnackbar } = useContext(UIContext);
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getAllUsers });

  function handleAddToPlaylistClick({ trackName }: { trackName: string }) {
    if (playlists && playlists.length > 0) {
      setIsAddToPlaylistDialogOpen(true);
      setTrackNameToAdd(trackName);
    } else {
      showSnackbar({ message: 'You have no playlists!', status: 'error' });
    }
  }

  function handleAddToPlaylistConfirm() {
    setIsAddToPlaylistDialogOpen(false);

    const selectedPlaylist = playlists?.find(playlist => playlist.name === playlistTitle);
    if (!trackNameToAdd || !selectedPlaylist) return;

    void setPlaylist({
      name: playlistTitle,
      trackNames: [...selectedPlaylist.trackNames, trackNameToAdd],
    });
    void queryClient.invalidateQueries({ queryKey: ['playlists'] });
  }

  if (isLoading) {
    return <Skeleton variant="rectangular" height={288} />;
  }

  return (
    <>
      <Dialog onClose={() => setIsAddToPlaylistDialogOpen(false)} open={isAddToPlaylistDialogOpen}>
        <DialogTitle>Choose playlist</DialogTitle>
        <DialogContent>
          <Select
            value={playlistTitle}
            onChange={(event: SelectChangeEvent) => setPlaylistTitle(event.target.value)}
            fullWidth
          >
            {playlists?.map(playlist => (
              <MenuItem key={playlist.name} value={playlist.name}>
                {playlist.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddToPlaylistDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleAddToPlaylistConfirm()}>Add</Button>
        </DialogActions>
      </Dialog>
      <Box display="flex" gap={1} flexDirection="column">
        {tracks?.map(item =>
          item.visibility === 'public' ? (
            <TrackListItem
              user={users?.find(user => user.uid === item.ownerUid)}
              onAddToPlaylist={handleAddToPlaylistClick}
              {...item}
              key={item.name}
            />
          ) : null,
        )}
      </Box>
    </>
  );
}

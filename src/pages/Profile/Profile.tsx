import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import useAuth from '../../hooks/useAuth/useAuth';
import { useLocation } from 'react-router-dom';
import { getUserDisplayName } from '../../providers/AuthProvider/AuthProvider.helpers';
import { useQuery } from '@tanstack/react-query';
import {
  getPlaylists,
  getTracks,
  setPlaylist,
} from '../../providers/StoreProvider/StoreProvider.helpers';
import { Add } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { STORE_ERRORS } from '../../providers/StoreProvider/StoreProvider.constants';
import { queryClient } from '../../main';
import TrackList from '../../components/TrackList/TrackList';
import PlaylistList from '../../components/PlaylistList/PlaylistList';

export default function Profile() {
  const { userInfo } = useAuth();
  const location = useLocation();
  const [isPlaylistTitleDialogOpen, setIsPlaylistTitleDialogOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const { showSnackbar } = useContext(UIContext);

  const queryParams = new URLSearchParams(location.search);
  const ownerUid = queryParams.get('id');
  const resolvedOwnerUid = ownerUid ?? (userInfo?.uid as string);
  const isOwnPage = ownerUid === userInfo?.uid || !ownerUid;

  const { data: fetchedDisplayName } = useQuery({
    queryKey: ['displayName', resolvedOwnerUid],
    queryFn: async () => getUserDisplayName(ownerUid ?? ''),
    enabled: Boolean(ownerUid) && !isOwnPage,
  });

  const { data: userTracks, isLoading: isUserTracksLoading } = useQuery({
    queryKey: ['userTracks', resolvedOwnerUid],
    queryFn: async () => getTracks({ ownerUid: resolvedOwnerUid }),
  });

  const { data: playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => getPlaylists({ ownerUid: userInfo?.uid }),
  });

  const resolvedDisplayName = fetchedDisplayName ?? userInfo?.displayName;
  const filteredTracks = isOwnPage
    ? userTracks
    : userTracks?.filter(track => track.visibility === 'public');

  async function handleCreatePlaylistClick() {
    setIsPlaylistTitleDialogOpen(false);

    const result = await setPlaylist({ name: playlistTitle, trackNames: [] });

    if (result.status === 'success') {
      showSnackbar({ message: 'Playlist created!', status: result.status });
    }

    if (result.status === 'error') {
      if (result.message === STORE_ERRORS.PLAYLIST_EXISTS) {
        showSnackbar({ message: 'Playlist with that name already exists!', status: result.status });
      }
    }
    void queryClient.invalidateQueries({ queryKey: ['playlists'] });
  }

  return (
    <Box margin={2}>
      <Dialog onClose={() => setIsPlaylistTitleDialogOpen(false)} open={isPlaylistTitleDialogOpen}>
        <DialogTitle>Playlist title</DialogTitle>
        <DialogContent>
          <TextField
            value={playlistTitle}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPlaylistTitle(event.target.value)
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPlaylistTitleDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => void handleCreatePlaylistClick()}>Create</Button>
        </DialogActions>
      </Dialog>
      <Typography mb={2} variant="h4">
        Profile - {resolvedDisplayName}
      </Typography>
      <Box display="flex" flexDirection={['column', 'row']} gap={2}>
        <Paper sx={{ padding: 2, width: '100%', minHeight: 500 }}>
          <Typography variant="h5">Personal tracks</Typography>
          <TrackList
            playlists={playlists ?? []}
            tracks={filteredTracks ?? []}
            isLoading={isUserTracksLoading}
            ownerUid={ownerUid ?? undefined}
          />
        </Paper>
        <Paper sx={{ padding: 2, width: '100%', minHeight: 500 }}>
          <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography variant="h5">Playlists</Typography>
            <PlaylistList playlists={playlists ?? []} />
            <Box display="flex" justifyContent="flex-end">
              {isOwnPage && (
                <Button
                  onClick={() => setIsPlaylistTitleDialogOpen(true)}
                  variant="contained"
                  startIcon={<Add />}
                >
                  Create
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

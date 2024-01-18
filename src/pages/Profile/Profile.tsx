import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import MusicTileList from '../MyFiles/MusicTileList/MusicTileList';
import { Add } from '@mui/icons-material';
import React, { Fragment, useContext, useState } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { STORE_ERRORS } from '../../providers/StoreProvider/StoreProvider.constants';
import { queryClient } from '../../main';

export default function Profile() {
  const { userInfo } = useAuth();
  const location = useLocation();
  const [isPlaylistTitleDialogOpen, setIsPlaylistTitleDialogOpen] = useState(false);
  const [isAddToPlaylistDialogOpen, setIsAddToPlaylistDialogOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [trackNameToAdd, setTrackNameToAdd] = useState<string | null>(null);
  const { showSnackbar } = useContext(UIContext);

  const queryParams = new URLSearchParams(location.search);
  const ownerUid = queryParams.get('id');
  const resolvedOwnerUid = ownerUid ?? (userInfo?.uid as string);
  const isOwner = ownerUid === userInfo?.uid || !ownerUid;

  const { data: fetchedDisplayName } = useQuery({
    queryKey: ['displayName', resolvedOwnerUid],
    queryFn: async () => getUserDisplayName(ownerUid ?? ''),
    enabled: Boolean(ownerUid) && !isOwner,
  });

  const { data: userTracks, isLoading: isUserTracksLoading } = useQuery({
    queryKey: ['userTracks', resolvedOwnerUid],
    queryFn: async () => getTracks({ ownerUid: resolvedOwnerUid }),
  });

  const { data: playlists } = useQuery({
    queryKey: ['playlists', resolvedOwnerUid],
    queryFn: async () => getPlaylists({ ownerUid: resolvedOwnerUid }),
  });

  const resolvedDisplayName = fetchedDisplayName ?? userInfo?.displayName;
  const filteredTracks = isOwner
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
    void queryClient.invalidateQueries({ queryKey: ['playlists', resolvedOwnerUid] });
  }

  function handleAddToPlaylistClick(trackName: string) {
    if (playlists && playlists?.length > 0) {
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
    void queryClient.invalidateQueries({ queryKey: ['playlists', resolvedOwnerUid] });
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
      <Typography mb={2} variant="h4">
        Profile - {resolvedDisplayName}
      </Typography>
      <Box display="flex" flexDirection={['column', 'row']} gap={2}>
        <Paper sx={{ padding: 2, width: '100%', minHeight: 500 }}>
          <Typography variant="h5">Personal tracks</Typography>
          <MusicTileList
            isLoaded={!isUserTracksLoading}
            fileType="track"
            tracksData={filteredTracks}
            onAdd={handleAddToPlaylistClick}
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
            <Box>
              {playlists?.map(playlist => (
                <Fragment key={playlist.name}>
                  <Typography variant="h6">{playlist.name}</Typography>
                  {playlist.tracks.map((track, key) => (
                    <Typography ml={1} key={`${track.name} ${playlist.name} ${key}`}>
                      {track.name}
                    </Typography>
                  ))}
                </Fragment>
              ))}
            </Box>
            <Box display="flex" justifyContent="flex-end">
              {isOwner && (
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

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import useAuth from '../../hooks/useAuth/useAuth';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  deletePlaylist,
  getFirestoreUser,
  getPlaylists,
  getTracks,
  setFirestoreUserDescription,
  setFirestoreUserImage,
  setPlaylist,
} from '../../providers/StoreProvider/StoreProvider.helpers';
import { Add, Edit, Save } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { STORE_ERRORS } from '../../providers/StoreProvider/StoreProvider.constants';
import { queryClient } from '../../main';
import TrackList from '../../components/TrackList/TrackList';
import PlaylistList from '../../components/PlaylistList/PlaylistList';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import placeholderAvatar from '../../assets/images/placeholder_avatar.jpg';
import { PROFILE_DEFAULT_DESCRIPTION } from './Profile.constants';
import Spinner from '../../components/Spinner/Spinner';
import FileDialog from '../MyFiles/FileDialog/FileDialog';
import { ACCEPTED_FILE_TYPES } from '../MyFiles/FileDialog/FileDialog.constants';

export default function Profile() {
  const { userInfo } = useAuth();
  const location = useLocation();
  const [isPlaylistTitleDialogOpen, setIsPlaylistTitleDialogOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const { showSnackbar } = useContext(UIContext);
  const [isDescriptionEditMode, setIsDescriptionEditMode] = useState(false);
  const [description, setDescription] = useState('');
  const [isImageEditMode, setIsImageEditMode] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const ownerUid = queryParams.get('id');
  const resolvedOwnerUid = ownerUid ?? (userInfo?.uid as string);
  const isOwnPage = ownerUid === userInfo?.uid || !ownerUid;

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ['user', resolvedOwnerUid],
    queryFn: async () => getFirestoreUser({ uid: resolvedOwnerUid }),
  });

  const { data: userTracks, isLoading: isUserTracksLoading } = useQuery({
    queryKey: ['userTracks', resolvedOwnerUid],
    queryFn: async () => getTracks({ ownerUid: resolvedOwnerUid }),
  });

  const { data: playlists, isLoading: isPlaylistsLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => getPlaylists({ ownerUid: userInfo?.uid }),
  });

  const resolvedDisplayName = userData?.displayName ?? userInfo?.displayName;
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

  function handleEditDescriptionClick() {
    setIsDescriptionEditMode(true);
  }

  async function handleEditDescriptionSaveClick() {
    setIsDescriptionEditMode(false);

    const result = await setFirestoreUserDescription({ description: description });

    if (result.status === 'success') {
      showSnackbar({ message: 'Description updated!', status: result.status });

      void queryClient.invalidateQueries({ queryKey: ['user', resolvedOwnerUid] });
    } else if (result.status === 'error') {
      showSnackbar({ message: 'Error updating description!', status: result.status });
    }
  }

  function handleImageEditClick() {
    setIsImageEditMode(true);
  }

  async function handleImageEditSaveClick(file: File) {
    setIsImageEditMode(false);

    const result = await setFirestoreUserImage({ file });

    if (result.status === 'success') {
      showSnackbar({ message: 'Image updated!', status: result.status });

      void queryClient.invalidateQueries({ queryKey: ['user', resolvedOwnerUid] });
    } else if (result.status === 'error') {
      showSnackbar({ message: 'Error updating image!', status: result.status });
    }
  }

  async function handleRemoveTrackFromPlaylist({
    playlistName,
    trackName,
  }: {
    playlistName: string;
    trackName: string;
  }) {
    const selectedPlaylist = playlists?.find(playlist => playlist.name === playlistName);
    if (!selectedPlaylist) return;

    const result = await setPlaylist({
      name: playlistName,
      trackNames: selectedPlaylist.trackNames.filter(name => name !== trackName),
    });

    if (result.status === 'success') {
      showSnackbar({ message: 'Track removed!', status: result.status });
      void queryClient.invalidateQueries({ queryKey: ['playlists'] });
    } else {
      showSnackbar({ message: 'Error removing track!', status: result.status });
    }
  }

  async function handleRemovePlaylist({ playlistName }: { playlistName: string }) {
    const result = await deletePlaylist({ name: playlistName });

    if (result.status === 'success') {
      showSnackbar({ message: 'Playlist removed!', status: result.status });

      void queryClient.invalidateQueries({ queryKey: ['playlists'] });
    } else {
      showSnackbar({ message: 'Error removing playlist!', status: result.status });
    }
  }

  return (
    <>
      <Box margin={2}>
        <Dialog
          onClose={() => setIsPlaylistTitleDialogOpen(false)}
          open={isPlaylistTitleDialogOpen}
        >
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
            <Button variant="contained" onClick={() => void handleCreatePlaylistClick()}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <FileDialog
          isOpen={isImageEditMode}
          onUpload={(file: File) => void handleImageEditSaveClick(file)}
          onClose={() => setIsImageEditMode(false)}
          acceptedFileTypes={ACCEPTED_FILE_TYPES.IMAGE}
        />
        <Typography mb={2} variant="h4">
          Profile
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Paper>
            <Box padding={2} display="flex" gap={8}>
              <Box position="relative">
                <Box margin={2}>
                  <img
                    style={{ borderRadius: '50%' }}
                    width={192}
                    height={192}
                    src={userData?.imagePath ?? placeholderAvatar}
                  />
                </Box>
                {isOwnPage && (
                  <Box position="absolute" top={0} right={0}>
                    <IconButton onClick={handleImageEditClick}>
                      <Edit />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Box display="flex" gap={4}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="caption" pt="10px">
                    Name
                  </Typography>
                  <Typography variant="h5">{resolvedDisplayName}</Typography>
                </Box>
                <Box>
                  <Box display="flex" gap={1} alignItems="center" pt={isOwnPage ? 0 : '10px'}>
                    <Typography variant="caption">Bio</Typography>
                    {isOwnPage && (
                      <IconButton onClick={handleEditDescriptionClick}>
                        <Edit />
                      </IconButton>
                    )}
                  </Box>
                  {!isDescriptionEditMode && !isUserDataLoading && (
                    <Typography variant="body1">
                      {userData?.description ?? PROFILE_DEFAULT_DESCRIPTION}
                    </Typography>
                  )}
                  {isDescriptionEditMode && !isUserDataLoading && (
                    <Box display="flex" gap={1} alignItems="center">
                      <TextField
                        value={description}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setDescription(event.target.value);
                        }}
                      />
                      <IconButton onClick={() => void handleEditDescriptionSaveClick()}>
                        <Save />
                      </IconButton>
                    </Box>
                  )}
                  {isUserDataLoading && <Spinner />}
                </Box>
              </Box>
            </Box>
          </Paper>
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
                <PlaylistList
                  playlists={playlists ?? []}
                  onRemoveTrack={(playlistName: string, trackName: string) =>
                    void handleRemoveTrackFromPlaylist({ playlistName, trackName })
                  }
                  onRemovePlaylist={(playlistName: string) =>
                    void handleRemovePlaylist({ playlistName })
                  }
                  isLoading={isPlaylistsLoading}
                />
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
      </Box>
      <AudioPlayer />
    </>
  );
}

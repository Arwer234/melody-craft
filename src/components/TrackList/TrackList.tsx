import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
} from '@mui/material';
import { TrackListProps } from './TrackList.types';
import TrackListItem from './TrackListItem/TrackListItem';
import { queryClient } from '../../main';
import { getComments, setPlaylist } from '../../providers/StoreProvider/StoreProvider.helpers';
import { Fragment, useContext, useState } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../providers/AuthProvider/AuthProvider.helpers';

export default function TrackList({
  tracks,
  isLoading,
  playlists,
  width,
  onRemoveTrack,
}: TrackListProps) {
  const [trackNameToAdd, setTrackNameToAdd] = useState<string | null>(null);
  const [isAddToPlaylistDialogOpen, setIsAddToPlaylistDialogOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const {
    showSnackbar,
    addToPlaylist,
    audioPlayer,
    toggleAudioPlayer,
    isLoading: isAudioEditorTracksLoading,
  } = useContext(UIContext);
  const [openedCommentSectionId, setOpenedCommentSectionId] = useState<string | null>(null);
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getAllUsers });

  const { data: comments } = useQuery({ queryKey: ['comments'], queryFn: getComments });

  const visibleTracks = tracks?.filter(track => track.visibility === 'public');

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

  function handlePlayClick({ trackName }: { trackName: string }) {
    if (audioPlayer.playlist.length === 0 || audioPlayer.playlist[0].name !== trackName)
      addToPlaylist(trackName);
    if (!audioPlayer.isShown) toggleAudioPlayer();
  }

  function handleCommentSectionOpen({ id }: { id: string }) {
    if (openedCommentSectionId === id) setOpenedCommentSectionId(null);
    else setOpenedCommentSectionId(id);
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
          <Button variant="contained" onClick={() => handleAddToPlaylistConfirm()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Box display="flex" gap={1} flexDirection="column" width={width}>
        {visibleTracks?.map((item, index) => (
          <Fragment key={item.name}>
            <TrackListItem
              user={users?.find(user => user.uid === item.ownerUid)}
              onAddToPlaylist={handleAddToPlaylistClick}
              onPlay={handlePlayClick}
              {...item}
              isLoading={isAudioEditorTracksLoading}
              onRemoveFromPlaylist={onRemoveTrack ? () => onRemoveTrack(item.name) : undefined}
              comments={comments?.filter(comment => comment.trackName === item.name) ?? []}
              onOpenCommentSection={handleCommentSectionOpen}
              isCommentSectionOpen={openedCommentSectionId === item.name}
            />
            {index !== tracks.length - 1 && <Divider />}{' '}
            {/* Don't render a divider after the last item */}
          </Fragment>
        ))}
      </Box>
    </>
  );
}

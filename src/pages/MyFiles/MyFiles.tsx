import { CloudUpload } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useState, useContext } from 'react';
import FileDialog from './FileDialog/FileDialog';
import { FileType, MusicTileDialogMode } from './MyFiles.types';
import {
  addMusicFile,
  deleteMusicFile,
  getMusicFileSrc,
  getPlaylists,
  getTracks,
} from '../../providers/StoreProvider/StoreProvider.helpers';
import { FileMetadata } from '../../providers/StoreProvider/StoreProvider.types';
import useAuth from '../../hooks/useAuth/useAuth';
import { useSnackbar } from '../../hooks/useSnackbar/useSnackbar';
import {
  ADD_MUSIC_FILE_MESSAGES,
  PLAY_MUSIC_MESSAGES,
  REMOVE_MUSIC_FILE_MESSAGES,
  SAMPLES_LIMIT,
  TRACKS_LIMIT,
} from './MyFiles.constants';
import MusicTileList from './MusicTileList/MusicTileList';
import { isUploadedFilesLimitExceeded } from './MyFiles.helpers';
import MusicTileDialog from './MusicTileDialog/MusicTileDialog';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { StoreContext } from '../../providers/StoreProvider/StoreProvider';
import { useQuery } from '@tanstack/react-query';
import TrackList from '../../components/TrackList/TrackList';

export default function MyFiles() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<FileType>('track');
  const [musicTileDialogMode, setMusicTileDialogMode] = useState<MusicTileDialogMode>(null);
  const [uploadFileType, setUploadFileType] = useState<FileType>('track');
  const { userInfo } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { setSrc, audioPlayer, togglePlay, toggleAudioPlayer } = useContext(UIContext);
  const {
    isMusicFilesMetadataLoaded,
    musicFilesMetadata: sampleFilesData,
    refetchMusicFilesMetadata,
  } = useContext(StoreContext);
  const { data: tracks, isLoading: isTracksLoading } = useQuery({
    queryKey: ['tracks', userInfo?.uid],
    queryFn: async () => getTracks({ ownerUid: userInfo?.uid }),
  });

  const { data: playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => getPlaylists({ ownerUid: userInfo?.uid }),
  });

  async function handleFileUpload(file: File) {
    const fileMetadata: FileMetadata = {
      type: uploadFileType,
      size: file.size,
      name: file.name,
      ownerUid: userInfo!.uid,
      datetime: new Date().toJSON(),
    };

    const addResult = await addMusicFile({ file, metadata: fileMetadata });

    if (addResult.status === 'error') {
      showSnackbar({
        message: `${ADD_MUSIC_FILE_MESSAGES.FAILURE}`,
        status: 'error',
      });
    } else if (addResult.status === 'success') {
      showSnackbar({ message: ADD_MUSIC_FILE_MESSAGES.SUCCESS, status: 'success' });
      refetchMusicFilesMetadata();
    }
  }

  function handleUploadDialogToggle(fileType?: FileType) {
    if (!isUploadDialogOpen) setUploadFileType(fileType as FileType);

    setIsUploadDialogOpen(previousState => !previousState);
  }

  function handleMusicTileDialogToggle(
    mode: MusicTileDialogMode,
    fileName: string,
    type: FileType,
  ) {
    setMusicTileDialogMode(mode);
    setSelectedFileName(fileName);
    setSelectedFileType(type);
  }

  async function handleMusicTileDialogRemove(type: FileType) {
    if (audioPlayer.fileName === selectedFileName && audioPlayer.isShown) {
      toggleAudioPlayer();
      setSrc('', '');
    }
    const deleteResult = await deleteMusicFile({ fileName: selectedFileName, type });

    if (deleteResult.status === 'error') {
      showSnackbar({ message: REMOVE_MUSIC_FILE_MESSAGES.FAILURE, status: 'error' });
    } else if (deleteResult.status === 'success') {
      showSnackbar({ message: REMOVE_MUSIC_FILE_MESSAGES.SUCCESS, status: 'success' });
      refetchMusicFilesMetadata();
    }

    setMusicTileDialogMode(null);
  }

  function handleMusicTilePlay(fileName: string, fileType: FileType) {
    if (audioPlayer.fileName !== fileName) {
      getMusicFileSrc(fileName, fileType)
        .then(url => {
          setSrc(url, fileName);
          if (!audioPlayer.isShown) {
            toggleAudioPlayer();
          }

          setTimeout(togglePlay, 200);
        })
        .catch((error: Error) => {
          showSnackbar({
            message: `${PLAY_MUSIC_MESSAGES.FAILURE} ${error.message}`,
            status: 'error',
          });
        });
    } else {
      togglePlay();
    }
  }

  // function handleNextClick() {
  //   const currentMusicFileIndex = musicFilesData.findIndex(
  //     fileData => fileData.name === audioPlayer.fileName,
  //   );
  //   let nextMusicFileIndex;
  //   if (currentMusicFileIndex + 1 === musicFilesData.length) nextMusicFileIndex = 0;
  //   else nextMusicFileIndex = currentMusicFileIndex + 1;

  //   console.log(audioPlayer.fileName);
  // }
  // function handlePreviousClick() {}

  return (
    <Box margin={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">My files</Typography>

      <FileDialog
        onUpload={handleFileUpload}
        isOpen={isUploadDialogOpen}
        onClose={() => handleUploadDialogToggle(undefined)}
      />

      <MusicTileDialog
        isOpen={musicTileDialogMode !== null}
        mode={musicTileDialogMode}
        onClose={() => setMusicTileDialogMode(null)}
        onConfirm={() => handleMusicTileDialogRemove(selectedFileType)}
        fileName={selectedFileName}
      />

      <Box display="flex" flexDirection="row" gap={2}>
        <Paper sx={{ width: '100%', height: '100%' }}>
          <Box
            margin={2}
            minHeight={700}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">Samples</Typography>
              <Typography>
                {sampleFilesData.length}/{SAMPLES_LIMIT}
              </Typography>
            </Box>
            <MusicTileList
              onPlay={handleMusicTilePlay}
              onRemove={(fileName: string) => {
                handleMusicTileDialogToggle('remove', fileName, 'sample');
              }}
              fileType="sample"
              samplesData={sampleFilesData}
              isLoaded={isMusicFilesMetadataLoaded}
            />

            <Box display="flex" justifyContent="flex-end">
              <Button
                startIcon={<CloudUpload />}
                variant="contained"
                onClick={() => handleUploadDialogToggle('sample')}
                disabled={isUploadedFilesLimitExceeded({
                  type: 'sample',
                  musicFilesData: sampleFilesData,
                })}
              >
                Upload
              </Button>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ width: '100%', height: '100%' }}>
          <Box margin={2} minHeight={700} display="flex" flexDirection="column" gap={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">Tracks</Typography>
              <Typography>
                {tracks?.length}/{TRACKS_LIMIT}
              </Typography>
            </Box>
            <TrackList
              tracks={tracks ?? []}
              isLoading={isTracksLoading}
              playlists={playlists ?? []}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

import { CloudUpload } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import EmptyView from '../../components/EmptyView/EmptyView';
import { useEffect, useState } from 'react';
import FileDialog from './FileDialog/FileDialog';
import { FileType, MusicTileDialogMode } from './MyFiles.types';
import {
  addMusicFile,
  getMusicFilesData,
} from '../../providers/StoreProvider/StoreProvider.helpers';
import { FileMetadata } from '../../providers/StoreProvider/StoreProvider.types';
import useAuth from '../../hooks/useAuth/useAuth';
import { useSnackbar } from '../../hooks/useSnackbar/useSnackbar';
import { ADD_MUSIC_FILE_MESSAGES, SAMPLES_LIMIT, TRACKS_LIMIT } from './MyFiles.constants';
import { STORE_ERRORS } from '../../providers/StoreProvider/StoreProvider.constants';
import MusicTileList from './MusicTileList/MusicTileList';
import { isUploadedFilesLimitExceeded } from './MyFiles.helpers';
import MusicTileDialog from './MusicTileDialog/MusicTileDialog';

export default function MyFiles() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [musicTileDialogMode, setMusicTileDialogMode] = useState<MusicTileDialogMode>(null);
  const [uploadFileType, setUploadFileType] = useState<FileType>('track');
  const [musicFilesData, setMusicFilesData] = useState<Array<FileMetadata>>([]);
  const { userInfo } = useAuth();
  const { showSnackbar } = useSnackbar();

  const sampleFilesData = musicFilesData.filter(fileData => fileData.type === 'sample');
  const trackFilesData = musicFilesData.filter(fileData => fileData.type === 'track');

  function handleFileUpload(file: File) {
    const fileMetadata: FileMetadata = {
      type: uploadFileType,
      size: file.size,
      name: file.name,
      ownerUid: userInfo!.uid,
      datetime: new Date().toJSON(),
    };

    addMusicFile({ file, metadata: fileMetadata })
      .then(() => {
        showSnackbar({ message: ADD_MUSIC_FILE_MESSAGES.SUCCESS, status: 'success' });
        getMusicFilesData({ ownerUid: userInfo!.uid })
          .then(data => {
            setMusicFilesData(data);
          })
          .catch(error => {
            console.log(error);
          });
      })

      .catch((error: Error) => {
        if ((error.message = STORE_ERRORS.FILE_EXISTS))
          showSnackbar({ message: ADD_MUSIC_FILE_MESSAGES.FILE_EXISTS, status: 'error' });
        else showSnackbar({ message: ADD_MUSIC_FILE_MESSAGES.FAILURE, status: 'error' });
      });
  }

  function handleUploadDialogToggle(fileType?: FileType) {
    if (!isUploadDialogOpen) setUploadFileType(fileType as FileType);

    setIsUploadDialogOpen(previousState => !previousState);
  }

  function handleMusicTileDialogToggle(mode: MusicTileDialogMode, fileName: string) {
    setMusicTileDialogMode(mode);
    setSelectedFileName(fileName);
  }

  function handleMusicTileDialogEdit(fileName: string) {
    console.log('edit', selectedFileName, fileName);
    setMusicTileDialogMode(null);
  }
  function handleMusicTileDialogRemove() {
    console.log('remove', selectedFileName);
    setMusicTileDialogMode(null);
  }

  useEffect(() => {
    const func = async () => {
      setMusicFilesData(await getMusicFilesData({ ownerUid: userInfo!.uid }));
    };

    func().catch(error => {
      console.log(error);
    });
  }, [userInfo]);

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
        onAccept={handleMusicTileDialogEdit}
        onConfirm={handleMusicTileDialogRemove}
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

            {sampleFilesData.length === 0 && <EmptyView description="There are no files yet!" />}
            {sampleFilesData.length > 0 && (
              <MusicTileList
                onEdit={(fileName: string) => {
                  handleMusicTileDialogToggle('edit', fileName);
                }}
                onRemove={(fileName: string) => {
                  handleMusicTileDialogToggle('remove', fileName);
                }}
                fileType="sample"
                musicFilesData={sampleFilesData}
              />
            )}

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
          <Box
            margin={2}
            minHeight={700}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">Tracks</Typography>
              <Typography>
                {trackFilesData.length}/{TRACKS_LIMIT}
              </Typography>
            </Box>
            {trackFilesData.length === 0 && <EmptyView description="There are no files yet!" />}
            {trackFilesData.length > 0 && (
              <MusicTileList
                onEdit={(fileName: string) => {
                  handleMusicTileDialogToggle('edit', fileName);
                }}
                onRemove={(fileName: string) => {
                  handleMusicTileDialogToggle('remove', fileName);
                }}
                fileType="track"
                musicFilesData={trackFilesData}
              />
            )}
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => handleUploadDialogToggle('track')}
                disabled={isUploadedFilesLimitExceeded({
                  type: 'track',
                  musicFilesData: trackFilesData,
                })}
              >
                Upload
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

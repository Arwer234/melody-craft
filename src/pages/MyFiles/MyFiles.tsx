import { CloudUpload } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import EmptyView from '../../components/EmptyView/EmptyView';
import { useState } from 'react';
import FileDialog from '../../components/FileDialog/FileDialog';
import { FileType } from './MyFiles.types';
import { addMusicFile } from '../../providers/StoreProvider/StoreProvider.helpers';
import { FileMetadata } from '../../providers/StoreProvider/StoreProvider.types';
import useAuth from '../../hooks/useAuth/useAuth';
import { useSnackbar } from '../../hooks/useSnackbar/useSnackbar';
import { ADD_MUSIC_FILE_MESSAGES } from './MyFiles.constants';
import { STORE_ERRORS } from '../../providers/StoreProvider/StoreProvider.constants';

const STATIC_FILES_LIST = [];

const TRACKS_LIMIT = 3;

const SAMPLES_LIMIT = 5;

export default function MyFiles() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFileType, setUploadFileType] = useState<FileType>('track');
  const { userInfo } = useAuth();
  const { showSnackbar } = useSnackbar();

  function handleFileUpload(file: File) {
    const fileMetadata: FileMetadata = {
      type: uploadFileType,
      contentType: file.type,
      size: file.size,
      name: file.name,
      ownerUid: userInfo!.uid,
    };

    addMusicFile({ file, metadata: fileMetadata })
      .then(() => {
        showSnackbar({ message: ADD_MUSIC_FILE_MESSAGES.SUCCESS, status: 'success' });
      })
      .catch((error: Error) => {
        if ((error.message = STORE_ERRORS.FILE_EXISTS))
          showSnackbar({ message: ADD_MUSIC_FILE_MESSAGES.FILE_EXISTS, status: 'error' });
        else showSnackbar({ message: ADD_MUSIC_FILE_MESSAGES.FAILURE, status: 'error' });
      });
  }

  function handleDialogToggle(fileType?: FileType) {
    if (!isUploadDialogOpen) setUploadFileType(fileType as FileType);

    setIsUploadDialogOpen(previousState => !previousState);
  }

  return (
    <Box margin={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">My files</Typography>

      <FileDialog
        onUpload={handleFileUpload}
        isOpen={isUploadDialogOpen}
        onClose={() => handleDialogToggle(undefined)}
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
              <Typography>0/{SAMPLES_LIMIT}</Typography>
            </Box>

            {STATIC_FILES_LIST.length === 0 && <EmptyView description="There are no files yet!" />}

            <Box display="flex" justifyContent="flex-end">
              <Button
                startIcon={<CloudUpload />}
                variant="contained"
                onClick={() => handleDialogToggle('sample')}
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
              <Typography>0/{TRACKS_LIMIT}</Typography>
            </Box>
            {STATIC_FILES_LIST.length === 0 && <EmptyView description="There are no files yet!" />}
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => handleDialogToggle('track')}
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

import { CloudUpload } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import EmptyView from '../../components/EmptyView/EmptyView';
import { useState } from 'react';
import FileDialog from '../../components/FileDialog/FileDialog';
import { FileType } from './MyFiles.types';

const STATIC_FILES_LIST = [];

const TRACKS_LIMIT = 3;

const SAMPLES_LIMIT = 5;

export default function MyFiles() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFileType, setUploadFileType] = useState<FileType>();
  function handleSampleUpload() {
    console.log('sample');
  }

  function handleTrackUpload() {
    console.log('track');
  }

  function handleDialogToggle(fileType?: FileType) {
    setUploadFileType(fileType);
    setIsUploadDialogOpen(previousState => !previousState);
  }

  return (
    <Box margin={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">My files</Typography>

      <FileDialog
        onUpload={uploadFileType === 'track' ? handleTrackUpload : handleSampleUpload}
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

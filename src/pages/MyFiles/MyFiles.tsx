import { CloudUpload } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import EmptyView from '../../components/EmptyView/EmptyView';

const STATIC_FILES_LIST = [];

export default function MyFiles() {
  function handleSampleUpload() {}

  function handleTrackUpload() {}

  return (
    <Box margin={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">My files</Typography>
      <Box display="flex" flexDirection="row" gap={2}>
        <Paper sx={{ width: '100%', height: '100%' }}>
          <Box
            margin={2}
            minHeight={700}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography variant="h5">Samples</Typography>

            {STATIC_FILES_LIST.length === 0 && <EmptyView description="There are no files yet!" />}

            <Box display="flex" justifyContent="flex-end">
              <Button startIcon={<CloudUpload />} variant="contained" onClick={handleSampleUpload}>
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
            <Typography variant="h5">Tracks</Typography>
            {STATIC_FILES_LIST.length === 0 && <EmptyView description="There are no files yet!" />}
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" startIcon={<CloudUpload />} onClick={handleTrackUpload}>
                Upload
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

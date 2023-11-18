import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import { useState } from 'react';

type FileDialog = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
};

export default function FileDialog({ isOpen, onClose, onUpload }: FileDialog) {
  const [file, setFile] = useState<File | null>(null);

  function handleFileUpload(nextFile: File | null) {
    if (nextFile) setFile(nextFile);
    console.log(nextFile);
  }

  function handleUploadClick() {
    if (file) {
      onUpload(file);
    }

    onClose();
  }

  function handleCancelClick() {
    setFile(null);
    onClose();
  }

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle>Upload a file</DialogTitle>
      <DialogContent>
        <Box width={512}>
          <MuiFileInput
            inputProps={{ accept: 'audio/*' }}
            value={file}
            onChange={handleFileUpload}
            placeholder="Insert a file"
            variant="outlined"
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box display="flex" gap={1} justifyContent="center" width="100%" padding={1}>
          <Button onClick={handleCancelClick} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleUploadClick} variant="contained" component="span">
            Upload
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

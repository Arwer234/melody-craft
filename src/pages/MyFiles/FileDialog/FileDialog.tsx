import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import { useState } from 'react';
import { ACCEPTED_FILE_TYPES } from './FileDialog.constants';

type FileDialog = {
  isOpen: boolean;
  onClose?: () => void;
  onUpload: (file: File) => Promise<void> | void;
  acceptedFileTypes?: (typeof ACCEPTED_FILE_TYPES)[keyof typeof ACCEPTED_FILE_TYPES];
};

export default function FileDialog({
  isOpen,
  onClose,
  onUpload,
  acceptedFileTypes = ACCEPTED_FILE_TYPES.AUDIO,
}: FileDialog) {
  const [file, setFile] = useState<File | null>(null);

  function handleFileUpload(nextFile: File | null) {
    if (nextFile) setFile(nextFile);
  }

  function handleUploadClick() {
    if (file) {
      void onUpload(file);
    }

    if (onClose) {
      onClose();
    }
  }

  function handleCancelClick() {
    setFile(null);

    if (onClose) {
      onClose();
    }
  }

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle>Upload a file</DialogTitle>
      <DialogContent>
        <Box width={512}>
          <MuiFileInput
            inputProps={{ accept: acceptedFileTypes }}
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

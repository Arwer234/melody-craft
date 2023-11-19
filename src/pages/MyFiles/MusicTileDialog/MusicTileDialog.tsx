import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { MusicTileDialogMode } from '../MyFiles.types';

type MusicTileDialog = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (newFileName: string) => void;
  onConfirm: () => void;
  fileName: string;
  mode: MusicTileDialogMode;
};

export default function MusicTileDialog({
  isOpen,
  onClose,
  onAccept,
  onConfirm,
  fileName,
  mode,
}: MusicTileDialog) {
  const [newFileName, setNewFileName] = useState(fileName);

  function handleConfirmClick() {
    if (mode === 'edit' && newFileName) onAccept(newFileName);
    if (mode === 'remove') onConfirm();
  }

  return (
    <Dialog onClose={onClose} open={isOpen}>
      {mode === 'edit' && <DialogTitle>Edit</DialogTitle>}
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="filename"
          label="File name"
          type="text"
          fullWidth
          variant="standard"
          value={newFileName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setNewFileName(event.target.value)
          }
        />
      </DialogContent>
      <DialogActions>
        <Box display="flex" gap={1} justifyContent="center" width="100%" padding={1}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmClick} variant="contained" component="span">
            {mode === 'edit' ? 'Accept' : 'Remove'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

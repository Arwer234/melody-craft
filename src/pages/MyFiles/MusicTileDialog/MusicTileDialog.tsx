import { Box, Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useState } from 'react';
import { MusicTileDialogMode } from '../MyFiles.types';

type MusicTileDialog = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  mode: MusicTileDialogMode;
};

export default function MusicTileDialog({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  mode,
}: MusicTileDialog) {
  function handleConfirmClick() {
    if (mode === 'remove') onConfirm();
  }

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogContent>{`Remove file ${fileName}?`}</DialogContent>
      <DialogActions>
        <Box display="flex" gap={1} justifyContent="center" width="100%" padding={1}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmClick} variant="contained" component="span">
            Remove
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

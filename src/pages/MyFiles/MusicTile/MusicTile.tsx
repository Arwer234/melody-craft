import { Box, IconButton, Paper, Typography } from '@mui/material';
import { MusicTileProps } from './MusicTile.types';
import { useState } from 'react';
import { DeleteForever, PlayArrow } from '@mui/icons-material';

export default function MusicTile({ onRemove, name }: MusicTileProps) {
  const [file, setFile] = useState();

  const [fileName, fileExtension] = name.split('.');

  function handlePlayClick() {
    console.log('play');
  }

  function handleRemoveClick() {
    onRemove(name);
  }

  return (
    <Paper sx={{ width: '100%' }}>
      <Box padding={2} display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">{fileName}</Typography>
          <Box>
            <IconButton onClick={handlePlayClick} color="secondary">
              <PlayArrow />
            </IconButton>
            <IconButton onClick={handleRemoveClick}>
              <DeleteForever />
            </IconButton>
          </Box>
        </Box>
        <Typography>format: {fileExtension}</Typography>
      </Box>
    </Paper>
  );
}

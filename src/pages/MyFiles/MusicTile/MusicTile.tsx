import { Box, IconButton, Paper, Typography } from '@mui/material';
import { MusicTileProps } from './MusicTile.types';
import { DeleteForever, PlayArrow } from '@mui/icons-material';
import React from 'react';

export default function MusicTile({ onRemove, onPlay, onDrag, name, type }: MusicTileProps) {
  const [fileName, fileExtension] = name.split('.');

  return (
    <Paper
      sx={{ width: '100%' }}
      onDragEnd={
        onDrag ? (event: React.DragEvent<HTMLDivElement>) => onDrag(event, name, type) : undefined
      }
      draggable={onDrag ? true : false}
    >
      <Box padding={2} display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">{fileName}</Typography>
          <Box>
            {onPlay && (
              <IconButton onClick={() => onPlay(name, type)} color="secondary">
                <PlayArrow />
              </IconButton>
            )}

            {onRemove && (
              <IconButton onClick={() => onRemove(name)}>
                <DeleteForever />
              </IconButton>
            )}
          </Box>
        </Box>
        <Typography>format: {fileExtension}</Typography>
      </Box>
    </Paper>
  );
}

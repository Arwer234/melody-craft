import { Box, IconButton, Paper, Typography } from '@mui/material';
import { MusicTileProps } from './MusicTile.types';
import { DeleteForever, PlayArrow } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useQuery } from '@tanstack/react-query';
import { getMusicFileSrc } from '../../../providers/StoreProvider/StoreProvider.helpers';

export default function MusicTile({ onRemove, onPlay, onDrag, name, type }: MusicTileProps) {
  const [isClicked, setIsClicked] = useState(false);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [fileName, fileExtension] = name.split('.');
  const containerId = `${fileName}.${fileExtension}`;

  const { data: src } = useQuery({
    queryKey: ['sampleUrl', name],
    queryFn: async () => {
      return getMusicFileSrc(name, type);
    },
    enabled: isClicked,
  });

  function handlePlayClick() {
    setIsClicked(true);
    void wavesurferRef.current?.playPause();
  }

  useEffect(() => {
    const container = document.getElementById(containerId);

    if (!src || !isClicked || !container) return;

    wavesurferRef.current = WaveSurfer.create({
      container: container,
      url: src,
      waveColor: '#00b0ff',
      progressColor: '#00b0ff',
      barWidth: 3,
      barGap: 2,
      barRadius: 2,
    });

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [containerId, isClicked, src]);

  return (
    <Paper
      sx={{ width: '100%' }}
      onDragEnd={
        onDrag ? (event: React.DragEvent<HTMLDivElement>) => onDrag(event, name, type) : undefined
      }
      draggable={onDrag ? true : false}
    >
      <Box display="flex" width="100%">
        <Box padding={2} display="flex" minWidth={200}>
          <Box display="flex" justifyContent="space-between" flexDirection="column" width="100%">
            <Typography variant="h5">{fileName}</Typography>
            <Typography>format: {fileExtension}</Typography>
          </Box>
        </Box>
        <Box id={containerId} width="100%" minHeight={128} />
        <Box display="flex" alignItems="center">
          {onPlay && (
            <IconButton onClick={handlePlayClick} color="secondary">
              <PlayArrow fontSize="inherit" />
            </IconButton>
          )}

          {onRemove && (
            <IconButton onClick={() => onRemove(name)}>
              <DeleteForever fontSize="inherit" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

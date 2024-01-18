import { Box, IconButton, Paper, Typography } from '@mui/material';
import { MusicTileProps } from './MusicTile.types';
import { Add, DeleteForever, PlayArrow } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useQuery } from '@tanstack/react-query';
import { getMusicFileSrc } from '../../../providers/StoreProvider/StoreProvider.helpers';
import TagList from '../../../components/TagList/TagList';
import { FileType } from '../MyFiles.types';

export default function MusicTile({
  onRemove,
  onPlay,
  onDrag,
  onAdd,
  sample,
  track,
}: MusicTileProps) {
  const [isClicked, setIsClicked] = useState(false);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [fileName, fileExtension] = sample
    ? sample.name.split('.')
    : track
    ? track.name.split('.')
    : [];
  const containerId = `${fileName}.${fileExtension}`;

  const { data: src } = useQuery({
    queryKey: ['sampleUrl', sample?.name as string],
    queryFn: async () => {
      return getMusicFileSrc(sample?.name as string, 'sample');
    },
    enabled: isClicked && sample !== undefined,
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
        onDrag
          ? (event: React.DragEvent<HTMLDivElement>) =>
              onDrag(event, sample?.name as string, sample?.type as FileType)
          : undefined
      }
      draggable={onDrag ? true : false}
    >
      <Box display="flex" width="100%">
        <Box padding={2} display="flex" minWidth={200}>
          <Box display="flex" justifyContent="space-between" flexDirection="column" width="100%">
            <Typography variant="h5">{fileName}</Typography>
            {sample !== undefined && <Typography>format: {fileExtension}</Typography>}
            {track !== undefined && <TagList tags={track.tags} />}
          </Box>
        </Box>
        <Box id={containerId} width="100%" minHeight={128} />
        {sample !== undefined && (
          <Box display="flex" alignItems="center">
            {onPlay && (
              <IconButton onClick={handlePlayClick} color="secondary">
                <PlayArrow fontSize="inherit" />
              </IconButton>
            )}

            {onRemove && (
              <IconButton onClick={() => onRemove(sample.name)}>
                <DeleteForever fontSize="inherit" />
              </IconButton>
            )}
          </Box>
        )}
        {track !== undefined && (
          <Box display="flex" alignItems="center">
            {onAdd && (
              <IconButton onClick={() => onAdd(track.name)}>
                <Add fontSize="inherit" />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

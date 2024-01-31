import { Box, IconButton, Typography, useTheme } from '@mui/material';
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
  onDrag,
  onAdd,
  sample,
  track,
  variant,
}: MusicTileProps) {
  const [isClicked, setIsClicked] = useState(false);
  const theme = useTheme();
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
      height: 64,
      url: src,
      waveColor: theme.palette.secondary.main,
      progressColor: theme.palette.secondary.main,
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
    <Box
      sx={{ width: '100%', cursor: onDrag ? 'grab' : 'default', maxHeight: '128px' }}
      onDragEnd={
        onDrag
          ? (event: React.DragEvent<HTMLDivElement>) =>
              onDrag(event, sample?.name as string, sample?.type as FileType)
          : undefined
      }
      draggable={onDrag ? true : false}
    >
      <Box padding={variant === 'default' ? 2 : 0} display="flex" width="100%" alignItems="center">
        <Box display="flex" minWidth={200} flex={2}>
          <Box display="flex" gap={2} flexDirection="column" width="100%">
            <Typography variant="h6">{fileName}</Typography>
            {sample !== undefined && <Typography>format: {fileExtension}</Typography>}
            {track !== undefined && <TagList tags={track.tags} />}
          </Box>
        </Box>
        <Box id={containerId} width="100%" height={64} flex={3} />
        {sample !== undefined && (
          <Box display="flex" alignItems="center">
            <IconButton onClick={handlePlayClick} color="primary">
              <PlayArrow fontSize="inherit" />
            </IconButton>

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
    </Box>
  );
}

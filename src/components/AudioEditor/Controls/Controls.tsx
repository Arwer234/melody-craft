import { Box, IconButton } from '@mui/material';
import { ControlsProps } from './Controls.types';
import { PlayArrow, SkipNext, SkipPrevious, Stop } from '@mui/icons-material';

export default function Controls({ isPlaying, onPlay, onSkipNext, onSkipPrevious }: ControlsProps) {
  return (
    <Box display="flex">
      <IconButton onClick={onSkipPrevious}>
        <SkipPrevious />
      </IconButton>
      <IconButton onClick={onPlay}>{isPlaying ? <Stop /> : <PlayArrow />}</IconButton>
      <IconButton onClick={onSkipNext}>
        <SkipNext />
      </IconButton>
    </Box>
  );
}

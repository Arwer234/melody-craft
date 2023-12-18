import { Box, Button, IconButton, Paper, Slider, Typography } from '@mui/material';
import { ControlsProps } from './Controls.types';
import { PlayArrow, SkipNext, SkipPrevious, Stop, VolumeMute, VolumeUp } from '@mui/icons-material';

export default function Controls({
  isPlaying,
  onPlay,
  onSkipNext,
  onSkipPrevious,
  volume,
  onVolumeChange,
}: ControlsProps) {
  return (
    <Box width="100%">
      <Paper>
        <Box display="flex" padding={2} justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="caption">Track Name</Typography>
            <Box width={200} display="flex" alignItems="center">
              <IconButton
                onClick={event => onVolumeChange(event as unknown as Event, volume > 0 ? 0 : 50)}
              >
                {volume === 0 ? <VolumeMute /> : <VolumeUp />}
              </IconButton>
              <Slider max={100} min={0} value={volume} onChange={onVolumeChange} />
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <IconButton size="large" onClick={onSkipPrevious}>
              <SkipPrevious fontSize="inherit" />
            </IconButton>
            <IconButton size="large" onClick={onPlay}>
              {isPlaying ? <Stop fontSize="inherit" /> : <PlayArrow fontSize="inherit" />}
            </IconButton>
            <IconButton size="large" onClick={onSkipNext}>
              <SkipNext fontSize="inherit" />
            </IconButton>
          </Box>
          <Button variant="contained">Next</Button>
        </Box>
      </Paper>
    </Box>
  );
}

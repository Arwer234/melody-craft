import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { ControlsProps } from './Controls.types';
import { PlayArrow, SkipNext, SkipPrevious, Stop } from '@mui/icons-material';

export default function Controls({
  isPlaying,
  onPlay,
  onSkipNext,
  onSkipPrevious,
  onNextClick,
}: ControlsProps) {
  return (
    <Box width="100%">
      <Paper>
        <Box display="flex" padding={2} justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="caption">Track Name</Typography>
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
          <Button onClick={onNextClick} variant="contained">
            Next
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

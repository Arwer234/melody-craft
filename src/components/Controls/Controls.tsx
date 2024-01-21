import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { ControlsProps } from './Controls.types';
import { Pause, PlayArrow, SkipNext, SkipPrevious } from '@mui/icons-material';

export default function Controls({
  isPlaying,
  isFixed,
  trackName,
  onPlay,
  onSkipNext,
  onSkipPrevious,
  onNextClick,
}: ControlsProps) {
  return (
    <Box width="100%" position={isFixed ? 'fixed' : 'initial'} bottom={isFixed ? 0 : undefined}>
      <Paper>
        <Box display="flex" padding={2}>
          <Box display="flex" alignItems="center" flex={1}>
            {trackName && <Typography variant="caption">{trackName}</Typography>}
          </Box>
          <Box display="flex" gap={1} flex={5} justifyContent="center">
            <IconButton size="large" onClick={onSkipPrevious}>
              <SkipPrevious fontSize="inherit" />
            </IconButton>
            <IconButton size="large" onClick={onPlay}>
              {isPlaying ? <Pause fontSize="inherit" /> : <PlayArrow fontSize="inherit" />}
            </IconButton>
            <IconButton size="large" onClick={onSkipNext}>
              <SkipNext fontSize="inherit" />
            </IconButton>
          </Box>
          {onNextClick && (
            <Box display="flex" alignItems="center">
              <Button onClick={onNextClick} variant="contained" sx={{ flex: 1 }}>
                Next
              </Button>
            </Box>
          )}
          {!onNextClick && <Box width={48} sx={{ flex: 1 }} />}
        </Box>
      </Paper>
    </Box>
  );
}

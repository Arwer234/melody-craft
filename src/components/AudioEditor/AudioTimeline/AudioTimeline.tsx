import { Box, Typography } from '@mui/material';
import { TIMELINE_TILE_DURATION } from './AudioTimeline.constants';
import { AudioTimelineProps } from './AudioTimeline.types';

export default function AudioTimeline({ duration }: AudioTimelineProps) {
  const notchesCount = duration / TIMELINE_TILE_DURATION;
  return (
    <Box position="absolute" height="100%">
      <Box display="flex" height="100%">
        {Array.from(Array(notchesCount).keys()).map((_, index) => (
          <Box
            key={index}
            sx={{
              borderLeft: '1px solid',
              borderColor: 'text.disabled',
              height: '100%',
              width: TIMELINE_TILE_DURATION / 20,
              opacity: 0.3,
              display: 'flex',
              alignItems: 'flex-end',
              paddingLeft: 0.5,
            }}
          >
            {index % 2 === 0 && (
              <Typography>{`${(TIMELINE_TILE_DURATION * index) / 1000}s`}</Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

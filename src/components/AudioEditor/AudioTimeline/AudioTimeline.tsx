import { Box, Typography } from '@mui/material';
import { TIMELINE_TILE_DURATION } from './AudioTimeline.constants';
import { AudioTimelineProps } from './AudioTimeline.types';

export default function AudioTimeline({ duration, currentTime, onClick }: AudioTimelineProps) {
  const notchesCount = duration / TIMELINE_TILE_DURATION;
  const caretPosition = (currentTime / duration) * 100;

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const box = event.currentTarget.getBoundingClientRect();
    const clickPosition = event.clientX - box.left;
    const clickPositionRatio = clickPosition / box.width;
    const clickedTime = clickPositionRatio * duration;

    onClick(clickedTime);
  }
  return (
    <Box position="absolute" height="100%" left={80} onClick={handleClick}>
      <Box display="flex" height="100%" zIndex={-1}>
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
      <Box
        position="absolute"
        left={`${caretPosition}%`}
        bottom={0}
        height="100%"
        width="2px"
        bgcolor="primary.main"
        sx={{
          transition: 'left 0.1s linear',
        }}
      />
    </Box>
  );
}

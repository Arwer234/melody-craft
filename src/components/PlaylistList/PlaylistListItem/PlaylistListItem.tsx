import Box from '@mui/material/Box';
import { PlaylistListItemProps } from './PlaylistListItem.types';
import { Typography } from '@mui/material';

export default function PlaylistListItem({ tracks, name }: PlaylistListItemProps) {
  return (
    <Box>
      <Typography variant="h6">{name}</Typography>
      {tracks.map((track, key) => (
        <Typography ml={1} key={`${track.name} ${name} ${key}`}>
          {track.name}
        </Typography>
      ))}
    </Box>
  );
}

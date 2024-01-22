import Box from '@mui/material/Box';
import { PlaylistListItemProps } from './PlaylistListItem.types';
import { IconButton, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function PlaylistListItem({ name, onRemove }: PlaylistListItemProps) {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="h6">{name}</Typography>
      <IconButton onClick={onRemove}>
        <Delete />
      </IconButton>
    </Box>
  );
}

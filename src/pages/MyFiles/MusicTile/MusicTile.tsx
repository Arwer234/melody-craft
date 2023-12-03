import { Box, IconButton, Paper, Typography } from '@mui/material';
import { MusicTileProps } from './MusicTile.types';
import { DeleteForever, PlayArrow } from '@mui/icons-material';

export default function MusicTile({ onRemove, onPlay, name, type }: MusicTileProps) {
  const [fileName, fileExtension] = name.split('.');

  function handlePlayClick() {
    onPlay(name, type);
  }

  function handleRemoveClick() {
    onRemove(name);
  }

  return (
    <Paper sx={{ width: '100%' }}>
      <Box padding={2} display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">{fileName}</Typography>
          <Box>
            <IconButton onClick={handlePlayClick} color="secondary">
              <PlayArrow />
            </IconButton>
            <IconButton onClick={handleRemoveClick}>
              <DeleteForever />
            </IconButton>
          </Box>
        </Box>
        <Typography>format: {fileExtension}</Typography>
      </Box>
    </Paper>
  );
}

import { Paper, Box, Typography } from '@mui/material';
import { DiscoverTileDto } from './DiscoverTile.types';

export default function DiscoverTile({ author, id, name, image_path }: DiscoverTileDto) {
  return (
    <Paper>
      <Box display="flex" padding={2}>
        <img width={256} height={256} src={image_path} alt={`${author} ${name}`} />
        <Box display="flex" flexDirection="column">
          <Typography>{author}</Typography>
          <Typography>{name}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

import { Paper, Box, Typography } from '@mui/material';
import { DiscoverTileProps } from './DiscoverTile.types';
import { ThumbUp } from '@mui/icons-material';
import TagList from '../../../components/TagList/TagList';
import { PLACEHOLDER_ALBUM_COVER_SRC } from './DiscoverTile.constants';

export default function DiscoverTile({
  displayName,
  name,
  image_path,
  likes,
  date,
  tags,
}: DiscoverTileProps) {
  return (
    <Paper>
      <Box display="flex" padding={2} justifyContent="space-around">
        <Box flex={1} display="flex" gap={2}>
          <img
            width={128}
            height={128}
            src={image_path ?? PLACEHOLDER_ALBUM_COVER_SRC}
            alt={`${displayName} ${name}`}
          />
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
            <Typography>
              {displayName} - {name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>{likes}</Typography>
              <ThumbUp color="primary" />
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="caption">{date.toDate().toLocaleDateString()}</Typography>
          <TagList tags={tags} />
        </Box>
      </Box>
    </Paper>
  );
}

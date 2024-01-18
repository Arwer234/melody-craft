import { Paper, Box, Typography, IconButton } from '@mui/material';
import { TrackListItemProps } from './TrackListItem.types';
import TagList from '../../TagList/TagList';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../routes';
import placeholderImageUrl from '../../../assets/images/placeholder_track_cover.png';

export default function TrackListItem({
  name,
  image_path,
  date,
  tags,
  onAddToPlaylist,
  user,
}: TrackListItemProps) {
  const userProfileLink = `${ROUTE_PATHS.PROFILE}?id=${user?.uid}`;
  return (
    <Paper>
      <Box display="flex" padding={2} justifyContent="space-around">
        <Box flex={1} display="flex" gap={2}>
          <img
            width={128}
            height={128}
            src={image_path ?? placeholderImageUrl}
            alt={`${user?.displayName} ${name}`}
          />
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            gap={2}
          >
            <Typography>
              <Link to={userProfileLink}>{user?.displayName}</Link> - {name}
            </Typography>
            <IconButton onClick={() => onAddToPlaylist({ trackName: name })}>
              <Add fontSize="inherit" />
            </IconButton>
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

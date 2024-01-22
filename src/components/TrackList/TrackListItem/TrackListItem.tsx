import { Box, Typography, IconButton, Link } from '@mui/material';
import { TrackListItemProps } from './TrackListItem.types';
import TagList from '../../TagList/TagList';
import { Add, Edit, PlayArrow, Remove } from '@mui/icons-material';
import { ROUTE_PATHS } from '../../../routes';
import placeholderImageUrl from '../../../assets/images/placeholder_track_cover.png';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';

export default function TrackListItem({
  name,
  image_path,
  date,
  tags,
  onAddToPlaylist,
  onPlay,
  user,
  isLoading,
  onRemoveFromPlaylist,
}: TrackListItemProps) {
  const navigate = useNavigate();

  const userProfileLink = `${ROUTE_PATHS.PROFILE}?id=${user?.uid}`;

  function handleEditClick() {
    navigate(`${ROUTE_PATHS.EDITOR}?trackName=${name}`);
  }
  return (
    <Box>
      <Box display="flex" padding={2} justifyContent="space-around" gap={3}>
        {onRemoveFromPlaylist && (
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => onRemoveFromPlaylist()}>
              <Remove />
            </IconButton>
          </Box>
        )}
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
            <Box display="flex">
              <Link href={userProfileLink}>{user?.displayName}</Link>
              <Typography>&nbsp;- {name}</Typography>
            </Box>
            <Box display="flex">
              {isLoading && <Spinner />}
              {!isLoading && (
                <IconButton onClick={() => onPlay({ trackName: name })}>
                  <PlayArrow color="primary" fontSize="inherit" />
                </IconButton>
              )}
              <IconButton onClick={() => onAddToPlaylist({ trackName: name })}>
                <Add color="secondary" fontSize="inherit" />
              </IconButton>
              <IconButton onClick={() => handleEditClick()}>
                <Edit fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="caption">{date.toDate().toLocaleDateString()}</Typography>
          <TagList tags={tags} />
        </Box>
      </Box>
    </Box>
  );
}

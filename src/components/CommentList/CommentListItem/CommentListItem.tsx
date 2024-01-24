import { Avatar, Box, Typography } from '@mui/material';
import { CommentListItemProps } from './CommentListItem.types';
import placeholderAvatar from '../../../assets/images/placeholder_avatar.jpg';

export default function CommentListItem({ imagePath, displayName, text }: CommentListItemProps) {
  return (
    <Box display="flex" gap={2} padding={1}>
      <Box>
        <Avatar src={imagePath ?? placeholderAvatar} />
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography variant="overline">{displayName}</Typography>
        <Typography>{text}</Typography>
      </Box>
    </Box>
  );
}

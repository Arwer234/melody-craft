import { Box, Divider, IconButton, TextField } from '@mui/material';
import { CommentListProps } from './CommentList.types';
import CommentListItem from './CommentListItem/CommentListItem';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../providers/AuthProvider/AuthProvider.helpers';
import { useContext, useState } from 'react';
import { Add } from '@mui/icons-material';
import { addComment } from '../../providers/StoreProvider/StoreProvider.helpers';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { queryClient } from '../../main';

export default function CommentList({ comments, trackName }: CommentListProps) {
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getAllUsers });
  const [newCommentValue, setNewCommentValue] = useState('');
  const { showSnackbar } = useContext(UIContext);

  async function handleCommentAdd() {
    const result = await addComment({ text: newCommentValue, trackName });
    if (result) {
      setNewCommentValue('');
    }

    if (result.status === 'error') {
      showSnackbar({ message: result.message, status: 'error' });
    } else if (result.status === 'success') {
      void queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Divider />
      <Box ml={2}>
        {comments.map(comment => {
          const selectedUser = users?.find(user => user.uid === comment.ownerUid);
          if (!selectedUser) return null;

          return <CommentListItem key={comment.id} {...comment} {...selectedUser} />;
        })}
      </Box>
      <Box display="flex" gap={2} ml={2}>
        <TextField
          value={newCommentValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setNewCommentValue(event.target.value)
          }
          fullWidth
          label="Add a comment"
        />
        <IconButton onClick={() => void handleCommentAdd()}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
}

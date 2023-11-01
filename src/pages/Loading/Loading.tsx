import { Box } from '@mui/material';
import Spinner from '../../components/Spinner/Spinner';

export default function Loading() {
  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
      <Spinner />
    </Box>
  );
}

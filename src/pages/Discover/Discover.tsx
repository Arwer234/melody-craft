import { Box, Typography } from '@mui/material';
import { DISCOVER_DUMMY } from './Discover.constants';
import DiscoverTile from './DiscoverTile/DiscoverTile';

export default function Discover() {
  return (
    <Box>
      <Typography variant="h4">Discover</Typography>
      <Box display="flex" gap={1}>
        {DISCOVER_DUMMY.map(item => (
          <DiscoverTile {...item} key={item.id} />
        ))}
      </Box>
    </Box>
  );
}

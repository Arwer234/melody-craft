import { Air } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

type EmptyView = {
  description: string;
};

export default function EmptyView({ description }: EmptyView) {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Air sx={{ width: '64px', height: '64px' }} />
      <Typography>{description}</Typography>
    </Box>
  );
}

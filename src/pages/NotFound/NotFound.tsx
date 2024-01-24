import { Box, Paper, Typography } from '@mui/material';
import { useContext } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';

import studioImageSrc from '../../assets/images/sign-in-wallpaper.jpg';

export function NotFound() {
  const { isMobile } = useContext(UIContext);
  return (
    <Box display="flex" height="100%">
      <Paper
        sx={{
          padding: 2,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography textAlign="center" variant="h4">
          Oops! Not found
        </Typography>
      </Paper>
      {!isMobile && (
        <Box width="100%" height="100%">
          <img
            style={{ height: '100%', width: '100%' }}
            src={studioImageSrc}
            alt="studio image src"
          />
        </Box>
      )}
    </Box>
  );
}

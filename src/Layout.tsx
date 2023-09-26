import { Outlet } from 'react-router-dom';
import './Layout.css';
import { Box } from '@mui/material';

export function Layout() {
  return (
    <Box height="100%" width="100%">
      <Outlet />
    </Box>
  );
}

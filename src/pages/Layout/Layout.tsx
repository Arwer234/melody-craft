import { Outlet } from 'react-router-dom';
import './Layout.css';
import { Alert, Box, CssBaseline, Snackbar } from '@mui/material';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import { useSnackbar } from '../../hooks/useSnackbar';

export function Layout() {
  const { snackbar } = useSnackbar();

  const isDrawerShown = false;

  return (
    <Box height="100%" width="100%">
      <CssBaseline />
      <NavigationBar />
      {isDrawerShown && <SideDrawer width="256px" />}

      <Outlet />
      {snackbar.isShown && (
        <Snackbar anchorOrigin={{ horizontal: 'center', vertical: 'top' }} open={snackbar.isShown}>
          <Alert severity={snackbar.status ?? undefined}>{snackbar.message}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

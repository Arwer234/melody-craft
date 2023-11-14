import { Outlet } from 'react-router-dom';
import './Layout.css';
import { Alert, Box, CssBaseline, Snackbar } from '@mui/material';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import useAuth from '../../hooks/useAuth/useAuth';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { useContext } from 'react';

const DRAWER_WIDTH = '256px';

export function Layout() {
  const { snackbar, drawer } = useContext(UIContext);
  const { isUserSignedIn } = useAuth();

  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <CssBaseline />
      <NavigationBar />
      {isUserSignedIn && <SideDrawer width="256px" />}
      <Box
        marginLeft={drawer.isOpen && isUserSignedIn ? DRAWER_WIDTH : '0'}
        sx={{ transition: 'margin-left 200ms', height: '100%' }}
      >
        <Outlet />
      </Box>

      {snackbar.isShown && (
        <Snackbar anchorOrigin={{ horizontal: 'center', vertical: 'top' }} open={snackbar.isShown}>
          <Alert severity={snackbar.status ?? undefined}>{snackbar.message}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

import { Outlet } from 'react-router-dom';
import './Layout.css';
import { Alert, Box, CssBaseline, Snackbar } from '@mui/material';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import useAuth from '../../hooks/useAuth/useAuth';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { useContext } from 'react';
import BasicAudioPlayer from '../../components/AudioPlayer/AudioPlayer';

const DRAWER_WIDTH = '256px';

export function Layout() {
  const { snackbar, drawer, audioPlayer } = useContext(UIContext);
  const { isUserSignedIn } = useAuth();

  const isDrawerShown = drawer.isOpen && isUserSignedIn;

  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <CssBaseline />
      <NavigationBar />
      {isUserSignedIn && <SideDrawer width="256px" />}
      <Box
        marginLeft={isDrawerShown ? DRAWER_WIDTH : '0'}
        sx={{
          transition: 'margin-left 200ms',
          height: '100%',
          width: `calc(100% - ${isDrawerShown ? DRAWER_WIDTH : 0})`,
        }}
      >
        <Outlet />
        {audioPlayer.isShown && <BasicAudioPlayer offset={isDrawerShown ? DRAWER_WIDTH : '0px'} />}
      </Box>

      {snackbar.isShown && (
        <Snackbar anchorOrigin={{ horizontal: 'center', vertical: 'top' }} open={snackbar.isShown}>
          <Alert severity={snackbar.status ?? undefined}>{snackbar.message}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

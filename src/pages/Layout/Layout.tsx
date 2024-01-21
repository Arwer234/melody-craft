import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';
import {
  Alert,
  Box,
  CssBaseline,
  PaletteMode,
  Snackbar,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import useAuth from '../../hooks/useAuth/useAuth';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { useContext, useEffect, useMemo, useState } from 'react';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';

const DRAWER_WIDTH = '256px';

export function Layout() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');
  const { snackbar, drawer, toggleAudioPlayer, audioPlayer } = useContext(UIContext);
  const { isUserSignedIn } = useAuth();
  const { pathname } = useLocation();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode],
  );

  const isDrawerShown = drawer.isOpen && isUserSignedIn;

  function toggleMode() {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }

  useEffect(() => {
    if (pathname.includes('/editor') && audioPlayer.isShown) {
      toggleAudioPlayer();
    }
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <Box height="100%" width="100%" display="flex" flexDirection="column">
        <CssBaseline />
        <NavigationBar mode={mode} onModeChange={toggleMode} />
        {isUserSignedIn && <SideDrawer width="256px" />}
        <Box
          marginLeft={isDrawerShown ? DRAWER_WIDTH : '0'}
          sx={{
            transition: 'margin-left 200ms',
            height: '100%',
            width: `calc(100% - ${isDrawerShown ? DRAWER_WIDTH : 0})`,
          }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Outlet />
          <AudioPlayer />
        </Box>

        {snackbar.isShown && (
          <Snackbar
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            open={snackbar.isShown}
          >
            <Alert severity={snackbar.status ?? undefined}>{snackbar.message}</Alert>
          </Snackbar>
        )}
      </Box>
    </ThemeProvider>
  );
}

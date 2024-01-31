import { Outlet } from 'react-router-dom';
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
import { useContext, useMemo, useState } from 'react';
import { APPBAR_HEIGHT, DRAWER_WIDTH } from './Layout.constants';

export function Layout() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');
  const { snackbar, drawer } = useContext(UIContext);
  const { isUserSignedIn } = useAuth();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: {
            main: '#bb4610',
          },
          secondary: {
            main: '#218cf0',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '16px',
              },
            },
          },
        },
      }),
    [mode],
  );

  const isDrawerShown = drawer.isOpen && isUserSignedIn;

  function toggleMode() {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100%"
        display="flex"
        height="100%"
        flexDirection="column"
        overflow={['initial', 'hidden']}
      >
        <CssBaseline />
        <NavigationBar mode={mode} onModeChange={toggleMode} />
        {isUserSignedIn && <SideDrawer width="256px" />}
        <Box
          marginLeft={isDrawerShown ? `${DRAWER_WIDTH}px` : '0'}
          sx={{
            transition: 'margin-left 200ms',
            height: `calc(100% - ${APPBAR_HEIGHT}px)`,
            width: `calc(100% - ${isDrawerShown ? `${DRAWER_WIDTH}px` : '0px'})`,
          }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Outlet />
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

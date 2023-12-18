import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth/useAuth';
import { signOutUser } from '../../providers/AuthProvider/AuthProvider.helpers';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routes';
import { Brightness4, Brightness7, Menu } from '@mui/icons-material';
import { useContext } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { NavigationBarProps } from './NavigationBar.types';

export default function NavigationBar({ mode, onModeChange }: NavigationBarProps) {
  const { isUserSignedIn } = useAuth();
  const { showSnackbar, toggleDrawer } = useContext(UIContext);
  const navigate = useNavigate();

  function handleSignOutClick() {
    void signOutUser();
    showSnackbar({
      status: 'success',
      message: 'You have signed out!',
    });
  }

  function handleSignInClick() {
    navigate(ROUTE_PATHS.SIGN_IN);
  }

  function handleDrawerToggle() {
    toggleDrawer();
  }

  return (
    <AppBar position="sticky" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Melody Craft
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={onModeChange} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {isUserSignedIn && (
            <Button onClick={handleSignOutClick} color="inherit">
              Sign Out
            </Button>
          )}
          {!isUserSignedIn && (
            <Button onClick={handleSignInClick} color="inherit">
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

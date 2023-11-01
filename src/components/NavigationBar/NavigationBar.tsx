import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useSnackbar } from '../../hooks/useSnackbar/useSnackbar';
import useAuth from '../../hooks/useAuth/useAuth';
import { signOutUser } from '../../providers/AuthProvider/AuthProvider.helpers';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routes';
export default function NavigationBar() {
  const { isUserSignedIn } = useAuth();
  const { showSnackbar } = useSnackbar();
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

  return (
    <AppBar position="sticky" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Melody Craft
        </Typography>
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
      </Toolbar>
    </AppBar>
  );
}

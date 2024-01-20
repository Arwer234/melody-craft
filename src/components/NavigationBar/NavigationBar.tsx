import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth/useAuth';
import { signOutUser } from '../../providers/AuthProvider/AuthProvider.helpers';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routes';
import { Brightness4, Brightness7, Menu, Notifications } from '@mui/icons-material';
import { useContext, useRef, useState } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { NavigationBarProps } from './NavigationBar.types';
import NotificationMenu from './NotificationMenu/NotificationMenu';
import { useQuery } from '@tanstack/react-query';
import {
  getNotifications,
  setNotificationAsRead,
} from '../../providers/StoreProvider/StoreProvider.helpers';
import { queryClient } from '../../main';

export default function NavigationBar({ mode, onModeChange }: NavigationBarProps) {
  const { isUserSignedIn } = useAuth();
  const { showSnackbar, toggleDrawer } = useContext(UIContext);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notificiationsAnchorRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

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

  function handleNotificationsClick() {
    setIsNotificationsOpen(previousValue => !previousValue);
  }

  async function handleNotificationItemClick(id: string) {
    navigate(ROUTE_PATHS.DISCOVER);
    setIsNotificationsOpen(false);

    if (notifications?.find(notification => notification.id === id)?.isRead) return;

    const result = await setNotificationAsRead({ id });
    if (result.status === 'success') {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  }

  const unreadNotificationsLength = notifications?.filter(
    notification => !notification.isRead,
  ).length;

  return (
    <AppBar position="sticky" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <NotificationMenu
        isOpen={isNotificationsOpen}
        anchorEl={notificiationsAnchorRef.current}
        onClose={handleNotificationsClick}
        onItemClick={handleNotificationItemClick}
        notifications={notifications ?? []}
      />
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
          <IconButton
            color="inherit"
            ref={notificiationsAnchorRef}
            onClick={handleNotificationsClick}
          >
            <Badge color="secondary" badgeContent={unreadNotificationsLength ?? 0}>
              <Notifications fontSize="inherit" />
            </Badge>
          </IconButton>
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

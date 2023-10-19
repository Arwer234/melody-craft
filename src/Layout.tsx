import { Outlet } from 'react-router-dom';
import './Layout.css';
import { Box, CssBaseline } from '@mui/material';
import NavigationBar from './components/NavigationBar/NavigationBar';
import SideDrawer from './components/SideDrawer/SideDrawer';

type LayoutProps = {
  isNavigationBarShown: boolean;
};

export function Layout({ isNavigationBarShown }: LayoutProps) {
  return (
    <Box height="100%" width="100%">
      <CssBaseline />
      {isNavigationBarShown && (
        <>
          <NavigationBar />
          <SideDrawer width="256px" />
        </>
      )}
      <Outlet />
    </Box>
  );
}

import { AppBar, Button, Toolbar, Typography } from '@mui/material';

type Props = {};

export default function NavigationBar({}: Props) {
  return (
    <AppBar position="sticky" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Melody Craft
        </Typography>
        <Button href="/sign-in" color="inherit">
          Sign In
        </Button>
      </Toolbar>
    </AppBar>
  );
}

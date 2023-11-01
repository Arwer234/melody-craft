import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { DRAWER_PERSONAL_CONFIG, DRAWER_STATIC_CONFIG } from './SideDrawer.constants';
import { useNavigate } from 'react-router-dom';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { useContext } from 'react';

type Props = {
  width: string;
};

export default function SideDrawer({ width }: Props) {
  const navigate = useNavigate();
  const { drawer } = useContext(UIContext);
  console.log('drawer: ', drawer);

  function handleListItemClick(path: string) {
    navigate(path);
  }

  return (
    <Drawer
      variant="persistent"
      sx={{
        width: width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: width, boxSizing: 'border-box' },
      }}
      open={drawer.isOpen}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {DRAWER_STATIC_CONFIG.map(item => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton onClick={() => handleListItemClick(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {DRAWER_PERSONAL_CONFIG.map(item => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton onClick={() => handleListItemClick(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

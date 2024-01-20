import { Badge, Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { NotificationMenuProps } from './NotificationMenu.types';

export default function NotificationMenu({
  isOpen,
  anchorEl,
  onClose,
  notifications,
  onItemClick,
}: NotificationMenuProps) {
  return (
    <Menu open={isOpen} anchorEl={anchorEl} onClose={onClose}>
      {notifications.length === 0 && <MenuItem>You have no notifications</MenuItem>}
      {notifications.map((notification, index) => (
        <div key={notification.id}>
          <MenuItem onClick={() => void onItemClick(notification.id)}>
            <Box display="flex" flexDirection="column" gap={1}>
              <Badge color="secondary" variant="dot" badgeContent={notification.isRead ? 0 : 1}>
                <Typography>{notification.title}</Typography>
              </Badge>
              <Typography variant="body2">{notification.description}</Typography>
            </Box>
          </MenuItem>
          {index !== notifications.length - 1 && <Divider />}{' '}
          {/* Don't render a divider after the last item */}
        </div>
      ))}
    </Menu>
  );
}

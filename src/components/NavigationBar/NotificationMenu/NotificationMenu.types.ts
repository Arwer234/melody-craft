import { NOTIFICATION_TYPES } from './NotificationMenu.constants';

export type NotificationMenuProps = {
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  notifications: Array<NotificationDto>;
  onItemClick: (id: string) => Promise<void>;
};

export type NotificationDto = {
  id: string;
  ownerUid: string;
  title: string;
  description: string;
  isRead: boolean;
  type: (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
};

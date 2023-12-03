import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';

export type SnackbarType = {
  isShown: boolean;
  message: string | undefined;
  status: (typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS] | undefined;
};

export type AudioPlayerType = {
  src: string;
  fileName: string;
  isPlaying: boolean;
  isShown: boolean;
};

export type DrawerType = {
  isOpen: boolean;
};

export type UIContextType = {
  snackbar: SnackbarType;
  showSnackbar: ({ message, status }: Omit<SnackbarType, 'isShown'>) => void;
  drawer: DrawerType;
  toggleDrawer: () => void;
  togglePlay: () => void;
  toggleAudioPlayer: () => void;
  setSrc: (src: string, fileName: string) => void;
  audioPlayer: AudioPlayerType;
};

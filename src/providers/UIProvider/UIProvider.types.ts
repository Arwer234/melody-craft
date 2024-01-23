import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';
import { AudioEditorTrack } from '../StoreProvider/StoreProvider.types';

export type SnackbarType = {
  isShown: boolean;
  message: string | undefined;
  status: (typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS] | undefined;
};

export type AudioPlayerType = {
  playlist: Array<AudioEditorTrack>;
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
  audioPlayer: AudioPlayerType;
  addToPlaylist: (trackName: string) => void;
  isLoading: boolean;
  isMobile: boolean;
};

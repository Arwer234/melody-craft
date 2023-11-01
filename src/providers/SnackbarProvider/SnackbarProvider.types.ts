import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';

export type Snackbar = {
  isShown: boolean;
  message: string | undefined;
  status: (typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS] | undefined;
};

export type SnackbarContextType = {
  snackbar: Snackbar;
  showSnackbar: ({ message, status }: Omit<Snackbar, 'isShown'>) => void;
};

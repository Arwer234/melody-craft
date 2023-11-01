import { useContext } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';

export function useSnackbar() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a UIProvider');
  }

  return { snackbar: context.snackbar, showSnackbar: context.showSnackbar };
}

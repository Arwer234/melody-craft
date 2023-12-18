import { PaletteMode } from '@mui/material';

export type NavigationBarProps = {
  mode: PaletteMode;
  onModeChange: () => void;
};

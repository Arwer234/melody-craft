export type ControlsProps = {
  isPlaying: boolean;
  onPlay: () => void;
  onSkipPrevious: () => void;
  onSkipNext: () => void;
  volume: number;
  onVolumeChange: (_event: Event, newValue: number | Array<number>) => void;
};

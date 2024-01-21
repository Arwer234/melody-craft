export type ControlsProps = {
  isPlaying: boolean;
  isFixed?: boolean;
  onPlay: () => void;
  onSkipPrevious: () => void;
  onSkipNext: () => void;
  onNextClick?: () => void;
  trackName?: string;
};

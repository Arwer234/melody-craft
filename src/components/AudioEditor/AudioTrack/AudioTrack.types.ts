import { WaveSurferOptions } from 'wavesurfer.js';

export type AudioTrackProps = {
  isPlaying: boolean;
  options: WaveSurferOptions;
  onFinish: () => void;
  onSeek: (time: number) => void;
  onDblClick: () => void;
  onDragEnd: (time: number) => void;
  onPause?: (time: number) => void;
  currentTime: number;
  filters: BiquadFilterNode[];
  isSelected?: boolean;
  startTime?: number;
};

import { WaveSurferOptions } from 'wavesurfer.js';

export type AudioTrackProps = {
  isPlaying: boolean;
  options: WaveSurferOptions;
  onFinish: () => void;
  onSeek: (time: number) => void;
  onDblClick: () => void;
  onDragEnd: (time: number) => void;
  onRemove: () => void;
  onAdd: (time: number) => void;
  seekTime: number | null;
  filters: BiquadFilterNode[];
  isSelected?: boolean;
  startTime?: number;
  volume: number;
};

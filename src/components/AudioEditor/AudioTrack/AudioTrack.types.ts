import { WaveSurferOptions } from 'wavesurfer.js';

export type AudioTrackProps = {
  isPlaying: boolean;
  options: WaveSurferOptions;
  onFinish: () => void;
  onSeek: (time: number) => void;
  currentTime: number;
  filters: BiquadFilterNode[];
};

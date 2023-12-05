import { WaveSurferOptions } from 'wavesurfer.js';

export const MAX_TRACK_AMOUNT = 8;

export const DEFAULT_WAVESURFER_OPTIONS: WaveSurferOptions = {
  container: 'waveform',
  waveColor: '#4F4A85',
  progressColor: '#383351',
  url: 'test.mp3',
  autoplay: false,
};

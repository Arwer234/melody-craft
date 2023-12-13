import { WaveSurferOptions } from 'wavesurfer.js';

export const MAX_TRACK_AMOUNT = 8;

export const DEFAULT_WAVESURFER_OPTIONS: Array<WaveSurferOptions> = [
  {
    container: 'waveform',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    url: 'test.mp3',
    autoplay: false,
  },
  {
    container: 'waveform_2',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    url: 'test2.mp3',
    autoplay: false,
  },
];

export const audioContext = new AudioContext();

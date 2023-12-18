import { WaveSurferOptions } from 'wavesurfer.js';
import { CustomTrackOptions } from './AudioEditor.types';

export const MAX_TRACK_AMOUNT = 8;

export const DEFAULT_WAVESURFER_OPTIONS: Array<WaveSurferOptions & CustomTrackOptions> = [
  {
    container: 'waveform',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    url: 'test.mp3',
    autoplay: false,
    startTime: 5.2,
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

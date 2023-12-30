import { Sample } from './AudioEditor.types';

export const MAX_TRACK_AMOUNT = 8;

export const DEFAULT_WAVESURFER_OPTIONS: Array<Sample> = [
  {
    id: '1233321',
    container: 'waveform',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    cursorColor: 'transparent',
    url: 'test.mp3',
    autoplay: false,
    startTime: 5.2,
    state: 'ready',
  },
  {
    id: '12333331',
    container: 'waveform_2',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    cursorColor: 'transparent',
    url: 'test2.mp3',
    autoplay: false,
    state: 'ready',
  },
  {
    id: '2233321',
    container: 'waveform_3',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    cursorColor: 'transparent',
    url: 'test.mp3',
    autoplay: false,
    startTime: 0,
    state: 'ready',
  },
];

export const audioContext = new AudioContext();

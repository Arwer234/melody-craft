import { Sample, TrackState } from './AudioEditor.types';

export const MAX_TRACK_AMOUNT = 8;

export const DEFAULT_WAVESURFER_OPTIONS: Array<Sample> = [
  {
    container: 'waveform',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    cursorColor: 'transparent',
    autoplay: false,
    url: 'test.mp3',
    startTime: 5.2,
    id: '1233321',
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

export const DEFAULT_SAMPLE_OPTIONS = {
  waveColor: '#4F4A85',
  progressColor: '#383351',
  cursorColor: 'transparent',
  autoplay: false,
  state: 'ready' as TrackState,
};

export const audioContext = new AudioContext();

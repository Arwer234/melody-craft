import { WaveSurferOptions } from 'wavesurfer.js';

export type TrackState = 'ready' | 'playing' | 'paused' | 'finished';

export type CustomTrackOptions = {
  startTime?: number;
  state: TrackState;
  id: string;
};

export type Sample = WaveSurferOptions & CustomTrackOptions;

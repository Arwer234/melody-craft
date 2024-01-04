import { Dispatch, SetStateAction } from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';

export type TrackState = 'ready' | 'playing' | 'paused' | 'finished';

export type CustomTrackOptions = {
  startTime?: number;
  state: TrackState;
  id: string;
  name: string;
};

export type Sample = WaveSurferOptions & CustomTrackOptions;

export type EqualizerType = {
  id: string;
  filters: Array<BiquadFilterNode>;
};

export type Volume = { id: string; value: number };

export type AudioEditorProps = {
  playlines: Array<Array<Sample>>;
  volumes: Array<Volume>;
  equalizers: Array<EqualizerType>;
  selectedTrackId: string | null;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setEqualizers: Dispatch<SetStateAction<Array<EqualizerType>>>;
  setPlaylines: Dispatch<SetStateAction<Array<Array<Sample>>>>;
  setVolumes: Dispatch<SetStateAction<Array<Volume>>>;
  setSelectedTrackId: Dispatch<SetStateAction<string | null>>;
};

import { TrackState } from './AudioEditor.types';

export const MAX_TRACK_AMOUNT = 8;

export const DEFAULT_SAMPLE_OPTIONS = {
  cursorColor: 'transparent',
  autoplay: false,
  state: 'ready' as TrackState,
} as const;

export const ACTIVE_STEPS = {
  CREATE: 0,
  EDIT: 1,
  PUBLISH: 2,
} as const;

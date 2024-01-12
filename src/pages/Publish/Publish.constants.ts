import { object, string, array } from 'yup';

export const TrackPublishSchema = object({
  name: string().required('Track name is required'),
  description: string().required('Track description is required'),
  tags: array().of(string()).required('At least one tag is required'),
  visibility: string().required('Visibility is required'),
});

export const PUBLISH_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export const EXISTING_TRACK_OPTIONS = {
  EDIT: 'edit',
  CREATE: 'create',
} as const;

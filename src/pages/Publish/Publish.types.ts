import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';
import { EXISTING_TRACK_OPTIONS, PUBLISH_VISIBILITY } from './Publish.constants';

export type PublishFormValues = {
  name: string;
  description: string;
  tags: string[];
  visibility: (typeof PUBLISH_VISIBILITY)[keyof typeof PUBLISH_VISIBILITY];
  mode: (typeof EXISTING_TRACK_OPTIONS)[keyof typeof EXISTING_TRACK_OPTIONS];
};

export type SubmitCustomValues = {
  file: File | null;
  isExisting: boolean;
};

export type PublishProps = {
  onSubmit: (
    values: PublishFormValues & SubmitCustomValues,
  ) => Promise<(typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS]>;
  isExisting: boolean;
  existingName?: string;
  existingDescription?: string;
  isModeLocked: boolean;
};

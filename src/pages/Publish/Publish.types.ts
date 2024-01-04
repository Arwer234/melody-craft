import { PUBLISH_VISIBILITY } from './Publish.constants';

export type PublishFormValues = {
  name: string;
  description: string;
  tags: string[];
  visibility: keyof typeof PUBLISH_VISIBILITY;
};

export type PublishProps = {
  onSubmit: (values: PublishFormValues) => void;
};

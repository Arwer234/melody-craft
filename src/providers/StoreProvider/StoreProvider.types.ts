import { FileType } from '../../pages/MyFiles/MyFiles.types';

export type StoredFile = {
  file: File;
  metadata: FileMetadata;
};

export type FileMetadata = {
  name: string;
  size: number;
  type: FileType;
  ownerUid: string;
  datetime: string;
};

import { FileType } from '../../pages/MyFiles/MyFiles.types';

export type StoredFile = {
  file: File;
  metadata: FileMetadata;
};

export type FileMetadata = {
  contentType: string;
  name: string;
  size: number;
  type: FileType;
  ownerUid: string;
};

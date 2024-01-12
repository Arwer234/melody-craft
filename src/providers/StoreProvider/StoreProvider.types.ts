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
  url?: string;
};

export type StoreContextType = {
  musicFilesMetadata: Array<FileMetadata>;
  isMusicFilesMetadataLoaded: boolean;
  refetchMusicFilesMetadata: () => void;
};

export type StoreSample = {
  gain: Array<number>;
  id: string;
  name: string;
  startTime: number;
  volume: number;
};

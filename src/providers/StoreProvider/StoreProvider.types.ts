import { Timestamp } from 'firebase/firestore';
import { FileType } from '../../pages/MyFiles/MyFiles.types';
import { PUBLISH_VISIBILITY } from '../../pages/Publish/Publish.constants';

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

export type TrackDto = {
  description: string;
  name: string;
  ownerUid: string;
  playlines: Array<Array<StoreSample>>;
  tags: Array<string>;
  visibility: (typeof PUBLISH_VISIBILITY)[keyof typeof PUBLISH_VISIBILITY];
  date: Timestamp;
  image: string;
  likes: number;
};

export type PlaylistDto = {
  name: string;
  ownerUid: string;
  trackNames: Array<string>;
  date: Timestamp;
};

export type PlaylistExtendedDto = PlaylistDto & {
  tracks: Array<TrackDto>;
};

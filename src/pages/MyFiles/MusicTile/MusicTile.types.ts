import { FileMetadata } from '../../../providers/StoreProvider/StoreProvider.types';

export type MusicTileProps = Omit<FileMetadata, 'ownerUid'> & {
  onRemove: (fileName: string) => void;
};

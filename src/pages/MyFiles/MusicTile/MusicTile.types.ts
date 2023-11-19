import { FileMetadata } from '../../../providers/StoreProvider/StoreProvider.types';

export type MusicTileProps = Omit<FileMetadata, 'ownerUid'> & {
  onEdit: (fileName: string) => void;
  onRemove: (fileName: string) => void;
};

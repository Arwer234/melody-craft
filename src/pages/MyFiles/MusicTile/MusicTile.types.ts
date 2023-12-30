import { FileMetadata } from '../../../providers/StoreProvider/StoreProvider.types';
import { FileType } from '../MyFiles.types';

export type MusicTileProps = Omit<FileMetadata, 'ownerUid'> & {
  onRemove?: (fileName: string) => void;
  onPlay?: (fileName: string, fileType: FileType) => void;
  onDrag?: (event: React.DragEvent<HTMLDivElement>, fileName: string, fileType: FileType) => void;
};

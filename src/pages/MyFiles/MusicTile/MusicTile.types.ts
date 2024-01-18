import { FileMetadata, TrackDto } from '../../../providers/StoreProvider/StoreProvider.types';
import { FileType } from '../MyFiles.types';

export type MusicTileProps = {
  onRemove?: (fileName: string) => void;
  onPlay?: (fileName: string, fileType: FileType) => void;
  onDrag?: (event: React.DragEvent<HTMLDivElement>, fileName: string, fileType: FileType) => void;
  onAdd?: (name: string) => void;
  src?: string;
  sample?: Omit<FileMetadata, 'ownerUid'>;
  track?: TrackDto;
};

import { FileMetadata } from '../../../providers/StoreProvider/StoreProvider.types';
import { FileType } from '../MyFiles.types';

export type MusicTileListProps = {
  musicFilesData: Array<FileMetadata>;
  fileType: FileType;
  onRemove?: (fileName: string) => void;
  onPlay?: (fileName: string, fileType: FileType) => void;
  onDrag?: (event: React.DragEvent<HTMLDivElement>, fileName: string, fileType: FileType) => void;
  isLoaded: boolean;
  columns?: 1 | 2 | 3;
};

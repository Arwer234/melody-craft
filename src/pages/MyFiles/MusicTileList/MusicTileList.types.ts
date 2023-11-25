import { FileMetadata } from '../../../providers/StoreProvider/StoreProvider.types';
import { FileType } from '../MyFiles.types';

export type MusicTileListProps = {
  musicFilesData: Array<FileMetadata>;
  fileType: FileType;
  onRemove: (fileName: string) => void;
};

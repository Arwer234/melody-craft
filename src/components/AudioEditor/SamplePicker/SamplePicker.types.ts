import { FileType } from '../../../pages/MyFiles/MyFiles.types';
import { FileMetadata } from '../../../providers/StoreProvider/StoreProvider.types';

export type SamplePickerProps = {
  musicFilesMetadata: Array<FileMetadata>;
  isMusicFilesMetadataLoaded: boolean;
  onDrag: (
    event: React.DragEvent<HTMLDivElement>,
    fileName: string,
    fileType: FileType,
  ) => Promise<void>;
};

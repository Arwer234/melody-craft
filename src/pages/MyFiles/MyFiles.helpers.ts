import { FileMetadata } from '../../providers/StoreProvider/StoreProvider.types';
import { SAMPLES_LIMIT, TRACKS_LIMIT } from './MyFiles.constants';
import { FileType } from './MyFiles.types';

export function isUploadedFilesLimitExceeded({
  type,
  musicFilesData,
}: {
  type: FileType;
  musicFilesData: Array<FileMetadata>;
}) {
  if (type === 'sample') {
    return musicFilesData.length >= SAMPLES_LIMIT;
  } else {
    return musicFilesData.length >= TRACKS_LIMIT;
  }
}

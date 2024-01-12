import { Paper } from '@mui/material';
import { SamplePickerProps } from './SamplePicker.types';
import Spinner from '../../Spinner/Spinner';
import MusicTileList from '../../../pages/MyFiles/MusicTileList/MusicTileList';

export function SamplePicker({
  musicFilesMetadata,
  isMusicFilesMetadataLoaded,
  onDrag,
}: SamplePickerProps) {
  if (!isMusicFilesMetadataLoaded) {
    return <Spinner />;
  }
  return (
    <Paper sx={{ padding: 2, height: 172, overflowY: 'scroll' }}>
      <MusicTileList
        musicFilesData={musicFilesMetadata}
        fileType="sample"
        isLoaded={isMusicFilesMetadataLoaded}
        onDrag={onDrag}
      />
    </Paper>
  );
}

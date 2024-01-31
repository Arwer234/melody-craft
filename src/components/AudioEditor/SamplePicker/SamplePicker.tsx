import { Paper } from '@mui/material';
import { SamplePickerProps } from './SamplePicker.types';
import Spinner from '../../Spinner/Spinner';
import MusicTileList from '../../../pages/MyFiles/MusicTileList/MusicTileList';

export function SamplePicker({
  sampleData,
  isMusicFilesMetadataLoaded,
  onDrag,
}: SamplePickerProps) {
  if (!isMusicFilesMetadataLoaded) {
    return <Spinner />;
  }
  return (
    <Paper sx={{ padding: 2 }}>
      <MusicTileList
        samplesData={sampleData}
        fileType="sample"
        isLoaded={isMusicFilesMetadataLoaded}
        onDrag={onDrag}
        variant="dense"
      />
    </Paper>
  );
}

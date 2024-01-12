import { Grid } from '@mui/material';
import { MusicTileListProps } from './MusicTileList.types';
import MusicTile from '../MusicTile/MusicTile';
import EmptyView from '../../../components/EmptyView/EmptyView';

export default function MusicTileList({
  fileType,
  musicFilesData,
  isLoaded,
  columns = 1,
  onDrag,
  onRemove,
  onPlay,
}: MusicTileListProps) {
  if (!isLoaded) {
    return <EmptyView description="There are no files yet!" />;
  }
  return (
    <Grid container rowGap={2}>
      {musicFilesData.map(musicFile => (
        <Grid key={`${fileType} ${musicFile.name}`} item xs={12 / columns}>
          <MusicTile onPlay={onPlay} onRemove={onRemove} onDrag={onDrag} {...musicFile} />
        </Grid>
      ))}
    </Grid>
  );
}

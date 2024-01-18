import { Grid } from '@mui/material';
import { MusicTileListProps } from './MusicTileList.types';
import MusicTile from '../MusicTile/MusicTile';
import EmptyView from '../../../components/EmptyView/EmptyView';

export default function MusicTileList({
  fileType,
  tracksData,
  samplesData,
  isLoaded,
  columns = 1,
  onDrag,
  onRemove,
  onPlay,
  onAdd,
}: MusicTileListProps) {
  if (!isLoaded) {
    return <EmptyView description="There are no files yet!" />;
  }
  return (
    <Grid container rowGap={2}>
      {fileType === 'track' &&
        tracksData?.map(track => (
          <Grid key={`${fileType} ${track.name}`} item xs={12 / columns}>
            <MusicTile
              onPlay={onPlay}
              onRemove={onRemove}
              onDrag={onDrag}
              track={track}
              onAdd={onAdd}
            />
          </Grid>
        ))}
      {fileType === 'sample' &&
        samplesData?.map(sample => (
          <Grid key={`${fileType} ${sample.name}`} item xs={12 / columns}>
            <MusicTile onPlay={onPlay} onRemove={onRemove} onDrag={onDrag} sample={sample} />
          </Grid>
        ))}
    </Grid>
  );
}

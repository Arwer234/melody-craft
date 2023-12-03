import { Box } from '@mui/material';
import { MusicTileListProps } from './MusicTileList.types';
import MusicTile from '../MusicTile/MusicTile';
import EmptyView from '../../../components/EmptyView/EmptyView';

export default function MusicTileList({
  fileType,
  musicFilesData,
  isLoaded,
  onRemove,
  onPlay,
}: MusicTileListProps) {
  if (!isLoaded) {
    return <EmptyView description="There are no files yet!" />;
  }
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {musicFilesData.map(musicFile => (
        <MusicTile
          onPlay={onPlay}
          onRemove={onRemove}
          key={`${fileType} ${musicFile.name}`}
          {...musicFile}
        />
      ))}
    </Box>
  );
}

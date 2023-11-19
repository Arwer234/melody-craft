import { Box } from '@mui/material';
import { MusicTileListProps } from './MusicTileList.types';
import MusicTile from '../MusicTile/MusicTile';

export default function MusicTileList({
  fileType,
  musicFilesData,
  onEdit,
  onRemove,
}: MusicTileListProps) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {musicFilesData.map(musicFile => (
        <MusicTile
          onEdit={onEdit}
          onRemove={onRemove}
          key={`${fileType} ${musicFile.name}`}
          {...musicFile}
        />
      ))}
    </Box>
  );
}

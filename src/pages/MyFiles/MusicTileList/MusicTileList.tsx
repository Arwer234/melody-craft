import { Box, Divider } from '@mui/material';
import { MusicTileListProps } from './MusicTileList.types';
import MusicTile from '../MusicTile/MusicTile';
import EmptyView from '../../../components/EmptyView/EmptyView';
import { Fragment } from 'react';

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
  variant = 'default',
  maxHeight = 312,
  isFullHeight,
}: MusicTileListProps) {
  if (!isLoaded) {
    return <EmptyView description="There are no files yet!" />;
  }

  const resolvedHeight = isFullHeight ? '100%' : maxHeight;
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      height="100%"
      sx={{ overflowY: 'scroll' }}
      maxHeight={resolvedHeight}
    >
      {fileType === 'track' &&
        tracksData?.map((track, index) => (
          <Fragment key={`${fileType} ${track.name}`}>
            <Box flexBasis={`${100 / columns}%`}>
              <MusicTile
                onPlay={onPlay}
                onRemove={onRemove}
                onDrag={onDrag}
                track={track}
                onAdd={onAdd}
              />
            </Box>
            {index !== tracksData.length - 1 && <Divider />}{' '}
            {/* Don't render a divider after the last item */}
          </Fragment>
        ))}
      {fileType === 'sample' &&
        samplesData?.map((sample, index) => (
          <Fragment key={`${fileType} ${sample.name}`}>
            <Box flexBasis={`${100 / columns}%`}>
              <MusicTile
                variant={variant}
                onPlay={onPlay}
                onRemove={onRemove}
                onDrag={onDrag}
                sample={sample}
              />
            </Box>
            {index !== samplesData.length - 1 && <Divider />}{' '}
            {/* Don't render a divider after the last item */}
          </Fragment>
        ))}
      {tracksData?.length === 0 && samplesData?.length === 0 && (
        <EmptyView description="There are no files yet!" />
      )}
    </Box>
  );
}

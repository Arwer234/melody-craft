import {
  PlaylistExtendedDto,
  TrackExtendedDto,
} from '../../providers/StoreProvider/StoreProvider.types';

export type TrackListProps = {
  tracks: Array<TrackExtendedDto>;
  isLoading?: boolean;
  playlists: Array<PlaylistExtendedDto>;
  ownerUid?: string;
};

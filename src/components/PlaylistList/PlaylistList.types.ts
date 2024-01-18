import { PlaylistExtendedDto } from '../../providers/StoreProvider/StoreProvider.types';

export type PlaylistListProps = {
  playlists: Array<PlaylistExtendedDto>;
  isLoading?: boolean;
};

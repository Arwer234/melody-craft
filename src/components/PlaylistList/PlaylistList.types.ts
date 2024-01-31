import { PlaylistExtendedDto } from '../../providers/StoreProvider/StoreProvider.types';

export type PlaylistListProps = {
  playlists: Array<PlaylistExtendedDto>;
  isLoading?: boolean;
  onRemovePlaylist: (playlistName: string) => void;
  onRemoveTrackFromPlaylist: (playlistName: string, trackName: string) => void;
};

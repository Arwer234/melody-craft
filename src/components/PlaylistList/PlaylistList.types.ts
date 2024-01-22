import { PlaylistExtendedDto } from '../../providers/StoreProvider/StoreProvider.types';

export type PlaylistListProps = {
  playlists: Array<PlaylistExtendedDto>;
  isLoading?: boolean;
  onRemovePlaylist: (playlistName: string) => void;
  onRemoveTrack: (playlistName: string, trackName: string) => void;
};

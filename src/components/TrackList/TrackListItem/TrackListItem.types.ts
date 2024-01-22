import { TrackExtendedDto } from '../../../providers/StoreProvider/StoreProvider.types';
import { FirestoreUserExtended } from '../../../providers/AuthProvider/AuthProvider.types';

export type TrackListItemCustomProps = {
  displayName: string | null;
  image_path: string | null;
  onAddToPlaylist: ({ trackName }: { trackName: string }) => void;
  onPlay: ({ trackName }: { trackName: string }) => void;
  user?: FirestoreUserExtended;
  isLoading?: boolean;
  onRemoveFromPlaylist?: () => void;
};

export type TrackListItemProps = TrackExtendedDto & TrackListItemCustomProps;

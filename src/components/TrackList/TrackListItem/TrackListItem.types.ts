import { CommentDto, TrackExtendedDto } from '../../../providers/StoreProvider/StoreProvider.types';
import { FirestoreUserExtended } from '../../../providers/AuthProvider/AuthProvider.types';

export type TrackListItemCustomProps = {
  displayName: string | null;
  image_path: string | null;
  onAddToPlaylist: ({ trackName }: { trackName: string }) => void;
  onPlay: ({ trackName }: { trackName: string }) => void;
  user?: FirestoreUserExtended;
  isLoading?: boolean;
  onRemoveFromPlaylist?: () => void;
  comments: Array<CommentDto>;
  onOpenCommentSection: ({ id }: { id: string }) => void;
  isCommentSectionOpen: boolean;
};

export type TrackListItemProps = TrackExtendedDto & TrackListItemCustomProps;

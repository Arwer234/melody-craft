import { PlaylistExtendedDto } from '../../../providers/StoreProvider/StoreProvider.types';

export type PlaylistListItemProps = PlaylistExtendedDto & {
  onRemove: () => void;
};

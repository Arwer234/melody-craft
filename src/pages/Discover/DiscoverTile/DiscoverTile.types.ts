import { TrackDto } from '../../../providers/StoreProvider/StoreProvider.types';

export type DiscoverTileCustomProps = {
  displayName: string | null;
  image_path: string | null;
};

export type DiscoverTileProps = TrackDto & DiscoverTileCustomProps;

import { CommentDto } from '../../providers/StoreProvider/StoreProvider.types';

export type CommentListProps = {
  comments: Array<CommentDto>;
  trackName: string;
};

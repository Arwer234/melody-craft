import { FirestoreUser } from '../../../providers/AuthProvider/AuthProvider.types';
import { CommentDto } from '../../../providers/StoreProvider/StoreProvider.types';

export type CommentListItemProps = CommentDto & FirestoreUser;

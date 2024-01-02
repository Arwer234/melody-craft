import { getTracks } from '../../providers/StoreProvider/StoreProvider.helpers';

export async function getCurrentUserTracks() {
  await getTracks();
}

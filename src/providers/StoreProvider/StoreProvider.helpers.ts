import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { StoredFile } from './StoreProvider.types';
import { StorageError, StorageErrorCode, getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebaseApp } from '../../firebase';
import { STORE_ERRORS } from './StoreProvider.constants';

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export async function addMusicFile(props: StoredFile) {
  const storageRef = ref(storage, `${props.metadata.type}s/${props.metadata.name}`);
  const existingDocSnap = await getDoc(doc(db, 'files', props.metadata.name));

  if (existingDocSnap.exists()) {
    throw new Error(STORE_ERRORS.FILE_EXISTS);
  }

  await setDoc(doc(db, 'files', props.metadata.name), {
    size: props.metadata.size,
    type: props.metadata.type,
    name: props.metadata.name,
    ownerUid: props.metadata.ownerUid,
  }).then(() => {
    uploadBytes(storageRef, props.file).catch((error: StorageError) => {
      throw new StorageError(error.code as StorageErrorCode, error.message);
    });
  });
}

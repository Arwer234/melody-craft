import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { FileMetadata, StoredFile } from './StoreProvider.types';
import {
  StorageError,
  StorageErrorCode,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { firebaseApp } from '../../firebase';
import { STORE_ERRORS } from './StoreProvider.constants';
import { FileType } from '../../pages/MyFiles/MyFiles.types';
import { auth } from '../AuthProvider/AuthProvider.helpers';

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
    ownerUid: props.metadata.ownerUid,
    datetime: props.metadata.datetime,
  }).then(() => {
    uploadBytes(storageRef, props.file).catch((error: StorageError) => {
      throw new StorageError(error.code as StorageErrorCode, error.message);
    });
  });
}

export async function getMusicFilesData({ ownerUid }: { ownerUid?: string }) {
  const q = query(
    collection(db, 'files'),
    where('ownerUid', '==', ownerUid ?? auth.currentUser?.uid),
  );

  const querySnapshot = await getDocs(q);
  const data: Array<FileMetadata> = [];
  querySnapshot.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    data.push({ name: doc.id, ...(doc.data() as Omit<FileMetadata, 'name'>) });
  });

  return data;
}

export async function deleteMusicFile(props: { fileName: string; type: string }) {
  const fileRef = ref(storage, `${props.type}s/${props.fileName}`);
  const existingDocSnap = await getDoc(doc(db, 'files', props.fileName));

  if (!existingDocSnap.exists()) {
    throw new Error(STORE_ERRORS.NO_FILE);
  }

  deleteObject(fileRef)
    .then(() => {
      deleteDoc(doc(db, 'files', props.fileName)).catch((error: StorageError) => {
        throw new StorageError(error.code as StorageErrorCode, error.message);
      });
    })
    .catch((error: StorageError) => {
      throw new StorageError(error.code as StorageErrorCode, error.message);
    });
}

export async function getMusicFileSrc(fileName: string, fileType: FileType) {
  const fileReference = ref(storage, `${fileType}s/${fileName}`);

  const url = await getDownloadURL(fileReference);

  return url;
}

export async function getTracks() {
  const currentUserUid = auth.currentUser?.uid;
  const q = query(collection(db, 'tracks'), where('ownerUid', '==', currentUserUid));

  const querySnapshot = await getDocs(q);
  const data: Array<{
    id: string;
    ownerUid: string;
    name: string;
    playlines: Array<
      Array<{
        name: string;
        startTime: number;
        src: string;
        volume: number;
        gain: Array<number>;
        id: string;
      }>
    >;
  }> = [];
  querySnapshot.forEach(doc => {
    const parsedDoc = { id: doc.id, ...doc.data() };
    parsedDoc.playlines = parsedDoc.playlines.map((playline: any) => {
      return [...Object.values(playline)];
    });
    data.push(parsedDoc);
  });

  data.forEach(track => {
    track.playlines.forEach(playline => {
      playline.forEach(sample => {
        getMusicFileSrc(sample.name, 'sample')
          .then(url => {
            sample.src = url;
          })
          .catch(error => {
            console.log(error);
          });
      });
    });
  });

  return data;
}

import {
  DocumentData,
  Query,
  Timestamp,
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
import {
  FileMetadata,
  PlaylistDto,
  StoreSample,
  StoredFile,
  TrackDto,
} from './StoreProvider.types';
import {
  StorageError,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { firebaseApp } from '../../firebase';
import { STORE_ERRORS } from './StoreProvider.constants';
import { FileType } from '../../pages/MyFiles/MyFiles.types';
import { auth, getUserDisplayName } from '../AuthProvider/AuthProvider.helpers';
import { EqualizerType, Sample, Volume } from '../../components/AudioEditor/AudioEditor.types';
import { EXISTING_TRACK_OPTIONS, PUBLISH_VISIBILITY } from '../../pages/Publish/Publish.constants';
import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export async function addMusicFile(props: StoredFile) {
  const storageRef = ref(storage, `${props.metadata.type}s/${props.metadata.name}`);
  const existingDocSnap = await getDoc(doc(db, 'files', props.metadata.name));

  if (existingDocSnap.exists()) {
    throw new Error(STORE_ERRORS.FILE_EXISTS);
  }

  const setDocPromise = setDoc(doc(db, 'files', props.metadata.name), {
    size: props.metadata.size,
    type: props.metadata.type,
    ownerUid: props.metadata.ownerUid,
    datetime: props.metadata.datetime,
  });
  const uploadBytesPromise = uploadBytes(storageRef, props.file);

  return Promise.all([setDocPromise, uploadBytesPromise])
    .then(() => {
      return {
        status: 'success',
        message: 'File successfully uploaded',
      };
    })
    .catch((error: StorageError) => {
      return {
        status: 'error',
        message: error.message,
      };
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

  const deleteObjectPromise = deleteObject(fileRef);
  const deleteDocPromise = deleteDoc(doc(db, 'files', props.fileName));

  return Promise.all([deleteObjectPromise, deleteDocPromise])
    .then(() => {
      return {
        status: 'success',
        message: 'File successfully deleted',
      };
    })
    .catch((error: StorageError) => {
      return {
        status: 'error',
        message: error.message,
      };
    });
}

export async function getMusicFileSrc(fileName: string, fileType: FileType) {
  const fileReference = ref(storage, `${fileType}s/${fileName}`);

  const url = await getDownloadURL(fileReference);

  return url;
}

export async function getAudioEditorTracks() {
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

export async function getImagePath(fileName: string) {
  const fileReference = ref(storage, `images/${fileName}`);

  if (!fileReference) return null;

  const url = await getDownloadURL(fileReference);

  return url;
}

export async function getTracks({
  tags,
  name,
  ownerUid,
}: {
  tags?: Array<string>;
  name?: string;
  ownerUid?: string;
}) {
  const coll = collection(db, 'tracks');
  let q: Query<DocumentData, DocumentData> | null = null;

  if (tags && tags.length > 0 && name && ownerUid && ownerUid.length > 0) {
    q = query(
      coll,
      where('tags', 'array-contains-any', tags),
      where('name', '==', name),
      where('ownerUid', '==', ownerUid),
    );
  } else if (tags && tags.length > 0 && ownerUid && ownerUid.length > 0) {
    q = query(coll, where('tags', 'array-contains-any', tags), where('ownerUid', '==', ownerUid));
  } else if (tags && tags.length > 0 && name && name.length > 0) {
    q = query(coll, where('tags', 'array-contains-any', tags), where('name', '==', name));
  } else if (tags && tags.length > 0) {
    q = query(coll, where('tags', 'array-contains-any', tags));
  } else if (name) {
    q = query(coll, where('name', '==', name));
  } else {
    q = query(coll);
  }

  if (q === null) return;

  const querySnapshot = await getDocs(q);
  const data: Array<TrackDto> = [];
  querySnapshot.forEach(doc => {
    data.push({ name: doc.id, ...(doc.data() as Omit<TrackDto, 'name'>) });
  });

  const extendedData = await Promise.all(
    data.map(async track => {
      const displayName = await getUserDisplayName(track.ownerUid);
      const image_path = track.image ? await getImagePath(track.image) : null;
      const filledTrack = { ...track, displayName, image_path };
      return filledTrack;
    }),
  );

  return extendedData;
}

export async function getTrackByName({ name }: { name: string }) {
  const docRef = doc(db, 'tracks', name);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const track = docSnap.data() as TrackDto;
    const displayName = await getUserDisplayName(track.ownerUid);
    const image_path = track.image ? await getImagePath(track.image) : null;
    const filledTrack = { ...track, displayName, image_path };
    return filledTrack;
  } else {
    return null;
  }
}

export async function getTags() {
  const q = query(collection(db, 'tracks'));
  const querySnapshot = await getDocs(q);
  const data: Array<string> = [];
  querySnapshot.forEach(doc => {
    const tags = doc.get('tags') as Array<string>;
    tags.forEach(tag => {
      if (!data.includes(tag)) data.push(tag);
    });
  });

  return data;
}

export async function setTrack({
  name,
  volumes,
  file,
  playlines,
  equalizers,
  tags,
  mode,
  visibility,
  description,
}: {
  name: string;
  file: File | null;
  volumes: Array<Volume>;
  mode: (typeof EXISTING_TRACK_OPTIONS)[keyof typeof EXISTING_TRACK_OPTIONS];
  playlines: Array<Array<Sample>>;
  equalizers: Array<EqualizerType>;
  tags: Array<string>;
  visibility: (typeof PUBLISH_VISIBILITY)[keyof typeof PUBLISH_VISIBILITY];
  description: string;
}): Promise<{ status: (typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS]; message: string }> {
  const currentUserUid = auth.currentUser?.uid;
  const q = query(collection(db, 'tracks'), where('name', '==', name));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length > 0 && mode === EXISTING_TRACK_OPTIONS.CREATE) {
    return {
      status: SNACKBAR_STATUS.ERROR,
      message: STORE_ERRORS.TRACK_EXISTS,
    };
  }

  const trackRef = doc(db, 'tracks', name);

  const parsedPlaylines = playlines.map(playline => {
    const parsedPlayline: { [k: number]: StoreSample } = {};
    playline.forEach((sample, index) => {
      parsedPlayline[index] = {
        name: sample.name,
        startTime: sample.startTime ?? 0,
        id: sample.id,
        gain: equalizers
          .find(equalizer => equalizer.id === sample.id)
          ?.filters.map(filter => filter.gain.value) ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        volume: volumes.find(volume => volume.id === sample.id)?.value ?? 100,
      };
    });
    return parsedPlayline;
  });

  await setDoc(trackRef, {
    name,
    ownerUid: currentUserUid,
    playlines: parsedPlaylines,
    tags,
    visibility,
    description,
    date: Timestamp.fromDate(new Date()),
    likes: 0,
    image: file ? file.name : null,
  });

  if (file) {
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await getDownloadURL(storageRef);
      return {
        status: SNACKBAR_STATUS.ERROR,
        message: STORE_ERRORS.FILE_EXISTS,
      };
    } catch {
      await uploadBytes(storageRef, file);
    }
  }

  return {
    status: SNACKBAR_STATUS.SUCCESS,
    message: 'Track successfully saved!',
  };
}

export async function setPlaylist({ name, trackNames }: Pick<PlaylistDto, 'name' | 'trackNames'>) {
  const currentUserUid = auth.currentUser?.uid;
  const q = query(collection(db, 'playlists'), where('name', '==', name));

  const querySnapshot = await getDocs(q);

  const isPlaylistNameTaken = querySnapshot.docs.some(
    doc => doc.get('ownerUid') !== currentUserUid,
  );

  if (querySnapshot.docs.length > 0 && isPlaylistNameTaken) {
    return {
      status: SNACKBAR_STATUS.ERROR,
      message: STORE_ERRORS.PLAYLIST_EXISTS,
    };
  }

  const playlistRef = doc(db, 'playlists', name);

  await setDoc(playlistRef, {
    name,
    ownerUid: currentUserUid,
    trackNames,
    date: Timestamp.fromDate(new Date()),
  });

  return {
    status: SNACKBAR_STATUS.SUCCESS,
    message: 'Playlist successfully saved!',
  };
}

export async function getPlaylists({ name, ownerUid }: { name?: string; ownerUid?: string }) {
  const col = collection(db, 'playlists');
  let q;
  if (name && ownerUid) {
    q = query(col, where('name', '==', name), where('ownerUid', '==', ownerUid));
  } else if (name) {
    q = query(col, where('name', '==', name));
  } else if (ownerUid) {
    q = query(col, where('ownerUid', '==', ownerUid));
  } else {
    q = query(col);
  }

  const querySnapshot = await getDocs(q);
  const data: Array<PlaylistDto> = [];
  querySnapshot.forEach(doc => {
    data.push(doc.data() as PlaylistDto);
  });
  console.log('data: ', data);

  const extendedData = await Promise.all(
    data.map(async playlist => {
      const extendedPlaylist = { ...playlist, tracks: [] as Array<TrackDto> };
      if (extendedPlaylist.trackNames.length === 0) return extendedPlaylist;

      extendedPlaylist.tracks = await Promise.all(
        playlist.trackNames.map(async name => {
          const track = await getTrackByName({ name });
          return track as TrackDto;
        }),
      );

      return extendedPlaylist;
    }),
  );

  return extendedData;
}

import {
  DocumentData,
  Query,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  AudioEditorTrack,
  CommentDto,
  FileMetadata,
  PlaylistDto,
  PlaylistExtendedDto,
  StoreSample,
  StoredFile,
  TrackDto,
  TrackExtendedDto,
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
import { NOTIFICATION_TYPES } from '../../components/NavigationBar/NotificationMenu/NotificationMenu.constants';
import { NotificationDto } from '../../components/NavigationBar/NotificationMenu/NotificationMenu.types';
import { FirestoreUserExtended } from '../AuthProvider/AuthProvider.types';

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

export async function getAudioEditorTracks({
  isOwnTracks,
}: {
  isOwnTracks: boolean;
}): Promise<AudioEditorTrack[]> {
  const currentUserUid = auth.currentUser?.uid;
  let q;
  if (isOwnTracks) {
    q = query(collection(db, 'tracks'), where('ownerUid', '==', currentUserUid));
  } else {
    q = query(collection(db, 'tracks'));
  }

  const querySnapshot = await getDocs(q);
  const data: Array<Omit<AudioEditorTrack, 'src'>> = [];
  querySnapshot.forEach(doc => {
    const parsedDoc = { id: doc.id, ...(doc.data() as TrackDto) };
    parsedDoc.playlines = parsedDoc.playlines.map((playline: Array<StoreSample>) => {
      return [...Object.values(playline)];
    });
    data.push(parsedDoc);
  });

  //@ts-expect-error unknown problem with types
  const resolvedData: Array<AudioEditorTrack> = await Promise.all(
    data.map(async track => {
      const resolvedPlaylines = await Promise.all(
        track.playlines.map(async playline => {
          const resolvedSamples = await Promise.all(
            playline.map(async sample => {
              const src = await getMusicFileSrc(sample.name, 'sample');
              const newSample = { ...sample, src };

              return newSample;
            }),
          );
          return resolvedSamples;
        }),
      );

      return { ...track, playlines: resolvedPlaylines };
    }),
  );

  return resolvedData;
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
  } else if (ownerUid && ownerUid.length > 0) {
    q = query(coll, where('ownerUid', '==', ownerUid));
  } else {
    q = query(coll);
  }

  if (q === null) return;

  const querySnapshot = await getDocs(q);
  const data: Array<TrackDto> = [];
  querySnapshot.forEach(doc => {
    data.push({ name: doc.id, ...(doc.data() as Omit<TrackDto, 'name'>) });
  });

  const extendedData: Array<TrackExtendedDto> = await Promise.all(
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
  previousName,
  isEditingAnotherUsersTrack,
}: {
  name: string;
  previousName?: string;
  file: File | null;
  volumes: Array<Volume>;
  mode: (typeof EXISTING_TRACK_OPTIONS)[keyof typeof EXISTING_TRACK_OPTIONS];
  playlines: Array<Array<Sample>>;
  equalizers: Array<EqualizerType>;
  tags: Array<string>;
  visibility: (typeof PUBLISH_VISIBILITY)[keyof typeof PUBLISH_VISIBILITY];
  description: string;
  isEditingAnotherUsersTrack: boolean;
}): Promise<{ status: (typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS]; message: string }> {
  const currentUserUid = auth.currentUser?.uid;
  let q;

  if (previousName) {
    q = query(collection(db, 'tracks'), where('name', '==', previousName));
  } else {
    q = query(collection(db, 'tracks'), where('name', '==', name));
  }

  const querySnapshot = await getDocs(q);
  const existingTrack =
    querySnapshot.docs.length === 1 ? (querySnapshot.docs[0].data() as TrackDto) : null;

  if (existingTrack && mode === EXISTING_TRACK_OPTIONS.CREATE && !isEditingAnotherUsersTrack) {
    return {
      status: SNACKBAR_STATUS.ERROR,
      message: STORE_ERRORS.TRACK_EXISTS,
    };
  }

  const trackRef = doc(db, 'tracks', name);

  const parsedPlaylines = playlines.map(playline => {
    const parsedPlayline: { [k: number]: Omit<StoreSample, 'src'> } = {};
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

  const editingUsersIds = existingTrack ? existingTrack.editingUsersIds : [currentUserUid];
  const isNewTrack = editingUsersIds.length === 1 && editingUsersIds[0] === currentUserUid;
  const isEditingOwnTrack = editingUsersIds[editingUsersIds.length - 1] === currentUserUid;

  await setDoc(trackRef, {
    name,
    ownerUid: currentUserUid,
    playlines: parsedPlaylines,
    tags,
    visibility,
    description,
    date: Timestamp.fromDate(new Date()),
    image: file ? file.name : null,
    editingUsersIds: isNewTrack ? [currentUserUid] : [...editingUsersIds, currentUserUid],
  });

  if (!isNewTrack && !isEditingOwnTrack) {
    const newNotification = {
      title: 'Track used',
      description: `Track ${previousName} has been used in a new track '${name}'! Check it out!`,
      isRead: false,
      type: NOTIFICATION_TYPES.EDITED_TRACK,
      ownerUid: editingUsersIds[editingUsersIds.length - 1],
    };

    await addDoc(collection(db, 'notifications'), newNotification);
  }

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

export async function getNotifications() {
  const ownerUid = auth.currentUser?.uid;
  const q = query(collection(db, 'notifications'), where('ownerUid', '==', ownerUid));
  const querySnapshot = await getDocs(q);
  const data: Array<NotificationDto> = [];
  querySnapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() } as NotificationDto);
  });

  return data;
}

export async function setNotificationAsRead({ id }: { id: string }) {
  const notificationRef = doc(db, 'notifications', id);
  await updateDoc(notificationRef, { isRead: true });

  return {
    status: SNACKBAR_STATUS.SUCCESS,
    message: 'Notification marked as read!',
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

export async function deletePlaylist({ name }: Pick<PlaylistDto, 'name'>) {
  const playlistRef = doc(db, 'playlists', name);
  await deleteDoc(playlistRef);

  return {
    status: SNACKBAR_STATUS.SUCCESS,
    message: 'Playlist successfully deleted!',
  };
}

export async function deleteTrack({ name }: Pick<TrackDto, 'name'>) {
  const trackRef = doc(db, 'tracks', name);

  await deleteDoc(trackRef);

  const col = collection(db, 'playlists');
  const q = query(col, where('trackNames', 'array-contains', name));
  const querySnapshot = await getDocs(q);

  const playlists = querySnapshot.docs.map(doc => doc.data() as PlaylistDto);

  await Promise.all(
    playlists.map(async playlist => {
      const newTrackNames = playlist.trackNames.filter(trackName => trackName !== name);
      const playlistRef = doc(db, 'playlists', playlist.name);
      await updateDoc(playlistRef, { trackNames: newTrackNames });
    }),
  );

  return {
    status: SNACKBAR_STATUS.SUCCESS,
    message: 'Track successfully deleted!',
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

  return extendedData as Array<PlaylistExtendedDto>;
}

export async function getFirestoreUser({ uid }: { uid: string }) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const user = { uid: docSnap.id, ...docSnap.data() } as FirestoreUserExtended;

    if (!user.imagePath) return user;

    const imagePath = await getImagePath(user.imagePath);
    user.imagePath = imagePath;

    return user;
  } else {
    return null;
  }
}

export async function setFirestoreUserDescription({
  uid,
  description,
}: {
  description: string;
  uid?: string;
}) {
  const resolvedUid = uid ?? auth.currentUser?.uid;

  if (!resolvedUid) return { status: SNACKBAR_STATUS.ERROR, message: 'No user id provided!' };

  const userRef = doc(db, 'users', resolvedUid);
  await updateDoc(userRef, { description });

  return {
    status: SNACKBAR_STATUS.SUCCESS,
    message: 'Description successfully saved!',
  };
}

export async function setFirestoreUserImage({
  uid,
  file,
}: {
  file: File;
  uid?: string;
}): Promise<{ status: (typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS]; message: string }> {
  const resolvedUid = uid ?? auth.currentUser?.uid;

  if (!resolvedUid) return { status: SNACKBAR_STATUS.ERROR, message: 'No user id provided!' };

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

  const userRef = doc(db, 'users', resolvedUid);
  await updateDoc(userRef, { imagePath: file.name });

  return {
    status: SNACKBAR_STATUS.SUCCESS,
    message: 'Image successfully saved!',
  };
}

export async function getComments() {
  const q = query(collection(db, 'comments'));
  const querySnapshot = await getDocs(q);
  const data: Array<CommentDto> = [];
  querySnapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() } as CommentDto);
  });

  return data;
}

export async function addComment({
  trackName,
  text,
}: Pick<CommentDto, 'text' | 'trackName'>): Promise<{
  status: (typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS];
  message: string;
}> {
  const currentUserUid = auth.currentUser?.uid;
  const newComment = {
    trackName,
    text,
    ownerUid: currentUserUid,
    date: Timestamp.fromDate(new Date()),
  };

  await addDoc(collection(db, 'comments'), newComment);

  return {
    status: SNACKBAR_STATUS.SUCCESS,
    message: 'Comment successfully added!',
  };
}

import {
  createUserWithEmailAndPassword,
  AuthError,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  updateProfile,
  User,
} from 'firebase/auth';
import { AUTH_STATUSES } from './AuthProvider.constants';
import { firebaseApp } from '../../firebase';
import { Firestore, collection, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { db } from '../StoreProvider/StoreProvider.helpers';
import { FirestoreUser, FirestoreUserExtended } from './AuthProvider.types';

export const auth = getAuth(firebaseApp);

export async function createUserUsingEmailAndPassword({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<{ status: (typeof AUTH_STATUSES)[keyof typeof AUTH_STATUSES]; message?: string }> {
  const result = await createUserWithEmailAndPassword(auth, email, password)
    .then(async () => {
      await updateProfile(auth.currentUser as User, { displayName: username });
    })
    .then(async () => {
      if (!auth.currentUser) {
        throw new Error('No current user!');
      }

      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: username,
        identifier: auth.currentUser?.email,
      });
    })
    .then(() => {
      return { status: AUTH_STATUSES.SIGNED_UP, message: 'You account has been created!' };
    })
    .catch((error: AuthError) => {
      const errorMessage = error.message;

      return { status: AUTH_STATUSES.SIGN_UP_FAILURE, message: errorMessage };
    });

  return result;
}

export async function signInUsingEmailAndPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const result = await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      return { status: AUTH_STATUSES.SIGNED_IN, message: 'You have logged in!' };
    })
    .catch((error: AuthError) => {
      const errorMessage = error.message;

      return { status: AUTH_STATUSES.SIGN_IN_FAILURE, message: errorMessage };
    });
  return result;
}

export async function signOutUser() {
  const result = await signOut(auth)
    .then(() => {
      return { status: AUTH_STATUSES.SIGNED_OUT, message: 'You have signed out!' };
    })
    .catch((error: AuthError) => {
      const errorMessage = error.message;

      return { status: AUTH_STATUSES.SIGN_OUT_FAILURE, message: errorMessage };
    });

  return result;
}

export async function getUserDisplayName(ownerUid: string) {
  const userDoc = await getDoc(doc(db, 'users', ownerUid));
  const user = userDoc.data() as User;

  return user?.displayName;
}

export async function getAllUsers() {
  const col = collection(db, 'users');
  const q = query(col);
  const querySnapshot = await getDocs(q);

  const users: Array<FirestoreUserExtended> = [];
  querySnapshot.forEach(doc => {
    users.push({ ...doc.data(), uid: doc.id } as FirestoreUserExtended);
  });

  return users;
}

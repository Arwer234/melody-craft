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
    .then(() => {
      return { status: AUTH_STATUSES.SIGNED_UP, message: 'You account has been created!' };
    })
    .catch((error: AuthError) => {
      const errorMessage = error.message;

      return { status: AUTH_STATUSES.SIGN_UP_FAILURE, message: errorMessage };
    });
  console.log(auth.currentUser);

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

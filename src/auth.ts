import {
  getAuth,
  createUserWithEmailAndPassword,
  AuthError,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseApp } from './firebase';

const STATUSES = {
  SIGNED_UP: 'signed_up',
  SIGNED_IN: 'signed_in',
  SIGN_IN_FAILURE: 'sign_in_failure',
  SIGN_UP_FAILURE: 'sign_up_failure',
  ERROR: 'error',
} as const;

const auth = getAuth(firebaseApp);

export async function createUserUsingEmailAndPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ status: (typeof STATUSES)[keyof typeof STATUSES]; message?: string }> {
  const result = await createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;

      return { status: STATUSES.SIGNED_UP, message: 'You account has been created!' };
    })
    .catch((error: AuthError) => {
      const errorMessage = error.message;

      return { status: STATUSES.SIGN_UP_FAILURE, message: errorMessage };
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
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      // ...
      return { status: STATUSES.SIGNED_IN, message: 'You have logged in!' };
    })
    .catch((error: AuthError) => {
      const errorMessage = error.message;

      return { status: STATUSES.SIGN_IN_FAILURE, message: errorMessage };
    });
  return result;
}

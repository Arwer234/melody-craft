import { Timestamp } from 'firebase/firestore';

export type FirestoreUser = {
  displayName: string;
  identifier: string;
  signUpDate: Timestamp;
  imagePath: string | null;
  description: string | null;
};

export type FirestoreUserExtended = FirestoreUser & {
  uid: string;
};

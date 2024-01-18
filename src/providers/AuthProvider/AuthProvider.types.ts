export type FirestoreUser = {
  displayName: string;
  identifier: string;
};

export type FirestoreUserExtended = FirestoreUser & {
  uid: string;
};

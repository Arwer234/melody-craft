import React, { createContext, useState } from 'react';
import { UserInfo, onAuthStateChanged } from 'firebase/auth';
import { auth } from './AuthProvider.helpers';
import Loading from '../../pages/Loading/Loading';

export const AuthContext = createContext<{
  userInfo?: UserInfo;
  setUserInfo?: (userInfo?: UserInfo) => void;
}>({ setUserInfo: undefined });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [isAuthReady, setIsAuthReady] = useState(false);

  onAuthStateChanged(auth, user => {
    setUserInfo(user ?? undefined);
    setIsAuthReady(true);
  });

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {isAuthReady ? children : <Loading />}
    </AuthContext.Provider>
  );
}

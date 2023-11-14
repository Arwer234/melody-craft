import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

export default function useAuth() {
  const { userInfo } = useContext(AuthContext);

  return { isUserSignedIn: !!userInfo?.uid, userInfo };
}

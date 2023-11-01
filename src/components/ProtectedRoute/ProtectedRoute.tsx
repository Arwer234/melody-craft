import { Navigate } from 'react-router-dom';
import { ProtectedRouteProps } from './ProtectedRoute.types';
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

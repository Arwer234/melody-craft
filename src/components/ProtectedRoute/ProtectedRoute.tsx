import { Navigate } from 'react-router-dom';
import { ProtectedRouteProps } from './ProtectedRoute.types';

export const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

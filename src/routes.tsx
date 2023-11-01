import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './pages/Layout/Layout';
import { NotFound } from './pages/NotFound/NotFound';
import { SignIn } from './pages/SignIn/SignIn';
import { SignUp } from './pages/SignUp/SignUp';
import { Home } from './pages/Home/Home';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

export const ROUTE_PATHS = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  NOT_FOUND: 'not-found',
  HOME: '',
};

export const publicRoutes = [
  {
    path: ROUTE_PATHS.SIGN_IN,
    element: <SignIn />,
  },
  {
    path: ROUTE_PATHS.SIGN_UP,
    element: <SignUp />,
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    element: <NotFound />,
  },
];

export const privateRoutes = [
  {
    path: ROUTE_PATHS.HOME,
    element: <Home />,
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      ...publicRoutes,
      ...privateRoutes.map(route => {
        return {
          path: route.path,
          element: <ProtectedRoute>{route.element}</ProtectedRoute>,
        };
      }),
    ],
    errorElement: <NotFound />,
  },
]);

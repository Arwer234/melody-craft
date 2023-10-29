import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './pages/Layout/Layout';
import { NotFound } from './pages/NotFound/NotFound';
import { SignIn } from './pages/SignIn/SignIn';
import { SignUp } from './pages/SignUp/SignUp';
import { Home } from './pages/Home/Home';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import NotSignedIn from './pages/NotSignedIn/NotSignedIn';

export const publicRoutes = [
  {
    path: 'sign-in',
    element: <SignIn />,
  },
  {
    path: 'sign-up',
    element: <SignUp />,
  },
  {
    path: 'not-found',
    element: <NotFound />,
  },
  {
    path: 'not-signed-in',
    element: <NotSignedIn />,
  },
];

const privateRoutes = [
  {
    path: '',
    element: <Home />,
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    //loader: rootLoader,
    children: [
      ...publicRoutes,
      ...privateRoutes.map(route => {
        return {
          path: route.path,
          element: <ProtectedRoute user="a">{route.element}</ProtectedRoute>,
        };
      }),
    ],
    errorElement: <NotFound />,
  },
]);

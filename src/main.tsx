import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './pages/Layout/Layout.css';
import { SnackbarProvider } from './providers/SnackbarProvider/SnackbarProvider';
import { AuthProvider } from './providers/AuthProvider/AuthProvider';
import Spinner from './components/Spinner/Spinner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SnackbarProvider>
        <RouterProvider router={router} fallbackElement={<Spinner />} />
      </SnackbarProvider>
    </AuthProvider>
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './pages/Layout/Layout.css';
import { UIProvider } from './providers/UIProvider/UIProvider';
import { AuthProvider } from './providers/AuthProvider/AuthProvider';
import Spinner from './components/Spinner/Spinner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UIProvider>
        <RouterProvider router={router} fallbackElement={<Spinner />} />
      </UIProvider>
    </AuthProvider>
  </React.StrictMode>,
);

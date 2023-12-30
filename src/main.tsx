import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './pages/Layout/Layout.css';
import { UIProvider } from './providers/UIProvider/UIProvider';
import { AuthProvider } from './providers/AuthProvider/AuthProvider';
import { StoreProvider } from './providers/StoreProvider/StoreProvider';
import Spinner from './components/Spinner/Spinner';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <UIProvider>
            <RouterProvider router={router} fallbackElement={<Spinner />} />
          </UIProvider>
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

import App from './App.tsx';
import { StoreProvider } from './state/store.tsx';

import './index.css';

const theme = createTheme({
  primaryColor: 'cyan',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </StoreProvider>
  </StrictMode>
);

import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/auth';
import { UnityProvider } from './unity/UnityInterface';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UnityProvider>
          <App />
        </UnityProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
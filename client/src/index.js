import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <GoogleOAuthProvider clientId="271402149128-crm27sfor9d4ib3occ7134fdr2a97r2b.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
);

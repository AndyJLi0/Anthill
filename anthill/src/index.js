import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { EmailProvider } from './Components/EmailContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <EmailProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </EmailProvider>

);

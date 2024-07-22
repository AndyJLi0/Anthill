import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EmailProvider } from './Components/EmailContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <EmailProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </EmailProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

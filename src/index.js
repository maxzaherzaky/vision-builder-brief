import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your main CSS import
import App from './App'; // Your App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you have web-vitals or reportWebVitals, you can add it here if needed:
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();
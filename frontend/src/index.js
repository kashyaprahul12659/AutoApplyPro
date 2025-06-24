import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkWrapper } from './components/auth/ClerkWrapper';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ThemeProvider>
          <ClerkWrapper>
            <App />
            <ToastContainer position="top-right" autoClose={3000} />
          </ClerkWrapper>
        </ThemeProvider>
      </Router>
    </HelmetProvider>
  </React.StrictMode>
);

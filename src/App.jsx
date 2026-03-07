import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ui/ScrollToTop';
import ErrorBoundary from './components/ui/ErrorBoundary';
import AppRouter from './router';

/**
 * Main Application Component
 * Wraps the app with AuthProvider and sets up routing
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

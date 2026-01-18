import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

/**
 * Main Application Component
 * Uses React Router for navigation between pages
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;


import React from 'react';

/**
 * AuthLayout - Minimal layout wrapper for authentication pages
 * The Login/Register pages now have their own split-card design
 * This wrapper just provides the full-screen background
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      {children}
    </div>
  );
}


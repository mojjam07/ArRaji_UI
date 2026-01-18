import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AuthLayout - Layout wrapper for authentication pages (Login, Register, Forgot Password)
 * This layout doesn't include the sidebar/navbar, just a clean centered auth form
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand at top */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-primary-100 mb-4 hover:bg-primary-200 transition-colors cursor-pointer">
            <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </Link>
        </div>

        {/* Auth Content */}
        {children}
      </div>
    </div>
  );
}


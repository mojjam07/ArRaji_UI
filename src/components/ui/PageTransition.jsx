import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition - A loading overlay with logo bounce animation
 * Displays during page transitions for ~3 seconds
 */
const PageTransition = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const [displayLoader, setDisplayLoader] = useState(false);
  const timeoutRef = useRef(null);

  // Trigger loader on route change
  useEffect(() => {
    // Show loader immediately
    setDisplayLoader(true);
    
    // Small delay to trigger animation
    const showTimer = setTimeout(() => {
      setShowLoader(true);
    }, 10);

    // Auto-hide after 3 seconds
    const hideTimer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    timeoutRef.current = hideTimer;

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [location]);

  // Remove from DOM after fade out
  useEffect(() => {
    if (!showLoader) {
      const removeTimer = setTimeout(() => {
        setDisplayLoader(false);
      }, 300);
      return () => clearTimeout(removeTimer);
    }
  }, [showLoader]);

  if (!displayLoader) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm
        transition-opacity duration-300 ease-in-out
        ${showLoader ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="flex flex-col items-center">
        {/* Logo with bounce animation */}
        <img
          src="/arraji_logo.png"
          alt="ArRaji Logo"
          className="h-20 w-auto animate-logo-bounce"
        />
        <p className="mt-4 text-lg font-medium text-neutral-600 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default PageTransition;


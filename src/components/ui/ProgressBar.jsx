import React from 'react';

const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label = '',
  striped = false,
  animated = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-secondary-500',
    warning: 'bg-yellow-500',
    error: 'bg-accent-600',
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-neutral-700">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-neutral-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`
            ${variants[variant]} ${sizes[size]}
            rounded-full transition-all duration-300 ease-out
            ${striped ? 'bg-repeat-space' : ''}
            ${animated ? 'animate-stripes' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;


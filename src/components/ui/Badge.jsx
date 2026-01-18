import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = '',
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    success: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-accent-100 text-accent-700 border-accent-200',
    info: 'bg-primary-100 text-primary-700 border-primary-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const dotColors = {
    default: 'bg-neutral-400',
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-secondary-500',
    warning: 'bg-yellow-500',
    error: 'bg-accent-500',
    info: 'bg-primary-500',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 focus:outline-none"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3.172 3.172a.5.5 0 01.707 0L6 5.293l2.121-2.121a.5.5 0 11.707.707L6.707 6l2.121 2.121a.5.5 0 01-.707.707L6 6.707 3.879 8.828a.5.5 0 01-.707-.707L5.293 6 3.172 3.879a.5.5 0 010-.707z" />
          </svg>
        </button>
      )}
    </span>
  );
};

// Pre-configured badge variants for common use cases
Badge.Pending = ({ children, ...props }) => (
  <Badge variant="warning" dot {...props}>{children || 'Pending'}</Badge>
);

Badge.Approved = ({ children, ...props }) => (
  <Badge variant="success" dot {...props}>{children || 'Approved'}</Badge>
);

Badge.Rejected = ({ children, ...props }) => (
  <Badge variant="error" dot {...props}>{children || 'Rejected'}</Badge>
);

Badge.Active = ({ children, ...props }) => (
  <Badge variant="primary" dot {...props}>{children || 'Active'}</Badge>
);

Badge.Inactive = ({ children, ...props }) => (
  <Badge variant="default" dot {...props}>{children || 'Inactive'}</Badge>
);

export default Badge;


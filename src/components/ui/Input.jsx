import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  leftIcon = null,
  rightIcon = null,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const inputWrapperClasses = `
    relative
    ${fullWidth ? 'w-full' : ''}
  `;

  const inputClasses = `
    w-full px-4 py-2.5 rounded-lg
    bg-white text-neutral-900 placeholder-neutral-400
    border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-neutral-100 disabled:cursor-not-allowed
    ${error
      ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
      : 'border-neutral-300 focus:border-primary-800 focus:ring-primary-500/20'
    }
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {props.required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}
      <div className={inputWrapperClasses}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-accent-600' : 'text-neutral-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;


import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  fullWidth = true,
  placeholder = 'Select an option',
  className = '',
  ...props
}, ref) => {
  const selectClasses = `
    w-full px-4 py-2.5 rounded-lg
    bg-white text-neutral-900
    border transition-all duration-200
    appearance-none cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-neutral-100 disabled:cursor-not-allowed
    ${error
      ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20'
    }
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
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-accent-600' : 'text-neutral-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;


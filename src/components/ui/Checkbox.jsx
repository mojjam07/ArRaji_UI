import React, { forwardRef } from 'react';

const Checkbox = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  const checkboxWrapperClasses = `
    flex items-start gap-3
    ${className}
  `;

  const checkboxClasses = `
    h-5 w-5 rounded border-2
    text-primary-600 focus:ring-2 focus:ring-primary-500/20
    transition-all duration-200
    cursor-pointer
    ${error
      ? 'border-accent-500 focus:border-accent-500'
      : 'border-neutral-300 focus:border-primary-500'
    }
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className={checkboxWrapperClasses}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          className={checkboxClasses}
          {...props}
        />
      </div>
      {label && (
        <div className="text-sm">
          <label
            htmlFor={props.id}
            className={`
              cursor-pointer
              ${error ? 'text-accent-600' : 'text-neutral-700'}
            `}
          >
            {label}
          </label>
          {props.helperText && (
            <p className="text-neutral-500 mt-0.5">{props.helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;


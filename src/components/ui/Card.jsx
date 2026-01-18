import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = true,
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-neutral-200
        ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''}
        ${padding ? 'p-0' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-b border-neutral-200 bg-neutral-50 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
};

const CardBody = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({
  children,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-t border-neutral-200 bg-neutral-50 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;


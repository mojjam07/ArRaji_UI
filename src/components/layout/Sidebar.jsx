import React from 'react';

const Sidebar = ({
  isOpen,
  onClose,
  items = [],
  logo,
  user,
  activeItem,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-64 bg-white border-r border-neutral-200
          transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {items.map((item, index) => {
              if (item.separator) {
                return (
                  <hr key={index} className="my-3 border-neutral-200" />
                );
              }

              const isActive = activeItem === item.id || item.active;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }
                  `}
                >
                  {item.icon && (
                    <span className="flex-shrink-0 h-5 w-5">
                      {item.icon}
                    </span>
                  )}
                  {item.badge && (
                    <span className={`
                      ml-auto px-2 py-0.5 text-xs font-medium rounded-full
                      ${isActive
                        ? 'bg-primary-200 text-primary-800'
                        : 'bg-neutral-200 text-neutral-700'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                  {!item.badge && <span className="flex-1">{item.name}</span>}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          {user && (
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary-700">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


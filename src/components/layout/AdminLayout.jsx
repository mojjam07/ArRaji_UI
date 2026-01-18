import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Admin sidebar items
  const adminSidebarItems = [
    {
      id: 'admin-dashboard',
      name: 'Dashboard',
      href: '/admin',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'application-review',
      name: 'Application Review',
      href: '/admin/review',
      badge: '12',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'user-management',
      name: 'User Management',
      href: '/admin/users',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    { separator: true },
    {
      id: 'reports',
      name: 'Reports & Analytics',
      href: '/admin/reports',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      name: 'Settings',
      href: '/admin/settings',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    { separator: true },
    {
      id: 'back-to-user',
      name: '← Back to User View',
      href: '/',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
      ),
    },
  ];

  // Default logo
  const defaultLogo = (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <span className="text-lg font-bold text-neutral-900">ArRaji Admin</span>
    </div>
  );

  // Default user
  const defaultUser = {
    name: 'John Doe',
    role: 'Administrator',
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen
          w-64 bg-white border-r border-neutral-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
            {defaultLogo}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {adminSidebarItems.map((item, index) => {
              if (item.separator) {
                return <hr key={index} className="my-3 border-neutral-200" />;
              }
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <span className="flex-shrink-0 h-5 w-5">{item.icon}</span>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-200 text-neutral-700">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-700">
                  {defaultUser.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 truncate">{defaultUser.name}</p>
                <p className="text-xs text-neutral-500 truncate">{defaultUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content wrapper */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top bar with toggle button */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 lg:px-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


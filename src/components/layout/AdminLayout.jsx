import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const confirmLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);

  const adminSidebarItems = [
    { id: 'admin-dashboard', name: 'Dashboard', href: '/admin', icon: <DashboardIcon /> },
    { id: 'application-review', name: 'Application Review', href: '/admin/review', badge: '12', icon: <ReviewIcon /> },
    { id: 'document-management', name: 'Documents', href: '/admin/documents', icon: <DocumentIcon /> },
    { id: 'passport-management', name: 'Passport Tracking', href: '/admin/passport', badge: '5', icon: <PassportIcon /> },
    { id: 'user-management', name: 'User Management', href: '/admin/users', icon: <UserIcon /> },
    { separator: true },
    { id: 'reports', name: 'Reports & Analytics', href: '/admin/reports', icon: <ReportsIcon /> },
    { id: 'settings', name: 'Settings', href: '/admin/settings', icon: <SettingsIcon /> },
    { separator: true },
    { id: 'back-to-user', name: 'Back to User View', href: '/', icon: <BackIcon /> },
  ];

  const defaultLogo = (
    <div className="flex items-center gap-2">
      <img src="/arraji_logo_.png" alt="ArRaji Logo" className="h-12 w-auto" />
      <span className="text-lg font-bold text-primary-900">ArRaji Admin</span>
    </div>
  );

  const defaultUser = { name: 'Raji Adeyanju', role: 'Administrator' };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
            {defaultLogo}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100">
              <CloseIcon />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {adminSidebarItems.map((item, index) => {
              if (item.separator) return <hr key={index} className="my-3 border-neutral-200" />;
              return (
                <NavLink
                  key={item.id}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`
                  }
                >
                  <span className="flex-shrink-0 h-5 w-5">{item.icon}</span>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-200 text-primary-900">{item.badge}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-900">{defaultUser.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 truncate">{defaultUser.name}</p>
                <p className="text-xs text-neutral-500 truncate">{defaultUser.role}</p>
              </div>
            </div>
            <button
              onClick={confirmLogout}
              className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
            >
              <LogoutIcon /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar backdrop */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 lg:px-6 justify-between">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100">
            <MenuIcon />
          </button>
          <img src="/Company_nams.png" alt="Company Name" className="h-8 w-auto" />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && <LogoutModal onCancel={cancelLogout} onConfirm={handleLogout} isLoggingOut={isLoggingOut} />}
    </div>
  );
};

export default AdminLayout;
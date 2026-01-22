import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api';
import { Card, Badge, ProgressBar, Button, Alert } from '../../components';

/**
 * User Dashboard Page - Personal User View
 * Integrated with backend API for real data
 * With comprehensive error handling and retry logic
 */
export default function UserDashboard() {
  const { user, fullName, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [stats, setStats] = useState({
    totalApplications: 0,
    draftApplications: 0,
    submittedApplications: 0,
    pendingPayments: 0,
    issuedApplications: 0,
  });
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  useEffect(() => {
    // Only fetch dashboard data if user is authenticated
    if (!authLoading) {
      if (isAuthenticated && user) {
        console.log('📊 Dashboard: User authenticated, fetching data...');
        fetchDashboardData();
      } else {
        console.log('📊 Dashboard: User not authenticated, skipping fetch');
        // Set empty stats for unauthenticated state
        setIsLoading(false);
        setConnectionStatus('unauthenticated');
      }
    } else {
      console.log('📊 Dashboard: Auth still loading, waiting...');
    }
  }, [authLoading, isAuthenticated, user]);

  const fetchDashboardData = async (retry = false) => {
    if (retry) {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
    } else {
      setIsLoading(true);
      setError(null);
      setConnectionStatus('connecting');
    }

    const maxRetries = 3;
    const currentAttempt = retry ? retryCount + 1 : 1;

    console.log(`📊 Dashboard: Fetching data (attempt ${currentAttempt}/${maxRetries})...`);

    try {
      // Check if API is reachable first with a simple test
      console.log('📊 Dashboard: Testing API connection...');
      const testResponse = await fetch('http://localhost:5000/api/test');
      if (testResponse.ok) {
        setConnectionStatus('connected');
        console.log('📊 Dashboard: ✅ API connection successful');
      }
    } catch (connError) {
      console.warn('📊 Dashboard: ⚠️ API connection test failed:', connError.message);
      setConnectionStatus('disconnected');
    }

    try {
      // Fetch dashboard data from API
      console.log('📊 Dashboard: Calling userAPI.getDashboard()...');
      const response = await userAPI.getDashboard();
      
      console.log('📊 Dashboard: API response received:', response);
      
      if (response.success && response.data) {
        const { statistics, recentApplications, notifications: notifs } = response.data;
        
        setStats({
          totalApplications: statistics?.totalApplications || 0,
          draftApplications: statistics?.draftApplications || 0,
          submittedApplications: statistics?.submittedApplications || 0,
          pendingPayments: statistics?.pendingPayments || 0,
          issuedApplications: statistics?.issuedApplications || 0,
        });
        
        setApplications(recentApplications || []);
        setNotifications(notifs?.recent || []);
        
        console.log('📊 Dashboard: ✅ Dashboard data loaded successfully');
        setError(null);
      } else {
        throw new Error(response.message || 'Invalid response from server');
      }
    } catch (err) {
      console.error('📊 Dashboard: ❌ Failed to fetch dashboard data:', err);
      console.error('📊 Dashboard: Error details:', {
        message: err.message,
        status: err.status,
        response: err.response?.data
      });
      
      // Determine if we should retry
      const isRetryable = err.status === 0 || err.status >= 500 || err.message.includes('Network');
      
      if (isRetryable && currentAttempt < maxRetries) {
        console.log(`📊 Dashboard: Will retry in 2 seconds... (${currentAttempt}/${maxRetries})`);
        setTimeout(() => {
          fetchDashboardData(true);
        }, 2000);
        return;
      }
      
      // Provide more detailed error message
      let errorMessage = 'Failed to load dashboard data.';
      
      if (err.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.status === 403) {
        errorMessage = 'You do not have permission to view this data.';
      } else if (err.status === 404) {
        errorMessage = 'Dashboard endpoint not found. Please contact support.';
      } else if (err.status >= 500) {
        errorMessage = 'Server error. Please try again later or contact support.';
      } else if (err.status === 0 || err.message.includes('Network')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection and ensure the backend is running.';
      }
      
      setError(errorMessage);
      setConnectionStatus('error');
      
      // Use mock data on error for demo
      console.log('📊 Dashboard: Using demo data fallback');
      setStats({
        totalApplications: 12,
        draftApplications: 2,
        submittedApplications: 5,
        pendingPayments: 1,
        issuedApplications: 7,
      });
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  const handleRetry = () => {
    console.log('📊 Dashboard: Manual retry requested');
    setRetryCount(0);
    fetchDashboardData();
  };

  // Mock stats for display if loading or fallback
  const displayStats = isLoading ? [
    { title: 'My Visa Applications', value: stats.totalApplications || '...', change: '-', positive: true, icon: '📋', color: 'primary' },
    { title: 'In Progress Visas', value: stats.submittedApplications || '...', change: '-', positive: true, icon: '🔄', color: 'info' },
    { title: 'Completed Visas', value: stats.completedApplications || '...', change: '-', positive: true, icon: '✅', color: 'success' },
    { title: 'Draft Applications', value: stats.draftApplications || '...', change: '-', positive: true, icon: '📝', color: 'warning' },
  ] : [
    { title: 'My Visa Applications', value: stats.totalApplications, change: '+3', positive: true, icon: '📋', color: 'primary' },
    { title: 'In Progress Visas', value: stats.submittedApplications, change: '-2', positive: true, icon: '🔄', color: 'info' },
    { title: 'Completed Visas', value: stats.completedApplications, change: '+1', positive: true, icon: '✅', color: 'success' },
    { title: 'Draft Applications', value: stats.draftApplications, change: '0', positive: true, icon: '📝', color: 'warning' },
  ];

  // Mock applications for display
  const displayApplications = applications.length > 0 ? applications : [
    { id: 'VISA-001', visaType: 'Tourist Visa - UAE', status: 'In Review', date: '2 days ago', progress: 75 },
    { id: 'VISA-002', visaType: 'Business Visa - UK', status: 'Approved', date: '1 week ago', progress: 100 },
    { id: 'VISA-003', visaType: 'Student Visa - Australia', status: 'Pending', date: '3 days ago', progress: 25 },
    { id: 'VISA-004', visaType: 'Work Visa - Canada', status: 'Draft', date: 'Today', progress: 10 },
  ];

  // Mock notifications for display
  const displayNotifications = notifications.length > 0 ? notifications : [
    { type: 'info', message: 'Your Tourist Visa - UAE application is under review', time: '2 hours ago' },
    { type: 'success', message: 'Business Visa - UK has been approved!', time: '1 day ago' },
    { type: 'warning', message: 'Please upload missing passport documents', time: '3 days ago' },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Approved': 'success',
      'Rejected': 'error',
      'Pending': 'warning',
      'In Review': 'primary',
      'Draft': 'default',
      'submitted': 'primary',
      'under_review': 'primary',
      'documents_requested': 'warning',
      'payment_pending': 'warning',
      'biometrics_scheduled': 'info',
      'completed': 'success',
      'rejected': 'error',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getStatIconBg = (color) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600',
      warning: 'bg-yellow-100 text-yellow-600',
      success: 'bg-secondary-100 text-secondary-600',
      info: 'bg-blue-100 text-blue-600',
    };
    return colors[color] || colors.primary;
  };

  // Get display name
  const displayName = fullName || user?.firstName || user?.email?.split('@')[0] || 'John';
  const nameParts = displayName.split(' ');
  const greetingName = nameParts[0];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
            <svg className="h-8 w-8 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Indicator */}
      {connectionStatus === 'disconnected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Connection Lost</p>
                <p className="text-sm text-red-600">Cannot connect to the server. Please check your connection.</p>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Retrying...
                </span>
              ) : (
                'Retry'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="error" title="Dashboard Error" onClose={() => setError(null)}>
          <div className="space-y-2">
            <p>{error}</p>
            {(error.includes('backend') || error.includes('server') || error.includes('expired')) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying}
                className="mt-2"
              >
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </Button>
            )}
          </div>
        </Alert>
      )}

      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back, {greetingName}!</h1>
          <p className="text-neutral-500 mt-1">Here's an overview of your visa applications</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          onClick={() => navigate('/user/applications')}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {displayStats.map((stat, index) => (
          <Card 
            key={index} 
            hover 
            className="relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              stat.color === 'primary' ? 'bg-primary-500' :
              stat.color === 'warning' ? 'bg-yellow-500' :
              stat.color === 'success' ? 'bg-secondary-500' : 'bg-blue-500'
            }`} />
            
            <Card.Body className="p-5 pl-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                  {stat.change !== '-' && (
                    <div className="mt-2 flex items-center">
                      <span className={`text-sm font-medium ${
                        stat.positive ? 'text-secondary-600' : 'text-accent-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-neutral-400 ml-1">new this month</span>
                    </div>
                  )}
                </div>
                <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${getStatIconBg(stat.color)}`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Applications */}
        <Card className="lg:col-span-2">
          <Card.Header
            title="My Visa Applications"
            subtitle="Track your visa application status"
            action={
              <button 
                onClick={() => navigate('/user/tracking')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                View all →
              </button>
            }
          />
          <Card.Body className="p-0">
            {isLoading ? (
              <div className="p-6 text-center">
                <svg className="h-8 w-8 text-neutral-300 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {displayApplications.map((app) => (
                  <div 
                    key={app.id} 
                    className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-all duration-150 hover:pl-8 cursor-pointer"
                    onClick={() => navigate('/user/tracking')}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                        <span className="text-sm font-semibold text-primary-700">
                          {app.visaType?.split(' ').slice(0, 2).map(n => n[0]).join('') || app.id?.substring(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{app.visaType || 'Visa Application'}</p>
                        <p className="text-sm text-neutral-500">{app.id} • {app.date || 'Recently'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="w-24">
                        <ProgressBar value={app.progress || 0} size="sm" variant={app.progress === 100 ? 'success' : 'primary'} />
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Notifications */}
        <Card>
          <Card.Header 
            title="Notifications" 
            subtitle="Recent updates"
            action={
              <button 
                onClick={() => navigate('/user/notifications')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                View all →
              </button>
            }
          />
          <Card.Body className="p-0">
            <div className="divide-y divide-neutral-100">
              {displayNotifications.map((notif, index) => (
                <div key={index} className="px-4 py-3 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      notif.type === 'success' ? 'bg-secondary-500' :
                      notif.type === 'warning' ? 'bg-yellow-500' : 
                      notif.type === 'error' ? 'bg-red-500' : 'bg-primary-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-700">{notif.message || notif.title}</p>
                      <p className="text-xs text-neutral-400 mt-1">{notif.time || notif.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              bgColor: 'bg-primary-50',
              iconColor: 'text-primary-600',
              title: 'New Visa Application',
              description: 'Start a new visa application',
              action: () => navigate('/user/applications'),
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              ),
              bgColor: 'bg-secondary-50',
              iconColor: 'text-secondary-600',
              title: 'Upload Documents',
              description: 'Upload required documents',
              action: () => navigate('/user/documents'),
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              ),
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600',
              title: 'Track Status',
              description: 'View application progress',
              action: () => navigate('/user/tracking'),
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              bgColor: 'bg-yellow-50',
              iconColor: 'text-yellow-600',
              title: 'Settings',
              description: 'Manage your account',
              action: () => navigate('/user/settings'),
            },
          ].map((action, index) => (
            <Card 
              key={index} 
              hover 
              className="cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              onClick={action.action}
            >
              <Card.Body className="flex items-center gap-4 p-5">
                <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${action.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                  <span className={action.iconColor}>{action.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">{action.title}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">{action.description}</p>
                </div>
                <svg className="h-5 w-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Help/Support Alert */}
      <Alert variant="info" title="Need Help?">
        Contact our support team if you have questions about your applications. We're here to help!
      </Alert>
    </div>
  );
}


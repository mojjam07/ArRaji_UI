import React, { useState, useEffect } from 'react';
import { Card, Badge, ProgressBar, Button, Select, Alert } from '../../components';
import { adminAPI } from '../../api';

/**
 * Admin Dashboard - System Administration View
 * Focuses on system-wide metrics, application review queue, and administrative actions
 * Integrated with backend API for real data
 */
export default function AdminDashboard() {
  // State for dashboard data
  const [stats, setStats] = useState([]);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [systemStats, setSystemStats] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  // Fetch dashboard data on mount and when timeRange changes
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch dashboard statistics
      const statsResponse = await adminAPI.getDashboardStats();
      if (statsResponse.success && statsResponse.data) {
        const data = statsResponse.data;
        setStats([
          { title: 'Total Applications', value: data.totalApplications?.toLocaleString() || '0', change: '+12%', positive: true, icon: '📋', color: 'primary' },
          { title: 'Pending Review', value: data.pendingApplications?.toString() || '0', change: '+5%', positive: false, icon: '⏳', color: 'warning' },
          { title: 'Active Users', value: data.activeUsers?.toLocaleString() || '0', change: '+8%', positive: true, icon: '👥', color: 'info' },
          { title: 'Avg. Processing', value: data.avgProcessingDays ? `${data.avgProcessingDays} days` : 'N/A', change: '-8%', positive: true, icon: '⚡', color: 'success' },
        ]);

        // Set system health metrics
        setSystemHealth([
          { name: 'Server Uptime', value: data.serverUptime || '99.9%', status: 'good', color: 'text-secondary-600' },
          { name: 'Response Time', value: data.responseTime || '120ms', status: 'good', color: 'text-secondary-600' },
          { name: 'Error Rate', value: data.errorRate || '0.1%', status: 'good', color: 'text-secondary-600' },
          { name: 'Storage Used', value: data.storageUsed || '68%', status: 'warning', color: 'text-yellow-600' },
        ]);

        // Set system stats
        setSystemStats([
          { name: 'Business Licenses', count: data.businessLicenses || 0, percentage: 37, color: 'primary' },
          { name: 'Permit Renewals', count: data.permitRenewals || 0, percentage: 25, color: 'secondary' },
          { name: 'New Registrations', count: data.newRegistrations || 0, percentage: 23, color: 'info' },
          { name: 'Document Updates', count: data.documentUpdates || 0, percentage: 15, color: 'warning' },
        ]);
      }

      // Fetch pending applications for review queue
      const applicationsResponse = await adminAPI.getApplications({ status: 'pending', limit: 10 });
      if (applicationsResponse.success && applicationsResponse.data) {
        const apps = applicationsResponse.data.applications || [];
        setReviewQueue(apps.map(app => ({
          id: app.id,
          applicant: app.fullName || `${app.firstName} ${app.lastName}`,
          type: app.visaType || app.applicationType || 'General',
          priority: app.priority || 'medium',
          submitted: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Recently',
          status: app.status,
        })));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Using demo data.');
      // Fallback to demo data
      setStats([
        { title: 'Total Applications', value: '1,234', change: '+12%', positive: true, icon: '📋', color: 'primary' },
        { title: 'Pending Review', value: '89', change: '+5%', positive: false, icon: '⏳', color: 'warning' },
        { title: 'Active Users', value: '456', change: '+8%', positive: true, icon: '👥', color: 'info' },
        { title: 'Avg. Processing', value: '2.3 days', change: '-8%', positive: true, icon: '⚡', color: 'success' },
      ]);
      setReviewQueue([
        { id: 'APP-2024-001', applicant: 'Ahmed Al-Rashid', type: 'Business License', priority: 'high', submitted: '2 hours ago' },
        { id: 'APP-2024-002', applicant: 'Sarah Johnson', type: 'Permit Renewal', priority: 'medium', submitted: '3 hours ago' },
        { id: 'APP-2024-003', applicant: 'Mohammed Ali', type: 'New Registration', priority: 'low', submitted: '4 hours ago' },
        { id: 'APP-2024-004', applicant: 'Fatima Hassan', type: 'Document Update', priority: 'high', submitted: '5 hours ago' },
      ]);
      setSystemStats([
        { name: 'Business Licenses', count: 456, percentage: 37, color: 'primary' },
        { name: 'Permit Renewals', count: 312, percentage: 25, color: 'secondary' },
        { name: 'New Registrations', count: 278, percentage: 23, color: 'info' },
        { name: 'Document Updates', count: 188, percentage: 15, color: 'warning' },
      ]);
      setSystemHealth([
        { name: 'Server Uptime', value: '99.9%', status: 'good', color: 'text-secondary-600' },
        { name: 'Response Time', value: '120ms', status: 'good', color: 'text-secondary-600' },
        { name: 'Error Rate', value: '0.1%', status: 'good', color: 'text-secondary-600' },
        { name: 'Storage Used', value: '68%', status: 'warning', color: 'text-yellow-600' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'error',
      medium: 'warning',
      low: 'default',
    };
    return <Badge variant={variants[priority] || 'default'}>{priority}</Badge>;
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
            <p className="text-neutral-500 mt-1">System overview and application management</p>
          </div>
        </div>
        <Card>
          <Card.Body className="text-center py-12">
            <svg className="h-8 w-8 text-neutral-300 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-neutral-500 mt-4">Loading dashboard data...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Admin focused */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="text-neutral-500 mt-1">System overview and application management</p>
        </div>
        <div className="flex items-center gap-3">
          <Select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'today', label: 'Today' }, 
              { value: 'week', label: 'This Week' }, 
              { value: 'month', label: 'This Month' }, 
              { value: 'all', label: 'All Time' }
            ]} 
            className="w-40"
          />
          <Button variant="primary" className="flex items-center shadow-sm hover:shadow-md transition-shadow">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="warning" title="Notice" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* System Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            hover 
            className="relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Gradient accent bar */}
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
                  <div className="mt-2 flex items-center">
                    <span className={`text-sm font-semibold ${
                      stat.positive ? 'text-secondary-600' : 'text-accent-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-neutral-400 ml-1">vs last period</span>
                  </div>
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
        {/* Review Queue - Admin specific */}
        <Card className="lg:col-span-2">
          <Card.Header 
            title="Review Queue" 
            subtitle="Applications requiring your attention" 
            action={
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                View all →
              </button>
            }
          />
          <Card.Body className="p-0">
            <div className="divide-y divide-neutral-100">
              {reviewQueue.map((app) => (
                <div 
                  key={app.id} 
                  className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-all duration-150 hover:pl-8 cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                      <span className="text-sm font-semibold text-primary-700">
                        {app.applicant.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{app.applicant}</p>
                      <p className="text-sm text-neutral-500">{app.type} • {app.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm text-neutral-400 font-medium">{app.submitted}</span>
                    {getPriorityBadge(app.priority)}
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="hover:shadow-md transition-shadow"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* System Health - Admin specific */}
        <Card>
          <Card.Header title="System Health" subtitle="Live metrics" />
          <Card.Body className="space-y-4">
            {systemHealth.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                <span className="text-sm text-neutral-600 font-medium">{metric.name}</span>
                <span className={`text-sm font-bold ${metric.color}`}>{metric.value}</span>
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>

      {/* Bottom Grid - Categories, Approval Rate, Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Application Categories */}
        <Card>
          <Card.Header title="Application Categories" subtitle="Distribution by type" />
          <Card.Body className="space-y-5">
            {systemStats.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm items-center">
                  <span className="font-medium text-neutral-700">{category.name}</span>
                  <span className="text-sm font-semibold text-neutral-600">{category.count}</span>
                </div>
                <ProgressBar 
                  value={category.percentage} 
                  size="md" 
                  className="h-2"
                  variant={
                    category.color === 'primary' ? 'primary' :
                    category.color === 'secondary' ? 'success' :
                    category.color === 'warning' ? 'warning' : 'primary'
                  }
                />
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Approval Rate - System metrics */}
        <Card>
          <Card.Header title="Approval Rate" subtitle="System-wide statistics" />
          <Card.Body className="flex flex-col items-center">
            <div className="relative">
              <svg className="h-32 w-32 transform -rotate-90">
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="none" 
                  className="text-neutral-100" 
                />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={`${85 * 3.52} 352`} 
                  className="text-secondary-500 transition-all duration-1000" 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-neutral-900">85%</p>
                  <p className="text-sm text-neutral-500">Approved</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 w-full">
              <div className="text-center p-4 rounded-xl bg-secondary-50 border border-secondary-100 transition-all duration-200 hover:shadow-md hover:bg-secondary-100">
                <p className="text-xl font-bold text-secondary-600">1,056</p>
                <p className="text-sm text-neutral-500">Approved</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-accent-50 border border-accent-100 transition-all duration-200 hover:shadow-md hover:bg-accent-100">
                <p className="text-xl font-bold text-accent-600">178</p>
                <p className="text-sm text-neutral-500">Rejected</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Admin Actions - Administrative tasks */}
        <Card>
          <Card.Header title="Admin Actions" subtitle="System management" />
          <Card.Body className="space-y-2 p-4">
            {[
              { label: 'Review Pending Applications', icon: '📋', count: reviewQueue.length, color: 'warning', action: '/admin/review' },
              { label: 'User Management', icon: '👥', count: null, color: 'default', action: '/admin/users' },
              { label: 'Generate Reports', icon: '📊', count: null, color: 'info', action: '/admin/reports' },
              { label: 'System Settings', icon: '⚙️', count: null, color: 'default', action: '/admin/settings' },
            ].map((action, index) => (
              <button 
                key={index} 
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 transition-all duration-200 text-left border border-transparent hover:border-neutral-200 hover:shadow-sm group"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">{action.icon}</span>
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">{action.label}</span>
                </span>
                {action.count !== null && (
                  <Badge variant={action.color} size="md" className="animate-pulse">
                    {action.count}
                  </Badge>
                )}
              </button>
            ))}
          </Card.Body>
        </Card>
      </div>

      {/* System Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">System Maintenance Scheduled</p>
            <p className="text-sm text-yellow-600">System maintenance is scheduled for Sunday at 2:00 AM. Review pending applications beforehand.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


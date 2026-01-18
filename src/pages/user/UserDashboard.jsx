import React from 'react';
import { Card, Badge, ProgressBar, Button, Alert } from '../../components';

/**
 * User Dashboard Page - Personal User View
 * Focuses on individual's applications, progress, and personal actions
 */
export default function UserDashboard() {
  // Personal stats for the user
  const stats = [
    { title: 'My Applications', value: '12', change: '+3', positive: true, icon: '📋', color: 'primary' },
    { title: 'In Progress', value: '5', change: '-2', positive: true, icon: '🔄', color: 'info' },
    { title: 'Completed', value: '7', change: '+1', positive: true, icon: '✅', color: 'success' },
    { title: 'Drafts', value: '2', change: '0', positive: true, icon: '📝', color: 'warning' },
  ];

  // User's personal applications
  const myApplications = [
    { id: 'APP-001', name: 'Business License Application', status: 'In Review', date: '2 days ago', progress: 75 },
    { id: 'APP-002', name: 'Permit Renewal', status: 'Approved', date: '1 week ago', progress: 100 },
    { id: 'APP-003', name: 'Document Update', status: 'Pending', date: '3 days ago', progress: 25 },
    { id: 'APP-004', name: 'New Registration', status: 'Draft', date: 'Today', progress: 10 },
  ];

  // Notifications specific to user
  const notifications = [
    { type: 'info', message: 'Your Business License application is under review', time: '2 hours ago' },
    { type: 'success', message: 'Permit Renewal has been approved!', time: '1 day ago' },
    { type: 'warning', message: 'Please upload missing documents', time: '3 days ago' },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Approved': 'success',
      'Rejected': 'error',
      'Pending': 'warning',
      'In Review': 'primary',
      'Draft': 'default',
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

  return (
    <div className="space-y-6">
      {/* Welcome Section - Personal greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back, John!</h1>
          <p className="text-neutral-500 mt-1">Here's an overview of your applications</p>
        </div>
        <Button variant="primary" className="flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Application
        </Button>
      </div>

      {/* Personal Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
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
                  <div className="mt-2 flex items-center">
                    <span className={`text-sm font-medium ${
                      stat.positive ? 'text-secondary-600' : 'text-accent-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-neutral-400 ml-1">new this month</span>
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
        {/* My Applications */}
        <Card className="lg:col-span-2">
          <Card.Header 
            title="My Applications" 
            subtitle="Track your application status"
            action={
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                View all →
              </button>
            }
          />
          <Card.Body className="p-0">
            <div className="divide-y divide-neutral-100">
              {myApplications.map((app) => (
                <div 
                  key={app.id} 
                  className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-all duration-150 hover:pl-8 cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                      <span className="text-sm font-semibold text-primary-700">
                        {app.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{app.name}</p>
                      <p className="text-sm text-neutral-500">{app.id} • {app.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-24">
                      <ProgressBar value={app.progress} size="sm" variant={app.progress === 100 ? 'success' : 'primary'} />
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Notifications - User specific */}
        <Card>
          <Card.Header title="Notifications" subtitle="Recent updates" />
          <Card.Body className="p-0">
            <div className="divide-y divide-neutral-100">
              {notifications.map((notif, index) => (
                <div key={index} className="px-4 py-3 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      notif.type === 'success' ? 'bg-secondary-500' :
                      notif.type === 'warning' ? 'bg-yellow-500' : 'bg-primary-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-700">{notif.message}</p>
                      <p className="text-xs text-neutral-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions - User focused */}
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
              title: 'New Application',
              description: 'Start a new application',
              link: '/applications/new',
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
              link: '/documents',
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
              link: '/tracking',
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
              link: '/settings',
            },
          ].map((action, index) => (
            <Card 
              key={index} 
              hover 
              className="cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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


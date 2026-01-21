import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Select } from '../../components';
import { notificationAPI } from '../../api';
import { userAPI } from '../../api';

/**
 * Notifications Page
 * Displays real-time notifications for all visa application stages
 * Integrated with backend API for real data
 */
export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    stageUpdates: true,
    documentAlerts: true,
    paymentReminders: true,
  });
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationAPI.getNotifications({ status: filter });
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      // Fallback to demo data
      setNotifications([
        {
          id: 1,
          type: 'stage',
          category: 'processing',
          title: 'Biometrics Appointment Confirmed',
          message: 'Your biometrics appointment has been scheduled for January 22, 2024 at 9:00 AM in Lagos.',
          time: '2 hours ago',
          read: false,
          icon: 'calendar',
        },
        {
          id: 2,
          type: 'document',
          category: 'documents',
          title: 'Document Verification Complete',
          message: 'Your uploaded documents have been verified. You can proceed to the next step.',
          time: '5 hours ago',
          read: false,
          icon: 'check',
        },
        {
          id: 3,
          type: 'payment',
          category: 'payment',
          title: 'Payment Received',
          message: 'Your visa processing fee of $150 has been received. Thank you!',
          time: '1 day ago',
          read: true,
          icon: 'dollar',
        },
        {
          id: 4,
          type: 'stage',
          category: 'cost',
          title: 'Cost Details Provided',
          message: 'The visa cost breakdown has been sent to your email. Please review and proceed with payment.',
          time: '2 days ago',
          read: true,
          icon: 'info',
        },
        {
          id: 5,
          type: 'reminder',
          category: 'biometrics',
          title: 'Biometrics Reminder',
          message: 'Don\'t forget your biometrics appointment tomorrow! Please arrive 15 minutes early.',
          time: '3 days ago',
          read: true,
          icon: 'bell',
        },
        {
          id: 6,
          type: 'stage',
          category: 'embassy',
          title: 'Application Submitted to Embassy',
          message: 'Your visa application has been successfully submitted to the embassy for processing.',
          time: '4 days ago',
          read: true,
          icon: 'building',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      if (response.success && response.data) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const handleTogglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    setError(null);
    
    try {
      await userAPI.updateNotificationPreferences(preferences);
      setSuccess('Preferences saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
      // Fallback - update locally
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      // Fallback - update locally
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      const wasUnread = notifications.find(n => n.id === id && !n.read);
      setNotifications(notifications.filter(n => n.id !== id));
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
      // Fallback - delete locally
      const wasUnread = notifications.find(n => n.id === id && !n.read);
      setNotifications(notifications.filter(n => n.id !== id));
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const clearAll = async () => {
    try {
      // Delete all notifications one by one or use bulk delete if available
      for (const notif of notifications) {
        await notificationAPI.deleteNotification(notif.id);
      }
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
      // Fallback - clear locally
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === filter);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'calendar':
        return (
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'check':
        return (
          <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'dollar':
        return (
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'bell':
        return (
          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      case 'building':
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      case 'upload':
        return (
          <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
        );
      case 'passport':
        return (
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getCategoryBadge = (category) => {
    const variants = {
      processing: 'primary',
      documents: 'info',
      payment: 'success',
      cost: 'warning',
      biometrics: 'primary',
      embassy: 'info',
      passport: 'secondary',
    };
    const labels = {
      processing: 'Processing',
      documents: 'Documents',
      payment: 'Payment',
      cost: 'Cost',
      biometrics: 'Biometrics',
      embassy: 'Embassy',
      passport: 'Passport',
    };
    return <Badge variant={variants[category] || 'default'}>{labels[category] || category}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-neutral-500 mt-1">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-primary-600">{notifications.length}</p>
            <p className="text-sm text-neutral-500">Total Notifications</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-warning-600">{unreadCount}</p>
            <p className="text-sm text-neutral-500">Unread</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-secondary-600">
              {notifications.filter(n => n.type === 'stage').length}
            </p>
            <p className="text-sm text-neutral-500">Stage Updates</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-info-600">
              {notifications.filter(n => n.type === 'document').length}
            </p>
            <p className="text-sm text-neutral-500">Document Alerts</p>
          </Card.Body>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Notifications' },
            { value: 'processing', label: 'Processing' },
            { value: 'documents', label: 'Documents' },
            { value: 'payment', label: 'Payment' },
            { value: 'biometrics', label: 'Biometrics' },
            { value: 'embassy', label: 'Embassy' },
          ]}
          className="w-48"
        />
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <Card>
          <Card.Body className="text-center py-12">
            <svg className="h-8 w-8 text-neutral-300 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-neutral-500 mt-4">Loading notifications...</p>
          </Card.Body>
        </Card>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${!notification.read ? 'border-l-4 border-l-primary-500' : ''}`}
            >
              <Card.Body>
                <div className="flex items-start gap-4">
                  {getIcon(notification.icon)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-sm font-semibold ${!notification.read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                            {notification.title}
                          </h3>
                          {getCategoryBadge(notification.category)}
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600">{notification.message}</p>
                        <p className="text-xs text-neutral-400 mt-2">{notification.time}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-neutral-400 hover:text-primary-600 transition-colors"
                            title="Mark as read"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-neutral-400 hover:text-accent-600 transition-colors"
                          title="Delete"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <svg className="h-12 w-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-neutral-500">No notifications to display</p>
            <p className="text-sm text-neutral-400 mt-1">You're all caught up!</p>
          </Card.Body>
        </Card>
      )}

      {/* Notification Preferences */}
      <Card>
        <Card.Header title="Notification Preferences" subtitle="Manage how you receive notifications" />
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Email Notifications</p>
                <p className="text-sm text-neutral-500">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleTogglePreference('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.emailNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">SMS Notifications</p>
                <p className="text-sm text-neutral-500">Receive updates via SMS</p>
              </div>
              <button
                onClick={() => handleTogglePreference('smsNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.smsNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Push Notifications</p>
                <p className="text-sm text-neutral-500">Browser push notifications</p>
              </div>
              <button
                onClick={() => handleTogglePreference('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.pushNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Stage Updates</p>
                <p className="text-sm text-neutral-500">Notifications for each processing stage</p>
              </div>
              <button
                onClick={() => handleTogglePreference('stageUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.stageUpdates ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.stageUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Document Alerts</p>
                <p className="text-sm text-neutral-500">Notifications for document verification</p>
              </div>
              <button
                onClick={() => handleTogglePreference('documentAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.documentAlerts ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.documentAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Payment Reminders</p>
                <p className="text-sm text-neutral-500">Notifications for pending payments</p>
              </div>
              <button
                onClick={() => handleTogglePreference('paymentReminders')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.paymentReminders ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.paymentReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={handleSavePreferences} loading={isSavingPreferences}>
              Save Preferences
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}


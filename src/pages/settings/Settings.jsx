import React, { useState } from 'react';
import { Card, Button, Input, Select, Checkbox, Alert } from '../../components';

/**
 * User Settings Page - Notifications & Preferences
 */
export default function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    documentStatus: true,
    paymentReminders: true,
    weeklyDigest: false,
    marketingEmails: false,
    // Account
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    // Security
    twoFactorAuth: true,
    loginAlerts: true,
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
    { id: 'account', label: 'Account', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { id: 'security', label: 'Security', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your account preferences and notifications</p>
      </div>

      {saved && (
        <Alert variant="success" title="Settings Saved">
          Your preferences have been updated successfully.
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <Card className="lg:col-span-1 h-fit">
          <Card.Body className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card.Body>
        </Card>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              <Card>
                <Card.Header title="Notification Channels" subtitle="Choose how you want to receive notifications" />
                <Card.Body className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      onClick={() => handleToggle('emailNotifications')}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        settings.emailNotifications
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Email</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-primary-600' : 'bg-neutral-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${settings.emailNotifications ? 'translate-x-5' : 'translate-x-1'}`} />
                        </div>
                      </div>
                      <p className="text-sm text-neutral-500">Receive notifications in your email</p>
                    </div>

                    <div
                      onClick={() => handleToggle('pushNotifications')}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        settings.pushNotifications
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <span className="font-medium">Push</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors ${settings.pushNotifications ? 'bg-primary-600' : 'bg-neutral-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${settings.pushNotifications ? 'translate-x-5' : 'translate-x-1'}`} />
                        </div>
                      </div>
                      <p className="text-sm text-neutral-500">Browser push notifications</p>
                    </div>

                    <div
                      onClick={() => handleToggle('smsNotifications')}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        settings.smsNotifications
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">SMS</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors ${settings.smsNotifications ? 'bg-primary-600' : 'bg-neutral-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${settings.smsNotifications ? 'translate-x-5' : 'translate-x-1'}`} />
                        </div>
                      </div>
                      <p className="text-sm text-neutral-500">Text message notifications</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Notification Preferences" subtitle="Choose what notifications you want to receive" />
                <Card.Body className="p-0">
                  <div className="divide-y divide-neutral-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Application Updates</p>
                        <p className="text-sm text-neutral-500">Get notified about your application status</p>
                      </div>
                      <Checkbox checked={settings.applicationUpdates} onChange={() => handleToggle('applicationUpdates')} />
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Document Status</p>
                        <p className="text-sm text-neutral-500">Alerts when documents are verified or rejected</p>
                      </div>
                      <Checkbox checked={settings.documentStatus} onChange={() => handleToggle('documentStatus')} />
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Payment Reminders</p>
                        <p className="text-sm text-neutral-500">Reminders for pending payments</p>
                      </div>
                      <Checkbox checked={settings.paymentReminders} onChange={() => handleToggle('paymentReminders')} />
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Weekly Digest</p>
                        <p className="text-sm text-neutral-500">Weekly summary of your applications</p>
                      </div>
                      <Checkbox checked={settings.weeklyDigest} onChange={() => handleToggle('weeklyDigest')} />
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Marketing Emails</p>
                        <p className="text-sm text-neutral-500">Promotional offers and updates</p>
                      </div>
                      <Checkbox checked={settings.marketingEmails} onChange={() => handleToggle('marketingEmails')} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <Card>
              <Card.Header title="Regional Settings" subtitle="Customize your language and regional preferences" />
              <Card.Body className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Language"
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'ar', label: 'Arabic' },
                      { value: 'fr', label: 'French' },
                      { value: 'es', label: 'Spanish' },
                    ]}
                  />
                  <Select
                    label="Timezone"
                    value={settings.timezone}
                    onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    options={[
                      { value: 'UTC', label: 'UTC' },
                      { value: 'EST', label: 'Eastern Time' },
                      { value: 'PST', label: 'Pacific Time' },
                      { value: 'GST', label: 'Gulf Standard Time' },
                    ]}
                  />
                  <Select
                    label="Date Format"
                    value={settings.dateFormat}
                    onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                    options={[
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                    ]}
                  />
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <Card>
                <Card.Header title="Two-Factor Authentication" subtitle="Add an extra layer of security" />
                <Card.Body>
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
                        <p className="text-sm text-neutral-500">Currently {settings.twoFactorAuth ? 'enabled' : 'disabled'}</p>
                      </div>
                    </div>
                    <Button variant={settings.twoFactorAuth ? 'secondary' : 'primary'}>
                      {settings.twoFactorAuth ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Login Security" subtitle="Monitor your account activity" />
                <Card.Body className="p-0">
                  <div className="divide-y divide-neutral-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Login Alerts</p>
                        <p className="text-sm text-neutral-500">Get notified of new logins to your account</p>
                      </div>
                      <Checkbox checked={settings.loginAlerts} onChange={() => handleToggle('loginAlerts')} />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Recent Activity" subtitle="Your recent login activity" />
                <Card.Body className="p-0">
                  <div className="divide-y divide-neutral-200">
                    {[
                      { device: 'Chrome on Windows', location: 'Dubai, UAE', time: 'Current session' },
                      { device: 'Safari on iPhone', location: 'Dubai, UAE', time: '2 hours ago' },
                      { device: 'Firefox on MacOS', location: 'Abu Dhabi, UAE', time: 'Yesterday' },
                    ].map((activity, index) => (
                      <div key={index} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{activity.device}</p>
                            <p className="text-sm text-neutral-500">{activity.location} • {activity.time}</p>
                          </div>
                        </div>
                        {index === 0 && <Badge variant="success">Current</Badge>}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


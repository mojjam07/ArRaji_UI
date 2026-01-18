import React, { useState } from 'react';
import { Card, Button, Input, Select, Checkbox, Alert, Badge } from '../../components';

/**
 * Admin Settings Page - System Configuration & Management
 */
export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('system');
  const [settings, setSettings] = useState({
    // System Settings
    maintenanceMode: false,
    registrationEnabled: true,
    emailService: true,
    smsService: true,
    backupFrequency: 'daily',
    logRetention: '30',
    // Security Settings
    sessionTimeout: '60',
    passwordPolicy: 'strong',
    ipWhitelist: false,
    auditLogging: true,
    // Notification Settings
    adminAlerts: true,
    systemAlerts: true,
    userRegistrationAlerts: true,
    errorAlerts: true,
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
    { id: 'system', label: 'System', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )},
    { id: 'security', label: 'Security', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )},
    { id: 'notifications', label: 'Notifications', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Settings</h1>
        <p className="text-neutral-500 mt-1">Configure system settings and administrative preferences</p>
      </div>

      {saved && (
        <Alert variant="success" title="Settings Saved">
          System settings have been updated successfully.
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
          {/* System Tab */}
          {activeTab === 'system' && (
            <>
              <Card>
                <Card.Header title="System Status" subtitle="Current system configuration and status" />
                <Card.Body className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${settings.maintenanceMode ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="font-medium">System Status</span>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {settings.maintenanceMode ? 'Maintenance Mode Active' : 'System Operational'}
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${settings.registrationEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium">User Registration</span>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {settings.registrationEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="System Configuration" subtitle="Configure core system settings" />
                <Card.Body className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">Maintenance Mode</p>
                          <p className="text-sm text-neutral-500">Temporarily disable user access</p>
                        </div>
                        <Checkbox checked={settings.maintenanceMode} onChange={() => handleToggle('maintenanceMode')} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">User Registration</p>
                          <p className="text-sm text-neutral-500">Allow new user registrations</p>
                        </div>
                        <Checkbox checked={settings.registrationEnabled} onChange={() => handleToggle('registrationEnabled')} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Select
                        label="Backup Frequency"
                        value={settings.backupFrequency}
                        onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                        options={[
                          { value: 'hourly', label: 'Hourly' },
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                        ]}
                      />
                      <Select
                        label="Log Retention (Days)"
                        value={settings.logRetention}
                        onChange={(e) => setSettings(prev => ({ ...prev, logRetention: e.target.value }))}
                        options={[
                          { value: '7', label: '7 Days' },
                          { value: '30', label: '30 Days' },
                          { value: '90', label: '90 Days' },
                          { value: '365', label: '1 Year' },
                        ]}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="External Services" subtitle="Configure third-party service integrations" />
                <Card.Body className="p-0">
                  <div className="divide-y divide-neutral-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Email Service</p>
                        <p className="text-sm text-neutral-500">Send automated emails to users</p>
                      </div>
                      <Checkbox checked={settings.emailService} onChange={() => handleToggle('emailService')} />
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">SMS Service</p>
                        <p className="text-sm text-neutral-500">Send SMS notifications</p>
                      </div>
                      <Checkbox checked={settings.smsService} onChange={() => handleToggle('smsService')} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <Card>
                <Card.Header title="Session Management" subtitle="Configure user session settings" />
                <Card.Body className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Session Timeout (minutes)"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                      options={[
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' },
                        { value: '60', label: '1 hour' },
                        { value: '240', label: '4 hours' },
                      ]}
                    />
                    <Select
                      label="Password Policy"
                      value={settings.passwordPolicy}
                      onChange={(e) => setSettings(prev => ({ ...prev, passwordPolicy: e.target.value }))}
                      options={[
                        { value: 'basic', label: 'Basic (8+ characters)' },
                        { value: 'strong', label: 'Strong (12+ chars, mixed case, numbers)' },
                        { value: 'complex', label: 'Complex (16+ chars, special chars)' },
                      ]}
                    />
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Access Control" subtitle="Configure security and access settings" />
                <Card.Body className="p-0">
                  <div className="divide-y divide-neutral-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">IP Whitelist</p>
                        <p className="text-sm text-neutral-500">Restrict access to specific IP addresses</p>
                      </div>
                      <Checkbox checked={settings.ipWhitelist} onChange={() => handleToggle('ipWhitelist')} />
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Audit Logging</p>
                        <p className="text-sm text-neutral-500">Log all administrative actions</p>
                      </div>
                      <Checkbox checked={settings.auditLogging} onChange={() => handleToggle('auditLogging')} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <Card.Header title="Admin Notifications" subtitle="Configure alerts for administrators" />
              <Card.Body className="p-0">
                <div className="divide-y divide-neutral-200">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Admin Alerts</p>
                      <p className="text-sm text-neutral-500">Critical system alerts to administrators</p>
                    </div>
                    <Checkbox checked={settings.adminAlerts} onChange={() => handleToggle('adminAlerts')} />
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">System Alerts</p>
                      <p className="text-sm text-neutral-500">Automated system status notifications</p>
                    </div>
                    <Checkbox checked={settings.systemAlerts} onChange={() => handleToggle('systemAlerts')} />
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-500">User Registration Alerts</p>
                      <p className="text-sm text-neutral-500">Notifications for new user registrations</p>
                    </div>
                    <Checkbox checked={settings.userRegistrationAlerts} onChange={() => handleToggle('userRegistrationAlerts')} />
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Error Alerts</p>
                      <p className="text-sm text-neutral-500">System error and exception notifications</p>
                    </div>
                    <Checkbox checked={settings.errorAlerts} onChange={() => handleToggle('errorAlerts')} />
                  </div>
                </div>
              </Card.Body>
            </Card>
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

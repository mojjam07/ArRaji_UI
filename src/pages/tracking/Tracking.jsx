import React, { useState } from 'react';
import { Card, Badge, ProgressBar, Button, Select } from '../../components';

/**
 * Status Tracking Page with Timeline View
 */
export default function Tracking() {
  const [selectedApplication, setSelectedApplication] = useState('all');

  const applications = [
    {
      id: 'APP-2024-001',
      type: 'Business License',
      submittedDate: '2024-01-15',
      status: 'under_review',
      timeline: [
        { step: 'Application Submitted', date: '2024-01-15 09:30', status: 'completed', description: 'Your application has been received' },
        { step: 'Documents Verified', date: '2024-01-16 14:20', status: 'completed', description: 'All required documents verified' },
        { step: 'Under Review', date: '2024-01-17 10:00', status: 'current', description: 'Your application is being reviewed by our team' },
        { step: 'Pending Approval', date: null, status: 'pending', description: 'Waiting for final approval' },
        { step: 'License Issued', date: null, status: 'pending', description: 'Your business license will be issued' },
      ],
    },
    {
      id: 'APP-2024-002',
      type: 'Permit Renewal',
      submittedDate: '2024-01-10',
      status: 'approved',
      timeline: [
        { step: 'Application Submitted', date: '2024-01-10 11:15', status: 'completed', description: 'Your renewal application has been received' },
        { step: 'Documents Verified', date: '2024-01-11 09:45', status: 'completed', description: 'All required documents verified' },
        { step: 'Under Review', date: '2024-01-12 16:30', status: 'completed', description: 'Your application has been reviewed' },
        { step: 'Pending Approval', date: '2024-01-13 10:00', status: 'completed', description: 'Your application has been approved' },
        { step: 'License Issued', date: '2024-01-14 14:00', status: 'completed', description: 'Your renewed permit has been issued' },
      ],
    },
    {
      id: 'APP-2024-003',
      type: 'Document Update',
      submittedDate: '2024-01-18',
      status: 'pending',
      timeline: [
        { step: 'Application Submitted', date: '2024-01-18 08:45', status: 'completed', description: 'Your request has been received' },
        { step: 'Documents Verified', date: null, status: 'pending', description: 'Waiting for document verification' },
        { step: 'Under Review', date: null, status: 'pending', description: 'Your request will be reviewed' },
        { step: 'Pending Approval', date: null, status: 'pending', description: 'Waiting for final approval' },
        { step: 'Update Complete', date: null, status: 'pending', description: 'Your documents will be updated' },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      approved: 'success',
      rejected: 'error',
      pending: 'warning',
      under_review: 'primary',
    };
    const labels = {
      approved: 'Approved',
      rejected: 'Rejected',
      pending: 'Pending',
      under_review: 'Under Review',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTimelineStepIcon = (status) => {
    if (status === 'completed') {
      return (
        <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    if (status === 'current') {
      return (
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center animate-pulse">
          <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
        <span className="text-sm font-medium text-neutral-400">{''}</span>
      </div>
    );
  };

  const filteredApplications = selectedApplication === 'all'
    ? applications
    : applications.filter(app => app.status === selectedApplication);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Application Tracking</h1>
          <p className="text-neutral-500 mt-1">Track the status of your applications</p>
        </div>
        <Select
          value={selectedApplication}
          onChange={(e) => setSelectedApplication(e.target.value)}
          options={[
            { value: 'all', label: 'All Applications' },
            { value: 'pending', label: 'Pending' },
            { value: 'under_review', label: 'Under Review' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />
      </div>

      {/* Application Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredApplications.map((app) => (
          <Card key={app.id} hover>
            <Card.Header
              title={app.type}
              subtitle={`ID: ${app.id}`}
              action={getStatusBadge(app.status)}
            />
            <Card.Body>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Submitted</span>
                  <span className="font-medium text-neutral-900">{app.submittedDate}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-500">Progress</span>
                    <span className="font-medium text-neutral-900">
                      {app.timeline.filter(t => t.status === 'completed').length}/{app.timeline.length}
                    </span>
                  </div>
                  <ProgressBar
                    value={(app.timeline.filter(t => t.status === 'completed').length / app.timeline.length) * 100}
                    variant={app.status === 'approved' ? 'success' : 'primary'}
                  />
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button variant="secondary" className="w-full">
                View Details
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {/* Detailed Timeline View */}
      {filteredApplications.length > 0 && (
        <Card>
          <Card.Header
            title={`Timeline - ${filteredApplications[0].id}`}
            subtitle={filteredApplications[0].type}
          />
          <Card.Body>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />
              
              {/* Timeline Items */}
              <div className="space-y-6">
                {filteredApplications[0].timeline.map((step, index) => (
                  <div key={index} className="relative flex gap-4">
                    {/* Icon */}
                    <div className="relative z-10">
                      {getTimelineStepIcon(step.status)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-neutral-400' : 'text-neutral-900'}`}>
                            {step.step}
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">{step.description}</p>
                        </div>
                        {step.date && (
                          <span className="text-xs text-neutral-500 whitespace-nowrap ml-4">
                            {step.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-neutral-900">{applications.length}</p>
            <p className="text-sm text-neutral-500">Total Applications</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-warning-600">
              {applications.filter(a => a.status === 'pending' || a.status === 'under_review').length}
            </p>
            <p className="text-sm text-neutral-500">In Progress</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-secondary-600">
              {applications.filter(a => a.status === 'approved').length}
            </p>
            <p className="text-sm text-neutral-500">Approved</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-accent-600">2.5</p>
            <p className="text-sm text-neutral-500">Avg. Days to Complete</p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}


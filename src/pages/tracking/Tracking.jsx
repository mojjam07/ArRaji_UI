import React, { useState } from 'react';
import { Card, Badge, ProgressBar, Button, Select, Alert } from '../../components';

/**
 * Visa Application Status Tracking Page with Timeline View
 * Tracks complete visa processing workflow from booking to passport return
 */
export default function Tracking() {
  const [selectedApplication, setSelectedApplication] = useState('all');

  const applications = [
    {
      id: 'VISA-2024-001',
      type: 'Tourist Visa - UAE',
      applicant: 'Ahmed Al-Rashid',
      submittedDate: '2024-01-15',
      status: 'biometrics_pending',
      currentStage: 4,
      stages: [
        { step: 'Booking Initiated', date: '2024-01-15 09:30', status: 'completed', description: 'Your visa application has been submitted' },
        { step: 'Documents Received', date: '2024-01-15 10:15', status: 'completed', description: 'All required documents uploaded and verified' },
        { step: 'Cost Provided', date: '2024-01-16 11:00', status: 'completed', description: 'Visa cost breakdown sent to your email' },
        { step: 'Payment Completed', date: '2024-01-16 14:30', status: 'completed', description: 'Payment received successfully' },
        { step: 'Biometrics Scheduled', date: '2024-01-17 08:00', status: 'current', description: 'Awaiting biometrics appointment' },
        { step: 'Biometrics Completed', date: null, status: 'pending', description: 'Your biometrics will be recorded' },
        { step: 'Embassy Submission', date: null, status: 'pending', description: 'Application submitted to embassy' },
        { step: 'Visa Processing', date: null, status: 'pending', description: 'Embassy is processing your visa' },
        { step: 'Visa Collected', date: null, status: 'pending', description: 'Visa sticker collected from embassy' },
        { step: 'Passport Returned', date: null, status: 'pending', description: 'Passport returned to client' },
      ],
    },
    {
      id: 'VISA-2024-002',
      type: 'Business Visa - UK',
      applicant: 'Sarah Johnson',
      submittedDate: '2024-01-10',
      status: 'embassy_submission',
      currentStage: 7,
      stages: [
        { step: 'Booking Initiated', date: '2024-01-10 11:15', status: 'completed', description: 'Application received' },
        { step: 'Documents Received', date: '2024-01-10 16:00', status: 'completed', description: 'All documents verified' },
        { step: 'Cost Provided', date: '2024-01-11 09:00', status: 'completed', description: 'Cost breakdown provided' },
        { step: 'Payment Completed', date: '2024-01-11 11:30', status: 'completed', description: 'Payment confirmed' },
        { step: 'Biometrics Scheduled', date: '2024-01-12 10:00', status: 'completed', description: 'Biometrics completed' },
        { step: 'Biometrics Completed', date: '2024-01-12 11:30', status: 'completed', description: 'Biometrics recorded successfully' },
        { step: 'Embassy Submission', date: '2024-01-15 09:00', status: 'current', description: 'Submitted to UK Embassy' },
        { step: 'Visa Processing', date: null, status: 'pending', description: 'Under embassy review' },
        { step: 'Visa Collected', date: null, status: 'pending', description: 'Awaiting visa collection' },
        { step: 'Passport Returned', date: null, status: 'pending', description: 'To be returned to client' },
      ],
    },
    {
      id: 'VISA-2024-003',
      type: 'Tourist Visa - USA',
      applicant: 'Mohammed Ali',
      submittedDate: '2024-01-18',
      status: 'documents_pending',
      currentStage: 2,
      stages: [
        { step: 'Booking Initiated', date: '2024-01-18 08:45', status: 'completed', description: 'Application started' },
        { step: 'Documents Received', date: null, status: 'pending', description: 'Waiting for document upload' },
        { step: 'Cost Provided', date: null, status: 'pending', description: 'Pending after documents' },
        { step: 'Payment Completed', date: null, status: 'pending', description: 'Awaiting payment' },
        { step: 'Biometrics Scheduled', date: null, status: 'pending', description: 'To be scheduled' },
        { step: 'Biometrics Completed', date: null, status: 'pending', description: 'Future stage' },
        { step: 'Embassy Submission', date: null, status: 'pending', description: 'Future stage' },
        { step: 'Visa Processing', date: null, status: 'pending', description: 'Future stage' },
        { step: 'Visa Collected', date: null, status: 'pending', description: 'Future stage' },
        { step: 'Passport Returned', date: null, status: 'pending', description: 'Final stage' },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      documents_pending: 'warning',
      cost_pending: 'warning',
      payment_pending: 'warning',
      biometrics_scheduled: 'primary',
      biometrics_pending: 'primary',
      biometrics_completed: 'info',
      embassy_submission: 'primary',
      visa_processing: 'info',
      visa_collected: 'success',
      passport_returned: 'success',
      rejected: 'error',
    };
    const labels = {
      documents_pending: 'Documents Pending',
      cost_pending: 'Awaiting Cost',
      payment_pending: 'Payment Pending',
      biometrics_scheduled: 'Biometrics Scheduled',
      biometrics_pending: 'Awaiting Biometrics',
      biometrics_completed: 'Biometrics Done',
      embassy_submission: 'At Embassy',
      visa_processing: 'Processing',
      visa_collected: 'Visa Collected',
      passport_returned: 'Completed',
      rejected: 'Rejected',
    };
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
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

  const getStageProgress = (stages) => {
    const completed = stages.filter(s => s.status === 'completed').length;
    return (completed / stages.length) * 100;
  };

  const filteredApplications = selectedApplication === 'all'
    ? applications
    : applications.filter(app => app.status === selectedApplication);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Visa Tracking</h1>
          <p className="text-neutral-500 mt-1">Track your visa application status in real-time</p>
        </div>
        <Select
          value={selectedApplication}
          onChange={(e) => setSelectedApplication(e.target.value)}
          options={[
            { value: 'all', label: 'All Applications' },
            { value: 'documents_pending', label: 'Documents Pending' },
            { value: 'biometrics_pending', label: 'Awaiting Biometrics' },
            { value: 'embassy_submission', label: 'At Embassy' },
            { value: 'passport_returned', label: 'Completed' },
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
                  <span className="text-neutral-500">Applicant</span>
                  <span className="font-medium text-neutral-900">{app.applicant}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Submitted</span>
                  <span className="font-medium text-neutral-900">{app.submittedDate}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-500">Progress</span>
                    <span className="font-medium text-neutral-900">
                      {app.stages.filter(s => s.status === 'completed').length}/{app.stages.length} stages
                    </span>
                  </div>
                  <ProgressBar
                    value={getStageProgress(app.stages)}
                    variant={app.status === 'passport_returned' ? 'success' : 'primary'}
                  />
                </div>
                <div className="pt-2">
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium">Current Stage:</span> {
                      app.stages.find(s => s.status === 'current')?.step || 'N/A'
                    }
                  </p>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button variant="secondary" className="w-full" onClick={() => setSelectedApplication(app.id)}>
                View Details
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {/* Detailed Timeline View */}
      {filteredApplications.length > 0 && filteredApplications[0].id && (
        <Card>
          <Card.Header
            title={`Timeline - ${filteredApplications[0].id}`}
            subtitle={`${filteredApplications[0].type} - ${filteredApplications[0].applicant}`}
          />
          <Card.Body>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />
              
              {/* Timeline Items */}
              <div className="space-y-2">
                {filteredApplications[0].stages.map((step, index) => (
                  <div key={index} className="relative flex gap-4">
                    {/* Icon */}
                    <div className="relative z-10">
                      {getTimelineStepIcon(step.status)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-4">
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
              {applications.filter(a => ['documents_pending', 'biometrics_pending'].includes(a.status)).length}
            </p>
            <p className="text-sm text-neutral-500">Awaiting Action</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {applications.filter(a => ['embassy_submission', 'visa_processing'].includes(a.status)).length}
            </p>
            <p className="text-sm text-neutral-500">At Embassy</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-secondary-600">
              {applications.filter(a => a.status === 'passport_returned').length}
            </p>
            <p className="text-sm text-neutral-500">Completed</p>
          </Card.Body>
        </Card>
      </div>

      {/* Help Alert */}
      <Alert variant="info" title="Need Help?">
        If you have questions about your application status, please contact our support team or check your email for updates.
      </Alert>
    </div>
  );
}


import React, { useState } from 'react';
import { Card, Button, Badge, Input, Select, Alert } from '../../components';

/**
 * Application Review Page (Admin/Officer View)
 * Review and manage applications with tabs
 */
export default function ApplicationReview() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  const applications = {
    pending: [
      {
        id: 'APP-2024-001',
        applicant: { name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', phone: '+971 50 123 4567' },
        type: 'Business License',
        submittedDate: '2024-01-18',
        priority: 'high',
        documents: ['ID Copy.pdf', 'Business License.pdf', 'Tax Registration.pdf'],
      },
      {
        id: 'APP-2024-002',
        applicant: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+971 55 987 6543' },
        type: 'Permit Renewal',
        submittedDate: '2024-01-17',
        priority: 'medium',
        documents: ['Permit Renewal Form.pdf', 'Current Permit.pdf'],
      },
      {
        id: 'APP-2024-003',
        applicant: { name: 'Mohammed Ali', email: 'mohammed@example.com', phone: '+971 52 456 7890' },
        type: 'New Registration',
        submittedDate: '2024-01-16',
        priority: 'low',
        documents: ['ID Copy.pdf', 'Company Registration.pdf'],
      },
    ],
    reviewed: [
      {
        id: 'APP-2023-156',
        applicant: { name: 'Fatima Hassan', email: 'fatima@example.com', phone: '+971 58 321 0987' },
        type: 'Document Update',
        submittedDate: '2024-01-15',
        status: 'approved',
        reviewedDate: '2024-01-16',
        reviewer: 'Officer A',
      },
      {
        id: 'APP-2023-155',
        applicant: { name: 'John Smith', email: 'john@example.com', phone: '+971 54 789 0123' },
        type: 'Business License',
        submittedDate: '2024-01-14',
        status: 'rejected',
        reviewedDate: '2024-01-15',
        reviewer: 'Officer B',
        rejectionReason: 'Incomplete documentation',
      },
    ],
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'error',
      medium: 'warning',
      low: 'success',
    };
    return <Badge variant={variants[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      approved: 'success',
      rejected: 'error',
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const handleApprove = (id) => {
    alert(`Application ${id} approved!`);
    setSelectedApplication(null);
  };

  const handleReject = (id) => {
    if (!reviewNote) {
      alert('Please provide a rejection reason');
      return;
    }
    alert(`Application ${id} rejected! Reason: ${reviewNote}`);
    setSelectedApplication(null);
    setReviewNote('');
  };

  const tabs = [
    { id: 'pending', label: 'Pending Review', count: applications.pending.length },
    { id: 'reviewed', label: 'Reviewed', count: applications.reviewed.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Application Review</h1>
          <p className="text-neutral-500 mt-1">Review and manage application submissions</p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search applications..."
            className="w-64"
          />
          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'business', label: 'Business License' },
              { value: 'permit', label: 'Permit Renewal' },
              { value: 'registration', label: 'New Registration' },
            ]}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application List */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'pending' && (
            <>
              {applications.pending.map((app) => (
                <Card key={app.id} hover={selectedApplication?.id !== app.id}>
                  <Card.Body>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-medium text-primary-700">
                            {app.applicant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-neutral-900">{app.applicant.name}</h3>
                            {getPriorityBadge(app.priority)}
                          </div>
                          <p className="text-sm text-neutral-500">{app.type} • {app.id}</p>
                          <p className="text-sm text-neutral-500 mt-1">
                            Submitted: {app.submittedDate}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-neutral-500">Documents:</span>
                            {app.documents.map((doc, index) => (
                              <Badge key={index} variant="secondary">{doc}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(app.id)}
                        >
                          Quick Approve
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}

          {activeTab === 'reviewed' && (
            <>
              {applications.reviewed.map((app) => (
                <Card key={app.id}>
                  <Card.Body>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          app.status === 'approved' ? 'bg-secondary-100' : 'bg-accent-100'
                        }`}>
                          <span className={`text-lg font-medium ${
                            app.status === 'approved' ? 'text-secondary-700' : 'text-accent-700'
                          }`}>
                            {app.applicant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-neutral-900">{app.applicant.name}</h3>
                            {getStatusBadge(app.status)}
                          </div>
                          <p className="text-sm text-neutral-500">{app.type} • {app.id}</p>
                          <p className="text-sm text-neutral-500 mt-1">
                            Reviewed: {app.reviewedDate} by {app.reviewer}
                          </p>
                          {app.rejectionReason && (
                            <Alert variant="error" className="mt-2">
                              Reason: {app.rejectionReason}
                            </Alert>
                          )}
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        View Full History
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedApplication ? (
            <Card className="sticky top-6">
              <Card.Header
                title="Application Details"
                subtitle={selectedApplication.id}
                action={
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                }
              />
              <Card.Body className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Applicant Information</h4>
                  <p className="font-medium text-neutral-900">{selectedApplication.applicant.name}</p>
                  <p className="text-sm text-neutral-600">{selectedApplication.applicant.email}</p>
                  <p className="text-sm text-neutral-600">{selectedApplication.applicant.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Application Type</h4>
                  <p className="text-neutral-900">{selectedApplication.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Submitted Date</h4>
                  <p className="text-neutral-900">{selectedApplication.submittedDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Documents</h4>
                  <ul className="space-y-1">
                    {selectedApplication.documents.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Review Notes</h4>
                  <textarea
                    className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    placeholder="Add review notes..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                  />
                </div>
              </Card.Body>
              <Card.Footer className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleReject(selectedApplication.id)}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleApprove(selectedApplication.id)}
                >
                  Approve
                </Button>
              </Card.Footer>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <svg className="h-12 w-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-neutral-500">Select an application to view details</p>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


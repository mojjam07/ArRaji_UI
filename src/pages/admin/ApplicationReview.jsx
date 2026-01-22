import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Select, Alert, ProgressBar } from '../../components';
import { adminAPI } from '../../api';

/**
 * Application Review Page (Admin/Officer View)
 * Review and manage visa applications with full processing workflow
 * Integrated with backend API for real data
 * 
 * Valid application statuses (must match backend enum):
 * - draft, submitted, under_review, documents_required
 * - biometrics_scheduled, biometrics_completed
 * - approved, rejected, completed, issued
 */
export default function ApplicationReview() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [applications, setApplications] = useState({
    pending: [],
    processing: [],
    completed: []
  });

  // Map frontend tabs to backend valid statuses
  const tabStatusMap = {
    'pending': 'submitted',  // Pending review = submitted applications
    'processing': 'under_review',  // In processing = under_review applications
    'completed': 'completed'  // Completed = completed applications
  };

  // Fetch applications on mount and when tab changes
  useEffect(() => {
    fetchApplications(activeTab);
  }, [activeTab]);

  const fetchApplications = async (tab) => {
    setIsLoading(true);
    setError(null);
    // Use the mapped valid status for the API call
    const status = tabStatusMap[tab] || tab;
    try {
      const response = await adminAPI.getApplications({ status, limit: 50 });
      if (response.success && response.data) {
        // Map the API response to our expected format
        const apps = (response.data.applications || []).map(app => ({
          id: app.applicationNumber || `VISA-${app.id}`,
          applicant: { 
            name: app.user ? `${app.user.firstName} ${app.user.lastName}` : 'Unknown',
            email: app.user?.email || 'Unknown',
            phone: app.user?.phoneNumber || 'N/A'
          },
          visaType: app.visaType || 'General',
          submittedDate: app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          priority: app.priority || 'medium',
          currentStage: mapStatusToStage(app.status),
          stages: [
            { step: 'Application Received', date: app.createdAt, status: 'completed', description: 'Application submitted' },
            { step: 'Documents Review', date: app.documentsVerifiedAt, status: app.status === 'documents_required' ? 'pending' : (['under_review', 'biometrics_scheduled', 'biometrics_completed', 'approved', 'completed', 'issued'].includes(app.status) ? 'completed' : 'pending'), description: 'Document verification' },
            { step: 'Biometrics', date: app.biometricsDate, status: ['biometrics_completed', 'approved', 'completed', 'issued'].includes(app.status) ? 'completed' : (['biometrics_scheduled'].includes(app.status) && app.biometricsDate ? 'current' : 'pending'), description: 'Biometrics scheduled' },
            { step: 'Decision', date: app.decisionDate, status: ['approved', 'rejected', 'completed', 'issued'].includes(app.status) ? 'completed' : 'pending', description: 'Embassy decision' },
            { step: 'Collection', date: app.issueDate, status: ['issued', 'completed'].includes(app.status) ? 'completed' : (app.status === 'issued' ? 'current' : 'pending'), description: 'Visa collected' },
          ],
          documents: (app.documents || []).map(d => d.name || 'Document'),
          biometricsDate: app.biometricsDate,
          decisionDate: app.decisionDate,
        }));
        
        // Group applications by status for different tabs
        setApplications({
          pending: apps.filter(a => ['application_received'].includes(a.currentStage)),
          processing: apps.filter(a => ['documents_review', 'biometrics'].includes(a.currentStage)),
          completed: apps.filter(a => ['collection', 'completed', 'rejected'].includes(a.currentStage))
        });
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications. Using demo data.');
      // Fallback to demo data
      setApplications({
        pending: [
          {
            id: 'VISA-2024-001',
            applicant: { name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', phone: '+971 50 123 4567' },
            visaType: 'Tourist Visa - UAE',
            submittedDate: '2024-01-18',
            priority: 'high',
            currentStage: 'documents_review',
            stages: ['Application Received', 'Documents Review', 'Cost Provided', 'Payment', 'Biometrics', 'Embassy', 'Collection'],
            documents: ['Passport Data Page.pdf', 'Invitation Letter.pdf', 'Passport Photo.jpg', 'Residence Permit.pdf'],
          },
          {
            id: 'VISA-2024-002',
            applicant: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+971 55 987 6543' },
            visaType: 'Business Visa - UK',
            submittedDate: '2024-01-17',
            priority: 'medium',
            currentStage: 'cost_provided',
            stages: ['Application Received', 'Documents Review', 'Cost Provided', 'Payment', 'Biometrics', 'Embassy', 'Collection'],
            documents: ['Passport Data Page.pdf', 'Invitation Letter.pdf', 'Passport Photo.jpg'],
          },
          {
            id: 'VISA-2024-003',
            applicant: { name: 'Mohammed Ali', email: 'mohammed@example.com', phone: '+971 52 456 7890' },
            visaType: 'Tourist Visa - USA',
            submittedDate: '2024-01-16',
            priority: 'low',
            currentStage: 'application_received',
            stages: ['Application Received', 'Documents Review', 'Cost Provided', 'Payment', 'Biometrics', 'Embassy', 'Collection'],
            documents: ['Passport Data Page.pdf'],
          },
        ],
        processing: [
          {
            id: 'VISA-2023-156',
            applicant: { name: 'Fatima Hassan', email: 'fatima@example.com', phone: '+971 58 321 0987' },
            visaType: 'Work Visa - Canada',
            submittedDate: '2024-01-15',
            priority: 'high',
            currentStage: 'biometrics',
            stages: ['Application Received', 'Documents Review', 'Cost Provided', 'Payment', 'Biometrics', 'Embassy', 'Collection'],
            documents: ['All Documents.pdf'],
            biometricsDate: '2024-01-20',
            embassyDate: '2024-01-25',
          },
          {
            id: 'VISA-2023-155',
            applicant: { name: 'John Smith', email: 'john@example.com', phone: '+971 54 789 0123' },
            visaType: 'Student Visa - Australia',
            submittedDate: '2024-01-14',
            priority: 'medium',
            currentStage: 'embassy',
            stages: ['Application Received', 'Documents Review', 'Cost Provided', 'Payment', 'Biometrics', 'Embassy', 'Collection'],
            documents: ['All Documents.pdf'],
            embassyDate: '2024-01-18',
          },
        ],
        completed: [
          {
            id: 'VISA-2023-150',
            applicant: { name: 'Emily Davis', email: 'emily@example.com', phone: '+971 56 111 2222' },
            visaType: 'Tourist Visa - UAE',
            submittedDate: '2024-01-10',
            priority: 'low',
            currentStage: 'completed',
            stages: ['Application Received', 'Documents Review', 'Cost Provided', 'Payment', 'Biometrics', 'Embassy', 'Collection'],
            documents: ['All Documents.pdf'],
            completedDate: '2024-01-16',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mapStatusToStage = (status) => {
    // Map backend valid statuses to frontend stages
    const statusMap = {
      'draft': 'application_received',
      'submitted': 'application_received',
      'documents_required': 'documents_review',
      'under_review': 'documents_review',
      'biometrics_scheduled': 'biometrics',
      'biometrics_completed': 'biometrics',
      'approved': 'collection',
      'rejected': 'rejected',
      'completed': 'completed',
      'issued': 'completed'
    };
    return statusMap[status] || 'application_received';
  };

  const handleApprove = async (id) => {
    setError(null);
    try {
      const response = await adminAPI.updateApplicationStatus(id, { 
        status: 'approved',
        notes: reviewNote 
      });
      
      if (response.success) {
        setSuccess(`Application ${id} approved successfully!`);
        fetchApplications(activeTab);
        setSelectedApplication(null);
        setReviewNote('');
      } else {
        throw new Error(response.message || 'Failed to approve');
      }
    } catch (err) {
      console.error('Failed to approve application:', err);
      setError('Failed to approve application. Please try again.');
    }
  };

  const handleReject = async (id) => {
    if (!reviewNote) {
      setError('Please provide a rejection reason');
      return;
    }
    
    setError(null);
    try {
      const response = await adminAPI.updateApplicationStatus(id, { 
        status: 'rejected',
        notes: reviewNote 
      });
      
      if (response.success) {
        setSuccess(`Application ${id} rejected.`);
        fetchApplications(activeTab);
        setSelectedApplication(null);
        setReviewNote('');
      } else {
        throw new Error(response.message || 'Failed to reject');
      }
    } catch (err) {
      console.error('Failed to reject application:', err);
      setError('Failed to reject application. Please try again.');
    }
  };

  const updateStage = async (id, newStage) => {
    setError(null);
    try {
      // Map frontend stages to valid backend statuses
      const stageStatusMap = {
        'next': 'under_review',
        'documents_review': 'documents_required',
        'biometrics': 'biometrics_scheduled',
        'decision': 'approved',  // Approve to move to decision
        'collection': 'issued'
      };
      
      const response = await adminAPI.updateApplicationStatus(id, { 
        status: stageStatusMap[newStage] || newStage,
        notes: reviewNote || `Stage updated to ${newStage}`
      });
      
      if (response.success) {
        setSuccess(`Application ${id} stage updated!`);
        fetchApplications(activeTab);
      } else {
        throw new Error(response.message || 'Failed to update stage');
      }
    } catch (err) {
      console.error('Failed to update stage:', err);
      setError('Failed to update stage. Please try again.');
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'error',
      medium: 'warning',
      low: 'default',
    };
    return <Badge variant={variants[priority] || 'default'}>{priority?.charAt(0).toUpperCase() + priority?.slice(1) || 'Medium'}</Badge>;
  };

  const getStageBadge = (stage) => {
    const variants = {
      application_received: 'primary',
      documents_review: 'info',
      cost_provided: 'warning',
      payment: 'warning',
      biometrics: 'primary',
      embassy: 'info',
      collection: 'success',
      completed: 'success',
      rejected: 'error',
    };
    const labels = {
      application_received: 'Application Received',
      documents_review: 'Documents Review',
      cost_provided: 'Cost Provided',
      payment: 'Payment',
      biometrics: 'Biometrics',
      embassy: 'Embassy',
      collection: 'Collection',
      completed: 'Completed',
      rejected: 'Rejected',
    };
    return <Badge variant={variants[stage] || 'default'}>{labels[stage] || stage}</Badge>;
  };

  const tabs = [
    { id: 'pending', label: 'Pending Review', count: applications.pending.length },
    { id: 'processing', label: 'In Processing', count: applications.processing.length },
    { id: 'completed', label: 'Completed', count: applications.completed.length },
  ];

  const currentApps = applications[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Application Review</h1>
          <p className="text-neutral-500 mt-1">Review and manage visa application submissions</p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search applications..."
            className="w-64"
          />
          <Select
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'tourist', label: 'Tourist Visa' },
              { value: 'business', label: 'Business Visa' },
              { value: 'work', label: 'Work Visa' },
              { value: 'student', label: 'Student Visa' },
            ]}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert variant="success" title="Success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {applications.pending.length + applications.processing.length}
            </p>
            <p className="text-sm text-neutral-500">Active Applications</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-warning-600">{applications.pending.length}</p>
            <p className="text-sm text-neutral-500">Pending Review</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-info-600">{applications.processing.length}</p>
            <p className="text-sm text-neutral-500">In Processing</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-secondary-600">{applications.completed.length}</p>
            <p className="text-sm text-neutral-500">Completed</p>
          </Card.Body>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <Card.Body className="text-center py-12">
            <svg className="h-8 w-8 text-neutral-300 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-neutral-500 mt-4">Loading applications...</p>
          </Card.Body>
        </Card>
      )}

      {/* Tabs */}
      {!isLoading && (
        <>
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
              {currentApps.length > 0 ? (
                currentApps.map((app) => (
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
                              {getStageBadge(app.currentStage)}
                            </div>
                            <p className="text-sm text-neutral-500">{app.visaType} • {app.id}</p>
                            <p className="text-sm text-neutral-500 mt-1">
                              Submitted: {app.submittedDate}
                            </p>
                            {app.biometricsDate && (
                              <p className="text-sm text-primary-600 mt-1">
                                Biometrics: {app.biometricsDate}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="text-xs text-neutral-500">Documents:</span>
                              {app.documents.slice(0, 3).map((doc, index) => (
                                <Badge key={index} variant="secondary" size="sm">{doc}</Badge>
                              ))}
                              {app.documents.length > 3 && (
                                <Badge variant="secondary" size="sm">+{app.documents.length - 3} more</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedApplication(app)}
                          >
                            View Details
                          </Button>
                          {activeTab === 'pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApprove(app.id)}
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Card>
                  <Card.Body className="text-center py-12">
                    <svg className="h-12 w-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-neutral-500">No applications in this category</p>
                  </Card.Body>
                </Card>
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
                    {/* Applicant Info */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Applicant Information</h4>
                      <p className="font-medium text-neutral-900">{selectedApplication.applicant.name}</p>
                      <p className="text-sm text-neutral-600">{selectedApplication.applicant.email}</p>
                      <p className="text-sm text-neutral-600">{selectedApplication.applicant.phone}</p>
                    </div>

                    {/* Visa Type */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Visa Type</h4>
                      <p className="text-neutral-900">{selectedApplication.visaType}</p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-500 mb-1">Submitted</h4>
                        <p className="text-neutral-900">{selectedApplication.submittedDate}</p>
                      </div>
                      {selectedApplication.completedDate && (
                        <div>
                          <h4 className="text-sm font-medium text-neutral-500 mb-1">Completed</h4>
                          <p className="text-neutral-900">{selectedApplication.completedDate}</p>
                        </div>
                      )}
                    </div>

                    {/* Current Stage */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Processing Stage</h4>
                      {getStageBadge(selectedApplication.currentStage)}
                    </div>

                    {/* Progress */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-2">Workflow Progress</h4>
                      <ProgressBar
                        value={(selectedApplication.stages?.indexOf(selectedApplication.currentStage?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) / selectedApplication.stages?.length) * 100 || 0}
                        variant={selectedApplication.currentStage === 'completed' ? 'success' : 'primary'}
                      />
                    </div>

                    {/* Documents */}
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

                    {/* Review Notes */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Review Notes</h4>
                      <textarea
                        className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                        placeholder="Add review notes..."
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                      />
                    </div>
                  </Card.Body>
                  <Card.Footer className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleReject(selectedApplication.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedApplication(null)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApprove(selectedApplication.id)}
                    >
                      Approve
                    </Button>
                    {activeTab !== 'completed' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateStage(selectedApplication.id, 'next')}
                      >
                        Next Stage
                      </Button>
                    )}
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
        </>
      )}
    </div>
  );
}


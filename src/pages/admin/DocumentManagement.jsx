import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Select, Alert, Modal } from '../../components';
import { adminAPI } from '../../api';

/**
 * Document Management Page (Admin/Officer View)
 * View and manage all uploaded documents across all applications
 */

export default function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    documentType: '',
    search: ''
  });

  // Selected document for viewing details
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch documents on mount and when filters change
  useEffect(() => {
    fetchDocuments();
  }, [pagination.page, filters.status, filters.documentType]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status || undefined,
        documentType: filters.documentType || undefined
      };

      const response = await adminAPI.getAllDocuments(params);
      
      if (response.success && response.data) {
        setDocuments(response.data.documents || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 1
        }));
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents. Using demo data.');
      
      // Fallback to demo data
      setDocuments([
        {
          id: 'doc-001',
          fileName: 'Passport_Data_Page.pdf',
          documentType: 'passport_copy',
          status: 'approved',
          user: { firstName: 'Ahmed', lastName: 'Al-Rashid', email: 'ahmed@example.com' },
          application: { id: 'app-001', visaType: 'Tourist Visa - UAE' },
          createdAt: '2024-01-18T10:30:00Z',
          fileSize: 1024000
        },
        {
          id: 'doc-002',
          fileName: 'Invitation_Letter.pdf',
          documentType: 'invitation_letter',
          status: 'pending',
          user: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' },
          application: { id: 'app-002', visaType: 'Business Visa - UK' },
          createdAt: '2024-01-17T14:20:00Z',
          fileSize: 2048000
        },
        {
          id: 'doc-003',
          fileName: 'Passport_Photo.jpg',
          documentType: 'passport_photo',
          status: 'approved',
          user: { firstName: 'Mohammed', lastName: 'Ali', email: 'mohammed@example.com' },
          application: { id: 'app-003', visaType: 'Tourist Visa - USA' },
          createdAt: '2024-01-16T09:15:00Z',
          fileSize: 512000
        },
        {
          id: 'doc-004',
          fileName: 'Bank_Statement.pdf',
          documentType: 'bank_statement',
          status: 'rejected',
          user: { firstName: 'Fatima', lastName: 'Hassan', email: 'fatima@example.com' },
          application: { id: 'app-004', visaType: 'Work Visa - Canada' },
          createdAt: '2024-01-15T16:45:00Z',
          fileSize: 3072000
        },
        {
          id: 'doc-005',
          fileName: 'Travel_Insurance.pdf',
          documentType: 'travel_insurance',
          status: 'pending',
          user: { firstName: 'John', lastName: 'Smith', email: 'john@example.com' },
          application: { id: 'app-005', visaType: 'Student Visa - Australia' },
          createdAt: '2024-01-14T11:00:00Z',
          fileSize: 1536000
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (docId, newStatus) => {
    setError(null);
    try {
      const response = await adminAPI.updateApplicationStatus(docId, { status: newStatus });
      if (response.success) {
        setSuccess(`Document status updated to ${newStatus}`);
        fetchDocuments();
      }
    } catch (err) {
      console.error('Failed to update document status:', err);
      setError('Failed to update document status');
    }
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      expired: 'default'
    };
    return <Badge variant={variants[status] || 'default'}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</Badge>;
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      passport: 'Passport',
      passport_photo: 'Passport Photo',
      passport_copy: 'Passport Copy',
      photo: 'Photo',
      id_card: 'ID Card',
      birth_certificate: 'Birth Certificate',
      marriage_certificate: 'Marriage Certificate',
      employment_letter: 'Employment Letter',
      bank_statement: 'Bank Statement',
      travel_insurance: 'Travel Insurance',
      travel_itinerary: 'Travel Itinerary',
      flight_itinerary: 'Flight Itinerary',
      hotel_booking: 'Hotel Booking',
      invitation_letter: 'Invitation Letter',
      insurance_policy: 'Insurance Policy',
      educational_certificate: 'Educational Certificate',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Document Management</h1>
          <p className="text-neutral-500 mt-1">View and manage all uploaded documents</p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search documents..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-64"
          />
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' }
            ]}
          />
          <Select
            value={filters.documentType}
            onChange={(e) => handleFilterChange('documentType', e.target.value)}
            options={[
              { value: '', label: 'All Types' },
              { value: 'passport', label: 'Passport' },
              { value: 'passport_photo', label: 'Passport Photo' },
              { value: 'passport_copy', label: 'Passport Copy' },
              { value: 'id_card', label: 'ID Card' },
              { value: 'birth_certificate', label: 'Birth Certificate' },
              { value: 'bank_statement', label: 'Bank Statement' },
              { value: 'invitation_letter', label: 'Invitation Letter' },
              { value: 'travel_insurance', label: 'Travel Insurance' }
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
            <p className="text-3xl font-bold text-primary-900">{pagination.total}</p>
            <p className="text-sm text-neutral-500">Total Documents</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-warning-600">
              {documents.filter(d => d.status === 'pending').length}
            </p>
            <p className="text-sm text-neutral-500">Pending Review</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-success-600">
              {documents.filter(d => d.status === 'approved').length}
            </p>
            <p className="text-sm text-neutral-500">Approved</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-error-600">
              {documents.filter(d => d.status === 'rejected').length}
            </p>
            <p className="text-sm text-neutral-500">Rejected</p>
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
            <p className="text-neutral-500 mt-4">Loading documents...</p>
          </Card.Body>
        </Card>
      )}

      {/* Documents Table */}
      {!isLoading && (
        <Card>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Document</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Uploaded By</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Application</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-medium text-neutral-900">{doc.fileName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" size="sm">
                            {getDocumentTypeLabel(doc.documentType)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm text-neutral-900">
                              {doc.user?.firstName} {doc.user?.lastName}
                            </p>
                            <p className="text-xs text-neutral-500">{doc.user?.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-neutral-900">{doc.application?.visaType}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-neutral-600">{formatFileSize(doc.fileSize)}</span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(doc.status)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-neutral-600">{formatDate(doc.createdAt)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(doc)}
                            >
                              View
                            </Button>
                            {doc.status === 'pending' && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(doc.id, 'approved')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="error"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(doc.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <svg className="h-12 w-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-neutral-500">No documents found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} documents
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-neutral-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Document Details"
        size="lg"
      >
        {selectedDocument && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-500">File Name</label>
                <p className="text-neutral-900">{selectedDocument.fileName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Document Type</label>
                <p className="text-neutral-900">{getDocumentTypeLabel(selectedDocument.documentType)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Status</label>
                <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">File Size</label>
                <p className="text-neutral-900">{formatFileSize(selectedDocument.fileSize)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Uploaded By</label>
                <p className="text-neutral-900">{selectedDocument.user?.firstName} {selectedDocument.user?.lastName}</p>
                <p className="text-sm text-neutral-500">{selectedDocument.user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Application</label>
                <p className="text-neutral-900">{selectedDocument.application?.visaType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Upload Date</label>
                <p className="text-neutral-900">{formatDate(selectedDocument.createdAt)}</p>
              </div>
              {selectedDocument.description && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-neutral-500">Description</label>
                  <p className="text-neutral-900">{selectedDocument.description}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              {selectedDocument.status === 'pending' && (
                <>
                  <Button variant="success" onClick={() => {
                    handleStatusUpdate(selectedDocument.id, 'approved');
                    setIsModalOpen(false);
                  }}>
                    Approve
                  </Button>
                  <Button variant="error" onClick={() => {
                    handleStatusUpdate(selectedDocument.id, 'rejected');
                    setIsModalOpen(false);
                  }}>
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

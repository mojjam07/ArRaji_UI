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

  // Loading states for status updates
  const [updatingDocId, setUpdatingDocId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

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
      setError('Failed to load documents. Please check your connection and try again.');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (docId, newStatus) => {
    setError(null);
    setUpdatingDocId(docId);
    setUpdatingStatus(newStatus);

    try {
      const response = await adminAPI.updateDocumentStatus(docId, { status: newStatus });

      if (response && response.success) {
        setSuccess(`Document status updated to ${newStatus}`);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
        // Refresh documents list
        fetchDocuments();
      } else {
        setError(response?.message || 'Failed to update document status. Please try again.');
      }
    } catch (err) {
      console.error('Error updating document status:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      });
      setError(err.message || 'Failed to update document status. Please check your connection and try again.');
    } finally {
      setUpdatingDocId(null);
      setUpdatingStatus(null);
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

      {/* Document Preview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Document Preview"
        size="xl"
      >
        {selectedDocument && (
          <div className="space-y-4">
            {/* Document Preview */}
            <div className="bg-neutral-100 rounded-lg p-4 flex items-center justify-center min-h-[400px] max-h-[600px] overflow-auto">
              {selectedDocument.mimeType?.startsWith('image/') ? (
                <img
                  src={`/uploads/${selectedDocument.filePath}`}
                  alt={selectedDocument.fileName}
                  className="max-w-full max-h-[550px] object-contain rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%23666"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
                  }}
                />
              ) : selectedDocument.mimeType === 'application/pdf' ? (
                <div className="text-center">
                  <svg className="h-24 w-24 text-neutral-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-neutral-600 mb-4">PDF Document</p>
                  <a
                    href={`/uploads/${selectedDocument.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open PDF in New Tab
                  </a>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="h-24 w-24 text-neutral-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-neutral-600 mb-4">{selectedDocument.mimeType || 'Document'}</p>
                  <a
                    href={`/uploads/${selectedDocument.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Download Document
                  </a>
                </div>
              )}
            </div>

            {/* Document Info Bar */}
            <div className="flex items-center justify-between bg-neutral-50 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{selectedDocument.fileName}</p>
                  <p className="text-xs text-neutral-500">
                    {getDocumentTypeLabel(selectedDocument.documentType)} • {formatFileSize(selectedDocument.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedDocument.status)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-neutral-500">
                Uploaded by {selectedDocument.user?.firstName} {selectedDocument.user?.lastName} on {formatDate(selectedDocument.createdAt)}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={updatingDocId === selectedDocument.id}>
                  Close
                </Button>
                <a
                  href={`/uploads/${selectedDocument.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                {selectedDocument.status === 'pending' && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => {
                        handleStatusUpdate(selectedDocument.id, 'approved');
                        setIsModalOpen(false);
                      }}
                      disabled={updatingDocId === selectedDocument.id}
                    >
                      {updatingDocId === selectedDocument.id && updatingStatus === 'approved' ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Approving...
                        </>
                      ) : (
                        'Approve'
                      )}
                    </Button>
                    <Button
                      variant="error"
                      onClick={() => {
                        handleStatusUpdate(selectedDocument.id, 'rejected');
                        setIsModalOpen(false);
                      }}
                      disabled={updatingDocId === selectedDocument.id}
                    >
                      {updatingDocId === selectedDocument.id && updatingStatus === 'rejected' ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Rejecting...
                        </>
                      ) : (
                        'Reject'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

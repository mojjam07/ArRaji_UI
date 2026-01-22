import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Modal } from '../../components';
import { documentAPI } from '../../api';

/**
 * Document Upload & Validation Page
 * Updated for visa-specific documents
 * Integrated with backend API for real data
 */
export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const getStatusBadge = (status) => {
    const variants = {
      verified: 'success',
      pending: 'warning',
      rejected: 'error',
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      passport_data_page: 'Passport Data Page',
      invitation_letter: 'Invitation Letter',
      passport_photo: 'Passport Photograph',
      residence_permit: 'Residence Permit of Host',
    };
    return labels[type] || type;
  };

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await documentAPI.getDocuments();
      if (response.success && response.data) {
        // Backend returns data as { documents: [...] }, so extract the array
        const docsArray = Array.isArray(response.data) 
          ? response.data 
          : (response.data.documents || []);
        setDocuments(docsArray);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents. Using demo data.');
      // Fallback to demo data
      setDocuments([
        { id: 1, name: 'Passport_Data_Page.pdf', type: 'passport_data_page', size: '2.4 MB', status: 'verified', uploadDate: '2024-01-15' },
        { id: 2, name: 'Invitation_Letter.pdf', type: 'invitation_letter', size: '1.8 MB', status: 'verified', uploadDate: '2024-01-15' },
        { id: 3, name: 'Passport_Photo.jpg', type: 'passport_photo', size: '0.5 MB', status: 'pending', uploadDate: '2024-01-18' },
        { id: 4, name: 'Residence_Permit.pdf', type: 'residence_permit', size: '1.2 MB', status: 'pending', uploadDate: '2024-01-18' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    setIsUploading(true);
    setError(null);
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'other');
        
        const response = await documentAPI.uploadDocument(formData);
        
        if (response.success && response.data) {
          const newDoc = {
            id: response.data.id || documents.length + 1,
            name: file.name,
            type: response.data.type || 'other',
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            status: response.data.status || 'pending',
            uploadDate: new Date().toISOString().split('T')[0],
          };
          setDocuments((prev) => [...prev, newDoc]);
        }
      }
    } catch (err) {
      console.error('Failed to upload documents:', err);
      setError('Failed to upload some documents. Adding with demo mode.');
      // Fallback - add files locally
      Array.from(files).forEach((file) => {
        const newDoc = {
          id: documents.length + 1,
          name: file.name,
          type: 'other',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'pending',
          uploadDate: new Date().toISOString().split('T')[0],
        };
        setDocuments((prev) => [...prev, newDoc]);
      });
    } finally {
      setIsUploading(false);
      setShowUploadModal(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentAPI.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error('Failed to delete document:', err);
      // Fallback - delete locally
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  // Required visa documents
  const requiredDocuments = [
    { 
      type: 'passport_data_page', 
      required: true, 
      description: 'Clear copy of your international passport data page',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    { 
      type: 'invitation_letter', 
      required: true, 
      description: 'Invitation letter stating visa validity from host',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    { 
      type: 'passport_photo', 
      required: true, 
      description: 'Recent passport photograph with white background',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    { 
      type: 'residence_permit', 
      required: true, 
      description: 'Valid residence permit of the host country',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  const uploadedCount = requiredDocuments.filter(doc => 
    documents.find(d => d.type === doc.type && d.status === 'verified')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Documents</h1>
          <p className="text-neutral-500 mt-1">Upload and manage your visa application documents</p>
        </div>
        <Button variant="primary" onClick={() => setShowUploadModal(true)} disabled={isUploading}>
          {isUploading ? (
            <>
              <svg className="h-5 w-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Document
            </>
          )}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="warning" title="Notice" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-primary-600">{documents.length}</p>
            <p className="text-sm text-neutral-500">Total Documents</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-secondary-600">
              {documents.filter(d => d.status === 'verified').length}
            </p>
            <p className="text-sm text-neutral-500">Verified</p>
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
            <p className="text-3xl font-bold text-primary-600">
              {uploadedCount}/{requiredDocuments.length}
            </p>
            <p className="text-sm text-neutral-500">Required Documents</p>
          </Card.Body>
        </Card>
      </div>

      {/* Required Documents Checklist */}
      <Card>
        <Card.Header title="Required Documents" subtitle="Documents needed for your visa application" />
        <Card.Body className="p-0">
          <div className="divide-y divide-neutral-200">
            {requiredDocuments.map((doc, index) => {
              const uploadedDoc = documents.find(d => d.type === doc.type);
              const isVerified = uploadedDoc?.status === 'verified';
              
              return (
                <div key={index} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isVerified ? 'bg-secondary-100 text-secondary-600' : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      {doc.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {getDocumentTypeLabel(doc.type)}
                        {doc.required && <span className="text-accent-600 ml-1">*</span>}
                      </p>
                      <p className="text-sm text-neutral-500">{doc.description}</p>
                    </div>
                  </div>
                  {isVerified ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Verified</Badge>
                      <Button variant="secondary" size="sm">View</Button>
                    </div>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => setShowUploadModal(true)}>
                      Upload
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Uploaded Documents List */}
      <Card>
        <Card.Header title="Uploaded Documents" subtitle="All your uploaded files" />
        <Card.Body className="p-0">
          {documents.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {documents.map((doc) => (
                <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                      <p className="text-sm text-neutral-500">
                        {getDocumentTypeLabel(doc.type)} • {doc.size} • Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-neutral-400 hover:text-accent-600 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="h-12 w-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-neutral-500">No documents uploaded yet</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Alert */}
      <Alert variant="warning" title="Verification in Progress">
        Some documents are still pending verification. This may take 24-48 hours. Please ensure all documents are clear and legible.
      </Alert>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
        size="md"
      >
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg className="h-12 w-12 text-neutral-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-lg font-medium text-neutral-900 mb-2">Drag and drop files here</p>
          <p className="text-sm text-neutral-500 mb-4">or click to browse</p>
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <label htmlFor="file-upload">
            <Button variant="secondary" as="span" className="cursor-pointer">
              Browse Files
            </Button>
          </label>
        </div>
        <div className="mt-4 text-xs text-neutral-500">
          <p className="font-medium mb-1">Supported formats:</p>
          <p>PDF, JPG, PNG (Max 10MB each)</p>
          <p className="mt-2">For passport photos: JPG or PNG only, max 5MB, white background preferred</p>
        </div>
      </Modal>
    </div>
  );
}


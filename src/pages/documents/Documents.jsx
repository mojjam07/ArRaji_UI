import React, { useState } from 'react';
import { Card, Button, Badge, Alert, Modal } from '../../components';

/**
 * Document Upload & Validation Page
 */
export default function Documents() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Business License.pdf', type: 'Business License', size: '2.4 MB', status: 'verified', uploadDate: '2024-01-15' },
    { id: 2, name: 'Tax Registration.pdf', type: 'Tax Registration', size: '1.8 MB', status: 'verified', uploadDate: '2024-01-15' },
    { id: 3, name: 'ID Copy.pdf', type: 'ID Copy', size: '0.5 MB', status: 'pending', uploadDate: '2024-01-18' },
  ]);
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
    // Handle file drop
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    // Add files to document list
    Array.from(files).forEach((file) => {
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        type: 'Other Document',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'pending',
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setDocuments((prev) => [...prev, newDoc]);
    });
    setShowUploadModal(false);
  };

  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const requiredDocuments = [
    { type: 'ID Copy', required: true, description: 'Government-issued ID (Passport/National ID)' },
    { type: 'Business License', required: true, description: 'Valid business registration certificate' },
    { type: 'Tax Registration', required: true, description: 'Tax identification documents' },
    { type: 'Proof of Address', required: false, description: 'Recent utility bill or bank statement' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Documents</h1>
          <p className="text-neutral-500 mt-1">Upload and manage your application documents</p>
        </div>
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Document
        </Button>
      </div>

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
            <p className="text-3xl font-bold text-accent-600">
              {documents.filter(d => d.status === 'rejected').length}
            </p>
            <p className="text-sm text-neutral-500">Rejected</p>
          </Card.Body>
        </Card>
      </div>

      {/* Required Documents Checklist */}
      <Card>
        <Card.Header title="Required Documents" subtitle="Documents needed for your application" />
        <Card.Body className="p-0">
          <div className="divide-y divide-neutral-200">
            {requiredDocuments.map((doc, index) => {
              const uploadedDoc = documents.find(d => d.type === doc.type);
              return (
                <div key={index} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${uploadedDoc ? 'bg-secondary-100' : 'bg-neutral-100'}`}>
                      {uploadedDoc ? (
                        <svg className="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {doc.type}
                        {doc.required && <span className="text-accent-600 ml-1">*</span>}
                      </p>
                      <p className="text-sm text-neutral-500">{doc.description}</p>
                    </div>
                  </div>
                  {uploadedDoc ? (
                    getStatusBadge(uploadedDoc.status)
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
          <div className="divide-y divide-neutral-200">
            {documents.map((doc) => (
              <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                    <p className="text-sm text-neutral-500">{doc.type} • {doc.size} • Uploaded {doc.uploadDate}</p>
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
        </Card.Body>
      </Card>

      {/* Alert */}
      <Alert variant="warning" title="Verification in Progress">
        Some documents are still pending verification. This may take 24-48 hours.
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
          Supported formats: PDF, JPG, PNG (Max 10MB each)
        </div>
      </Modal>
    </div>
  );
}


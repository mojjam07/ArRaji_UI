import React, { useState, useRef, useCallback } from 'react';
import { documentAPI } from '../../api';

/**
 * DocumentUpload Component
 * Reusable document upload zone with drag-and-drop and click-to-upload functionality
 * Used in visa application document step
 */
export default function DocumentUpload({
  type,
  label,
  description,
  required = false,
  icon = 'document',
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 10 * 1024 * 1024, // 10MB default
  uploadedFile,
  onUpload,
  onRemove,
  disabled = false,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Get icon based on type
  const getIcon = () => {
    const iconMap = {
      document: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      ),
      passport: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      ),
      photo: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
      building: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      ),
    };
    return iconMap[icon] || iconMap.document;
  };

  // Validate file
  const validateFile = (file) => {
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const acceptedTypes = accept.split(',').map(ext => ext.trim().replace('.', ''));
    
    if (!acceptedTypes.includes(fileExtension)) {
      return `Invalid file type. Please upload ${accept} files.`;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0);
      return `File too large. Maximum size is ${maxSizeMB}MB.`;
    }

    return null;
  };

  // Map frontend document types to backend-accepted types
  const getBackendDocumentType = (frontendType) => {
    const typeMapping = {
      'invitation_letter': 'invitation_letter',
      'passport_data_page': 'passport_copy',
      'passport_photo': 'passport_photo',
      'residence_permit': 'other',
      'passport_copy': 'passport_copy',
      'id_card': 'id_card',
      'birth_certificate': 'birth_certificate',
      'marriage_certificate': 'marriage_certificate',
      'employment_letter': 'employment_letter',
      'bank_statement': 'bank_statement',
      'travel_itinerary': 'travel_itinerary',
      'hotel_booking': 'hotel_booking',
      'insurance_policy': 'insurance_policy',
      'educational_certificate': 'educational_certificate',
    };
    return typeMapping[frontendType] || 'other';
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    setError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Map frontend type to backend-accepted type
      formData.append('documentType', getBackendDocumentType(type));
      // Also include description for clarity
      formData.append('description', `${label} - ${description}`);

      const response = await documentAPI.uploadDocument(formData);

      if (response.success && response.data) {
        onUpload({
          id: response.data.id || Date.now(),
          name: file.name,
          type: type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          file: file,
          uploadedAt: new Date().toISOString(),
        });
      } else {
        // Fallback: store file locally without API
        onUpload({
          id: Date.now(),
          name: file.name,
          type: type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          file: file,
          uploadedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Upload failed:', err);
      // Fallback: store file locally
      onUpload({
        id: Date.now(),
        name: file.name,
        type: type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        file: file,
        uploadedAt: new Date().toISOString(),
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [disabled, isUploading]);

  // Handle file selection from input
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
    // Reset input value to allow re-uploading same file
    e.target.value = '';
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  // Handle remove uploaded file
  const handleRemove = (e) => {
    e.stopPropagation();
    if (disabled || isUploading) return;
    onRemove();
  };

  // Determine border color based on state
  const getBorderColor = () => {
    if (dragActive) return 'border-primary-900 bg-primary-50';
    if (uploadedFile) return 'border-secondary-500 bg-secondary-50';
    if (error) return 'border-accent-600 bg-accent-50';
    return 'border-neutral-300 hover:border-primary-900';
  };

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center 
          transition-all cursor-pointer
          ${getBorderColor()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isUploading ? 'animate-pulse' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {isUploading ? (
          <div className="space-y-3">
            <svg className="h-10 w-10 text-primary-900 mx-auto animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm font-medium text-primary-900">Uploading...</p>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-700 truncate px-4">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-neutral-500">
              {uploadedFile.size} • Click to replace
            </p>
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-accent-600 transition-colors"
              disabled={disabled}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="h-10 w-10 text-neutral-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {getIcon()}
            </svg>
            <p className="text-sm font-medium text-neutral-700">{label}</p>
            <p className="text-xs text-neutral-500">{description}</p>
            {required && (
              <p className="text-xs text-accent-600 font-medium">Required *</p>
            )}
            <p className="text-xs text-neutral-400 mt-2">
              Click or drag file here
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-accent-600">{error}</p>
      )}

      {/* File Info */}
      {uploadedFile && !isUploading && (
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
          <span>Type: {accept.replace(/[.,]/g, ', ')}</span>
          <span>Max: {(maxSize / 1024 / 1024).toFixed(0)}MB</span>
        </div>
      )}
    </div>
  );
}


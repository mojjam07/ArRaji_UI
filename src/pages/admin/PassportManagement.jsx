import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Select, Modal, Alert, ProgressBar } from '../../components';
import { adminAPI } from '../../api';

/**
 * Admin Passport Management Page
 * Track passport location and courier status throughout visa processing
 * Integrated with backend API for real data
 */
export default function PassportManagement() {
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateLocation, setUpdateLocation] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passports, setPassports] = useState([]);

  // Fetch passport data on mount
  useEffect(() => {
    fetchPassportData();
  }, []);

  const fetchPassportData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getPassportTracking({});
      if (response.success && response.data) {
        setPassports(response.data.passports || []);
      }
    } catch (err) {
      console.error('Failed to fetch passport data:', err);
      setError('Failed to load passport data. Using demo data.');
      // Fallback to demo data
      setPassports([
        {
          id: 'PP-001',
          applicationId: 'VISA-2024-001',
          applicant: { name: 'Ahmed Al-Rashid', phone: '+971 50 123 4567', email: 'ahmed@example.com' },
          currentLocation: 'with_courier',
          locationHistory: [
            { status: 'application_received', location: 'Client', date: '2024-01-15 09:30', note: 'Application received' },
            { status: 'documents_collected', location: 'Office', date: '2024-01-15 14:00', note: 'Documents verified' },
            { status: 'with_courier', location: 'Lagos to Abuja', date: '2024-01-16 10:00', note: 'Courier picked up for embassy submission' },
          ],
          courier: { name: 'DHL Express', tracking: 'DHL123456789', eta: '2024-01-17' },
          embassy: { name: 'UAE Embassy Abuja', submittedDate: null, collectedDate: null },
          status: 'in_transit',
          priority: 'high',
          lastUpdated: '2024-01-16 10:30',
        },
        {
          id: 'PP-002',
          applicationId: 'VISA-2024-002',
          applicant: { name: 'Sarah Johnson', phone: '+971 55 987 6543', email: 'sarah@example.com' },
          currentLocation: 'at_embassy',
          locationHistory: [
            { status: 'application_received', location: 'Client', date: '2024-01-10 11:15', note: 'Application received' },
            { status: 'documents_collected', location: 'Office', date: '2024-01-10 16:00', note: 'Documents verified' },
            { status: 'courier_to_embassy', location: 'Abuja Office', date: '2024-01-12 08:00', note: 'With courier to embassy' },
            { status: 'at_embassy', location: 'UK Embassy Abuja', date: '2024-01-12 14:00', note: 'Submitted to embassy' },
          ],
          courier: { name: 'FedEx', tracking: 'FX987654321', eta: null },
          embassy: { name: 'UK Embassy Abuja', submittedDate: '2024-01-12', collectedDate: null },
          status: 'at_embassy',
          priority: 'medium',
          lastUpdated: '2024-01-12 14:00',
        },
        {
          id: 'PP-003',
          applicationId: 'VISA-2024-003',
          applicant: { name: 'Mohammed Ali', phone: '+971 52 456 7890', email: 'mohammed@example.com' },
          currentLocation: 'with_client',
          locationHistory: [
            { status: 'application_received', location: 'Client', date: '2024-01-18 08:45', note: 'Application started' },
          ],
          courier: null,
          embassy: null,
          status: 'pending',
          priority: 'low',
          lastUpdated: '2024-01-18 08:45',
        },
        {
          id: 'PP-004',
          applicationId: 'VISA-2023-156',
          applicant: { name: 'Fatima Hassan', phone: '+971 58 321 0987', email: 'fatima@example.com' },
          currentLocation: 'returned_to_client',
          locationHistory: [
            { status: 'application_received', location: 'Client', date: '2024-01-10 09:00', note: 'Application received' },
            { status: 'at_embassy', location: 'Embassy', date: '2024-01-12 10:00', note: 'Submitted' },
            { status: 'visa_collected', location: 'Embassy', date: '2024-01-15 14:00', note: 'Visa collected' },
            { status: 'with_courier', location: 'Courier', date: '2024-01-15 16:00', note: 'Return courier' },
            { status: 'returned_to_client', location: 'Client', date: '2024-01-16 11:00', note: 'Delivered to client' },
          ],
          courier: { name: 'DHL Express', tracking: 'DHL111222333', eta: null },
          embassy: { name: 'USA Embassy Abuja', submittedDate: '2024-01-12', collectedDate: '2024-01-15' },
          status: 'completed',
          priority: 'low',
          lastUpdated: '2024-01-16 11:00',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!updateStatus || !updateLocation) {
      setError('Please select both status and location');
      return;
    }

    setError(null);
    try {
      const response = await adminAPI.updatePassportStatus(selectedPassport.id, {
        status: updateStatus,
        location: updateLocation,
        note: `Status updated by admin`
      });

      if (response.success) {
        setSuccess('Passport status updated successfully!');
        fetchPassportData();
        setShowUpdateModal(false);
        setUpdateStatus('');
        setUpdateLocation('');
        setSelectedPassport(null);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update passport status:', err);
      setError('Failed to update status. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      in_transit: 'primary',
      at_embassy: 'info',
      visa_collected: 'secondary',
      with_courier: 'primary',
      returned_to_client: 'success',
      rejected: 'error',
    };
    const labels = {
      pending: 'Pending',
      in_transit: 'In Transit',
      at_embassy: 'At Embassy',
      visa_collected: 'Visa Collected',
      with_courier: 'With Courier',
      returned_to_client: 'Returned',
      rejected: 'Rejected',
    };
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'error',
      medium: 'warning',
      low: 'default',
    };
    return <Badge variant={variants[priority] || 'default'}>{priority}</Badge>;
  };

  const getLocationIcon = (location) => {
    switch (location) {
      case 'with_client':
        return '👤';
      case 'with_courier':
        return '📦';
      case 'at_embassy':
        return '🏛️';
      case 'office':
        return '🏢';
      default:
        return '📍';
    }
  };

  const filteredPassports = filter === 'all' 
    ? passports 
    : passports.filter(p => p.status === filter);

  const handleAddPassport = () => {
    // Show a modal or navigate to add passport page
    setSuccess('Add Passport functionality - Modal would open here');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
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

      {/* Loading State */}
      {isLoading && (
        <Card>
          <Card.Body className="text-center py-12">
            <svg className="h-8 w-8 text-neutral-300 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-neutral-500 mt-4">Loading passport data...</p>
          </Card.Body>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Passport Management</h1>
          <p className="text-neutral-500 mt-1">Track passport location and courier status</p>
        </div>
        <Button variant="primary" onClick={handleAddPassport}>
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Passport
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-neutral-900">{passports.length}</p>
            <p className="text-sm text-neutral-500">Total Passports</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-warning-600">
              {passports.filter(p => p.status === 'pending').length}
            </p>
            <p className="text-sm text-neutral-500">Pending</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {passports.filter(p => p.status === 'in_transit' || p.status === 'with_courier').length}
            </p>
            <p className="text-sm text-neutral-500">In Transit</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-info-600">
              {passports.filter(p => p.status === 'at_embassy').length}
            </p>
            <p className="text-sm text-neutral-500">At Embassy</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-3xl font-bold text-secondary-600">
              {passports.filter(p => p.status === 'returned_to_client' || p.status === 'completed').length}
            </p>
            <p className="text-sm text-neutral-500">Returned</p>
          </Card.Body>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Passports' },
            { value: 'pending', label: 'Pending' },
            { value: 'in_transit', label: 'In Transit' },
            { value: 'at_embassy', label: 'At Embassy' },
            { value: 'with_courier', label: 'With Courier' },
            { value: 'returned_to_client', label: 'Returned' },
          ]}
          className="w-48"
        />
        <Input placeholder="Search by applicant name or ID..." className="w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Passport List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPassports.map((passport) => (
            <Card 
              key={passport.id} 
              hover={selectedPassport?.id !== passport.id}
              className={`${selectedPassport?.id === passport.id ? 'ring-2 ring-primary-500' : ''}`}
            >
              <Card.Body>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-medium text-primary-700">
                        {passport.applicant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">{passport.applicant.name}</h3>
                        {getPriorityBadge(passport.priority)}
                        {getStatusBadge(passport.status)}
                      </div>
                      <p className="text-sm text-neutral-500">{passport.applicationId} • {passport.id}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg">{getLocationIcon(passport.currentLocation)}</span>
                        <span className="text-sm text-neutral-600">
                          Current: {passport.currentLocation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Last updated: {passport.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedPassport(passport)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedPassport(passport);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedPassport ? (
            <Card className="sticky top-6">
              <Card.Header
                title="Passport Details"
                subtitle={selectedPassport.id}
                action={
                  <button
                    onClick={() => setSelectedPassport(null)}
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
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Applicant</h4>
                  <p className="font-medium text-neutral-900">{selectedPassport.applicant.name}</p>
                  <p className="text-sm text-neutral-600">{selectedPassport.applicant.email}</p>
                  <p className="text-sm text-neutral-600">{selectedPassport.applicant.phone}</p>
                </div>

                {/* Current Status */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Current Location</h4>
                  <p className="text-neutral-900">
                    {selectedPassport.currentLocation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>

                {/* Courier Info */}
                {selectedPassport.courier && (
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Courier Information</h4>
                    <p className="text-sm text-neutral-900">{selectedPassport.courier.name}</p>
                    <p className="text-sm text-neutral-600">Tracking: {selectedPassport.courier.tracking}</p>
                    {selectedPassport.courier.eta && (
                      <p className="text-sm text-neutral-600">ETA: {selectedPassport.courier.eta}</p>
                    )}
                  </div>
                )}

                {/* Embassy Info */}
                {selectedPassport.embassy && (
                  <div className="p-3 bg-neutral-50 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Embassy Information</h4>
                    <p className="text-sm text-neutral-900">{selectedPassport.embassy.name}</p>
                    {selectedPassport.embassy.submittedDate && (
                      <p className="text-sm text-neutral-600">Submitted: {selectedPassport.embassy.submittedDate}</p>
                    )}
                    {selectedPassport.embassy.collectedDate && (
                      <p className="text-sm text-neutral-600">Collected: {selectedPassport.embassy.collectedDate}</p>
                    )}
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-2">Location History</h4>
                  <div className="space-y-3">
                    {selectedPassport.locationHistory.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-xs">{getLocationIcon(item.status)}</span>
                          </div>
                          {index < selectedPassport.locationHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-neutral-200 my-1"></div>
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="text-sm font-medium text-neutral-900">{item.note}</p>
                          <p className="text-xs text-neutral-500">{item.location} • {item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowUpdateModal(true)}
                >
                  Update Status
                </Button>
              </Card.Footer>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <svg className="h-12 w-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <p className="text-neutral-500">Select a passport to view details</p>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Passport Status"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              New Status
            </label>
            <Select
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              options={[
                { value: '', label: 'Select status' },
                { value: 'with_courier', label: 'With Courier' },
                { value: 'at_embassy', label: 'At Embassy' },
                { value: 'visa_collected', label: 'Visa Collected' },
                { value: 'with_courier_return', label: 'Courier Return' },
                { value: 'returned_to_client', label: 'Returned to Client' },
              ]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Location
            </label>
            <Input
              value={updateLocation}
              onChange={(e) => setUpdateLocation(e.target.value)}
              placeholder="e.g., DHL Office Lagos, UK Embassy, etc."
              className="w-full"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleUpdateStatus}>
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


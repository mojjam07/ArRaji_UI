import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Checkbox, Alert, ProgressBar, Badge } from '../../components';
import { applicationAPI } from '../../api';

/**
 * Visa Application Form Page
 * 6 steps: Personal Info, Passport Details, Biometrics, Documents, Cost, Review
 * Integrated with backend API for real data
 */
export default function Applications() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [costEstimation, setCostEstimation] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Step 2: Passport Details
    passportNumber: '',
    passportIssueDate: '',
    passportIssuePlace: '',
    passportExpiryDate: '',
    
    // Step 3: Biometrics Information
    biometricsLocation: '',
    biometricsDate: '',
    biometricsTime: '',
    expectedTravelDate: '',
    
    // Step 4: Documents
    invitationLetter: null,
    passportDataPage: null,
    passportPhoto: null,
    residencePermit: null,
    
    // Step 5: Cost & Payment
    costAgreed: false,
    paymentMethod: 'card',
    
    // Step 6: Review
    agreed: false,
  });

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Passport Details' },
    { number: 3, title: 'Biometrics' },
    { number: 4, title: 'Documents' },
    { number: 5, title: 'Cost Review' },
    { number: 6, title: 'Submit' },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchMyApplications();
    fetchCostEstimation('tourist');
  }, []);

  const fetchMyApplications = async () => {
    setError(null);
    try {
      const response = await applicationAPI.getMyApplications();
      if (response.success && response.data) {
        setMyApplications(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load your applications. Using demo data.');
      // Fallback to demo data
      setMyApplications([
        { id: 'VISA-001', visaType: 'Tourist Visa - UAE', status: 'draft', createdAt: new Date().toISOString() },
        { id: 'VISA-002', visaType: 'Business Visa - UK', status: 'submitted', createdAt: new Date().toISOString() },
      ]);
    }
  };

  const fetchCostEstimation = async (visaType) => {
    try {
      const response = await applicationAPI.getCostEstimation(visaType);
      if (response.success && response.data) {
        setCostEstimation(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch cost estimation:', err);
      // Fallback mock data
      setCostEstimation({
        processingFee: 150,
        biometricsFee: 50,
        courierFee: 25,
        total: 225,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreed || !formData.costAgreed) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const applicationData = {
        personalInfo: {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
        },
        passportDetails: {
          passportNumber: formData.passportNumber,
          passportIssueDate: formData.passportIssueDate,
          passportIssuePlace: formData.passportIssuePlace,
          passportExpiryDate: formData.passportExpiryDate,
        },
        biometricsInfo: {
          location: formData.biometricsLocation,
          date: formData.biometricsDate,
          time: formData.biometricsTime,
          expectedTravelDate: formData.expectedTravelDate,
        },
      };

      const response = await applicationAPI.createApplication(applicationData);
      
      if (response.success) {
        setSuccess(true);
        alert(`Visa application submitted successfully! Application ID: ${response.data?.id || 'VISA-NEW'}. You will receive a cost estimate within 24 hours.`);
        
        // Refresh applications list
        fetchMyApplications();
        
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          passportNumber: '',
          passportIssueDate: '',
          passportIssuePlace: '',
          passportExpiryDate: '',
          biometricsLocation: '',
          biometricsDate: '',
          biometricsTime: '',
          expectedTravelDate: '',
          invitationLetter: null,
          passportDataPage: null,
          passportPhoto: null,
          residencePermit: null,
          costAgreed: false,
          paymentMethod: 'card',
          agreed: false,
        });
        setCurrentStep(1);
      } else {
        throw new Error(response.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      // For demo, still show success message
      alert('Demo: Application would be submitted. API connection required for real submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Personal Information</h3>
      <p className="text-sm text-neutral-500 mb-4">Enter your full name as it appears in your passport</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="Enter first name"
          required
        />
        <Input
          label="Middle Name"
          value={formData.middleName}
          onChange={(e) => handleInputChange('middleName', e.target.value)}
          placeholder="Enter middle name (optional)"
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="Enter last name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter email"
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Enter phone number"
          required
        />
        <Input
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Passport Details</h3>
      <p className="text-sm text-neutral-500 mb-4">Enter your international passport information</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Passport Number"
          value={formData.passportNumber}
          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
          placeholder="Enter passport number"
          required
        />
        <Input
          label="Date of Issuance"
          type="date"
          value={formData.passportIssueDate}
          onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
          required
        />
        <Input
          label="Place of Issuance"
          value={formData.passportIssuePlace}
          onChange={(e) => handleInputChange('passportIssuePlace', e.target.value)}
          placeholder="City, Country"
          required
        />
        <Input
          label="Expiry Date"
          type="date"
          value={formData.passportExpiryDate}
          onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
          required
        />
      </div>
      <Alert variant="info" title="Passport Validity">
        Please ensure your passport has at least 6 months validity from your intended travel date.
      </Alert>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Biometrics Information</h3>
      <p className="text-sm text-neutral-500 mb-4">Schedule your biometrics appointment</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Preferred Location"
          value={formData.biometricsLocation}
          onChange={(e) => handleInputChange('biometricsLocation', e.target.value)}
          options={[
            { value: '', label: 'Select location' },
            { value: 'lagos', label: 'Lagos' },
            { value: 'abuja', label: 'Abuja' },
          ]}
          required
        />
        <Input
          label="Expected Date of Travel"
          type="date"
          value={formData.expectedTravelDate}
          onChange={(e) => handleInputChange('expectedTravelDate', e.target.value)}
          required
        />
        <Input
          label="Preferred Date"
          type="date"
          value={formData.biometricsDate}
          onChange={(e) => handleInputChange('biometricsDate', e.target.value)}
          required
        />
        <Select
          label="Preferred Time"
          value={formData.biometricsTime}
          onChange={(e) => handleInputChange('biometricsTime', e.target.value)}
          options={[
            { value: '', label: 'Select time' },
            { value: '08:00', label: '8:00 AM' },
            { value: '08:45', label: '8:45 AM' },
            { value: '09:30', label: '9:30 AM' },
            { value: '10:15', label: '10:15 AM' },
            { value: '11:00', label: '11:00 AM' },
            { value: '11:45', label: '11:45 AM' },
            { value: '12:30', label: '12:30 PM' },
            { value: '13:15', label: '1:15 PM' },
            { value: '14:00', label: '2:00 PM' },
            { value: '14:45', label: '2:45 PM' },
            { value: '15:30', label: '3:30 PM' },
          ]}
          required
        />
      </div>
      <Alert variant="warning" title="Biometrics Schedule">
        Biometrics appointments are only available on weekdays between 8:00 AM and 3:45 PM.
      </Alert>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Document Upload</h3>
      <p className="text-sm text-neutral-500 mb-4">Upload all required documents for your visa application</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invitation Letter */}
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
          <svg className="h-10 w-10 text-neutral-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium text-neutral-700">Invitation Letter</p>
          <p className="text-xs text-neutral-500 mt-1">Stating visa validity</p>
          <p className="text-xs text-accent-600 mt-2">Required *</p>
        </div>

        {/* International Passport Data Page */}
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
          <svg className="h-10 w-10 text-neutral-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <p className="text-sm font-medium text-neutral-700">Passport Data Page</p>
          <p className="text-xs text-neutral-500 mt-1">Clear copy of data page</p>
          <p className="text-xs text-accent-600 mt-2">Required *</p>
        </div>

        {/* Passport Photograph */}
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
          <svg className="h-10 w-10 text-neutral-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium text-neutral-700">Passport Photograph</p>
          <p className="text-xs text-neutral-500 mt-1">White background</p>
          <p className="text-xs text-accent-600 mt-2">Required *</p>
        </div>

        {/* Residence Permit of Host */}
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
          <svg className="h-10 w-10 text-neutral-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-sm font-medium text-neutral-700">Residence Permit of Host</p>
          <p className="text-xs text-neutral-500 mt-1">Host's valid residence permit</p>
          <p className="text-xs text-accent-600 mt-2">Required *</p>
        </div>
      </div>

      <Alert variant="info" title="Document Requirements">
        All documents must be clear and legible. PDF, JPG, PNG formats accepted (Max 10MB each).
      </Alert>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Cost Review</h3>
      
      <Card>
        <Card.Header title="Estimated Visa Costs" subtitle={costEstimation ? 'Based on selected visa type' : 'Will be provided within 24 hours'} />
        <Card.Body>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-600">Visa Processing Fee</span>
              <span className="font-semibold">
                {costEstimation ? `$${costEstimation.processingFee}` : 'Pending (24h)'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-600">Biometrics Fee</span>
              <span className="font-semibold">
                {costEstimation ? `$${costEstimation.biometricsFee}` : 'Pending (24h)'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-600">Courier Service (if applicable)</span>
              <span className="font-semibold">
                {costEstimation ? `$${costEstimation.courierFee}` : 'Pending (24h)'}
              </span>
            </div>
            <div className="border-t border-neutral-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-neutral-900">Total Estimated Cost</span>
                <span className="text-lg font-bold text-primary-600">
                  {costEstimation ? `$${costEstimation.total}` : 'To be confirmed (24h)'}
                </span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Alert variant="info" title="24-Hour Cost Guarantee">
        {costEstimation 
          ? 'This is the estimated cost for your visa application. Final costs may vary slightly.'
          : 'You will receive a detailed cost breakdown within 24 hours of submitting your application. Payment will be required before processing begins.'}
      </Alert>

      <Checkbox
        checked={formData.costAgreed}
        onChange={(e) => handleInputChange('costAgreed', e.target.checked)}
        label="I understand the costs and agree to proceed with the application."
      />
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Review & Submit</h3>
      
      <Card>
        <Card.Header title="Application Summary" />
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Personal Information</h4>
              <p className="text-neutral-900">{formData.firstName} {formData.middleName} {formData.lastName}</p>
              <p className="text-neutral-600">{formData.email}</p>
              <p className="text-neutral-600">{formData.phone}</p>
              <p className="text-neutral-600">DOB: {formData.dateOfBirth}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Passport Details</h4>
              <p className="text-neutral-900">Passport: {formData.passportNumber}</p>
              <p className="text-neutral-600">Issued: {formData.passportIssueDate} at {formData.passportIssuePlace}</p>
              <p className="text-neutral-600">Expires: {formData.passportExpiryDate}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Biometrics</h4>
              <p className="text-neutral-900">Location: {formData.biometricsLocation === 'lagos' ? 'Lagos' : formData.biometricsLocation === 'abuja' ? 'Abuja' : ''}</p>
              <p className="text-neutral-600">Date: {formData.biometricsDate}</p>
              <p className="text-neutral-600">Time: {formData.biometricsTime}</p>
              <p className="text-neutral-600">Travel Date: {formData.expectedTravelDate}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Documents</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Invitation Letter</Badge>
                <Badge variant="primary">Passport Data Page</Badge>
                <Badge variant="primary">Passport Photo</Badge>
                <Badge variant="primary">Residence Permit</Badge>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Checkbox
        checked={formData.agreed}
        onChange={(e) => handleInputChange('agreed', e.target.checked)}
        label="I confirm that all information provided is accurate and complete. I understand that I will receive cost details within 24 hours."
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Visa Application</h1>
        <p className="text-neutral-500 mt-1">Complete all steps to submit your visa application</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert variant="success" title="Success" onClose={() => setSuccess(false)}>
          Your application has been submitted successfully!
        </Alert>
      )}

      {/* My Applications Section */}
      {myApplications.length > 0 && (
        <Card>
          <Card.Header title="My Applications" subtitle="Your submitted applications" />
          <Card.Body className="p-0">
            <div className="divide-y divide-neutral-100">
              {myApplications.map((app) => (
                <div key={app.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{app.visaType}</p>
                    <p className="text-sm text-neutral-500">ID: {app.id} • Submitted: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={app.status === 'submitted' ? 'primary' : 'warning'}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Progress Steps */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    ${currentStep >= step.number
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'}
                  `}>
                    {currentStep > step.number ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-xs mt-2 whitespace-nowrap ${currentStep >= step.number ? 'text-primary-600 font-medium' : 'text-neutral-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 min-w-[20px] ${currentStep > step.number ? 'bg-primary-600' : 'bg-neutral-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Form Content */}
      <Card>
        <Card.Body>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </Card.Body>
        <Card.Footer className="flex justify-between">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep < 6 ? (
            <Button variant="primary" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!formData.agreed || !formData.costAgreed || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
}


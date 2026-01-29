import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Checkbox, Alert, ProgressBar, Badge, DocumentUpload } from '../../components';
import { applicationAPI } from '../../api';

/**
 * Visa Application Form Page
 * 6 steps: Personal Info, Passport Details, Documents, Biometrics, Cost, Review
 * Integrated with backend API for real data
 */
export default function Applications() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  
  // Document upload state
  const [uploadedDocuments, setUploadedDocuments] = useState({
    invitationLetter: null,
    passportDataPage: null,
    passportPhoto: null,
    residencePermit: null,
  });

  const [formData, setFormData] = useState({
    // Visa Type (required for submission)
    visaType: 'tourist',
    
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
    
    // Step 3: Documents (kept for reference)
    invitationLetter: null,
    passportDataPage: null,
    passportPhoto: null,
    residencePermit: null,

    // Step 4: Cost & Payment
    costAgreed: false,
    paymentMethod: 'card',
    
    // Step 5: Biometrics Information
    biometricsLocation: '',
    biometricsDate: '',
    biometricsTime: '',
    expectedTravelDate: '',
    
    // Step 6: Review
    agreed: false,
  });

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Passport Details' },
    { number: 3, title: 'Documents' },
    { number: 4, title: 'Cost Review' },
    { number: 5, title: 'Biometrics' },
    { number: 6, title: 'Submit' },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchMyApplications();
    // Only fetch cost estimation if user has draft applications (not yet submitted)
    // Cost estimation is provided by admin after submission, not fetched automatically
  }, []);

  const fetchMyApplications = async () => {
    setError(null);
    try {
      const response = await applicationAPI.getMyApplications();
      
      if (response.success && response.data) {
        // Handle both array and object with applications property
        const applications = Array.isArray(response.data) 
          ? response.data 
          : response.data.applications || [];
        setMyApplications(applications);
      } else {
        throw new Error(response.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response?.data
      });
      setError(`Failed to load applications: ${err.message}. Using demo data.`);
      // Fallback to demo data
      setMyApplications([
        { id: 'VISA-001', visaType: 'Tourist Visa - UAE', status: 'draft', createdAt: new Date().toISOString() },
        { id: 'VISA-002', visaType: 'Business Visa - UK', status: 'submitted', createdAt: new Date().toISOString() },
      ]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Document upload handlers
  const handleDocumentUpload = (type) => (documentData) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [type]: documentData,
    }));
    // Also update formData for backward compatibility
    setFormData(prev => ({
      ...prev,
      [type]: documentData,
    }));
  };

  const handleDocumentRemove = (type) => () => {
    setUploadedDocuments(prev => ({
      ...prev,
      [type]: null,
    }));
    // Also update formData for backward compatibility
    setFormData(prev => ({
      ...prev,
      [type]: null,
    }));
  };

  // Check if all required documents are uploaded
  const allDocumentsUploaded = Object.values(uploadedDocuments).every(doc => doc !== null);

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
      // Flatten the form data to match backend expected structure
      const applicationData = {
        // Required: visaType
        visaType: formData.visaType,
        
        // Personal info fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        
        // Passport details
        passportNumber: formData.passportNumber,
        passportIssueDate: formData.passportIssueDate,
        passportIssuePlace: formData.passportIssuePlace,
        passportExpiryDate: formData.passportExpiryDate,
        
        // Biometrics info
        biometricsLocation: formData.biometricsLocation,
        biometricsDate: formData.biometricsDate,
        biometricsTime: formData.biometricsTime,
        expectedTravelDate: formData.expectedTravelDate,
        
        // Additional optional fields
        purposeOfTravel: formData.purposeOfTravel || '',
        intendedDurationOfStay: formData.intendedDurationOfStay || 30,
        destinationCountry: formData.destinationCountry || '',
      };

      console.log('Submitting application data:', applicationData);

      // Create the application (draft status)
      const createResponse = await applicationAPI.createApplication(applicationData);

      if (createResponse.success && createResponse.data?.application?.id) {
        const applicationId = createResponse.data.application.id;

        // Submit the application for admin review
        const submitResponse = await applicationAPI.submitApplication(applicationId);

        if (submitResponse.success) {
          setSuccess(true);
          alert(`Visa application submitted successfully for admin review! Application ID: ${applicationId}. You will receive a cost estimate within 24 hours.`);

          // Refresh applications list
          fetchMyApplications();

          // Reset form
          setFormData({
            visaType: 'tourist',
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
          throw new Error(submitResponse.message || 'Failed to submit application for review');
        }
      } else {
        throw new Error(createResponse.message || 'Failed to create application');
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Visa & Personal Information</h3>
      <p className="text-sm text-neutral-500 mb-4">Select your visa type and enter your full name as it appears in your passport</p>
      
      {/* Visa Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Visa Type <span className="text-accent-600">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'tourist', label: 'Tourist', icon: '🏖️' },
            { value: 'business', label: 'Business', icon: '💼' },
            { value: 'student', label: 'Student', icon: '📚' },
            { value: 'work', label: 'Work', icon: '👷' },
            { value: 'transit', label: 'Transit', icon: '✈️' },
            { value: 'family', label: 'Family', icon: '👨‍👩‍👧' },
            { value: 'diplomatic', label: 'Diplomatic', icon: '🏛️' },
          ].map((visa) => (
            <button
              key={visa.value}
              type="button"
              onClick={() => {
                handleInputChange('visaType', visa.value);
              }}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                formData.visaType === visa.value
                  ? 'border-primary-900 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-400'
              }`}
            >
              <span className="text-xl">{visa.icon}</span>
              <p className="text-sm font-medium text-neutral-900 mt-1">{visa.label}</p>
            </button>
          ))}
        </div>
      </div>

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
      <h3 className="text-lg font-semibold text-neutral-900">Document Upload</h3>
      <p className="text-sm text-neutral-500 mb-4">Upload all required documents for your visa application</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invitation Letter */}
        <DocumentUpload
          type="invitation_letter"
          label="Invitation Letter"
          description="Stating visa validity"
          required={true}
          icon="document"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={10 * 1024 * 1024}
          uploadedFile={uploadedDocuments.invitationLetter}
          onUpload={handleDocumentUpload('invitationLetter')}
          onRemove={handleDocumentRemove('invitationLetter')}
        />

        {/* International Passport Data Page */}
        <DocumentUpload
          type="passport_data_page"
          label="Passport Data Page"
          description="Clear copy of data page"
          required={true}
          icon="passport"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={10 * 1024 * 1024}
          uploadedFile={uploadedDocuments.passportDataPage}
          onUpload={handleDocumentUpload('passportDataPage')}
          onRemove={handleDocumentRemove('passportDataPage')}
        />

        {/* Passport Photograph */}
        <DocumentUpload
          type="passport_photo"
          label="Passport Photograph"
          description="White background"
          required={true}
          icon="photo"
          accept=".jpg,.jpeg,.png"
          maxSize={5 * 1024 * 1024}
          uploadedFile={uploadedDocuments.passportPhoto}
          onUpload={handleDocumentUpload('passportPhoto')}
          onRemove={handleDocumentRemove('passportPhoto')}
        />

        {/* Residence Permit of Host */}
        <DocumentUpload
          type="residence_permit"
          label="Residence Permit of Host"
          description="Host's valid residence permit"
          required={true}
          icon="building"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={10 * 1024 * 1024}
          uploadedFile={uploadedDocuments.residencePermit}
          onUpload={handleDocumentUpload('residencePermit')}
          onRemove={handleDocumentRemove('residencePermit')}
        />
      </div>

      {/* Document Status Summary */}
      <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">
            Documents Uploaded: {Object.values(uploadedDocuments).filter(d => d !== null).length}/4
          </span>
          {allDocumentsUploaded ? (
            <span className="text-sm text-secondary-600 font-medium flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              All documents ready
            </span>
          ) : (
            <span className="text-sm text-accent-600 font-medium">
              {4 - Object.values(uploadedDocuments).filter(d => d !== null).length} documents remaining
            </span>
          )}
        </div>
        <div className="mt-2 w-full bg-neutral-200 rounded-full h-2">
          <div 
            className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(Object.values(uploadedDocuments).filter(d => d !== null).length / 4) * 100}%` 
            }}
          />
        </div>
      </div>

      <Alert variant="info" title="Document Requirements">
        All documents must be clear and legible. PDF, JPG, PNG formats accepted. Passport photos must have a white background.
      </Alert>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Cost Review</h3>
      
      <Card>
        <Card.Header title="Visa Application Costs" subtitle="Cost will be provided after document review" />
        <Card.Body>
          <div className="text-center py-8">
            <svg className="h-12 w-12 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-neutral-900 mb-2">Cost Estimation Pending</p>
            <p className="text-sm text-neutral-500 mb-4">
              After you submit your application and documents, an admin will review your application and provide the cost breakdown within 24 hours.
            </p>
            <div className="bg-primary-50 rounded-lg p-4 text-left">
              <p className="text-sm text-primary-900">
                <span className="font-medium">What happens next:</span>
              </p>
              <ol className="text-sm text-primary-800 mt-2 list-decimal list-inside">
                <li>Your application is submitted for review</li>
                <li>Admin reviews your uploaded documents</li>
                <li>Cost breakdown is sent to your email</li>
                <li>Complete payment to proceed</li>
              </ol>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Alert variant="info" title="24-Hour Cost Guarantee">
        Our team will review your application and documents within 24 hours and provide a detailed cost breakdown. You will receive a notification once the cost is ready.
      </Alert>

      <Alert variant="warning" title="Payment Required">
        Payment must be completed before you can schedule your biometrics appointment.
      </Alert>

      <Checkbox
        checked={formData.costAgreed}
        onChange={(e) => handleInputChange('costAgreed', e.target.checked)}
        label="I understand the visa application process and agree to proceed. I understand I will receive the cost breakdown after submission and must complete payment before biometrics scheduling."
        required
      />
    </div>
  );

  const renderStep5 = () => (
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
        Biometrics appointments are only available on weekdays between 8:00 AM and 3:45 PM. Payment must be completed before scheduling.
      </Alert>
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
                      ? 'bg-primary-900 text-white'
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
                  <span className={`text-xs mt-2 whitespace-nowrap ${currentStep >= step.number ? 'text-primary-900 font-medium' : 'text-neutral-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 min-w-[20px] ${currentStep > step.number ? 'bg-primary-900' : 'bg-neutral-200'}`} />
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


import React, { useState } from 'react';
import { Card, Button, Input, Select, Checkbox, Alert, ProgressBar } from '../../components';

/**
 * Multi-Step Application Form Page
 * 5 steps: Personal Info, Business Details, Document Upload, Review, Submit
 */
export default function Applications() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    idNumber: '',
    // Step 2: Business Details
    businessName: '',
    businessType: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    // Step 3: Documents
    documents: [],
    // Step 4: Review
    agreed: false,
  });

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Business Details' },
    { number: 3, title: 'Document Upload' },
    { number: 4, title: 'Review & Submit' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Application submitted successfully!');
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: '',
      idNumber: '',
      businessName: '',
      businessType: '',
      businessAddress: '',
      city: '',
      state: '',
      zipCode: '',
      documents: [],
      agreed: false,
    });
    setCurrentStep(1);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="Enter first name"
          required
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
          label="Nationality"
          value={formData.nationality}
          onChange={(e) => handleInputChange('nationality', e.target.value)}
          placeholder="Enter nationality"
          required
        />
        <Input
          label="ID Number"
          value={formData.idNumber}
          onChange={(e) => handleInputChange('idNumber', e.target.value)}
          placeholder="Enter ID number"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Business Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Business Name"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Enter business name"
          required
        />
        <Select
          label="Business Type"
          value={formData.businessType}
          onChange={(e) => handleInputChange('businessType', e.target.value)}
          options={[
            { value: '', label: 'Select type' },
            { value: 'sole', label: 'Sole Proprietorship' },
            { value: 'partnership', label: 'Partnership' },
            { value: 'llc', label: 'Limited Liability Company' },
            { value: 'corporation', label: 'Corporation' },
          ]}
          required
        />
        <div className="md:col-span-2">
          <Input
            label="Business Address"
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            placeholder="Enter business address"
            required
          />
        </div>
        <Input
          label="City"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          placeholder="Enter city"
          required
        />
        <Input
          label="State/Province"
          value={formData.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
          placeholder="Enter state"
          required
        />
        <Input
          label="ZIP Code"
          value={formData.zipCode}
          onChange={(e) => handleInputChange('zipCode', e.target.value)}
          placeholder="Enter ZIP code"
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Document Upload</h3>
      <Alert variant="info" title="Required Documents">
        Please upload the following documents: ID Copy, Business License, and Tax Registration.
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['ID Copy', 'Business License', 'Tax Registration'].map((doc) => (
          <div key={doc} className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
            <svg className="h-10 w-10 text-neutral-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-neutral-700">{doc}</p>
            <p className="text-xs text-neutral-500 mt-1">Click to upload</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Review & Submit</h3>
      <Card>
        <Card.Header title="Application Summary" />
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-neutral-500">Personal Information</p>
              <p className="text-neutral-900">{formData.firstName} {formData.lastName}</p>
              <p className="text-neutral-600">{formData.email}</p>
              <p className="text-neutral-600">{formData.phone}</p>
            </div>
            <div>
              <p className="font-medium text-neutral-500">Business Details</p>
              <p className="text-neutral-900">{formData.businessName}</p>
              <p className="text-neutral-600">{formData.businessAddress}</p>
              <p className="text-neutral-600">{formData.city}, {formData.state} {formData.zipCode}</p>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Checkbox
        checked={formData.agreed}
        onChange={(e) => handleInputChange('agreed', e.target.checked)}
        label="I confirm that all information provided is accurate and complete."
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">New Application</h1>
        <p className="text-neutral-500 mt-1">Complete all steps to submit your application</p>
      </div>

      {/* Progress Steps */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
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
                  <span className={`text-xs mt-2 ${currentStep >= step.number ? 'text-primary-600 font-medium' : 'text-neutral-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? 'bg-primary-600' : 'bg-neutral-200'}`} />
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
        </Card.Body>
        <Card.Footer className="flex justify-between">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep < 4 ? (
            <Button variant="primary" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!formData.agreed}
            >
              Submit Application
            </Button>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
}


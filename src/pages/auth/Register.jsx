import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Checkbox, Card } from '../../components';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showAlert, setShowAlert] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPasswordStrength = (password) => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const count = [hasLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;
    
    if (count <= 1) return { width: '25%', color: 'bg-accent-500', label: 'Weak' };
    if (count <= 2) return { width: '50%', color: 'bg-yellow-500', label: 'Fair' };
    if (count <= 3) return { width: '75%', color: 'bg-secondary-500', label: 'Good' };
    return { width: '100%', color: 'bg-secondary-600', label: 'Strong' };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setShowAlert({ type: '', message: '' });

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });

      if (result.success) {
        setShowAlert({ 
          type: 'success', 
          message: 'Registration successful! Redirecting...' 
        });

        setTimeout(() => {
          navigate('/user', { replace: true });
        }, 1000);
      } else {
        setShowAlert({ 
          type: 'error', 
          message: result.error || 'Registration failed. Please try again.' 
        });
      }
    } catch (error) {
      setShowAlert({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      {/* Split Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side - Info */}
        <div className="lg:w-5/12 bg-primary-600 p-8 lg:p-12 flex flex-col justify-between text-white">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xl font-bold">ArRaji</span>
            </Link>
            
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">Create Account</h1>
            <p className="text-primary-100 mb-8">
              Join thousands of users who trust ArRaji for their application management needs.
            </p>
            
            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Easy Application Process</p>
                  <p className="text-sm text-primary-200">Simple steps to submit your applications</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Real-time Tracking</p>
                  <p className="text-sm text-primary-200">Stay updated on your application progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Secure Data</p>
                  <p className="text-sm text-primary-200">Your information is encrypted and safe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">24/7 Support</p>
                  <p className="text-sm text-primary-200">We're here to help you anytime</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-sm text-primary-200">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-7/12 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Create Account</h2>
            <p className="text-neutral-500 mb-8">Fill in the details below to get started</p>

            {/* Alert */}
            {showAlert.message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                showAlert.type === 'success' 
                  ? 'bg-secondary-50 border-secondary-200 text-secondary-700'
                  : 'bg-accent-50 border-accent-200 text-accent-700'
              }`}>
                <div className="flex items-center gap-2">
                  {showAlert.type === 'success' ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <p className="text-sm font-medium">{showAlert.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Adeyanju"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Raji"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="raji.adeyanju@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (234) 567-8901"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  disabled={isSubmitting}
                />
                
                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                        <div 
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <span className="text-xs font-medium text-neutral-600">{strength.label}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className={formData.password.length >= 8 ? 'text-secondary-600' : 'text-neutral-400'}>8+ characters</span>
                      <span className={/[A-Z]/.test(formData.password) ? 'text-secondary-600' : 'text-neutral-400'}>Uppercase</span>
                      <span className={/[a-z]/.test(formData.password) ? 'text-secondary-600' : 'text-neutral-400'}>Lowercase</span>
                      <span className={/[0-9]/.test(formData.password) ? 'text-secondary-600' : 'text-neutral-400'}>Number</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  disabled={isSubmitting}
                />
              </div>

              {/* Terms */}
              <div>
                <Checkbox
                  id="agree-terms"
                  label={
                    <span className="text-sm text-neutral-600">
                      I agree to the <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and{' '}
                      <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                    </span>
                  }
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  error={errors.terms}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                Create Account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox, Card } from '../../components';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const getPasswordStrength = (password) => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const count = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (count <= 1) return { width: '20%', color: 'bg-accent-500', label: 'Weak' };
    if (count <= 2) return { width: '40%', color: 'bg-accent-400', label: 'Fair' };
    if (count <= 3) return { width: '60%', color: 'bg-yellow-500', label: 'Good' };
    if (count <= 4) return { width: '80%', color: 'bg-secondary-500', label: 'Strong' };
    return { width: '100%', color: 'bg-secondary-600', label: 'Very Strong' };
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
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        navigate('/login');
      }, 2000);
    }, 1500);
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
            {showAlert && (
              <div className="mb-6 p-4 rounded-lg bg-secondary-50 border border-secondary-200">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-secondary-700 font-medium">Registration Successful - Redirecting...</p>
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
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (234) 567-8901"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
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
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
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


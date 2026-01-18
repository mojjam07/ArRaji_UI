import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox, Card, Alert } from '../../components';

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

  const passwordStrength = {
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  };

  const getPasswordStrength = (password) => {
    const strength = { ...passwordStrength };
    strength.hasLength = password.length >= 8;
    strength.hasUpper = /[A-Z]/.test(password);
    strength.hasLower = /[a-z]/.test(password);
    strength.hasNumber = /[0-9]/.test(password);
    strength.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return strength;
  };

  const calculateStrength = (password) => {
    const strength = getPasswordStrength(password);
    const count = Object.values(strength).filter(Boolean).length;
    if (count <= 1) return { width: '20%', color: 'bg-accent-500', label: 'Weak' };
    if (count <= 2) return { width: '40%', color: 'bg-accent-400', label: 'Fair' };
    if (count <= 3) return { width: '60%', color: 'bg-warning-500', label: 'Good' };
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

      // Redirect to login after successful registration
      setTimeout(() => {
        setShowAlert(false);
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  const strength = calculateStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-primary-100 mb-4">
            <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Create Account</h1>
          <p className="text-neutral-500 mt-2">Fill in the details below to get started</p>
        </div>

        {/* Alert */}
        {showAlert && (
          <Alert variant="success" title="Registration Successful" className="mb-6" onClose={() => setShowAlert(false)}>
            Your account has been created. Please check your email to verify your account.
          </Alert>
        )}

        {/* Registration Form */}
        <Card>
          <Card.Body className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="label">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="label">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="label">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>

              {/* Password Field with Strength Indicator */}
              <div>
                <label htmlFor="password" className="label">
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
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                        <div 
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <span className="ml-2 text-xs font-medium text-neutral-600">{strength.label}</span>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                      <span className={formData.password.length >= 8 ? 'text-secondary-600' : 'text-neutral-400'}>
                        At least 8 characters
                      </span>
                      <span className={/[A-Z]/.test(formData.password) ? 'text-secondary-600' : 'text-neutral-400'}>
                        Uppercase letter
                      </span>
                      <span className={/[a-z]/.test(formData.password) ? 'text-secondary-600' : 'text-neutral-400'}>
                        Lowercase letter
                      </span>
                      <span className={/[0-9]/.test(formData.password) ? 'text-secondary-600' : 'text-neutral-400'}>
                        Number
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="label">
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

              {/* Terms & Conditions */}
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
          </Card.Body>
        </Card>

        {/* Login Link */}
        <p className="mt-6 text-center text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


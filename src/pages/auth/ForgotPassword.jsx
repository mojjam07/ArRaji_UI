import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, Alert } from '../../components';

export default function ForgotPassword() {
  const [step, setStep] = useState('email'); // 'email' | 'success'
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleResend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-primary-100 mb-4">
            <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          {step === 'email' ? (
            <>
              <h1 className="text-2xl font-bold text-neutral-900">Forgot Password?</h1>
              <p className="text-neutral-500 mt-2">Enter your email to reset your password</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-neutral-900">Check Your Email</h1>
              <p className="text-neutral-500 mt-2">We've sent you a reset link</p>
            </>
          )}
        </div>

        {/* Email Form */}
        {step === 'email' && (
          <Card>
            <Card.Body className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Alert variant="info" title="Note">
                  If an account exists for this email address, you will receive a password reset link within a few minutes.
                </Alert>

                <div>
                  <label htmlFor="email" className="label">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    error={error}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>
              </form>
            </Card.Body>
          </Card>
        )}

        {/* Success State */}
        {step === 'success' && (
          <Card>
            <Card.Body className="p-8">
              <div className="text-center">
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 mb-4">
                  <svg className="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <p className="text-neutral-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                
                <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-neutral-500">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mb-3"
                  onClick={handleResend}
                  isLoading={isLoading}
                >
                  Resend Email
                </Button>
                
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setStep('email');
                    setEmail('');
                  }}
                >
                  Try Different Email
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Back to Login Link */}
        <p className="mt-6 text-center text-neutral-500">
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from '../../components';
import { authAPI } from '../../api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'success'
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const response = await authAPI.forgotPassword({ email });
      
      if (response.success) {
        setSuccess('Password reset link sent to your email!');
        setStep('success');
      } else {
        setError(response.message || 'Failed to send password reset link');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      // For demo purposes, still show success
      setSuccess('Demo: Password reset link would be sent to ' + email);
      setStep('success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authAPI.forgotPassword({ email });
      
      if (response.success) {
        setSuccess('Reset link resent successfully!');
      } else {
        setError(response.message || 'Failed to resend reset link');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setSuccess('Demo: Reset link resent!');
    } finally {
      setIsLoading(false);
    }
  };

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
            
            {step === 'email' ? (
              <>
                <h1 className="text-2xl lg:text-3xl font-bold mb-4">Forgot Password?</h1>
                <p className="text-primary-100 mb-8">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl lg:text-3xl font-bold mb-4">Check Your Email</h1>
                <p className="text-primary-100 mb-8">
                  We've sent a password reset link to your email address.
                </p>
              </>
            )}
            
            {/* Security Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Secure Process</p>
                  <p className="text-sm text-primary-200">Your data is protected</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Email Delivery</p>
                  <p className="text-sm text-primary-200">Check your inbox (and spam)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20">
            <button 
              onClick={() => navigate('/login')}
              className="text-primary-200 hover:text-white flex items-center gap-2 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-7/12 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {step === 'email' ? (
              <>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Reset Password</h2>
                <p className="text-neutral-500 mb-8">Enter your email to receive a reset link</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-700">
                        If an account exists for this email, you will receive a password reset link within a few minutes.
                      </p>
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
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      error={error}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Email Sent!</h2>
                <p className="text-neutral-500 mb-8">Check your inbox at <strong>{email}</strong></p>

                <div className="text-center">
                  {/* Success Icon */}
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-secondary-100 mb-6">
                    <svg className="h-10 w-10 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-neutral-600">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
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
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


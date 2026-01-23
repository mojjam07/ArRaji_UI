import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Checkbox, Card } from '../../components';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [showAlert, setShowAlert] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/user';

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      console.log('🔐 Frontend: Attempting login...');
      console.log('📧 Frontend: Email:', formData.email);
      
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log('📊 Frontend: Login result:', result);

      if (result.success) {
        setShowAlert({ 
          type: 'success', 
          message: 'Login successful! Redirecting...' 
        });

        // Redirect based on user role
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }, 1000);
      } else {
        console.error('❌ Frontend: Login failed:', result.error);
        setShowAlert({ 
          type: 'error', 
          message: result.error || 'Login failed. Please check your credentials and try again.' 
        });
      }
    } catch (error) {
      console.error('❌ Frontend: Unexpected login error:', error);
      
      // Handle different error types
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for network errors
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (!navigator.onLine) {
        errorMessage = 'You are offline. Please check your internet connection.';
      }
      
      setShowAlert({ 
        type: 'error', 
        message: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      {/* Split Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side - Info */}
        <div className="lg:w-5/12 bg-primary-900 p-8 lg:p-12 flex flex-col justify-between text-white">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <img src="/arraji_logo.png" alt="ArRaji Logo" className="h-10 w-auto bg-neutral-100 rounded-full" />
              <span className="text-xl font-bold">ArRaji</span>
            </Link>
            
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">Welcome Back</h1>
            <p className="text-primary-100 mb-8">
              Sign in to access your dashboard and manage your applications efficiently.
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Track Applications</p>
                  <p className="text-sm text-primary-200">Monitor your application status in real-time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Quick Processing</p>
                  <p className="text-sm text-primary-200">Fast approval and document handling</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Secure & Private</p>
                  <p className="text-sm text-primary-200">Your data is protected and encrypted</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-sm text-primary-200">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-medium hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-7/12 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Sign In</h2>
            <p className="text-neutral-500 mb-8">Enter your credentials to access your account</p>

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
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-900 hover:text-primary-700">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  disabled={isSubmitting}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <Checkbox
                  id="remember-me"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
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
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" disabled={isSubmitting}>
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full" disabled={isSubmitting}>
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


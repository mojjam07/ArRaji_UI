import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components';
import ChatbotTrigger from '../components/ui/ChatbotTrigger';

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 relative">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 mr-2"
              >
                <svg className="h-6 w-6 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <img src="/arraji_logo.png" alt="ArRaji Logo" className="h-12 w-auto" />
              <span className="ml-2 text-xl font-bold text-primary-900">ArRaji</span>
            </div>

            {/* Company name image - center on desktop, right on mobile */}
            <img src="/Company_nams.png" alt="Company Name" className="hidden md:block h-8 w-auto absolute left-1/2 transform -translate-x-1/2" />
            <img src="/Company_nams.png" alt="Company Name" className="md:hidden h-8 w-auto" />

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="accent">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Apply for Visa</Button>
              </Link>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-neutral-200 shadow-lg z-50">
                <div className="px-4 py-4 space-y-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="accent" className="w-full text-primary-900">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full mt-2">Apply for Visa</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-100 overflow-hidden">
                <img src="https://res.cloudinary.com/doi8mindp/image/upload/v1768837281/cld-sample-2.png" alt="Airplane" className="h-20 w-20 object-contain" />
              </div>
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-100 overflow-hidden">
                <img src="https://res.cloudinary.com/doi8mindp/image/upload/v1768837312/samples/waves.png" alt="Globe" className="h-20 w-20 object-contain" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Your Gateway to
              <span className="text-primary-800"> Global Travel</span>
            </h1>
            {/* <img src="/Company_nams.png" alt="Company Name" className="h-8 md:h-10 w-auto mx-auto mb-6" /> */}
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Apply for visas, book tours, and manage your travel documents seamlessly.
              Experience hassle-free travel planning with our comprehensive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Apply for Visa Now
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Tours
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visa Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Visa Types We Support
            </h2>
            <p className="text-lg text-neutral-600">
              Choose the visa that fits your travel needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Tourist Visa */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                  <svg className="h-8 w-8 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Tourist Visa</h3>
                <p className="text-neutral-600 mb-4">
                  Perfect for vacation, sightseeing, and leisure travel
                </p>
                <Link to="/register">
                  <Button variant="outline" size="sm">Learn More</Button>
                </Link>
              </Card.Body>
            </Card>

            {/* Business Visa */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 mb-4">
                  <svg className="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Business Visa</h3>
                <p className="text-neutral-600 mb-4">
                  For business meetings, conferences, and corporate travel
                </p>
                <Link to="/register">
                  <Button variant="outline" size="sm">Learn More</Button>
                </Link>
              </Card.Body>
            </Card>

            {/* Work Visa */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 mb-4">
                  <svg className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Work Visa</h3>
                <p className="text-neutral-600 mb-4">
                  Employment opportunities and long-term work permits
                </p>
                <Link to="/register">
                  <Button variant="outline" size="sm">Learn More</Button>
                </Link>
              </Card.Body>
            </Card>

            {/* Student Visa */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-100 mb-4">
                  <svg className="h-8 w-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Student Visa</h3>
                <p className="text-neutral-600 mb-4">
                  Educational opportunities and academic programs abroad
                </p>
                <Link to="/register">
                  <Button variant="outline" size="sm">Learn More</Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Travel Services Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Complete Travel Solutions
            </h2>
            <p className="text-lg text-neutral-600">
              Everything you need for a seamless travel experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Tour Packages */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                  <svg className="h-8 w-8 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Tour Packages</h3>
                <p className="text-neutral-600">
                  Curated travel packages with guided tours and accommodations
                </p>
              </Card.Body>
            </Card>

            {/* Travel Insurance */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 mb-4">
                  <svg className="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Travel Insurance</h3>
                <p className="text-neutral-600">
                  Comprehensive coverage for medical emergencies and trip cancellations
                </p>
              </Card.Body>
            </Card>

            {/* Hotel Booking */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 mb-4">
                  <svg className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Hotel Booking</h3>
                <p className="text-neutral-600">
                  Book accommodations worldwide with best price guarantees
                </p>
              </Card.Body>
            </Card>

            {/* Airport Transfer */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-100 mb-4">
                  <svg className="h-8 w-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a1 1 0 001 1h8m-9-9l8.72-4.288a1 1 0 011.28.53v15.036a1 1 0 01-.56.9L9 20.28a1 1 0 01-1.28-.53V11a1 1 0 00-1-1H5a1 1 0 00-1 1v8.28a1 1 0 01-1.28.53L.56 16.9A1 1 0 010 16.036V1.464a1 1 0 01.56-.9L8.72 6.512A1 1 0 019 7.28z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Airport Transfer</h3>
                <p className="text-neutral-600">
                  Reliable transportation to and from airports worldwide
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Complete Visa Processing Journey
            </h2>
            <p className="text-lg text-neutral-600">
              From application to visa collection - our comprehensive 11-stage process ensures your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                <span className="text-xl font-bold text-primary-900">1</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Application & Documents</h3>
              <p className="text-neutral-600">
                Complete visa application form and upload required documents (Invitation Letter, Passport, Photo, Residence Permit)
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 mb-4">
                <span className="text-xl font-bold text-secondary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Cost Estimation (24h)</h3>
              <p className="text-neutral-600">
                Receive detailed cost breakdown within 24 hours including visa fees, biometrics, and courier services
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 mb-4">
                <span className="text-xl font-bold text-accent-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Payment & Biometrics</h3>
              <p className="text-neutral-600">
                Complete secure payment and schedule biometrics appointment (Lagos/Abuja locations, weekday slots)
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-100 mb-4">
                <span className="text-xl font-bold text-neutral-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Processing & Collection</h3>
              <p className="text-neutral-600">
                Track embassy processing, visa collection, and passport return with real-time notifications
              </p>
            </div>
          </div>

          {/* Additional Process Details */}
          <div className="mt-12 text-center">
            <p className="text-neutral-600 mb-6">
              Our system includes 11 comprehensive stages: Application → Document Verification → Cost Estimation → Payment → Biometrics → Embassy Submission → Processing → Visa Collection → Passport Return
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                24h Cost Estimation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-100 text-secondary-700">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Real-time Tracking
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-100 text-accent-700">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Biometrics Scheduling
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Courier Integration
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Choose ArRaji?
            </h2>
            <p className="text-lg text-neutral-600">
              Trusted by thousands of travelers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Expert Consultation */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                  <svg className="h-8 w-8 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Expert Consultation</h3>
                <p className="text-neutral-600">
                  Get personalized guidance from our visa experts
                </p>
              </Card.Body>
            </Card>

            {/* Fast Processing */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 mb-4">
                  <svg className="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Fast Processing</h3>
                <p className="text-neutral-600">
                  Expedited visa processing with priority handling
                </p>
              </Card.Body>
            </Card>

            {/* Secure Documents */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 mb-4">
                  <svg className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Secure Documents</h3>
                <p className="text-neutral-600">
                  Bank-level security for all your travel documents
                </p>
              </Card.Body>
            </Card>

            {/* 24/7 Support */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                  <svg className="h-8 w-8 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">24/7 Support</h3>
                <p className="text-neutral-600">
                  Round-the-clock assistance for all your travel needs
                </p>
              </Card.Body>
            </Card>

            {/* Global Coverage */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 mb-4">
                  <svg className="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Global Coverage</h3>
                <p className="text-neutral-600">
                  Visa services for destinations worldwide
                </p>
              </Card.Body>
            </Card>

            {/* Best Price Guarantee */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <Card.Body className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 mb-4">
                  <svg className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Best Price Guarantee</h3>
                <p className="text-neutral-600">
                  Competitive rates with money-back guarantee
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-neutral-600">
              Explore the world's most sought-after travel destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* US/UK/Canada */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-red-600 rounded-t-xl flex items-center justify-center p-4">
                <div className="flex gap-4 justify-center items-center">
                  <img src="https://flagcdn.com/w320/us.png" alt="USA" className="h-16 w-24 object-cover rounded shadow-md" />
                  <img src="https://flagcdn.com/w320/gb.png" alt="UK" className="h-16 w-24 object-cover rounded shadow-md" />
                  <img src="https://flagcdn.com/w320/ca.png" alt="Canada" className="h-16 w-24 object-cover rounded shadow-md" />
                </div>
              </div>
              <Card.Body className="text-center">
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">US/UK/Canada</h4>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-neutral-600">United States | United Kingdom | Canada</p>
                </div>
                <p className="text-neutral-600 mb-4">
                  Tourist, Business & Work visas available. Processing time: 2-8 weeks
                </p>
                <Link to="/register">
                  <Button variant="primary" size="sm">Apply Now</Button>
                </Link>
              </Card.Body>
            </Card>

            {/* UAE */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl flex gap-4 items-center justify-center p-4">
                <img src="https://flagcdn.com/w320/ae.png" alt="UAE" className="h-16 w-24 object-cover rounded shadow-md" />
                <img src="https://flagcdn.com/w320/sa.png" alt="UAE" className="h-16 w-24 object-cover rounded shadow-md" />
              </div>
              <Card.Body className="text-center">
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">UAE & Saudi Arabia</h4>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-neutral-600">United Arab Emirates | Saudi Arabia</p>
                </div>
                <p className="text-neutral-600 mb-4">
                  Tourist & Business visas available. Processing time: 1-3 weeks
                </p>
                <Link to="/register">
                  <Button variant="primary" size="sm">Apply Now</Button>
                </Link>
              </Card.Body>
            </Card>

            {/* Others */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl flex items-center justify-center p-4">
                <div className="flex gap-4 justify-center items-center">
                  <img src="https://flagcdn.com/w320/au.png" alt="Australia" className="h-16 w-24 object-cover rounded shadow-md" />
                  <img src="https://flagcdn.com/w320/jp.png" alt="Japan" className="h-16 w-24 object-cover rounded shadow-md" />
                </div>
              </div>
              <Card.Body className="text-center">
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">Other Countries</h4>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-neutral-600">Australia | Japan | Others</p>
                  {/* <p className="text-sm text-neutral-600">Japan</p> */}
                </div>
                <p className="text-neutral-600 mb-4">
                  Tourist, Business & Student visas available. Processing time: 2-7 weeks
                </p>
                <Link to="/register">
                  <Button variant="primary" size="sm">Apply Now</Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of travelers who trust ArRaji for their visa and travel needs
          </p>
          <Link to="/register">
            <Button variant="accent" size="lg">
              Start Your Visa Application Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <img src="/arraji_logo.png" alt="ArRaji Logo" className="h-12 w-auto bg-neutral-100 rounded-full mr-2" />
                <span className="ml-2 text-lg font-bold">ArRaji</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Your trusted partner for visa applications and travel services worldwide.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link to="/user/applications" className="hover:text-white transition-colors">Visa Applications</Link></li>
                <li><a href="#tour-packages" className="hover:text-white transition-colors">Tour Packages</a></li>
                <li><a href="#travel-insurance" className="hover:text-white transition-colors">Travel Insurance</a></li>
                <li><a href="#hotel-booking" className="hover:text-white transition-colors">Hotel Booking</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#help-center" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact-us" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link to="/user/tracking" className="hover:text-white transition-colors">Track Application</Link></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-neutral-400 text-sm">
                © 2024 ArRaji. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="https://twitter.com/arraji" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="https://facebook.com/arraji" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/arraji" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ChatbotTrigger />
    </div>
  );
}

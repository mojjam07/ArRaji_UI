import React, { useState } from 'react';
import { Card, Button, Badge, Alert, Select, ProgressBar } from '../../components';

/**
 * Cost Estimation Page
 * Displays visa costs (within 24 hours) and payment options
 */
export default function CostEstimation() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Sample cost data
  const costData = {
    applicationId: 'VISA-2024-001',
    applicant: 'Ahmed Al-Rashid',
    visaType: 'Tourist Visa - UAE',
    submittedDate: '2024-01-15',
    costProvidedDate: '2024-01-16',
    status: 'cost_provided',
    costs: [
      { item: 'Visa Processing Fee', amount: 120.00, description: 'Embassy processing fee' },
      { item: 'Biometrics Fee', amount: 50.00, description: 'Biometrics collection' },
      { item: 'Service Charge', amount: 30.00, description: 'Processing and handling' },
      { item: 'Courier Service', amount: 25.00, description: 'Passport return delivery' },
    ],
    total: 225.00,
    paymentDeadline: '2024-01-18',
  };

  const generateTransactionId = () => {
    return `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionId(generateTransactionId());
      setPaymentComplete(true);
    }, 2000);
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(costData.paymentDeadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  if (paymentComplete) {
    return (
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <Card.Body className="text-center py-12">
              <div className="h-20 w-20 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Payment Successful!</h2>
              <p className="text-neutral-500 mb-6">
                Your payment of ${costData.total.toFixed(2)} has been processed. Your visa application will now proceed to the next stage.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Transaction ID:</span> {transactionId}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Amount:</span> ${costData.total.toFixed(2)}
                </p>
              </div>
              <Alert variant="success" title="Next Steps">
                Your application will proceed to biometrics scheduling. You will receive a notification shortly.
              </Alert>
              <div className="flex justify-center gap-4 mt-6">
                <Button variant="secondary" onClick={() => setPaymentComplete(false)}>
                  View Details
                </Button>
                <Button variant="primary">
                  Schedule Biometrics
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Cost Estimation</h1>
          <p className="text-neutral-500 mt-1">Review and pay your visa processing fees</p>
        </div>
        <Badge variant="success" size="md">
          Cost Provided within 24h ✓
        </Badge>
      </div>

      {/* 24-Hour Cost Guarantee Alert */}
      <Alert variant="success" title="Cost Estimate Delivered">
        Your visa cost breakdown has been provided within our 24-hour guarantee. Please review and complete payment before the deadline.
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Summary */}
          <Card>
            <Card.Header title="Application Details" subtitle={`Reference: ${costData.applicationId}`} />
            <Card.Body>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Applicant</p>
                  <p className="font-medium text-neutral-900">{costData.applicant}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Visa Type</p>
                  <p className="font-medium text-neutral-900">{costData.visaType}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Submitted Date</p>
                  <p className="font-medium text-neutral-900">{costData.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Cost Provided</p>
                  <p className="font-medium text-neutral-900">{costData.costProvidedDate}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <Card.Header title="Cost Breakdown" subtitle="Detailed breakdown of all charges" />
            <Card.Body className="p-0">
              <div className="divide-y divide-neutral-200">
                {costData.costs.map((cost, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{cost.item}</p>
                      <p className="text-xs text-neutral-500">{cost.description}</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">
                      ${cost.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-neutral-900">Total Amount</p>
                  <p className="text-xl font-bold text-primary-600">
                    ${costData.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Payment Method */}
          <Card>
            <Card.Header title="Payment Method" subtitle="Select your payment method" />
            <Card.Body>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
                  { id: 'wallet', label: 'Digital Wallet', icon: '📱' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-2xl">{method.icon}</span>
                      <p className="text-sm font-medium text-neutral-900 mt-2">{method.label}</p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedPaymentMethod === 'card' && (
                <div className="space-y-4 bg-neutral-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-neutral-700 mb-3">Accepted Cards</p>
                  <div className="flex gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/100px-American_Express_logo_%282018%29.svg.png" alt="Amex" className="h-8" />
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'bank' && (
                <Alert variant="info" title="Bank Transfer Details">
                  <div className="space-y-2 mt-2">
                    <p><span className="font-medium">Bank:</span> First Bank of Nigeria</p>
                    <p><span className="font-medium">Account Name:</span> ArRaji Visa Services</p>
                    <p><span className="font-medium">Account Number:</span> 1234567890</p>
                    <p><span className="font-medium">Reference:</span> {costData.applicationId}</p>
                  </div>
                </Alert>
              )}

              {selectedPaymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600">Connect your digital wallet for quick payment.</p>
                  <div className="flex gap-4">
                    <button className="flex-1 py-3 px-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center justify-center gap-2">
                      <span className="font-medium">Apple Pay</span>
                    </button>
                    <button className="flex-1 py-3 px-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center justify-center gap-2">
                      <span className="font-medium">Google Pay</span>
                    </button>
                  </div>
                </div>
              )}
            </Card.Body>
            <Card.Footer>
              <Button
                variant="primary"
                className="w-full"
                onClick={handlePayment}
                loading={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay $${costData.total.toFixed(2)}`}
              </Button>
            </Card.Footer>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Deadline */}
          <Card className={daysUntilDeadline <= 1 ? 'border-2 border-accent-500' : ''}>
            <Card.Header 
              title="Payment Deadline" 
              subtitle={daysUntilDeadline <= 1 ? 'Urgent - Due Soon!' : `${daysUntilDeadline} days remaining`}
            />
            <Card.Body className="text-center">
              <p className="text-3xl font-bold text-neutral-900">{costData.paymentDeadline}</p>
              <p className="text-sm text-neutral-500 mt-1">
                {daysUntilDeadline <= 0 
                  ? 'Deadline passed - Payment urgent!' 
                  : daysUntilDeadline === 1 
                    ? 'Due tomorrow' 
                    : `${daysUntilDeadline} days remaining`}
              </p>
              {daysUntilDeadline <= 2 && (
                <Alert variant="warning" className="mt-4">
                  Please complete payment soon to avoid delays in your visa processing.
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Processing Timeline */}
          <Card>
            <Card.Header title="After Payment" subtitle="Next steps in your application" />
            <Card.Body>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Biometrics Scheduling', desc: 'Schedule your appointment' },
                  { step: '2', title: 'Biometrics', desc: 'Visit our center' },
                  { step: '3', title: 'Embassy', desc: 'Application submitted' },
                  { step: '4', title: 'Collection', desc: 'Passport with visa' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary-600">{item.step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                      <p className="text-xs text-neutral-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Help */}
          <Card>
            <Card.Header title="Need Help?" subtitle="Contact support" />
            <Card.Body>
              <p className="text-sm text-neutral-600 mb-4">
                Have questions about the costs or payment? Our team is here to help.
              </p>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Support
                </Button>
                <Button variant="secondary" className="w-full">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Us
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}


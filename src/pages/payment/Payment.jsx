import React, { useState } from 'react';
import { Card, Button, Input, Select, Alert, Badge } from '../../components';

/**
 * Payment Processing Page
 */
export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const pendingPayments = [
    { id: 1, description: 'Application Fee - Business License', amount: 150.00, dueDate: '2024-01-20' },
    { id: 2, description: 'Processing Fee', amount: 50.00, dueDate: '2024-01-20' },
  ];

  const paymentHistory = [
    { id: 1, description: 'Document Verification', amount: 25.00, date: '2024-01-15', status: 'completed' },
    { id: 2, description: 'Priority Processing', amount: 75.00, date: '2024-01-10', status: 'completed' },
  ];

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

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

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
                Your payment of ${pendingPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} has been processed.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Transaction ID:</span> {transactionId}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={() => setPaymentComplete(false)}>
                  View Details
                </Button>
                <Button variant="primary">
                  Download Receipt
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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Payment</h1>
        <p className="text-neutral-500 mt-1">Manage your payments and billing information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Payments */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <Card.Header title="Pending Payments" subtitle="Payments due for your applications" />
            <Card.Body className="p-0">
              <div className="divide-y divide-neutral-200">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{payment.description}</p>
                      <p className="text-sm text-neutral-500">Due: {payment.dueDate}</p>
                    </div>
                    <p className="text-lg font-semibold text-neutral-900">${payment.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-neutral-900">Total Due</p>
                  <p className="text-xl font-bold text-primary-600">
                    ${pendingPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Payment Form */}
          <Card>
            <Card.Header title="Payment Method" subtitle="Select your payment method" />
            <Card.Body>
              {/* Payment Method Selection */}
              <div className="flex gap-4 mb-6">
                {['card', 'bank', 'wallet'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      paymentMethod === method
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {method === 'card' && (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                      {method === 'bank' && (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      {method === 'wallet' && (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                      <span className="font-medium capitalize">{method === 'wallet' ? 'Digital Wallet' : method === 'bank' ? 'Bank Transfer' : 'Credit Card'}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  <Input
                    label="Cardholder Name"
                    value={cardDetails.cardHolder}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cardHolder: e.target.value }))}
                    placeholder="John Doe"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <Input
                      label="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="123"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <Alert variant="info" title="Bank Transfer">
                  You will receive bank transfer details after clicking Pay Now. Please include the transaction reference in your transfer.
                </Alert>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600">Connect your digital wallet for quick payments.</p>
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
                {isProcessing ? 'Processing...' : `Pay $${pendingPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`}
              </Button>
            </Card.Footer>
          </Card>
        </div>

        {/* Payment History */}
        <div>
          <Card>
            <Card.Header title="Payment History" subtitle="Recent transactions" />
            <Card.Body className="p-0">
              <div className="divide-y divide-neutral-200">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-neutral-900">{payment.description}</p>
                      <Badge variant="success">{payment.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-neutral-500">{payment.date}</p>
                      <p className="font-semibold text-neutral-900">${payment.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
            <Card.Footer>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center">
                View All Transactions →
              </button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
}


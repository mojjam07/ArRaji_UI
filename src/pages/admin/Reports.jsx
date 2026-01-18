import React, { useState } from 'react';
import { Card, Button, Select, ProgressBar, Badge } from '../../components';

/**
 * Reporting & Analytics Page (Admin View)
 * Comprehensive analytics and reporting dashboard
 */
export default function Reports() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  const metrics = {
    totalApplications: { value: '1,234', change: '+12%', trend: 'up' },
    approvalRate: { value: '85%', change: '+3%', trend: 'up' },
    avgProcessingTime: { value: '2.3 days', change: '-8%', trend: 'down' },
    userSatisfaction: { value: '4.5/5', change: '+0.2', trend: 'up' },
  };

  const applicationsByMonth = [
    { month: 'Aug', applications: 89, approved: 76 },
    { month: 'Sep', applications: 102, approved: 88 },
    { month: 'Oct', applications: 118, approved: 102 },
    { month: 'Nov', applications: 134, approved: 115 },
    { month: 'Dec', applications: 145, approved: 128 },
    { month: 'Jan', applications: 156, approved: 142 },
  ];

  const topPerformers = [
    { name: 'Officer A', reviewed: 156, avgTime: '1.8 days', rating: 4.8 },
    { name: 'Officer B', reviewed: 142, avgTime: '2.1 days', rating: 4.6 },
    { name: 'Officer C', reviewed: 128, avgTime: '2.3 days', rating: 4.5 },
    { name: 'Officer D', reviewed: 115, avgTime: '2.5 days', rating: 4.4 },
  ];

  const rejectionReasons = [
    { reason: 'Incomplete Documentation', count: 45, percentage: 35 },
    { reason: 'Invalid Information', count: 32, percentage: 25 },
    { reason: 'Expired Documents', count: 28, percentage: 22 },
    { reason: 'Payment Not Received', count: 18, percentage: 14 },
    { reason: 'Other', count: 5, percentage: 4 },
  ];

  const recentReports = [
    { name: 'Monthly Summary - January 2024', type: 'Summary', date: '2024-01-18', size: '2.4 MB' },
    { name: 'Application Analysis Q4 2023', type: 'Analysis', date: '2024-01-10', size: '5.1 MB' },
    { name: 'User Activity Report', type: 'Activity', date: '2024-01-05', size: '1.8 MB' },
    { name: 'Processing Time Statistics', type: 'Statistics', date: '2024-01-01', size: '1.2 MB' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h1>
          <p className="text-neutral-500 mt-1">Comprehensive analytics and reporting dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
            ]}
          />
          <Button variant="primary">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(metrics).map(([key, metric]) => (
          <Card key={key}>
            <Card.Body>
              <p className="text-sm font-medium text-neutral-500">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-3xl font-bold text-neutral-900">{metric.value}</p>
                <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-secondary-600' : 'text-accent-600'}`}>
                  {metric.trend === 'up' ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  <span className="ml-1">{metric.change}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <Card>
          <Card.Header title="Applications Over Time" subtitle="Submitted vs Approved" />
          <Card.Body>
            <div className="space-y-4">
              {applicationsByMonth.map((month, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-neutral-700">{month.month}</span>
                    <span className="text-neutral-500">
                      {month.applications} submitted • {month.approved} approved
                    </span>
                  </div>
                  <div className="relative h-8 bg-neutral-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary-200 rounded-lg"
                      style={{ width: `${(month.applications / 200) * 100}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 bg-secondary-500 rounded-lg"
                      style={{ width: `${(month.approved / 200) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary-200" />
                <span className="text-sm text-neutral-600">Submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-secondary-500" />
                <span className="text-sm text-neutral-600">Approved</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Rejection Reasons */}
        <Card>
          <Card.Header title="Rejection Reasons" subtitle="Common reasons for application rejection" />
          <Card.Body className="space-y-4">
            {rejectionReasons.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-neutral-700">{item.reason}</span>
                  <span className="text-neutral-500">{item.count} ({item.percentage}%)</span>
                </div>
                <ProgressBar value={item.percentage} variant="error" />
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="lg:col-span-2">
          <Card.Header title="Top Performing Officers" subtitle="Based on reviews and ratings" />
          <Card.Body className="p-0">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Officer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Reviewed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Avg. Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {topPerformers.map((officer, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {officer.name.split(' ')[1]}
                          </span>
                        </div>
                        <span className="font-medium text-neutral-900">{officer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-900">{officer.reviewed}</td>
                    <td className="px-6 py-4 text-neutral-900">{officer.avgTime}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-warning-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-neutral-900">{officer.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
        </Card>

        {/* Recent Reports */}
        <Card>
          <Card.Header title="Recent Reports" subtitle="Downloadable reports" />
          <Card.Body className="p-0">
            <div className="divide-y divide-neutral-200">
              {recentReports.map((report, index) => (
                <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{report.name}</p>
                      <p className="text-xs text-neutral-500">{report.type} • {report.size}</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </Card.Body>
          <Card.Footer>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center">
              View All Reports →
            </button>
          </Card.Footer>
        </Card>
      </div>

      {/* Report Types */}
      <Card>
        <Card.Header title="Generate Custom Report" subtitle="Select report type and parameters" />
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { type: 'Applications Summary', icon: '📋', description: 'Overview of all applications' },
              { type: 'Performance Analysis', icon: '📊', description: 'Officer performance metrics' },
              { type: 'User Activity', icon: '👥', description: 'User engagement statistics' },
              { type: 'Financial Report', icon: '💰', description: 'Revenue and payments' },
            ].map((report, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  reportType === report.type.toLowerCase().replace(' ', '-')
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
                onClick={() => setReportType(report.type.toLowerCase().replace(' ', '-'))}
              >
                <span className="text-2xl mb-2 block">{report.icon}</span>
                <p className="font-medium text-neutral-900">{report.type}</p>
                <p className="text-sm text-neutral-500">{report.description}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="primary">Generate {reportType.replace('-', ' ')} Report</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}


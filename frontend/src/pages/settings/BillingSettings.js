import React from 'react';
import { Link } from 'react-router-dom';
import { PageErrorBoundary } from '../../components/withErrorBoundary';
import { CreditCardIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const planOptions = [
  {
    name: 'Basic',
    description: 'Limited applications',
    price: '$9.99',
    period: '/mo',
    isCurrent: false
  },
  {
    name: 'Pro Plus',
    description: 'Unlimited applications',
    price: '$19.99',
    period: '/mo',
    isCurrent: true
  },
  {
    name: 'Enterprise',
    description: 'Team features & API access',
    price: '$49.99',
    period: '/mo',
    isCurrent: false
  }
];

const billingHistory = [
  { id: 'inv_2025_05', date: '2025-05-24', amount: '$19.99', status: 'Paid' },
  { id: 'inv_2025_04', date: '2025-04-24', amount: '$19.99', status: 'Paid' },
  { id: 'inv_2025_03', date: '2025-03-24', amount: '$19.99', status: 'Paid' }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getNextRenewalDate = (latestInvoiceDate) => {
  const renewalDate = new Date(latestInvoiceDate);
  renewalDate.setMonth(renewalDate.getMonth() + 1);
  return formatDate(renewalDate.toISOString());
};

const BillingSettings = () => {
  const nextRenewalDate = getNextRenewalDate(billingHistory[0].date);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your payment methods and subscription plans</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 p-1">
            <DocumentTextIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            <p className="text-sm text-gray-600">Your subscription details</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">AutoApply Pro Plus</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Monthly subscription with unlimited applications and AI cover letters.</p>
                <p className="mt-1">
                  <span className="text-xl font-semibold text-primary-600">$19.99</span>
                  <span className="text-gray-600"> per month</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
              <p className="mt-1 text-xs text-gray-600">Renews on {nextRenewalDate}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Change Plan
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-900 mb-2">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planOptions.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-md p-4 transition ${
                  plan.isCurrent
                    ? 'border-2 border-primary-500 relative shadow-sm'
                    : 'border border-gray-200 hover:border-primary-300 hover:shadow-sm cursor-pointer'
                }`}
              >
                {plan.isCurrent && (
                  <div className="absolute -top-3 left-4 bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    Current
                  </div>
                )}
                <h4 className="font-medium text-gray-900">{plan.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                <p className="mt-2 text-lg font-semibold text-primary-600">
                  {plan.price}
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 p-1">
            <CreditCardIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
            <p className="text-sm text-gray-600">Manage your saved payment methods</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-md p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded p-2 mr-3">
                <svg className="h-5 w-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Default
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Add New Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 p-1">
            <ClockIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
            <p className="text-sm text-gray-600">View your previous invoices and payment history</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingHistory.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(invoice.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 hover:text-primary-700">
                    <button type="button" className="underline" aria-label={`View invoice ${invoice.id}`}>
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Having issues with your billing?{' '}
          <Link to="/help" className="text-primary-600 hover:text-primary-700 underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PageErrorBoundary(BillingSettings, { pageName: 'BillingSettings' });

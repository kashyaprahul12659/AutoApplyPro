import React from 'react';
import { Helmet } from 'react-helmet-async';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Refund Policy - AutoApply Pro</title>
        <meta name="description" content="AutoApply Pro Refund Policy - Information about refunds and cancellations." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-3xl font-bold text-white">Refund Policy</h1>
            <p className="text-indigo-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="px-6 py-8 prose prose-lg max-w-none">
            <h2>1. Overview</h2>
            <p>At AutoApply Pro, we want you to be completely satisfied with our service. This Refund Policy explains when and how you can request a refund for your subscription.</p>

            <h2>2. 7-Day Money-Back Guarantee</h2>
            <p>We offer a 7-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, you can request a full refund within 7 days of your initial purchase.</p>

            <h3>Eligibility Criteria:</h3>
            <ul>
              <li>Request must be made within 7 days of the initial subscription purchase</li>
              <li>Applies only to first-time subscribers</li>
              <li>Account must not have violated our Terms of Service</li>
              <li>Must provide feedback about why the service didn't meet your needs</li>
            </ul>

            <h2>3. Subscription Renewals</h2>
            <p>Subscription renewals are generally non-refundable. However, we may consider refunds for renewals in exceptional circumstances:</p>
            <ul>
              <li>Technical issues preventing service use for extended periods</li>
              <li>Billing errors or unauthorized charges</li>
              <li>Service changes that significantly impact functionality</li>
            </ul>

            <h2>4. Partial Refunds</h2>
            <p>In certain circumstances, we may offer partial refunds:</p>
            <ul>
              <li>Service downtime exceeding 48 hours in a billing period</li>
              <li>Feature removal that significantly impacts your use case</li>
              <li>Account suspension due to technical errors on our part</li>
            </ul>

            <h2>5. Non-Refundable Situations</h2>
            <p>Refunds will not be provided in the following situations:</p>
            <ul>
              <li>Change of mind after the 7-day guarantee period</li>
              <li>Failure to cancel subscription before renewal</li>
              <li>Account termination due to Terms of Service violations</li>
              <li>Dissatisfaction with job application results</li>
              <li>Technical issues on third-party job sites</li>
              <li>User error or misunderstanding of service features</li>
            </ul>

            <h2>6. How to Request a Refund</h2>
            <p>To request a refund, please follow these steps:</p>
            <ol>
              <li>Email us at support@autoapplypro.tech with "Refund Request" in the subject line</li>
              <li>Include your account email address</li>
              <li>Provide your subscription purchase date</li>
              <li>Explain the reason for your refund request</li>
              <li>Include any relevant screenshots or documentation</li>
            </ol>

            <h2>7. Refund Processing</h2>
            <h3>Review Process</h3>
            <p>We will review your refund request within 2-3 business days and respond with our decision.</p>

            <h3>Processing Time</h3>
            <p>If approved, refunds will be processed to your original payment method within:</p>
            <ul>
              <li>Credit/Debit Cards: 5-10 business days</li>
              <li>Digital Wallets: 1-3 business days</li>
              <li>Bank Transfers: 3-7 business days</li>
            </ul>

            <h2>8. Subscription Cancellation</h2>
            <p>You can cancel your subscription at any time to prevent future charges:</p>
            <ul>
              <li>Log into your account dashboard</li>
              <li>Navigate to "Subscription Settings"</li>
              <li>Click "Cancel Subscription"</li>
              <li>Follow the confirmation prompts</li>
            </ul>
            <p>Your access will continue until the end of your current billing period.</p>

            <h2>9. Service Credits</h2>
            <p>In some cases, instead of a monetary refund, we may offer service credits:</p>
            <ul>
              <li>Extended subscription period</li>
              <li>Upgrade to a higher plan</li>
              <li>Additional feature access</li>
            </ul>

            <h2>10. Chargebacks and Disputes</h2>
            <p>If you initiate a chargeback or payment dispute:</p>
            <ul>
              <li>Your account may be suspended pending resolution</li>
              <li>Please contact us first to resolve issues amicably</li>
              <li>Chargeback fees may be deducted from any refund amount</li>
            </ul>

            <h2>11. Free Trial and Promotional Offers</h2>
            <p>Special refund terms may apply to promotional offers:</p>
            <ul>
              <li>Free trials: No refund necessary, simply cancel before trial ends</li>
              <li>Discounted subscriptions: Refund amount based on discounted price paid</li>
              <li>Special promotions: Subject to specific terms communicated at time of purchase</li>
            </ul>

            <h2>12. Changes to This Policy</h2>
            <p>We may update this Refund Policy from time to time. Material changes will be communicated via email or through our service.</p>

            <h2>13. Contact Us</h2>
            <p>If you have questions about our Refund Policy or need to request a refund:</p>
            <ul>
              <li>Email: support@autoapplypro.tech</li>
              <li>Subject Line: "Refund Request" or "Refund Policy Question"</li>
              <li>Website: https://autoapplypro.tech</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
              <h3 className="text-blue-800 font-semibold mb-2">Need Help?</h3>
              <p className="text-blue-700">
                Before requesting a refund, consider reaching out to our support team. 
                We're often able to resolve issues and help you get the most out of AutoApply Pro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

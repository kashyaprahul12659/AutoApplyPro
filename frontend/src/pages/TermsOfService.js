import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Terms of Service - AutoApply Pro</title>
        <meta name="description" content="AutoApply Pro Terms of Service - Legal terms and conditions for using our service." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="text-indigo-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="px-6 py-8 prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using AutoApply Pro ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

            <h2>2. Description of Service</h2>
            <p>AutoApply Pro is a job application automation platform that helps users:</p>
            <ul>
              <li>Automatically fill job application forms using resume data</li>
              <li>Generate personalized cover letters using AI</li>
              <li>Track job applications and manage application history</li>
              <li>Analyze job descriptions for skill matching</li>
              <li>Create and customize resumes</li>
            </ul>

            <h2>3. User Accounts</h2>
            <h3>Registration</h3>
            <p>To use certain features of the Service, you must register for an account. You agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your account credentials secure</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3>Account Suspension</h3>
            <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in inappropriate behavior.</p>

            <h2>4. Acceptable Use</h2>
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul>
              <li>Use the Service to apply for jobs you're not qualified for</li>
              <li>Submit false or misleading information in applications</li>
              <li>Violate any laws or regulations</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to other accounts</li>
              <li>Use automated scripts to abuse the Service</li>
              <li>Share your account with others</li>
            </ul>

            <h2>5. Subscription and Payment</h2>
            <h3>Subscription Plans</h3>
            <p>We offer various subscription plans with different features and limitations. Subscription fees are billed in advance and are non-refundable except as stated in our Refund Policy.</p>

            <h3>Payment Processing</h3>
            <p>Payments are processed through secure third-party payment processors. We do not store your payment information.</p>

            <h3>Auto-Renewal</h3>
            <p>Subscriptions automatically renew unless cancelled before the renewal date. You can cancel your subscription at any time through your account settings.</p>

            <h2>6. Intellectual Property</h2>
            <h3>Our Content</h3>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of AutoApply Pro and its licensors.</p>

            <h3>Your Content</h3>
            <p>You retain ownership of your resume data, cover letters, and other content you upload. By using the Service, you grant us a license to use this content to provide our services.</p>

            <h2>7. Privacy and Data Protection</h2>
            <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.</p>

            <h2>8. Disclaimers</h2>
            <h3>Service Availability</h3>
            <p>The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted or error-free service.</p>

            <h3>Job Application Success</h3>
            <p>We do not guarantee that using our Service will result in job interviews or offers. Success depends on many factors beyond our control.</p>

            <h3>Third-Party Websites</h3>
            <p>We are not responsible for the content or practices of third-party job sites where you submit applications.</p>

            <h2>9. Limitation of Liability</h2>
            <p>In no event shall AutoApply Pro be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>

            <h2>10. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless AutoApply Pro from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service.</p>

            <h2>11. Termination</h2>
            <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>

            <h2>12. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will provide notice of material changes. Your continued use of the Service constitutes acceptance of the modified Terms.</p>

            <h2>13. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>

            <h2>14. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul>
              <li>Email: legal@autoapplypro.tech</li>
              <li>Website: https://autoapplypro.tech</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

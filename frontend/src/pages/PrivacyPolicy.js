import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Privacy Policy - AutoApply Pro</title>
        <meta name="description" content="AutoApply Pro Privacy Policy - How we collect, use, and protect your data." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-indigo-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="px-6 py-8 prose prose-lg max-w-none">
            <h2>1. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>When you use AutoApply Pro, we may collect the following personal information:</p>
            <ul>
              <li>Name, email address, and contact information</li>
              <li>Resume data including work experience, education, and skills</li>
              <li>Job application history and preferences</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>
            
            <h3>Usage Data</h3>
            <p>We automatically collect certain information when you use our service:</p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address and location data</li>
              <li>Usage patterns and feature interactions</li>
              <li>Error logs and performance data</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and improve our job application automation services</li>
              <li>Generate personalized cover letters and resumes</li>
              <li>Track your job application history</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important service updates and notifications</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Data Sharing and Disclosure</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
            <ul>
              <li>To trusted service providers who assist in operating our service</li>
              <li>When required by law or to protect our rights</li>
              <li>In the event of a business transfer or merger</li>
              <li>With your explicit consent</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
              <li>Secure payment processing</li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>We retain your personal information only as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time.</p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Request corrections to inaccurate data</li>
              <li>Delete your account and personal information</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of non-essential communications</li>
            </ul>

            <h2>7. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Authenticate your account</li>
              <li>Analyze usage patterns</li>
              <li>Improve our service performance</li>
            </ul>
            <p>You can control cookie settings through your browser preferences.</p>

            <h2>8. Third-Party Services</h2>
            <p>Our service integrates with third-party platforms and services. Please review their privacy policies:</p>
            <ul>
              <li>Authentication: Clerk</li>
              <li>Payment Processing: Razorpay</li>
              <li>Analytics: Various anonymized analytics services</li>
            </ul>

            <h2>9. Children's Privacy</h2>
            <p>Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18.</p>

            <h2>10. International Users</h2>
            <p>If you are accessing our service from outside the United States, please note that your information may be transferred to and processed in the United States.</p>

            <h2>11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our service.</p>

            <h2>12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: privacy@autoapplypro.tech</li>
              <li>Website: https://autoapplypro.tech</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

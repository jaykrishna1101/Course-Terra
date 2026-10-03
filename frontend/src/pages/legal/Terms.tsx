import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose max-w-none text-gray-600">
        <p>Last updated: October 2026</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and registering on Course Terra, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our platform.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">2. User Accounts</h2>
        <p>
          You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">3. Course Access and Intellectual Property</h2>
        <p>
          Upon successful payment, you are granted a non-exclusive, non-transferable license to access the course content for personal, non-commercial educational purposes. 
          You may not download (unless explicitly permitted), record, share, resell, or distribute any course materials. All content remains the intellectual property of Course Terra.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">4. Pricing and Payments</h2>
        <p>
          All prices are listed in Indian Rupees (INR) unless otherwise stated. We reserve the right to change course prices at any time. Payments are processed securely via our payment gateway partner.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">5. Account Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account immediately, without prior notice, if you breach these Terms (such as sharing your account or pirating content).
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">6. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.
        </p>
      </div>
    </div>
  );
};

export default Terms;

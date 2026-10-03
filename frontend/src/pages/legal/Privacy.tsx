

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none text-gray-600">
        <p>Last updated: October 2026</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">1. Information We Collect</h2>
        <p>
          When you register for an account on Course Terra, we collect basic information required to provide our services, including:
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li>Your Full Name</li>
          <li>Your Email Address</li>
          <li>Account credentials (encrypted passwords)</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>To create and manage your learning account.</li>
          <li>To grant you access to purchased course materials.</li>
          <li>To communicate with you regarding updates, technical support, and transactional receipts.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">3. Payment Data</h2>
        <p>
          We do not store your credit card or UPI details on our servers. All payments are securely processed by Razorpay, our RBI-authorized Payment Gateway partner. Please refer to Razorpay's privacy policy for details on how they handle financial data.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">4. Data Protection</h2>
        <p>
          Your data is stored securely using industry-standard encryption. We do not sell, rent, or share your personal information with third parties for marketing purposes.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">5. Contact</h2>
        <p>
          For any privacy-related concerns, please contact us at jkkhond@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default Privacy;



const Refund = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Refund and Cancellation Policy</h1>
      
      <div className="prose max-w-none text-gray-600">
        <p>Last updated: October 2026</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">1. Digital Products</h2>
        <p>
          Course Terra provides lifetime access to digital educational content. Due to the nature of digital goods, we generally offer a strict refund policy to prevent abuse.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">2. Cancellation Policy</h2>
        <p>
          Since access to our courses is granted immediately upon successful payment, cancellations are not applicable once the purchase is complete. 
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">3. Refund Conditions</h2>
        <p>Refunds will only be considered under the following circumstances:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Duplicate Payment:</strong> If you were accidentally charged twice for the same transaction due to a technical error.</li>
          <li><strong>Non-Delivery:</strong> If the payment was successful but course access was not granted to your account within 24 hours, and our technical team is unable to resolve the issue.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">4. Refund Process & Timeline</h2>
        <p>
          To request a refund for a duplicate payment, please email us at <strong>jkkhond@gmail.com</strong> with your payment receipt and email address. 
          Approved refunds will be processed and credited back to the original method of payment within <strong>5-7 business days</strong>.
        </p>
      </div>
    </div>
  );
};

export default Refund;

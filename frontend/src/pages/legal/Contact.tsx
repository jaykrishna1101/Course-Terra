import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <p className="text-gray-600 mb-6">
          If you have any questions, concerns, or need support regarding our courses, please reach out to us using the information below.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">Legal Entity Name</h3>
            <p className="text-gray-600">Jaykrishna Khond</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Registered Address</h3>
            <p className="text-gray-600">
              Na, Maharashtra<br/>
              India, 411001
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Email Support</h3>
            <p className="text-gray-600">jkkhond@gmail.com</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Phone Number</h3>
            <p className="text-gray-600">+91 9999999999 (Operating Hours: Mon-Fri, 10 AM to 6 PM IST)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

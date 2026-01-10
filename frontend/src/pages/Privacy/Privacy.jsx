import React from 'react';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
      <div className="prose prose-lg mx-auto">
        <p className="mb-4">
          At Emptio, we are committed to protecting your privacy and ensuring the security of your personal information.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Personal information you provide (name, email, shipping address)</li>
          <li>Payment information (processed securely through third-party providers)</li>
          <li>Browsing data and cookies for improving your experience</li>
          <li>Order history and preferences</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>To process and fulfill your orders</li>
          <li>To communicate with you about your purchases</li>
          <li>To improve our website and services</li>
          <li>To send marketing communications (with your consent)</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your personal information. Your payment information is never stored on our servers.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal information. Contact us to exercise these rights.
        </p>
        <p>
          This privacy policy may be updated periodically. Please check back for any changes.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
import React from 'react';

const Returns = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Returns & Exchanges</h1>
      <div className="prose prose-lg mx-auto">
        <p className="mb-4">
          We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>30-day return window from the date of delivery</li>
          <li>Items must be in original condition and packaging</li>
          <li>Return shipping costs are the responsibility of the customer</li>
          <li>Refunds will be processed within 5-7 business days after receipt</li>
          <li>Exchanges are available for different sizes or colors</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Contact our customer service team to initiate a return</li>
          <li>Receive a return authorization number</li>
          <li>Package the item securely with all original materials</li>
          <li>Ship to the address provided by our team</li>
          <li>Once received, we'll process your refund or exchange</li>
        </ol>
        <p>
          For more details or to start a return, please email us at returns@emptio.com or call +1 (555) 123-4567.
        </p>
      </div>
    </div>
  );
};

export default Returns;
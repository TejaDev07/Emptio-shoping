import React from 'react';

const Shipping = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Shipping Information</h1>
      <div className="prose prose-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Shipping Options</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Standard Shipping</h3>
            <p>3-5 business days - Free on orders over $50</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Express Shipping</h3>
            <p>1-2 business days - $9.99</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Overnight Shipping</h3>
            <p>Next business day - $19.99</p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-4 mt-8">Shipping Policies</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>All orders are processed within 1-2 business days</li>
          <li>Shipping costs are calculated at checkout</li>
          <li>International shipping is available to select countries</li>
          <li>Tracking information will be sent via email once your order ships</li>
          <li>We are not responsible for delays caused by carriers or customs</li>
        </ul>
        <p className="mt-6">
          For more information about your specific order, please contact our customer service team.
        </p>
      </div>
    </div>
  );
};

export default Shipping;
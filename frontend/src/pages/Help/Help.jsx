import React from 'react';

const Help = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Help Center</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">How do I place an order?</h3>
              <p className="text-gray-600">Browse our products, add items to your cart, and proceed to checkout. Follow the simple steps to complete your purchase.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and other secure payment options.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">How long does shipping take?</h3>
              <p className="text-gray-600">Standard shipping takes 3-5 business days. Express options are available for faster delivery.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Can I return items?</h3>
              <p className="text-gray-600">Yes, we offer a 30-day return policy on most items. Please check our Returns page for more details.</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Need More Help?</h2>
          <p className="mb-4">If you can't find the answer you're looking for, our customer service team is here to help.</p>
          <p><strong>Email:</strong> support@emptio.com</p>
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>Live Chat:</strong> Available on our website during business hours</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
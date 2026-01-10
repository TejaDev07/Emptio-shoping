import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">Unable to find order details.</p>
        <Link to="/" className="bg-orange-500 text-white py-3 px-6 rounded hover:bg-orange-600 transition-colors">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg">Thank you for your order. We'll send you shipping updates at your email address.</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span className="font-mono">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-orange-600">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            A confirmation email has been sent to your email address with the order details.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/"
              className="bg-orange-500 text-white py-3 px-6 rounded hover:bg-orange-600 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/Order-tracking"
              className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition-colors"
            >
              Order Tracking
            </Link>
            <Link
              to="/cart"
              className="bg-gray-500 text-white py-3 px-6 rounded hover:bg-gray-600 transition-colors"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;